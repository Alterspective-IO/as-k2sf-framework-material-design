import { IControl, IFramework, IViewInstance, LinkedHiddenHash } from "asFramework/src/index";
import { AsMaterialdesignDatatable } from "alterspective-k2-smartfroms/dist/components/as-materialdesign-datatable";
import { alterspectiveDataTableExtension } from ".";
import { OptColumn, OptGrid, OptHeader, OptColumnHeaderInfo } from "alterspective-k2-smartfroms/node_modules/tui-grid/types/options";
import { IASK2DataTableSettings } from "./settings";
import { SliderBase } from "alterspective-k2-smartfroms/dist/types/exports/exportMD";
import { ProcessedTarget } from "../../Common/commonSettings";
import { Row } from "alterspective-k2-smartfroms/node_modules/tui-grid";
import { Formatter } from "alterspective-k2-smartfroms/node_modules/tui-grid/types/store/column";
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
