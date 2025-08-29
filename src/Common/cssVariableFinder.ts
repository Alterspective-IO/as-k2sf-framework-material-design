import { get } from "lodash";

// Function to search all stylesheets, <style> tags, Shadow DOMs, and Constructed Stylesheets for CSS variables
 function findCSSVariables(root: Document | ShadowRoot = document) {
    const variableSet: Set<string> = new Set(); // To store unique variable usages
  
    // Helper function to process styles in a stylesheet
    function processStylesheet(sheet: CSSStyleSheet): void {
      try {
        const rules = Array.from(sheet.cssRules) as CSSStyleRule[];
        rules.forEach(rule => {
          if (rule.style) {
            // Loop through all style declarations in the rule
            for (let i = 0; i < rule.style.length; i++) {
              const property = rule.style[i];
              const propertyValue = rule.style.getPropertyValue(property);
  
              // Check for variable usage in the style value
              const matches = propertyValue.match(/var\(--[^\)]+\)/g);
              if (matches) {
                matches.forEach(match => variableSet.add(match));
              }
            }
          }
        });
      } catch (e) {
        // console.warn("Unable to access stylesheet:", sheet, e);
      }
    }
  
    // Process all stylesheets in the root
    const stylesheets = Array.from(root.styleSheets || []);
    stylesheets.forEach(sheet => {
      if (sheet instanceof CSSStyleSheet) {
        processStylesheet(sheet);
      }
    });
  
    // Process <style> tags in the root (including Webpack-injected ones)
    const styleTags = root.querySelectorAll("style");
    styleTags.forEach(styleTag => {
      try {
        const cssText = styleTag.textContent || "";
        const matches = cssText.match(/var\(--[^\)]+\)/g); // Match variable usages
        if (matches) {
          matches.forEach(match => variableSet.add(match));
        }
      } catch (e) {
        console.warn("Error processing <style> tag:", e);
      }
    });
  
    // Traverse Shadow DOMs recursively and look for Constructed Stylesheets
    function traverseShadowDOM(node: Element): void {
      if (node.shadowRoot) {
        // Process stylesheets in the shadow root
        
            
        const adoptedSheets = node.shadowRoot.adoptedStyleSheets || [];
        adoptedSheets.forEach(sheet => processStylesheet(sheet));
  
        // Recurse into Shadow DOM
        findCSSVariables(node.shadowRoot).forEach(variable => variableSet.add(variable));
      }
      // Check children for Shadow DOM
      Array.from(node.children).forEach(child => traverseShadowDOM(child));
    }
  
    // Traverse all nodes in the root
    const elements = Array.from(root.querySelectorAll("*"));
    elements.forEach(node => traverseShadowDOM(node));
  
    return Array.from(variableSet); // Convert Set to Array for display
  }
  
   function getAllVarAndValues() {
    let vars = findCSSVariables().filter((v) => v.includes("font-size"));

    //@ts-ignore
    window.mdvars= vars;
   
    return extractVariables(vars);

  }


  function extractVariables(values: string[]): Array<[string, string]> {
    return values.map(value => {
      const match = value.match(/var\((--[a-zA-Z0-9\-]+),\s*([^\)]+)\)/);
      if (match) {
        const [, variable, fallback] = match;
        return [variable, fallback.trim()];
      }
      throw new Error(`Invalid format: ${value}`);
    });
  }

//   export function updateCssVariableByFactor(namevale: [string, string][], factor: number) {
//     namevale.forEach(([name, value]) => {
//       let newValue = value;
//       if (value.endsWith("px")) {
//         const numberValue = parseFloat(value);
//         newValue = `${numberValue * factor}px`;
//       }
//       document.documentElement.style.setProperty(name, newValue);
//     });
//   }
export function insertAndScaleVariablesForComponent(componentName: string, scalingFactor: number) {
    // Find all instances of the specified web component
    const components = document.querySelectorAll<HTMLElement>(componentName);
  
    if (!components.length) {
      console.warn(`No instances of the web component "${componentName}" found.`);
      return;
    }
  
    // Define the CSS variables and their initial values
    const cssVariables = getAllVarAndValues();
  
    components.forEach(component => {
      const shadowRoot = component.shadowRoot;
  
      if (!shadowRoot) {
        console.warn(`The web component "${componentName}" does not have a shadow DOM.`);
        return;
      }
  
      let styleElement;
      // Insert and scale each variable into the shadow DOM
      cssVariables.forEach(([variable, value]) => {
        const numericValue = parseFloat(value); // Extract the numeric value
        const unit = value.match(/[a-z%]+$/)?.[0] || ""; // Extract the unit (e.g., 'rem', 'px', '%')
  
         styleElement = shadowRoot.querySelector('style') || document.createElement('style');
  
        // Ensure the style element is added to the shadow DOM
        if (!shadowRoot.contains(styleElement)) {
          shadowRoot.appendChild(styleElement);
        }
  
        // Add or update the CSS rule in the shadow DOM's style element
        if (unit === "rem" || unit === "px") {
          const scaledValue = (numericValue * scalingFactor).toFixed(3) + unit;
          styleElement.textContent += `:host { ${variable}: ${scaledValue}; }`;
        } else {
          // For other units (e.g., percentages), leave them as-is
          styleElement.textContent += `:host { ${variable}: ${value}; }`;
        }

      });

      console.log("AS-K2SF-Framework - baseFontSize",styleElement!.textContent);
    });
  }
  