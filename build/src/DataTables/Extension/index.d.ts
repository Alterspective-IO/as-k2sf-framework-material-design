import { IPassPack, OptColumnExtended, AsMaterialdesignDatatableExtended, convertedListControls } from "./interfaces";
import { AsDataTableExtensionSettings, IASK2DataTableSettings } from "./settings";
import { AS_MaterialDesign_TagNames, ProcessedTarget, ProcessedTargets } from "../../Common/commonSettings";
import { IFramework, IControl, IViewInstance, ISmartObject } from "asFramework/src/index";
declare global {
    var SourceCode: any;
}
export declare class alterspectiveDataTableExtension {
    tagName: AS_MaterialDesign_TagNames;
    DataTable?: AsMaterialdesignDatatableExtended;
    as: IFramework;
    currentUserFQN: any;
    currentUserDisplayName: any;
    convertedTargets: convertedListControls[];
    targets: ProcessedTargets;
    INDEX: number;
    name: any;
    extensionSettings: AsDataTableExtensionSettings;
    constructor(as: IFramework);
    implementStylingRules(): Promise<void>;
    tagSettingsChangedEvent(processedTargets: ProcessedTargets, extensionSettings: any, specificAffectedControl?: IControl | IViewInstance, specificChangedSettings?: any): void;
    convertTargetToDataTable(target: ProcessedTarget<IControl | IViewInstance, IASK2DataTableSettings>): IPassPack | undefined;
    /**
     * Render the DataTable
     * @param clondedTarget
     * @param listControlElement
     * @param newDataTable
     * @param originalDisplay
     */
    private render;
    convertSmartobjectItemToCorrectDataTypes(smartobject: ISmartObject): any[];
    getK2PropValueAsBoolean(value: any): boolean;
}
/**
 * Get the data of the rowKey and updates all bound K2 Control
 * @param passPack
 * @param rowKey
 * @returns
 */
export declare function updateAllK2ControlsWithDataForTheRowKey(passPack: IPassPack, rowKey: number): void;
export declare function addEventToK2ControlToUpdateGridCurrentColumnRow(c: IControl, col: OptColumnExtended, passPack: IPassPack): void;
