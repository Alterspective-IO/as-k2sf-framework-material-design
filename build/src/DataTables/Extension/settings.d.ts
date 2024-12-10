import { OptPreset } from "@alterspective-io/as-framework-material-design/dist/types";
import { OptColumnExtended, OptGridExtended } from "./interfaces";
export declare enum DataGridExecutionActions {
    Delete = "delete",
    Save = "save",
    none = "none"
}
export type Expression = {
    name: string;
    expression: string | Array<string>;
};
export declare class AsDataTableExtensionSettings {
    wrapHeaders: boolean;
}
export interface IASK2DataTableSettings {
    customStyle: string | Array<string> | null | undefined;
    autoBindToViewControls: boolean;
    autoBindToViewName: string | null | undefined;
    columnDefaults: OptColumnExtended | null | undefined;
    autoGenerateColumns: boolean;
    enabled: boolean;
    exportSettings: string | null | undefined;
    sampleData: string | null | undefined;
    data: any[];
    elevation: number;
    minHeight: number | null | undefined;
    execute_grid_method_saveModifiedData_on: string | null | undefined;
    execute_grid_method_deleteSelectedRow_on: string | null | undefined;
    execute_grid_method_runForEachChecked_on: string | null | undefined;
    execute_grid_method_appendNewRow_on: string | null | undefined;
    execute_grid_method_export_on: string | null | undefined;
    k2control_to_bind_rowIndex: string | null | undefined;
    default_grid_action_for_each_checked_item: DataGridExecutionActions | null | undefined;
    /**
     * Enabled binding K2 Events to Custom Methods against the grid.
     * format: { "K2EventName,viewname/instancename": "gridMethod()" }
     * example: { "UnCheckAll,current": "uncheckAll()" }
     */
    customGridMethodBindings: IASK2DataTableSettingsCustomMethodBinding[] | null | undefined;
    k2_rule_to_execute_for_each_updated: string | null | undefined;
    k2_rule_to_execute_for_each_created: string | null | undefined;
    k2_rule_to_execute_for_each_deleted: string | null | undefined;
    k2_rule_to_execute_for_each_checked: string | null | undefined;
    k2_rule_to_execute_for_focus_changed: string | null | undefined;
    k2_rule_to_execute_for_double_click: string | null | undefined;
    expressions: Expression[] | null | undefined;
    optGrid: OptGridExtended | null | undefined;
    theme: OptPreset | null | undefined;
}
export interface IASK2DataTableSettingsCustomMethodBinding {
    k2_rule_to_monitor: string | null | undefined;
    grid_method_to_execute: string | null | undefined;
    parameters: [string];
}
