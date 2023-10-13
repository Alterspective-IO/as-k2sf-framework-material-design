import { AS_MaterialDesign_TagNames, TargetedControlsSettingsContainer, Target, ProcessedTargets, ProcessedTarget, TargetType } from "./commonSettings";
import { IControl, IViewInstance, IFramework } from "../../framework/src";
type TagCallback = (processedTargets: ProcessedTargets, extensionSettings: any, specificAffectedControl?: IControl | IViewInstance, specificChangedSettings?: any) => void;
export declare function getPageSettings(as: IFramework): TargetedControlsSettingsContainer;
/**
 * Main entry point for a custom control looking to find all the controls and their settings
 * @param as
 * @param tagName the custom control Tag Namr
 * @returns a populated object with all the controls found and the settings to apply
 */
export declare function setupCallbackForWhenTagSettingsChange(as: IFramework, tagName: AS_MaterialDesign_TagNames, settingsChangedCallback: TagCallback): void;
type SiblingControlSettingsResult = {
    settingsControl: IControl | undefined;
    settings: any | undefined;
};
export declare function getProcessedTargetsForTagName(as: IFramework, tagName: AS_MaterialDesign_TagNames): {
    processedTargets: ProcessedTargets;
    extensionSettings: any;
};
export declare function refreshSettings(target: ProcessedTarget<IControl | IViewInstance, any>): void;
/**
 * Search for any sibling controls for the passed in control and tag.
 * A sibling control has the same name as the control it provides settings for except it includes as-settings in the name
 * @param taggedControl Control or ViewInstance that we need to find siblings for
 * @param mdControl The TAG
 * @param type View or Control
 * @returns The sibling control and its settings
 */
export declare function getControlSiblingSettings(taggedControl: IControl | IViewInstance, mdControl: AS_MaterialDesign_TagNames, type: TargetType): SiblingControlSettingsResult;
export type ControlTargetPair<T extends IControl | IViewInstance> = {
    k2ControlOrView: T;
    appliedTargetSettings?: Target[];
};
export {};
