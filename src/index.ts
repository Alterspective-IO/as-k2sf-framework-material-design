import { Framework, IFramework, IRegisteredExtensionModule } from "../framework/src";
import { displayFormIfHidden } from "../framework/src/Models/DisplayHidden";
import { AlterspectiveMaterialButtonExtension } from "./Buttons/Extension";
import { simpliedMaterialCardExtension } from "./Card/Extension";
import {  removeOverflows } from "./Common/StyleHelper";
import { alterspectiveDataTableExtension } from "./DataTables/Extension";
import { alterspectiveExpanderExtension } from "./Expander/Extension";
import { alterspectiveHtmlRepeaterExtension } from "./HTMLRepeater/Extension";
import { alterspectiveMaterialDesignIconExtension } from "./Icons";


export * as TestSettingHelper from "./Common/settings.Helper";


console.log("simpliedUX Card extension script has loaded");
// addBirdsEffect();
 //export { Framework };
  

let p = Framework;
console.log(p);

let initialised : boolean = false; 

// export const s1 = defaultSetting1;

export const initialize = async (): Promise<
  IFramework | undefined
> => {



  if(initialised==true) return 
  initialised=true;
  let promiseArray = new Array<
    Promise<IRegisteredExtensionModule | undefined>
  >();
 
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
 
 
  console.log(
    "------------------- All Alterspective Material Design Modules Initialized  -----------------"
  );
  if (promissesBack[0]?.as) {
    return promissesBack[0].as;
  }
}; 


// initialize();

