import { utf8ToBase64 } from "./Base64Encoding";
import { JsonToHtmlConverter } from "./JsonToHTMLConverter";

/**
 * this function will execute a function based on the expression and the dataContext.
 * It will return the result of the function.
 * It does not use eval, but creates a new function based on the expression and then executes it.
 * TODO: consider using `expr-eval` library instead of creating a new function each time as it is faster and safer
 * @param expression the expression to execute
 * @param dataContext The data context to use for the expression
 * @param dataContextName The name of the data context to use in the expression, default is "dataContext"
 * @returns 
 */
export function executeFunc(expression: string | undefined | null, dataContext: any, dataContextName?: string) {
  // Create a new function based on the formatter
  // l(inf(`evaluteRule(${expression})`), dataContext);

  if (expression === "") {
    return "";
  }

  if (!expression) {
    return undefined;
  }
  let dynamicFunc: Function
  try {
    let dataContextNameToUse = 'dataContext';

    // Replace the dataContextName with the dataContextNameToUse
    if (dataContextName) {

      // Escape special characters in the string for use in regular expressions
      const escapedDataContextName = dataContextName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const regex = new RegExp(escapedDataContextName, 'g');
      expression = expression.replace(regex, dataContextNameToUse);
    }

    checkAndLogUndefined(dataContext, expression, dataContextNameToUse);
    dynamicFunc = new Function(`${dataContextNameToUse}`, `return (${expression});`);

  }
  catch (e) {
    let errMessage = `Error creating function for expression [${expression}]`;
    // l(err(errMessage), e);
    return errMessage;
  }

  // l(inf(`evaluteRule(${expression}) - dynamicFunc: `), dynamicFunc);

  try {
    const returnValue: any = dynamicFunc(dataContext);
    return returnValue;
  } catch (e) {
    console.log(`Error evaluating rule [${expression}] with data context`, e);
    return `${e}`; // Default value in case of an error
  }
}

/**
 * This function will evaluate a rule and return the result.
 * It uses the executeFunc function to execute the rule.
 * It will return false if the rule is undefined or null.
 * @param rule The rule to evaluate, example: "dataContext.title === 'Test'" or "dataContext.title === 'Test' && dataContext.parent.title === 'Test'"
 * @param dataContext The data context to use for the rule
 * @param dataContextName Optional name of the data context to use in the rule, default is "dataContext"
 * @returns 
 */
export function evaluteRule(rule: string | undefined | null, dataContext: any, dataContextName?: string): boolean {
  if (!rule) {
    return false;
  }

  try {
    const returnValue: any = executeFunc(rule, dataContext, dataContextName);
    if (typeof returnValue === 'boolean') {
      return returnValue;
    } else {
      // l(err((`Rule [${rule}] did not return a boolean value. It returned: ${returnValue}`)));
      return false; // Default value if the rule doesn't return a boolean
    }
  } catch (e) {
    console.log(`Error evaluating rule [${rule}] with data context`, e);
    return false; // Default value in case of an error
  }
}

/**
 * This function will check if the property exists in the object.
 * If it does not exist, it will log an error and return undefined.
 * If it does exist, it will return the value of the property.
 * It is used to help with debugging rules.
 * @param obj 
 * @param rule 
 * @param dataContextName 
 * @returns 
 */
export function checkAndLogUndefined(obj: any, rule: string, dataContextName: string) {
  const props = rule.split('.');
  let current: any = {};
  current[dataContextName] = obj;

  for (let i = 0; i < props.length; i++) {
    if (current[props[i]] === undefined) {
      // l(err(`Error while evaluating a rule ${rule}! The property ${dataContextName}.${props.slice(0, i + 1).join('.')} is undefined.`));
      // l(err(`Check the configuration of the rule ${rule}!`));
      return undefined;
    }
    current = current[props[i]];
  }

  return current;
}


/**
 * This function will execute embedded code in a string by replacing ${} with the result of the code.
 * It uses the executeFunc function to execute the code.
 * Example: "title: ${title.toUpperCase()} Matter Search ${2 + 2}"
 * Resurn: "title: TITLE MATTER SEARCH 4"
 * @param input The input string to execute the embedded code in, example "title: ${title.toUpperCase()} Matter Search ${2 + 2}"
 * @param dataContext The data context to use for the embedded code
 * @param dataContextName The name of the data context to use in the embedded code, default is "dataContext"
 * @returns 
 */
export function executeEmbeddedCode(input: string | undefined | null, dataContext: any, dataContextName?: string): string {

  if (!input) {
    return "";
  }

  return input.replace(/\$\{(.+?)\}/g, (_, code) => {
    try {
      //! WARNING: Eval can execute arbitrary code and is unsafe - This code DOES NOT use eval

      dataContext["helpers"] = dataContext["helpers"] || {};
      dataContext["helpers"].utf8ToBase64 = utf8ToBase64;

      let val = executeFunc(code, dataContext, dataContextName);
      if (val === undefined) {
        val = '';
      }

      val = JsonToHtmlConverter.convert(val);

      return val;
    } catch (error: any) {
      console.error('Failed to execute embedded code:', error);

      let val = '';
      if (error.message) {
        val = error.message;
      }
      else {
        val = JSON.stringify(error);
      }

      return JSON.stringify(val);
    }
  });
}
