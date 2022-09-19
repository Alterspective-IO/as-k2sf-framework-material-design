import { IControl, IViewInstance} from "@alterspective-io/as-k2sf-framework"
import { ProcessedTarget, TargetType } from "../../Common/commonSettings";
import { getControlsInControl } from "../../Common/controlHelpers";
import { applySettingsToObject } from "../../Common/ObjectHelpers";
import { AS_K2_DataTable_Default_Settings } from "./defaults";
import { OptGridExtended } from "./interfaces";
import { IASK2DataTableSettings } from "./settings";


  /**
   * Applys the programmed default settings to the target with the existing target settings taking priority
   * @param container
   * @returns
   */
   export function applyDefaultSettings(
    target: ProcessedTarget<IControl | IViewInstance, IASK2DataTableSettings>
  ) : AS_K2_DataTable_Default_Settings {
    


    //apply the defaults to the target if not already applied
    let retValue = new AS_K2_DataTable_Default_Settings();
    //Apply found user settings
    applySettingsToObject(retValue,target.settings, "settings");

    // let found = target.appliedSettings.find((as) => as.from == this.tagName);
    // if (!found) {
    //   target.appliedSettings.push({
    //     from: this.tagName,
    //     fromInfo: AS_K2_DataTable_Default_Settings,
    //     settings: defaultSetting,
    //   });
     
    // }

    if (target.type == TargetType.views) {
      (retValue.optGrid as OptGridExtended).pageOptions = undefined;
    }
    
    return retValue
  }

  /**
   * Finds first control with as-settings in the name
   * @param controlParentElement
   * @returns
   */
  export function findSettingsControl(controlParentElement: HTMLElement | null) {
    let settingsControl: IControl | undefined;
    let parentControl = window.as.getControlFromElement(controlParentElement!);

    if (parentControl) {
      settingsControl = getControlsInControl(parentControl!).find((c) =>
        c.name.includes("as-settings")
      );
    }
    return settingsControl;
  }
