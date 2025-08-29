
import { AsMaterialdesignText } from "@alterspective-io/as-framework-material-design/as-materialdesign-text";
import { Framework, IFramework, IRegisteredExtensionModule } from "../framework/src";
import { displayFormIfHidden } from "../framework/src/Models/DisplayHidden";
import { AlterspectiveMaterialButtonExtension } from "./Buttons/Extension";
import { simpliedMaterialCardExtension } from "./Card/Extension";
import {  removeOverflows } from "./Common/StyleHelper";
import { alterspectiveDataTableExtension } from "./DataTables/Extension";
import { alterspectiveExpanderExtension } from "./Expander/Extension";
import { alterspectiveHtmlRepeaterExtension } from "./HTMLRepeater/Extension";
import { alterspectiveMaterialDesignIconExtension } from "./Icons";
import { AlterspectiveMaterialTextExtension } from "./Text/Extension";
import "./cssForK2.css"
import { insertAndScaleVariablesForComponent } from "./Common/cssVariableFinder";
import { runTheFramework } from "../framework/src/Models/validateRun";
import { addBirdsEffect } from "./demoBirds";
export * as TestSettingHelper from "./Common/settings.Helper";
export {insertAndScaleVariablesForComponent};
import {MaterialDesignIcons} from "./Common/materialButtons";
import { AS_K2_DataTable_Default_Settings } from "./DataTables/Extension/defaults";


//export a new module into global scope for the framework to use
//create the ability so when this file is loaded it will check for alterspective and if not create it
//then it will add MaterialDesignIcons to the alterspective namespace
declare global {
  var Alterspective: any;
}

if(!window.Alterspective)
{
  window.Alterspective = {};
}

window.Alterspective.MaterialDesignIcons = MaterialDesignIcons;




//@ts-ignore
window.insertAndScaleVariablesForComponent = insertAndScaleVariablesForComponent;



// Run the function to adjust typography variables
// adjustTypographyVariables();

// Optional: Re-adjust on window resize (for responsive designs)
// window.addEventListener('resize', adjustTypographyVariables);
 //used to ensure we only run the initialization once
let initialised : boolean = false; 


// export const s1 = defaultSetting1;

export const initialize = async (): Promise<
  IFramework | undefined
> => {

  return init();
};


async function init(){
  //ensure we only run this once

  console.log("%c AS-K2SF-Framework - Initializing", "color: green; font-weight: bold; font-size: 16px", initialised);

  if(initialised==true) {
    console.log("%c AS-K2SF-Framework - Already Initialized", "color: green; font-weight: bold; font-size: 16px");
    return;
  } 
  initialised=true;


  let promiseArray = new Array<Promise<any>>();
 
  promiseArray.push(
    Framework.registerExtensionModule(
      "dataTableExtension",
      alterspectiveDataTableExtension
    ).then((m) => {
      console.log("dataTableExtension - initialized",m);
      return m;
    })
  );

  promiseArray.push(
    Framework.registerExtensionModule(
      "materialCardExtension",
      simpliedMaterialCardExtension
    ).then((m) => {
      console.log("materialCardExtension - initialized");
      return m;
    })
  );

  promiseArray.push(
    Framework.registerExtensionModule(
      "materialTextExtension",
      AlterspectiveMaterialTextExtension
    ).then((m) => {
      console.log("materialTextExtension - initialized");
      return m;
    })
  );


  promiseArray.push(
    Framework.registerExtensionModule(
      "materialButtonsExtension",
      AlterspectiveMaterialButtonExtension
    ).then((m) => {
      console.log("materialButtonExtension - initialized");
      return m;
    })
  );

  promiseArray.push(
    Framework.registerExtensionModule(
      "materialIconExtension",
      alterspectiveMaterialDesignIconExtension
    ).then((m) => {
      console.log("alterspectiveMaterialDesignIconExtension - initialized");
      return m;
    })
  );

  promiseArray.push(
    Framework.registerExtensionModule(
      "htmlRepeaterExtension",
      alterspectiveHtmlRepeaterExtension
    ).then((m) => {
      console.log("htmlRepeaterExtension - initialized");
      return m;
    })
  );

  promiseArray.push(
    Framework.registerExtensionModule(
      "materialExpander",
      alterspectiveExpanderExtension
    ).then((m) => {
      console.log("materialExpander - initialized");
      return m;
    })
  );

 
  let promissesBack = await Promise.all(promiseArray);
  

  displayFormIfHidden();
  removeOverflows();
 

  //adjust fonts
  const htmlFontSize = getComputedStyle(document.documentElement).fontSize;

  // Calculate the new basesize as 100% of the current font size
  //This is used as K2 style sheet sets HTML font size to 62.5% (10px) and we need to adjust for this
  const baseFontSize = "16px"
  // Dynamically set the CSS variable
  document.documentElement.style.setProperty('--base-font-size', baseFontSize);


  
  

  if (promissesBack[0]?.as) {
    return promissesBack[0].as;
  }
}; 



if(!runTheFramework())
  {
    console.log("%cAS-K2SF-Framework - Framework Disabled", "color: red; font-weight: bold; font-size: 16px");
    //log in small what to check if the framework is disabled
    console.log("%c To enable the framework remove 'asdisabled' from the querystring of the page", "color: grey; font-size: 10px");
   
  }
else{
  console.log("%cAS-K2SF-Framework - Framework Enabled", "color: green; font-weight: bold; font-size: 16px");
  //log in small text how to disable the framework
  console.log("%c To disable the framework add 'asdisabled' into the querystring of the page", "color: grey; font-size: 10px");
  //auto initialize
  initialize().then((framework) => {


    console.log("-------------- Running Auto Init -----------------");

    if(!framework)
    {
      console.error("Framework not initialized",framework);
      console.log("%c!!Framework not returned from initialize, check the console for errors", "color: red; font-weight: bold; font-size: 16px");
      return;
    }


    //Update fromend status and information 
    framework.getControlsByName("Internal - as.framework.status").forEach((c) => {
      c.value = "Loaded...";
    } );

  
    if(framework.extensions?.registeredExtensionModules)
    {
    framework.getControlsByName("Internal - AS Loaded Extensions").forEach((c) => {
        c.value = Object.keys(framework.extensions!.registeredExtensionModules).join(", ");
    });

    //Output to user all the Tags that can be utalised
    framework.getControlsByName("Internal - Extension Tags").forEach((c) => {
      let tags = new Array<string>();
      Object.keys(framework.extensions!.registeredExtensionModules).forEach((ext) => {
        let mod = framework.extensions!.registeredExtensionModules[ext];
        if(mod?.tagName)
        {
          tags.push(mod.tagName);
        }
      });
      c.value = tags.join("\n"); //add them to textbox one under the other
    });


    console.log("Framework Initialized",framework);
  }});

};
  

//check if addbirds is in the querystring and if so add the birds
if(window.location.search.toLowerCase().includes("addbirds"))
{
  addBirdsEffect();
}