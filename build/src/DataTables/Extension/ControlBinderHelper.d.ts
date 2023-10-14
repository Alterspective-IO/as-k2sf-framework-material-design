import { IViewInstance, IControl } from "../../../framework/src";
import { ProcessedTarget } from "../../Common/commonSettings";
import { AsMaterialdesignDatatableExtended, IPassPack } from "./interfaces";
import { IASK2DataTableSettings } from "./settings";
/**
 * This function binds the K2 Controls to the columns in the grid
 * It first binds to explicitly set K2 Controls in the settings.optGrid.columns[].k2control_to_bind_to
 *
 * @param target
 * @param passPack
 */
export declare function bingColumnsToK2Controls(target: ProcessedTarget<IViewInstance | IControl, IASK2DataTableSettings>, passPack: IPassPack): void;
export declare function addEventBindingToViewInstanceFieldControls(passPack: IPassPack): void;
/**
 * Implements all binding of K2 Controls and K2 Rules events and methods
 * @param dataTable
 */
export declare function implementK2ExecutionControlBindings(dataTable: AsMaterialdesignDatatableExtended): void;
/**
 * Implements rules to execute when the K2 Control in settings.saveK2Control is clicked.
 * @param dataTable
 */
export declare function implementSaveBinding(dataTable: AsMaterialdesignDatatableExtended): void;
/**
 * Update the GRID when a bound K2 control updates
 * @param c The Control to monitor
 * @param dataPropertyName The grid column data property name to update
 * @param passPack The passPack
 * @returns
 */
export declare function addEventToK2ControlToUpdateGridCurrentRowData(c: IControl, dataPropertyName: string, passPack: IPassPack): void;
