import { AsMaterialdesignDatatableExtended, IPassPack } from "./interfaces";
/**
 * Sets the databound K2 Controls for each row in the data array and executes all K2 rules based on the configurationName
 * @param ruleConfigurationName - the configuration name of the rule to execute "name" | "name,viewInstanceName" | "name,current" for the current ViewInstance
 * @param passPack
 * @param dataArray
 * @returns
 */
export declare function executeK2RuleForEachRow(ruleConfigurationName: string | undefined, passPack: IPassPack, dataArray: Array<any>): Promise<void>;
/**
 * Updates the value of K2 Controls with the passed in data, both implicitly bound controls in Column settings.optGrid.Column[].k2Control and auto bound ViewInstance controls
 * when settings.autoBindToViewControls=true
 * @param pack
 * @param dataObject :  a single instance of some name value type JSON data
 */
export declare function updateAllK2ControlsBoundToGridColumns(pack: IPassPack, dataObject: any): void;
/**
 * Attach to K2 events and execute method passing in the event and passPack
 * Ensures that the event is always the latest and no duplicated events are attached using the EventId `MdDataTable${passPack.control.id}`
 * @param dataTable
 * @param k2ConfigurationName - format [rule|control:name,viewInstance] or [rule|control:name] or  [rule|control:name,current] for current view instance
 * @param method
 */
export declare function implementK2ControlToGridAction(dataTable: AsMaterialdesignDatatableExtended, k2ConfigurationName: string | undefined, method: Function): void;
