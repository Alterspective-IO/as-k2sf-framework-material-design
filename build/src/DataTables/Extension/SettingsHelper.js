import { TargetType } from "../../Common/commonSettings";
import { getControlsInControl } from "../../Common/controlHelpers";
import { applySettingsToObject } from "../../Common/ObjectHelpers";
import { AS_K2_DataTable_Default_Settings } from "./defaults";
/**
 * Applys the programmed default settings to the target with the existing target settings taking priority
 * @param container
 * @returns
 */
export function applyDefaultSettings(target) {
    //apply the defaults to the target if not already applied
    let retValue = new AS_K2_DataTable_Default_Settings();
    //Apply found user settings
    applySettingsToObject(retValue, target.settings, "settings");
    // let found = target.appliedSettings.find((as) => as.from == this.tagName);
    // if (!found) {
    //   target.appliedSettings.push({
    //     from: this.tagName,
    //     fromInfo: AS_K2_DataTable_Default_Settings,
    //     settings: defaultSetting,
    //   });
    // }
    if (target.type == TargetType.views) {
        retValue.optGrid.pageOptions = undefined;
    }
    return retValue;
}
/**
 * Finds first control with as-settings in the name
 * @param controlParentElement
 * @returns
 */
export function findSettingsControl(controlParentElement) {
    let settingsControl;
    let parentControl = window.as.getControlFromElement(controlParentElement);
    if (parentControl) {
        settingsControl = getControlsInControl(parentControl).find((c) => c.name.includes("as-settings"));
    }
    return settingsControl;
}
//# sourceMappingURL=SettingsHelper.js.map