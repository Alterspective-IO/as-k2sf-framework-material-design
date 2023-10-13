import { IControl, IViewInstance, TypeView, ControlType } from "../../framework/src";
export interface Templates {
    [name: string]: any;
    default?: any;
}
export interface Targets {
    controls: TargetControl[];
    views: TargetView[];
}
export interface ProcessedTargets {
    tag: AS_MaterialDesign_TagNames;
    controls: ProcessedTarget<IControl, any>[];
    viewsInstances: ProcessedTarget<IViewInstance, any>[];
}
export interface Target {
    name?: string;
    match?: "exact" | "contains" | "startsWith" | "endsWith";
    templates?: string | Array<string>;
    enabled?: boolean;
    note?: string;
    settings?: any;
}
export declare enum TargetType {
    controls = "controls",
    views = "views"
}
export interface ProcessedTarget<T extends IControl | IViewInstance, SettingsType> extends Target {
    tag: AS_MaterialDesign_TagNames;
    templateReferences: Array<{
        templateName: string;
        templateSettings: any;
    }>;
    appliedSettings: Array<{
        from: string;
        settings: any;
        fromInfo: any | undefined;
    }>;
    settings: SettingsType;
    referencedK2Object: T;
    type: TargetType;
}
export interface TargetView extends Target {
    typeOfView?: TypeView;
}
export interface TargetControl extends Target {
    viewName?: string;
    controlsToTarget?: ControlType;
}
export type ExtensionSettings = {
    enabled: boolean;
    [name: string]: any;
};
/**
 * JSON structure with extension settings, templates and target settings
 */
export type TargetedControlSettings<TExtensionSettings extends ExtensionSettings> = {
    extensionSettings: TExtensionSettings;
    templates?: Templates;
    targets?: Targets;
};
export type ProcessedTargetedControlSettings = {
    tag?: AS_MaterialDesign_TagNames;
    templates?: Templates;
    targets?: ProcessedTargets;
};
export declare enum AS_MaterialDesign_TagNames {
    dataTable = "as-md-datatable",
    expander = "as-md-expander",
    card = "sux-md-card",
    htmlRepeater = "as-md-htmlrepeater",
    icon = "as-md-icon"
}
export type TargetedControlsSettingsContainer = {
    [key in AS_MaterialDesign_TagNames]?: TargetedControlSettings<any>;
};
export type ProcessedTargetedControlsSettingsContainer = {
    [key in AS_MaterialDesign_TagNames]?: ProcessedTargetedControlSettings;
};
export declare enum AS_MaterialDesign_SettingKeywords {
    pageSettings = "as-md-page-settings",
    mdSiblingControlSetting = "as-settings"
}
