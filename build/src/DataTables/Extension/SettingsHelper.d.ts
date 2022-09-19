import { IControl, IViewInstance } from "@alterspective-io/as-k2sf-framework";
import { ProcessedTarget } from "../../Common/commonSettings";
import { AS_K2_DataTable_Default_Settings } from "./defaults";
import { IASK2DataTableSettings } from "./settings";
/**
 * Applys the programmed default settings to the target with the existing target settings taking priority
 * @param container
 * @returns
 */
export declare function applyDefaultSettings(target: ProcessedTarget<IControl | IViewInstance, IASK2DataTableSettings>): AS_K2_DataTable_Default_Settings;
/**
 * Finds first control with as-settings in the name
 * @param controlParentElement
 * @returns
 */
export declare function findSettingsControl(controlParentElement: HTMLElement | null): IControl | undefined;
