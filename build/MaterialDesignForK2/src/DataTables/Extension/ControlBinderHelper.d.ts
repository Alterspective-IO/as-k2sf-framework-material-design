import { IViewInstance, IControl } from "asFramework/src/index";
import { ProcessedTarget } from "../../Common/commonSettings";
import { AsMaterialdesignDatatableExtended, IPassPack } from "./interfaces";
import { IASK2DataTableSettings } from "./settings";
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
export declare function addEventToK2ControlToUpdateGridCurrentRowData(c: IControl, dataPropertyName: string, passPack: IPassPack): void;
