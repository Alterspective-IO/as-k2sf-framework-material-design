var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cssForK2 from "./extension.css";
import * as _ from "lodash";
import { AsDataTableExtensionSettings } from "./settings";
import { applySettingsToObject } from "../../Common/ObjectHelpers";
import { addDependantTopLevelStyles, } from "../../Common/StyleHelper";
// import { Log, LogIn, LogOut } from "../../Common/Logging";
import { AS_MaterialDesign_TagNames, TargetType, } from "../../Common/commonSettings";
import { LogType, Log, PerformanceSession, ListViewInstance } from "asFramework/src/index";
import { configureColumns } from "./ColumnConfigurators";
import { insertGridUsingControl, insertGridUsingListView } from "./DataTablePlacement";
import { attachToSmartObjectsRefreshedEvent } from "./EventManagers";
import { applyDefaultSettings } from "./SettingsHelper";
import { bingColumnsToK2Controls, implementK2ExecutionControlBindings } from "./ControlBinderHelper";
import { convertExpressions, convertRenderers } from "./expressionConverters";
import { applyCustomStylings } from "./StyleHelpers";
import { updateAllK2ControlsBoundToGridColumns } from "./ControlExecutionHelpers";
import { getProcessedTargetsForTagName, refreshSettings, setupCallbackForWhenTagSettingsChange } from "../../Common/settings.Helper";
export class alterspectiveDataTableExtension {
    constructor(as) {
        //Dependencies - adjust names as required
        this.tagName = AS_MaterialDesign_TagNames.dataTable;
        // dependantViewName = "Alterspective.DataTable";
        this.currentUserFQN = SourceCode.Forms.SessionManagement.Session.userfqn;
        this.currentUserDisplayName = SourceCode.Forms.SessionManagement.Session.userdisplayname;
        this.convertedTargets = new Array();
        this.INDEX = 0;
        this.as = as;
        let p1 = new PerformanceSession("alterspectiveDataTableExtension", LogType.extensions);
        let processedTargetsAndExtensionSettings = getProcessedTargetsForTagName(as, this.tagName);
        setupCallbackForWhenTagSettingsChange(this.as, this.tagName, this.tagSettingsChangedEvent);
        this.targets = processedTargetsAndExtensionSettings.processedTargets;
        this.extensionSettings = new AsDataTableExtensionSettings(); //create new extension setting with defaults
        applySettingsToObject(this.extensionSettings, processedTargetsAndExtensionSettings.extensionSettings); //merge in anu users extension settings
        this.implementStylingRules();
        // this.targets.controls.forEach((target) => {
        //   this.convertedTargets.push({
        //     target: target,
        //     dataTable: this.convertTargetToDataTable(target),
        //   });
        // });
        // this.targets.viewsInstances.forEach((target) => {
        //   this.convertedTargets.push({
        //     target: target,
        //     dataTable: this.convertTargetToDataTable(target),
        //   });
        // });
        this.targets.controls.forEach((target) => {
            this.convertedTargets.push({
                info: this.convertTargetToDataTable(target),
            });
        });
        this.targets.viewsInstances.forEach((target) => {
            this.convertedTargets.push({
                info: this.convertTargetToDataTable(target),
            });
        });
        p1.finish();
    }
    implementStylingRules() {
        return __awaiter(this, void 0, void 0, function* () {
            let p1 = new PerformanceSession("implementStylingRules", LogType.extensions);
            cssForK2.use({
                target: this.as.window.document.head,
                Id: "as-md-datatable",
            });
            addDependantTopLevelStyles(this.as);
            var root = document.querySelector(':root');
            if (this.extensionSettings.wrapHeaders == true && root) {
                //  --as_md_datatable_header-white-space: break-spaces;
                // --as_md_datatable_--header-word-break: break-word;
                root.style.setProperty('--as_md_datatable_header-white-space', 'break-spaces');
                root.style.setProperty('-  --as_md_datatable_header-word-break', 'break-word');
            }
            else {
                root.style.setProperty('--as_md_datatable_header-white-space', 'nowrap');
                root.style.setProperty('-  --as_md_datatable_header-word-break', 'normal');
            }
            p1.finish();
        });
    }
    tagSettingsChangedEvent(processedTargets, extensionSettings, specificAffectedControl, specificChangedSettings) {
        var _a;
        console.log("TCL: alterspectiveDataTableExtension -> tagSettingsChangedEvent");
        console.log("processedTargets", processedTargets);
        console.log("extensionSettings", extensionSettings);
        if (specificAffectedControl) {
            console.log("specificAffectedControl", specificAffectedControl);
            console.log("specificChangedSettings", specificChangedSettings);
            if (specificChangedSettings) {
                let passPack = ((_a = specificAffectedControl.attachedCustomControl) === null || _a === void 0 ? void 0 : _a.element).passPack;
                if (passPack) {
                    passPack.extension.render(passPack);
                }
                //applySettingsToObject(specificAffectedControl.attachedCustomControl?.element,specificChangedSettings)
            }
        }
    }
    convertTargetToDataTable(target) {
        var _a;
        let p1 = new PerformanceSession(`convertListToDataTable - ${target.name}`, LogType.extensions);
        let contents = undefined; //placeholder to insert the card contents
        //TODO: this should be in render
        let targetControlHTMLElement = target.referencedK2Object.getHTMLElement();
        let targetControlWith = targetControlHTMLElement.style.width;
        let settings = target.settings;
        let passPack = {
            extension: this,
            target: target,
            dataTable: undefined,
            grid: undefined,
            currentRowKey: -1,
            viewInstance: target.type == TargetType.controls
                ? target.referencedK2Object.parent
                : target.referencedK2Object,
            processedSettings: settings
        };
        if (target.type == TargetType.views) {
            passPack = insertGridUsingListView(passPack);
        }
        else {
            passPack = insertGridUsingControl(passPack);
        }
        target.referencedK2Object.attachedCustomControl = { elementId: passPack.dataTable.id, element: passPack.dataTable };
        //Attach to the event when the target control is populatred with data
        attachToSmartObjectsRefreshedEvent(passPack, this.render);
        this.render(passPack);
        if (contents)
            (_a = passPack.dataTable) === null || _a === void 0 ? void 0 : _a.appendChild(contents);
        p1.finish();
        return passPack;
    }
    /**
     * Render the DataTable
     * @param clondedTarget
     * @param listControlElement
     * @param newDataTable
     * @param originalDisplay
     */
    render(passPack) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            let target = passPack.target;
            let newDataTable = passPack.dataTable;
            if (!target)
                return;
            if (!newDataTable)
                return;
            newDataTable.optGrid = {};
            // Object.assign(newDataTable,passPack.savedResetSettings)
            refreshSettings(passPack.target);
            // let target = _.cloneDeep(target)
            let p1 = new PerformanceSession(`render - ${target.name}`, LogType.extensions);
            try {
                //get latest settings
                // target = getProcessedTargetsForTagName(
                //   this.as,
                //   AS_MaterialDesign_TagNames.dataTable
                // ).viewsInstances.find(
                //   (vi) => vi.referencedK2Object.id == target.referencedK2Object.id
                // )!;
                //getPageSettings(this.as)["as-md-datatable"]?.targets?.views.find((t)=>(t as ProcessedTarget<IViewInstance>).referencedK2Object.id==target.referencedK2Object.id)
                let settings = applyDefaultSettings(target);
                passPack.processedSettings = settings;
                if (settings.enabled == false) {
                    Log(`${target.name} - is not enabled in settings `);
                    p1.finish();
                }
                let configColResult = configureColumns(passPack, settings);
                settings.optGrid.columns = (configColResult === null || configColResult === void 0 ? void 0 : configColResult.columns) || [];
                if (!settings.optGrid.header)
                    settings.optGrid.header = {};
                settings.optGrid.header.columns = (configColResult === null || configColResult === void 0 ? void 0 : configColResult.headers) || [];
                // this.updateGridColumnsWithDataBoundK2Controls(newDataTable.passPack);
                //Merge custom settings into newDataTable
                //Set after applying defaults and before running converters
                passPack.finalSettings = _.cloneDeep(settings);
                bingColumnsToK2Controls(target, passPack);
                //After this point the setting are injected with objects
                passPack.processedSettings = convertExpressions(passPack.processedSettings, passPack);
                passPack.processedSettings = convertRenderers(passPack.processedSettings, passPack);
                //set the dataTables settings
                applySettingsToObject(newDataTable, passPack.processedSettings, "settings");
                applyCustomStylings(passPack, newDataTable);
                if (target.type == TargetType.views) {
                    let pageSize = target.referencedK2Object.rawData.properties.property.find((p) => p.name == "PageSize");
                    if (pageSize) {
                        let pageSizeInt = Number.parseInt(pageSize._);
                        if (typeof pageSizeInt === "number" &&
                            ((_a = passPack.processedSettings.optGrid) === null || _a === void 0 ? void 0 : _a.pageOptions)) {
                            passPack.processedSettings.optGrid.pageOptions.perPage = pageSizeInt;
                        }
                    }
                    if (target.referencedK2Object.smartobject.items) {
                        //if a list view remove first row
                        newDataTable.data = target.referencedK2Object.smartobject.items;
                        // newDataTable.data.splice(0,1); not always true
                    }
                    else {
                        newDataTable.data = [];
                    }
                }
                else {
                    newDataTable.data = target.referencedK2Object.smartobject.items || [];
                }
                if (!newDataTable.data) {
                    console.error(`Something wrong ${target.referencedK2Object.name}`);
                }
                if (passPack) {
                    passPack.grid = yield newDataTable.getGrid();
                    passPack.grid.parent = newDataTable;
                }
                (_b = passPack === null || passPack === void 0 ? void 0 : passPack.grid) === null || _b === void 0 ? void 0 : _b.on("selection", (e) => {
                    Log("selection", { data: e, color: "pink" });
                });
                (_c = passPack === null || passPack === void 0 ? void 0 : passPack.grid) === null || _c === void 0 ? void 0 : _c.on("check", (e) => {
                    Log("check", { data: e, color: "pink" });
                    //setTaretedControlValue(passPack,e, [e.rowKey]) //commented out as we only set current selected.
                });
                (_d = passPack === null || passPack === void 0 ? void 0 : passPack.grid) === null || _d === void 0 ? void 0 : _d.on("beforeChange", (e) => {
                    Log("beforeChange", { data: e, color: "pink" });
                });
                (_e = passPack === null || passPack === void 0 ? void 0 : passPack.grid) === null || _e === void 0 ? void 0 : _e.on("focusChange", (e) => {
                    console.log("TCL: focusChange -> e", e);
                    Log("focusChange", { data: e, color: "pink" });
                    setTaretedControlValue(passPack, e);
                    // newDataTable.applyMaterialClasses();
                    executeK2Rule(passPack === null || passPack === void 0 ? void 0 : passPack.processedSettings.k2_rule_to_execute_for_focus_changed, passPack, "focusChanged");
                    updateAllK2ControlsWithDataForTheRowKey(passPack, e.rowKey);
                    simulateUserActionAgainstListView(passPack, e.rowKey, "click");
                });
                (_f = passPack === null || passPack === void 0 ? void 0 : passPack.grid) === null || _f === void 0 ? void 0 : _f.on("dblclick", (e) => {
                    Log("dblclick", { data: e, color: "pink", enabled: true });
                    // newDataTable.applyMaterialClasses();
                    executeK2Rule(passPack === null || passPack === void 0 ? void 0 : passPack.processedSettings.k2_rule_to_execute_for_double_click, passPack, "dblclick");
                    simulateUserActionAgainstListView(passPack, e.rowKey, "dblclick");
                });
                (_g = passPack === null || passPack === void 0 ? void 0 : passPack.grid) === null || _g === void 0 ? void 0 : _g.on("afterChange", (e) => {
                    e.changes.forEach((change) => {
                        var _a, _b, _c, _d;
                        //small hack to get the grid to update the renderers that have calculated values.
                        let rowDisabledState = (_b = (_a = passPack === null || passPack === void 0 ? void 0 : passPack.grid) === null || _a === void 0 ? void 0 : _a.getRow(change.rowKey)) === null || _b === void 0 ? void 0 : _b._attributes.disabled;
                        if (rowDisabledState) {
                            (_c = passPack === null || passPack === void 0 ? void 0 : passPack.grid) === null || _c === void 0 ? void 0 : _c.disableRow(change.rowKey);
                        }
                        else {
                            (_d = passPack === null || passPack === void 0 ? void 0 : passPack.grid) === null || _d === void 0 ? void 0 : _d.enableRow(change.rowKey);
                        }
                    });
                    if (passPack === null || passPack === void 0 ? void 0 : passPack.currentRowKey) {
                        updateAllK2ControlsWithDataForTheRowKey(passPack, passPack === null || passPack === void 0 ? void 0 : passPack.currentRowKey);
                    }
                });
                implementK2ExecutionControlBindings(newDataTable);
                //TODO: reenable for stling fixes
                // watchAndApplyStyle(passPack);
                p1.finish();
            }
            catch (err) {
                console.error(`Something went wrong with [${target.referencedK2Object.containerType}] [${target.referencedK2Object.name}] `, err);
            }
        });
    }
    convertSmartobjectItemToCorrectDataTypes(smartobject) {
        if (!smartobject.items)
            return [];
        if (smartobject.fieldInfo.length == 0)
            return smartobject.items;
        return smartobject.items.map((soItem) => {
            let convertedResult = {};
            for (const key in soItem) {
                let fieldInfo = smartobject.fieldInfo.find((fi) => fi.propertyName == key);
                if (fieldInfo) {
                    convertedResult[key] = fieldInfo.javascriptType.parse(soItem[key]);
                }
                else {
                    convertedResult[key] = soItem[key];
                }
            }
            return convertedResult;
        });
    }
    // /**
    //  *
    //  * @param dataTable
    //  *
    //  */
    // private implementExecuteForEachBinding(dataTable: AsMaterialdesignDatatableExtended) {
    //   let k2ControlToBindTo = dataTable.passPack?.settings.executeForEachCheckedK2Control;
    //   let passPack = dataTable.passPack!;
    //   if (k2ControlToBindTo)
    //     if (k2ControlToBindTo.length > 0) {
    //       this.as
    //         .getControlsByConfigurationName(k2ControlToBindTo, dataTable.passPack!.control.parent as IViewInstance)
    //         .forEach(async (c) => {
    //           console.log("TCL: implementSaveBinding -> add event to  -> c", c);
    //           c.events.smartFormEventClick.addEvent(
    //             async (e: EmittedControlEvent) => {
    //               console.log("TCL: event -> implementSaveBinding -> e", e);
    //               if (passPack.grid) {
    //                 let data = passPack.grid.getData().filter((d:any)=>d._attributes.checked==true);
    //                   await this.executeK2RuleForEachRow(
    //                     passPack.settings.k2RuleForEachChecked,
    //                     passPack,
    //                     data
    //                   ).then((e:any)=>
    //                   {
    //                       console.log("TCL: after K2 rule implementExecuteForEachBinding -> e", e)
    //                   })
    //                   if(passPack.settings.dataGridActionForEachChecked==DataGridExecutionActions.Delete)
    //                   {
    //                     passPack.grid.removeRows(data.map((d:any)=>d.rowKey))
    //                   }
    //               }
    //             },
    //             null,
    //             `MdDataTable${passPack.control.id}`
    //           );
    //         });
    //     }
    // }
    //   /**
    //    *
    //    * @param passPack
    //    */
    //   public updateGridColumnsWithDataBoundK2Controls(passPack: IPassPack)
    // {
    //     let currentView = passPack.control.parent as IViewInstance
    //     //run through all configured columns
    //      passPack.settings.optGrid?.columns.forEach((col: OptColumnExtended)=>
    //       {
    //         if(col.k2control_to_bind_to)
    //         {
    //             let k2Controls = this.as.getControlsByConfigurationName(col.k2control_to_bind_to, currentView)
    //             col.dataBoundK2Controls = k2Controls
    //             k2Controls.forEach(c=>{
    //               this.addEventToK2ControlToUpdateGridCurrentRow(c, passPack);
    //             })
    //         }
    //       })
    // }
    getK2PropValueAsBoolean(value) {
        if (!value)
            return false;
        if (typeof value == "boolean")
            return value;
        return value == "true";
    }
}
function executeK2Rule(ruleConfigurationName, passPack, eventName) {
    if (!passPack)
        return;
    if (typeof ruleConfigurationName == "string") {
        let rules = window.as.getRulesByConfigurationName(ruleConfigurationName, passPack.viewInstance);
        rules.forEach((r) => {
            Log(`Executing rule ${r.name} for event ${eventName}`, {});
            r.execute();
        });
    }
}
/**
 * Get the data of the rowKey and updates all bound K2 Control
 * @param passPack
 * @param rowKey
 * @returns
 */
export function updateAllK2ControlsWithDataForTheRowKey(passPack, rowKey) {
    var _a;
    //TODO
    // console.log("bindSelectedRowColumnData - TCL: pack", passPack);
    passPack.currentRowKey = -1;
    if (rowKey == undefined)
        return;
    passPack.currentRowKey = rowKey; //could not find a way to find the current row key
    setCurrentRowKey(passPack, rowKey);
    let rowData = (_a = passPack.grid) === null || _a === void 0 ? void 0 : _a.getRow(rowKey);
    if (!rowData)
        return;
    updateAllK2ControlsBoundToGridColumns(passPack, rowData);
}
function simulateUserActionAgainstListView(passPack, rowKey, action) {
    var _a, _b;
    if (passPack.target.type != TargetType.views)
        return; //this is only for converted list views
    let rowData = (_a = passPack.grid) === null || _a === void 0 ? void 0 : _a.getRow(rowKey);
    if (!rowData)
        return;
    if (passPack.target.type == TargetType.views) {
        let counter = (_b = rowData._linkedHiddenHash) === null || _b === void 0 ? void 0 : _b.counter;
        if (counter) {
            passPack.viewInstance
                .as(ListViewInstance)
                .simulateUserEventAgainstCounterRow(counter, action);
        }
    }
}
/**
* Updates K2 Control found in settings.currentRowDataK2Control with the rowKey
* @param pack
* @param rowKey
*/
function setCurrentRowKey(pack, rowKey) {
    // console.log("TCL: setCurrentRowKey -> rowKey", rowKey);
    if (pack.processedSettings.k2control_to_bind_rowIndex) {
        window.as.collections.viewInstanceControls
            .filter((c) => c.name == pack.processedSettings.k2control_to_bind_rowIndex)
            .forEach((c) => {
            c.value = rowKey.toString();
        });
    }
}
export function addEventToK2ControlToUpdateGridCurrentColumnRow(c, col, passPack) {
    var _a;
    if (!passPack.dataTable)
        return;
    let ruleId = c.id + passPack.dataTable.id + "OnChange";
    (_a = c.rules.OnChange) === null || _a === void 0 ? void 0 : _a.addListener(ruleId, (evt) => {
        var _a;
        let rowData = {};
        let eventControl = evt.detail.parent;
        if (passPack.currentRowKey != -1) {
            //rowData = passPack.grid?.getRow(passPack.currentRowKey);
            //if (!rowData) rowData = this.setEmptyRowData(passPack);
            //let rowDataFieldProperty = rowData[col.name];
            //rowData[rowDataFieldProperty] = evt.detail.control.value;
            (_a = passPack.grid) === null || _a === void 0 ? void 0 : _a.setValue(passPack.currentRowKey, col.name, eventControl.value);
            //passPack.grid?.setRow(passPack.currentRowKey, rowData)
            // passPack.dataTable.applyMaterialClasses();
        }
    });
}
/**
 * Update the origional K2 control with the value of the selected item(s)
 * @param passPack
 * @param arg1
 */
function setTaretedControlValue(passPack, e) {
    if (passPack.target.type == TargetType.controls) {
        let control = passPack.target.referencedK2Object;
        let valueProperty = control.getPropertyValue("ValueProperty");
        let delimiter = control.getPropertyValue("Delimiter");
        let valueToSet;
        valueToSet = e.instance.getData().find((d) => d.rowKey == e.rowKey)[valueProperty];
        // valueToSet =values.map(v=>v);
        // valueToSet = values.map(v=>
        //    {
        //      let foundValue=  e.instance.getData().find((d:any)=>d.rowKey==v)[valueProperty]
        //      return foundValue
        //    });
        // e.instance.getData().find((d:any)=>d.rowKey==values[0])[valueProperty]
        passPack.target.referencedK2Object.value = valueToSet.toString();
    }
}
//# sourceMappingURL=index.js.map