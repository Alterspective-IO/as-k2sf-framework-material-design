import { OptPreset } from "alterspective-k2-smartfroms/node_modules/tui-grid/types/options";
import { OptColumnExtended, OptGridExtended } from "./interfaces";
export declare enum DataGridExecutionActions {
    Delete = "delete",
    Save = "save",
    none = "none"
}
export declare type Expression = {
    name: string;
    expression: string | Array<string>;
};
export declare class AsDataTableExtensionSettings {
    wrapHeaders: boolean;
}
export interface IASK2DataTableSettings {
    customStyle?: string | Array<string>;
    autoBindToViewControls: boolean;
    columnDefaults?: OptColumnExtended;
    autoGenerateColumns: boolean;
    enabled: boolean;
    exportSettings?: string;
    sampleData?: string;
    data: any[];
    elevation: number;
    minHeight?: number;
    execute_grid_method_saveModifiedData_on?: string;
    execute_grid_method_deleteSelectedRow_on?: string;
    execute_grid_method_runForEachChecked_on?: string;
    execute_grid_method_appendNewRow_on?: string;
    execute_grid_method_export_on?: string;
    k2control_to_bind_rowIndex?: string;
    default_grid_action_for_each_checked_item?: DataGridExecutionActions;
    k2_rule_to_execute_for_each_updated?: string;
    k2_rule_to_execute_for_each_created?: string;
    k2_rule_to_execute_for_each_deleted?: string;
    k2_rule_to_execute_for_each_checked?: string;
    k2_rule_to_execute_for_focus_changed?: string;
    k2_rule_to_execute_for_double_click?: string;
    expressions?: Expression[];
    optGrid?: OptGridExtended;
    theme?: OptPreset;
}
