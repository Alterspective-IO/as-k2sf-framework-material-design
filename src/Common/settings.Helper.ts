// import {
//   FrameworkControlTags,
//   IFramework,
//   IControl,
//   IViewInstance,
//   Rule,
//   EmittedControlEvent,
// } from "@alterspective-io/as-k2sf-framework"
import {
  AS_MaterialDesign_TagNames,
  AS_MaterialDesign_SettingKeywords,
  TargetedControlSettings as TargetedControlsSettings,
  TargetedControlsSettingsContainer,
  Target,
  ProcessedTargets,
  ProcessedTarget,
  TargetControl,
  Templates,
  TargetType,
  TargetView,
  ProcessedTargetedControlsSettingsContainer,
  ExtensionSettings,
} from "./commonSettings";
import { applySettingsToObject } from "./ObjectHelpers";
import { getJsonFromControlValue, getJsonFromString } from "./controlHelpers";
import * as _ from "lodash";
import { IControl, IViewInstance, IFramework, Rule, FrameworkControlTags, EmittedControlEvent, ControlType } from "../../framework/src";
import { INFO_EXAMPLE_PAGE_SETTING, SIMPLE_EXAMPLE_PAGE_SETTING, WITH_EXAMPLE_DATA_TABLE_SETTINGS, applyExampleSettings, getExampleSettingForControlType } from "./examples";


let eventTarget = new EventTarget();
// export function addPageSettingsChangedListener(
//   callback: (evt: CustomEvent<TargetedControlsSettingsContainer>) => void
// ): void {
//   //  console.log(`---> TCL: Control -> addListner -> event [${smartFormEventTypes}] `)
//   return eventTarget.addEventListener(
//     "PageSettingsChanged",
//     callback as (evt: Event) => void
//   );
// }

type TagCallback = (
  processedTargets: ProcessedTargets,
  extensionSettings: any,
  specificAffectedControl?: IControl | IViewInstance,
  specificChangedSettings?:any
) => void;
 
type TagCallbackKeyValue = {
  as: IFramework;
  tagName: AS_MaterialDesign_TagNames; 
  tagCallback: TagCallback;
};
 
let cachedPageSettingControls: Array<IControl>;
let tagCallbacks = new Array<TagCallbackKeyValue>();


export function applyExampleToControls(controlType:ControlType): string
{

  return getExampleSettingForControlType(controlType);

 

}


function addFoundPageSettingsControls(control: IControl) {
  if (cachedPageSettingControls.indexOf(control) === -1) {
    console.log("TCL: addFoundPageSettingsControls -> control", control);

    

    cachedPageSettingControls.push(control);
    //add event hander to monitor for changing of settings
    control.rules.OnChange?.addListener(
      "SettingChangedListner",
      pageSettingControlChanged
    );
    control.events.smartformEventPopulated.addEvent(pageSettingControlChanged);
  }
}

function addTagCallbacks(value: TagCallbackKeyValue) {
  console.log(`addTagCallbacks checking [${value.tagName}]`)
  if (tagCallbacks.indexOf(value) === -1) {
    tagCallbacks.push(value);
    console.log(`Adding Tage Callback for  [${value.tagName}]`)
  }
}

//Manage callback to tag handlers when settings change
function pageSettingControlChanged(evt: CustomEvent<Rule>) {
  console.log("TCL: pageSettingControlChanged - rule", evt);


  let parentControl = evt.detail.parent as IControl;

  parentControl.value = applyExampleSettings(parentControl.value)

  tagCallbacks.forEach((tc) => {
    let retValue = getProcessedTargetsForTagName(tc.as, tc.tagName);

    console.log("TCL: settingsChangedCallback - ", tc.tagName);
    tc.tagCallback(retValue.processedTargets, retValue.extensionSettings);
  });
}

export function getPageSettings(
  as: IFramework
): TargetedControlsSettingsContainer {
  let retValue: TargetedControlsSettingsContainer = {};

  //We only need to find the PAGE settings controls once, so we cache them here if non in the cache
  if (!cachedPageSettingControls) {
    findAndCacheAllPageSettingControls(as);
  }

  //Extract the settings from the controls
  for (let index = 0; index < cachedPageSettingControls.length; index++) {
    const c = cachedPageSettingControls[index];

    if (!c.smartobject.exists) {
      let foundSetting = getJsonFromControlValue(c);
      if (foundSetting)
        applySettingsToObject(retValue, foundSetting, "settings");
    } else {
      c.smartobject.items
        ?.filter(
          (soi: any) =>
            soi.SubCategory == AS_MaterialDesign_SettingKeywords.pageSettings
        )
        .forEach((soi) => {
          if (typeof soi.Value == "string") {
            let foundSetting = getJsonFromString(soi.Value);
            applySettingsToObject(retValue, foundSetting, "settings");
          }
        });
    }
  }
  return retValue;
}

function findAndCacheAllPageSettingControls(as: IFramework) {
  cachedPageSettingControls = new Array<IControl>();

  let sortedFoundSettings = as
    .getControlsByNameContains(AS_MaterialDesign_SettingKeywords.pageSettings)
    .sort((a, b) => {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });

  for (let index = 0; index < sortedFoundSettings.length; index++) {
    const c = sortedFoundSettings[index];
    addFoundPageSettingsControls(c);
  }

  //look f=if we have a page settings control on the page
  //Searches for a "as-page-settings" data control and if found looks for "as-md-page-settings"
  let pageSettingsControls = as.collections.viewInstanceControls.filter((c) =>
    c.name.includes(FrameworkControlTags.pageSettings)
  );

  for (let index = 0; index < pageSettingsControls.length; index++) {
    const c = pageSettingsControls[index];
    addFoundPageSettingsControls(c);
  }
}

/**
 * Main entry point for a custom control looking to find all the controls and their settings
 * @param as
 * @param tagName the custom control Tag Namr
 * @returns a populated object with all the controls found and the settings to apply
 */
export function setupCallbackForWhenTagSettingsChange(
  as: IFramework,
  tagName: AS_MaterialDesign_TagNames,
  settingsChangedCallback: TagCallback
): void {
  //add the TAG to a repository of tag callback to execute when settings change
  addTagCallbacks({
    as: as,
    tagName: tagName,
    tagCallback: settingsChangedCallback,
  });
  //execute a callback for initial values
}

type SiblingControlSettingsResult = {
  settingsControl: IControl | undefined;
  settings: any | undefined;
};

export function getProcessedTargetsForTagName(
  as: IFramework,
  tagName: AS_MaterialDesign_TagNames
) {
  //Get current page settings
  let pageSettings = getPageSettings(as);
  //Extract just the setting for the current tag name
  let pageControlTypeSettings = pageSettings[tagName];

  let dretValue: ProcessedTargets = {
    controls: [],
    viewsInstances: [],   
    tag: tagName
  };

  //setup a return value with the same templates but the targets will be converted to the actual found controls
  let retValue: ProcessedTargets = {
    controls: processControls(
      as,
      tagName,
      pageControlTypeSettings,
      TargetType.controls
    ),
    viewsInstances: processControls(
      as,
      tagName,
      pageControlTypeSettings,
      TargetType.views
    ),
    tag: tagName
  };

  applyTemplatesToControlSettings(
    pageControlTypeSettings?.templates,
    retValue.controls
  );
  applyTemplatesToControlSettings(
    pageControlTypeSettings?.templates,
    retValue.viewsInstances
  );

  // if (settingsChangedCallback) {
  //   console.log("TCL: settingsChangedCallback - ", tagName);
  //   settingsChangedCallback(
  //     retValue,
  //     pageControlTypeSettings?.extensionSettings
  //   );
  // } else {
  //   console.warn("settingsChangedCallback is empty");
  // }

  return {
    processedTargets: retValue,
    extensionSettings: pageControlTypeSettings?.extensionSettings
  };
}


export function refreshSettings(target: ProcessedTarget<IControl | IViewInstance, any>) {
  if(target.type ==TargetType.controls)
  { 
    target.settings= getProcessedTargetsForTagName(target.referencedK2Object._as,target.tag).processedTargets.controls.find(pc=>pc.referencedK2Object.id==target.referencedK2Object.id)?.settings;
    
  }
}


/**
 * Finds all the controls on the form with the tagName in the name of the control and applies settings.
 * Settings are found in the [Targetting Settings] as well as any [Sibling Controls]
 * @param as 
 * @param tagName 
 * @param targetingSettings // The JSON used to target the control on the page.
 * @param type Control or View
 * @returns An array of Targeted Control with their applied settings
 */
function processControls<
  T extends IControl | IViewInstance,
  TS,
  TES extends ExtensionSettings
>(
  as: IFramework,
  tagName: AS_MaterialDesign_TagNames,
  targetingSettings: TargetedControlsSettings<TES> | undefined,
  type: TargetType
): ProcessedTarget<T, TS>[] {

  let retValue = new Array<ProcessedTarget<T, TS>>();
  let taggedAndTargetedControlPairs: ControlTargetPair<T>[]
  
  //#region Get Tagged and Targeted Controls
  //Get all the controls or views that have the TAG in their name. 
  let taggedControlPairs = getTaggedControls<T>(as,type, tagName);    
  //Gets all targeted controls based on the [Control Setting ]  
  let targetedControlPairs = getTargetedControls<T, TES>(as,type,targetingSettings);
  //#endregion Get
  
  //Combine Tagged and Targeted Controls into a single array
  taggedAndTargetedControlPairs = _.union(taggedControlPairs,targetedControlPairs)

  //At this point we should have an array of all the controls we need to setup and apply settings to
  //We now need to find the settings for each control, we look in the target settings and also if any sibling controls exist
  taggedAndTargetedControlPairs.forEach((targetedControl) => {    
    //Setup the new return value for the array of found controls.
    let newProcessedTargetControl: ProcessedTarget<T, any> = {
      referencedK2Object: targetedControl.k2ControlOrView,
      appliedSettings: [],
      templateReferences: [], 
      settings: {}, 
      type: type,      
      tag: tagName
    };

    //apply the existing setting ( from the targetting settings )
    targetedControl.appliedTargetSettings?.forEach((targetToApply) => {
      newProcessedTargetControl.appliedSettings.push({
        from: `Target`,
        settings: targetToApply.settings,
        fromInfo: targetToApply,
      });
      applySettingsToObject(
        newProcessedTargetControl.settings,
        targetToApply.settings,
        "settings"
      );
    });


    //TODO is this the same as the above?
    // //APPLY TARGET SETTINGS -  Get any setting for this control in control settings targetat apply
    // let pageLevelControlTargetSetting =
    //   getControlSettingFromControlTypePageSettings(
    //     pageControlTypeSettings,
    //     newProcessedTargetControl.settings
    //   );
    // applySettingsToObject(
    //   newProcessedTargetControl.settings,
    //   pageLevelControlTargetSetting,
    //   "settings"
    // );

    //APPLY SIBLING SETTINGS - search for and get any setting explicitly set for this control in a sibling settings control
    let siblingControlResult = getControlSiblingSettings(
      newProcessedTargetControl.referencedK2Object,
      tagName,
      type
    );

    if (siblingControlResult) {

       //Add event handler to notify if this control settings change
      if(siblingControlResult.settingsControl)
      {
        siblingControlResult.settingsControl.events.smartformEventChanged.addEvent((ev:EmittedControlEvent)=>
        {

          tagCallbacks.filter(tc=>tc.tagName==tagName).forEach((tc) => {
            console.log("TCL: sibling settings changed - Execute callback - ", tc.tagName);
            let targetedControlId = newProcessedTargetControl.referencedK2Object.id

            let retValue = getProcessedTargetsForTagName(tc.as, tc.tagName);       
            let specificControlSettings = {}
            if(targetedControlId)
            {
              specificControlSettings = retValue.processedTargets.controls.find(pc=>pc.referencedK2Object.id == targetedControlId)?.settings //getJsonFromControlValue(ev.control)            
            }
            tc.tagCallback(retValue.processedTargets, retValue.extensionSettings, newProcessedTargetControl.referencedK2Object, specificControlSettings);
          });

        },undefined,"settingsHelper")
      }

      if (siblingControlResult.settings) {


       


        newProcessedTargetControl.appliedSettings.push({
          from: `Sibling Control`,
          settings: siblingControlResult.settings,
          fromInfo: siblingControlResult.settingsControl,
        });
        applySettingsToObject(
          newProcessedTargetControl.settings,
          siblingControlResult.settings,
          "settings"
        );
      }
    }
    retValue.push(newProcessedTargetControl);
  });
  return retValue;
}

function getTaggedControls<T extends IControl | IViewInstance>(as: IFramework,type: TargetType, tagName: AS_MaterialDesign_TagNames) {
  
  let retValue : ControlTargetPair<T>[] = []
  let taggedControls: T[]; //The return variable that will be populated with each found control

  if (type == TargetType.controls) {
    taggedControls = (as.getControlsByNameContains(tagName) as T[]) || [];
  } else {
    taggedControls =
      (as.collections.viewInstances.filter(
        (vi) => vi.name.includes(tagName) || vi.parent?.name.includes(tagName)
      ) as T[]) || []; // any views / viewinstances with the tag
  }
  //if existing controls convert them to control setting pairs
  if (taggedControls)
    if (Array.isArray(taggedControls))
      taggedControls.forEach((ec) => {
        let newItem: ControlTargetPair<T> = {
          k2ControlOrView: ec,
          appliedTargetSettings: [],
        };
        retValue.push(newItem);
      });
  return retValue;
}

/**
 * Search for any sibling controls for the passed in control and tag. 
 * A sibling control has the same name as the control it provides settings for except it includes as-settings in the name
 * @param taggedControl Control or ViewInstance that we need to find siblings for
 * @param mdControl The TAG 
 * @param type View or Control 
 * @returns The sibling control and its settings
 */
export function getControlSiblingSettings(
  taggedControl: IControl | IViewInstance,
  mdControl: AS_MaterialDesign_TagNames,
  type: TargetType
): SiblingControlSettingsResult {

  //Extract the name of the control without the tag name
  let settingsControlName = taggedControl.name.replace(mdControl, "").trim();

  let settingTag = AS_MaterialDesign_SettingKeywords.mdSiblingControlSetting;
  
  //if its a control search for siblings in the same viewInstance, if its a view then search
  let controlsToSearch =
    type == TargetType.controls
      ? (taggedControl.parent as IViewInstance).controls
      : taggedControl._as.collections.viewInstances.find(
          (vi) => vi.isFormViewInstance == true
        )?.controls;

  //Find control sibling settings if exists
  let settingsControl = controlsToSearch
    ?.filter((c) => c.name.includes(settingsControlName))
    .find((c) =>
      c.name.includes(settingTag)
    );
  let settingControlValue = getJsonFromControlValue(settingsControl);
  return { settingsControl: settingsControl, settings: settingControlValue };
}

/**
 * Search console settings to find a matching setting for the control, first priority is a match on control name
 * and view/viewInstance name, second priority is a match just on the control name
 * @param controlSettings
 * @param controlSettingPair
 * @returns
 */
// export function getControlSettingFromControlTypePageSettings(
//   controlSettings: TargetedControlsSettings | undefined,
//   controlSettingPair: ControlTargetPair
// ): Target | undefined {
//   let retValue: Target | undefined;
//   if (!controlSettings) return undefined;
//   if (!controlSettings.targets) return undefined;
//   if (!controlSettings.targets.controls) return undefined;

//   //= controlSettingPair.targetSetting || {};

//   controlSettings.targets.controls.forEach((targetSettings) => {
//     console.log("targetSettings", targetSettings);
//     //for (const setting in controlSettings?.targets.controls) {

//     // let settingName = targetSettings.name
//     // //does this setting match the name of the control?
//     // if (settingName != controlSettingPair.control.name) continue;

//     // let settingView = settingNameViewArray[1];
//     // //if the setting has a viewname then check if we have a match there too
//     // if (settingView) {
//     //   if (
//     //     controlSettingPair.control.parent?.name == settingView ||
//     //     controlSettingPair.control.parent?.parent?.name == settingView
//     //   ) {
//     //     //if we find a match by name and view/viewInstance set and get out
//     //     applySettingsToObject(
//     //       retValue,
//     //       controlSettings?.targets[setting],
//     //       "settings"
//     //     );
//     //     break;
//     //   }
//     // } else {
//     //   //if we find a match only on name set but continue loop incase there is a more exact match still to come
//     //   applySettingsToObject(
//     //     retValue,
//     //     controlSettings?.targets[setting],
//     //     "settings"
//     //   );
//     // }
//   });

//   return retValue;
// }

function applyTemplatesToControlSettings<
  T extends IControl | IViewInstance,
  TS
>(templates: Templates | undefined, processedTarget: ProcessedTarget<T, TS>[]) {
  let retValue = processedTarget;
  if (!processedTarget) return retValue;
  if (!templates) return retValue;

  for (let index = 0; index < processedTarget.length; index++) {
    const target = processedTarget[index];
    let combinedTemplateSetting = {};

    //Find all the templates from all the applied targets and build the templates array for this item
    target.templates = [];
    target.appliedSettings
      .filter((as) => as.from == "Target")
      .forEach((as) => {
        let appliedTarget = as.fromInfo as Target;
        if (appliedTarget) {
          let tempTemplates = new Array<string>();

          if (!Array.isArray(appliedTarget.templates)) {
            tempTemplates = appliedTarget.templates?.split(",") || [];
          }
          tempTemplates.forEach((tt) => {
            if (!target.templates?.includes(tt))
              (target.templates! as Array<string>).push(tt);
          });
        }
      });

    let templatesNameAsLowercase = target.templates.map((t) =>
      t.toLocaleLowerCase()
    ); //make everything lowercase

    //APPLY DEFAULT TEMPLATE - if there is a default template apply it first but dont if its been asked not to implement
    if (!templatesNameAsLowercase.includes("!default")) {
      if (templates.default) {
        target.templateReferences.push({
          templateName: "default",
          templateSettings: templates.default,
        });
        target.templates.push("default");
        target.appliedSettings.push({
          from: "Template",
          settings: templates.default,
          fromInfo: "default",
        });
        applySettingsToObject(
          combinedTemplateSetting,
          templates?.default,
          "settings"
        );
      }
    }

    for (let index = 0; index < templatesNameAsLowercase.length; index++) {
      const lowerCaseTemplateName = templatesNameAsLowercase[index];
      const templateName = target.templates[index];
      if (lowerCaseTemplateName == "!default") continue; //ignore default as its delt with with above

      let templateSettings; //find template ignoring case - for less pront to errors from end users
      for (const tName in templates) {
        if (tName.toLocaleLowerCase() == lowerCaseTemplateName) {
          templateSettings = templates[tName];
        }
      }

      //if we find a template then add it as a reference and apply its setting
      if (templateSettings) {
        target.templateReferences.push({
          templateName: templateName,
          templateSettings: templateSettings,
        });
        //Apply the found template to the combined templates and let the most recent
        //template override any previous values
        target.appliedSettings.push({
          from: "Template",
          settings: templateSettings,
          fromInfo: templateName,
        });
        applySettingsToObject(
          combinedTemplateSetting,
          templateSettings,
          "settings"
        );
      }
    }

    //Apply the combined templates to the control but keep the explicitly sets settings of the target
    applySettingsToObject(target.settings, combinedTemplateSetting, "primary");
  }
}
export type ControlTargetPair<T extends IControl | IViewInstance> = {
  k2ControlOrView: T;
  appliedTargetSettings?: Target[];
};

/**
 * Finds all controls based [Target Control Settings] and matchest them up with the setting ( in Target Control Settings ) used to find them.
 * @param as
 * @param targetedControlsSettings 
 * @param existingTargetedControls
 * @returns a Control Settings pair
 */
function getTargetedControls<
  T extends IControl | IViewInstance,
  TES extends ExtensionSettings
>(
  as: IFramework,
  type: TargetType,
  targetedControlsSettings?: TargetedControlsSettings<TES> | undefined
): Array<ControlTargetPair<T>> {
  let retValue = new Array<ControlTargetPair<T>>();

 

  if (!targetedControlsSettings) return retValue;
  if (!targetedControlsSettings.targets) return retValue;

  let arrayToProcess = targetedControlsSettings.targets[type];

  //run though all the targeted controls in the settings

  if(!arrayToProcess) return retValue;

  // for (
  //   let index = 0;
  //   arrayToProcess.length ;
  //   index++
  // ) {

  arrayToProcess.forEach((target) => {

    // const target = arrayToProcess[index];

    if(!target) return; 

    if (target.enabled === false) return; //ignore targets that are not enabled.

    let foundControl: IControl[] | IViewInstance[] | undefined;
    let targetName = target.name;

    switch (target.match) {
      case "contains":
      case "endsWith":
      case "startsWith":
        if (type == TargetType.controls) {
          foundControl = as.collections.viewInstanceControls.filter(
            (c) =>
              (!targetName || (c.name as any)[target.match!](targetName)) &&
              (c.type === (target as TargetControl).controlsToTarget ||
                !(target as TargetControl).controlsToTarget)
          );
        } //search view instances
        else {
          foundControl = as.collections.viewInstances.filter(
            (c) =>
              !targetName ||
              (c.name as any)[target.match!](targetName) ||
              !targetName ||
              (c.parent?.name as any)[target.match!](targetName)
          );
        }

        break;
      default:
        if (type == TargetType.controls) {
          foundControl = as.collections.viewInstanceControls.filter(
            (c) =>
            {
              // console.log(c.type);
              return (
              (!targetName || c.name === targetName) &&
              (c.type === (target as TargetControl).controlsToTarget ||
                !(target as TargetControl).controlsToTarget))
            }
          );
        } //search views
        else {
          foundControl = as.collections.viewInstances.filter((c) => {
            return (
              !targetName ||
              c.name === targetName ||
              !targetName ||
              c.parent?.name == targetName
            );
          });
        }
        break;
    }

    //after all searching if there are not controls found then move to next
    if (!foundControl) return;

    //If we are dealing with controls and have been asked to target a specific view/viewInstance then filter the result for only the view(s) required
    if (type == TargetType.controls) {
      let targetViewName = (target as TargetControl).viewName;
      if (targetViewName) {
        (foundControl as IControl[]) = (foundControl as IControl[]).filter(
          (c) => {
            if (c.parent?.name == targetViewName) return true;
            if (c.parent?.parent?.name == targetViewName) return true;
            return false;
          }
        );
      }
    } else {
      let typeOfView = (target as TargetView).typeOfView;
      if (typeOfView) {
        (foundControl as IViewInstance[]) = (
          foundControl as IViewInstance[]
        ).filter((vi) => vi.typeView == typeOfView);
      } else {
        //console.warn(`Target Views should target a specific view type updates the setting to specify a typeOfView TargetInfo:`,target)
        //Do we allow targeting of all view types?
      }
    }

    //Add and new controls to the return controls ( no duplicates )
    foundControl.forEach((c) => {
      let existingControl = retValue.find(
        (existing) => existing.k2ControlOrView.id == c.id
      );
      

      if (!existingControl) {
        retValue.push({
          k2ControlOrView: c as T,
          appliedTargetSettings: [target],
        });
      } else {
        //if we find an existing control and this control has been very specifically targeted then merge the settings
        //NOTE: commented out as cuasing conficts, if control is targeted and alread added then dont add more targets
        //existingControl.appliedTargetSettings?.push(target);
      }
    });
  });

  return retValue;
}
