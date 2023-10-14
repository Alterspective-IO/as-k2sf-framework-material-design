import { AsMaterialdesignDatatable } from "@alterspective-io/as-framework-material-design/dist/components/as-materialdesign-datatable";
import { alterspectiveDataTableExtension } from ".";
import { IASK2DataTableSettings } from "./settings";
import { ProcessedTarget } from "../../Common/commonSettings";
import { Formatter, OptColumn, OptColumnHeaderInfo, OptGrid, OptHeader, Row, SliderBase } from "@alterspective-io/as-framework-material-design/dist/types";
import { IControl, IViewInstance, LinkedHiddenHash, IFramework } from "../../../framework/src";
export interface AsMaterialdesignDatatableExtended extends AsMaterialdesignDatatable {
    passPack?: IPassPack;
    structureGenerated?: boolean;
}
export interface IPassPack {
    finalSettings?: IASK2DataTableSettings;
    observer?: MutationObserver;
    target: ProcessedTarget<IControl | IViewInstance, IASK2DataTableSettings>;
    dataTable?: AsMaterialdesignDatatable;
    grid?: TUIGridExtended;
    extension: alterspectiveDataTableExtension;
    currentRowKey: number;
    processedSettings: IASK2DataTableSettings;
    viewInstance: IViewInstance;
    savedResetSettings?: any;
}
export interface RowExtended extends Row {
    _linkedHiddenHash?: LinkedHiddenHash;
}
export declare class TUIGridExtended {
    [key: string]: any;
    parent?: AsMaterialdesignDatatable;
}
export interface OptColumnExtended extends Omit<OptColumn, "formatter"> {
    extraInfo?: any;
    k2control_to_bind_to?: string;
    dataBoundK2Controls?: IControl[];
    formatter?: Formatter | StringExpressionArray;
}
export { OptHeader, OptColumnHeaderInfo };
export interface OptGridExtended extends Omit<OptGrid, 'el' | 'columns'> {
    columns: OptColumnExtended[];
}
export interface DataGridRenderOptions {
    as: IFramework;
    passPack: IPassPack;
}
export interface CustomSliderDataGridRenderOptions extends DataGridRenderOptions, SliderBase {
}
export interface CustomProcessBarDataGridRenderOptions extends HTMLProgressElement {
    max: number;
    backgroundColor: string;
    color: string;
    showValue: boolean;
}
export interface CustomButtonDataGridRenderOptions extends DataGridRenderOptions {
    icon: string;
    k2rule_to_execute_on_button_click: string;
    label: string;
    outlined: boolean;
    raised: boolean;
    style: {
        width: string;
    };
    targetColumn: string;
    toggleValueOnClick: boolean;
    trailingIcon: boolean;
}
export interface convertedListControls {
    info: IPassPack | undefined;
}
export interface StringExpressionArray {
    exp: string | Array<string>;
}
