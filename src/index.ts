import * as Framework from "asFramework/src/index"
import { simpliedMaterialCardExtension } from "./Card/Extension";
import { displayFormIfHidden, removeOverflows } from "./Common/StyleHelper";
import { alterspectiveDataTableExtension } from "./DataTables/Extension";
import { addBirdsEffect } from "./demoBirds";
import { alterspectiveExpanderExtension } from "./Expander/Extension";
import { alterspectiveHtmlRepeaterExtension } from "./HTMLRepeater/Extension";
import { alterspectiveMaterialDesignIconExtension } from "./Icons";
// export { Framework } from "asframework/src/Models/framework"
export * as TestSettingHelper from "./Common/settings.Helper";

console.log("simpliedUX Card extension script has loaded");

export { Framework };

let initialised : boolean = false;

export const initialize = async (): Promise<
  Framework.IFramework | undefined
> => {

  if(initialised==true) return
  initialised=true;
  let promiseArray = new Array<
    Promise<Framework.IRegisteredExtensionModule | undefined>
  >();

  promiseArray.push(
    Framework.Extensions.registerExtensionModule(
      "dataTableExtension",
      alterspectiveDataTableExtension
    ).then((m) => {
      console.log("htmlRepeaterExtension - initialized");
      return m;
    })
  );

  promiseArray.push(
    Framework.Extensions.registerExtensionModule(
      "materialCardExtension",
      simpliedMaterialCardExtension
    ).then((m) => {
      console.log("materialCardExtension - initialized");
      return m;
    })
  );

  promiseArray.push(
    Framework.Extensions.registerExtensionModule(
      "materialIconExtension",
      alterspectiveMaterialDesignIconExtension
    ).then((m) => {
      console.log("alterspectiveMaterialDesignIconExtension - initialized");
      return m;
    })
  );

  promiseArray.push(
    Framework.Extensions.registerExtensionModule(
      "htmlRepeaterExtension",
      alterspectiveHtmlRepeaterExtension
    ).then((m) => {
      console.log("htmlRepeaterExtension - initialized");
      return m;
    })
  );

  promiseArray.push(
    Framework.Extensions.registerExtensionModule(
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
  addBirdsEffect();

  console.log(
    "------------------- All Alterspective Material Design Modules Initialized  -----------------"
  );
  if (promissesBack[0]?.as) {
    return promissesBack[0].as;
  }
};


initialize();