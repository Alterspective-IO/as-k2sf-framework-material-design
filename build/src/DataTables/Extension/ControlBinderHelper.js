var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { addEventToK2ControlToUpdateGridCurrentColumnRow } from ".";
import { TargetType } from "../../Common/commonSettings";
import { executeK2RuleForEachRow, implementK2ControlToGridAction } from "./ControlExecutionHelpers";
import { DataGridExecutionActions } from "./settings";
export function bingColumnsToK2Controls(target, passPack) {
    var _a;
    let thisViewInstance = target.type == TargetType.controls
        ? target.referencedK2Object.parent
        : target.referencedK2Object;
    //add K2 Controls to columns with specified controls to bind to
    //TODO - make this a generic replacer
    (_a = passPack.processedSettings.optGrid) === null || _a === void 0 ? void 0 : _a.columns.forEach((col) => {
        //First bind to explicitly set k2 controls set by the user
        if (col.k2control_to_bind_to) {
            col.dataBoundK2Controls = window.as.getControlsByConfigurationName(col.k2control_to_bind_to, thisViewInstance);
        }
        if (col.dataBoundK2Controls) {
            col.dataBoundK2Controls.forEach((boundControl) => {
                addEventToK2ControlToUpdateGridCurrentColumnRow(boundControl, col, passPack);
            });
        }
    });
    //Then if we are auto binding to view controls then run through all columns
    addEventBindingToViewInstanceFieldControls(passPack);
}
export function addEventBindingToViewInstanceFieldControls(passPack) {
    var _a, _b, _c;
    let thisViewInstance = passPack.viewInstance;
    if (passPack.processedSettings.autoBindToViewControls) {
        let foundFieldControls = thisViewInstance.controls.filter((c) => { var _a; return (_a = c.field) === null || _a === void 0 ? void 0 : _a.name; });
        for (let index = 0; index < foundFieldControls.length; index++) {
            const foundFieldControl = foundFieldControls[index];
            //If this control has not already been bound to a explicitly set column then do the even binding
            if (!((_a = passPack.processedSettings.optGrid) === null || _a === void 0 ? void 0 : _a.columns.find((gc) => { var _a; return (_a = gc.dataBoundK2Controls) === null || _a === void 0 ? void 0 : _a.find((c) => c.id == foundFieldControl.id); }))) {
                if ((_b = foundFieldControl.field) === null || _b === void 0 ? void 0 : _b.name) {
                    addEventToK2ControlToUpdateGridCurrentRowData(foundFieldControl, (_c = foundFieldControl.field) === null || _c === void 0 ? void 0 : _c.name, passPack);
                }
            }
        }
    }
}
/**
 * Implements all binding of K2 Controls and K2 Rules events and methods
 * @param dataTable
 */
export function implementK2ExecutionControlBindings(dataTable) {
    var _a, _b, _c, _d;
    //Bind to Save Button Events
    implementSaveBinding(dataTable);
    //Bind to K2 Execute for Each Button Events
    implementK2ControlToGridAction(dataTable, (_a = dataTable.passPack) === null || _a === void 0 ? void 0 : _a.processedSettings.execute_grid_method_runForEachChecked_on, (event, eDataTable) => __awaiter(this, void 0, void 0, function* () {
        let data = eDataTable
            .passPack.grid.getData()
            .filter((d) => d._attributes.checked == true);
        yield executeK2RuleForEachRow(eDataTable.passPack.processedSettings.k2_rule_to_execute_for_each_checked, eDataTable.passPack, data).then((e) => {
            console.log("TCL: after K2 rule executeForEachCheckedK2Control -> e", e);
        });
        if (eDataTable.passPack.processedSettings
            .default_grid_action_for_each_checked_item ==
            DataGridExecutionActions.Delete) {
            eDataTable.passPack.grid.removeRows(data.map((d) => d.rowKey));
        }
    }));
    //Bind to K2 Export Button Event
    implementK2ControlToGridAction(dataTable, (_b = dataTable.passPack) === null || _b === void 0 ? void 0 : _b.processedSettings.execute_grid_method_deleteSelectedRow_on, (event, eDataTable) => __awaiter(this, void 0, void 0, function* () {
        console.log("TCL: exportK2Control");
        if (eDataTable.passPack.grid) {
            let data = eDataTable.passPack.grid
                .getData()
                .filter((d) => d._attributes.checked == true);
            yield executeK2RuleForEachRow(eDataTable.passPack.settings.k2RuleForEachChecked, eDataTable.passPack, data).then((e) => {
                console.log("TCL: after K2 rule exportK2Control -> e", e);
            });
            if (eDataTable.passPack.settings.dataGridActionForEachChecked ==
                DataGridExecutionActions.Delete) {
                eDataTable.passPack.grid.removeRows(data.map((d) => d.rowKey));
            }
        }
    }));
    implementK2ControlToGridAction(dataTable, (_c = dataTable.passPack) === null || _c === void 0 ? void 0 : _c.processedSettings.execute_grid_method_appendNewRow_on, (event, edataTable) => {
        var _a;
        if ((_a = edataTable.passPack) === null || _a === void 0 ? void 0 : _a.grid) {
            edataTable.passPack.grid.appendRow({}, { at: 0 });
            edataTable.passPack.grid.focusAt(0, 0, true);
        }
    });
    implementK2ControlToGridAction(dataTable, (_d = dataTable.passPack) === null || _d === void 0 ? void 0 : _d.processedSettings.execute_grid_method_export_on, (event, edataTable) => {
        var _a;
        debugger;
        if ((_a = edataTable.passPack) === null || _a === void 0 ? void 0 : _a.grid) {
            let exportSettings = {};
            if (edataTable.passPack.processedSettings.exportSettings) {
                debugger;
            }
        }
    });
}
/**
 * Implements rules to execute when the K2 Control in settings.saveK2Control is clicked.
 * @param dataTable
 */
export function implementSaveBinding(dataTable) {
    var _a;
    implementK2ControlToGridAction(dataTable, (_a = dataTable.passPack) === null || _a === void 0 ? void 0 : _a.processedSettings.execute_grid_method_saveModifiedData_on, (event, eDataTable) => __awaiter(this, void 0, void 0, function* () {
        if (eDataTable.passPack.grid) {
            let dataManager = eDataTable.passPack.grid.dataManager;
            if (dataManager) {
                //Execute Update Rows
                yield executeK2RuleForEachRow(eDataTable.passPack.settings.k2RuleForEachUpdated, eDataTable.passPack, dataManager.getAllModifiedData()["updatedRows"]);
                //Execute Create Rows
                yield executeK2RuleForEachRow(eDataTable.passPack.settings.k2RuleForEachCreated, eDataTable.passPack, dataManager.getAllModifiedData()["createdRows"]);
                //Execute Delete Rows
                yield executeK2RuleForEachRow(eDataTable.passPack.settings.k2RuleForEachDeleted, eDataTable.passPack, dataManager.getAllModifiedData()["deletedRows"]);
                //Execute Checked Rows
                yield executeK2RuleForEachRow(eDataTable.passPack.settings.k2RuleForEachChecked, eDataTable.passPack, eDataTable.passPack.grid
                    .getData()
                    .filter((d) => d._attributes.checked == true));
            }
        }
    }));
}
export function addEventToK2ControlToUpdateGridCurrentRowData(c, dataPropertyName, passPack) {
    var _a;
    if (!passPack.dataTable)
        return;
    let ruleId = c.id + passPack.dataTable.id + "OnChange";
    let callBack = (evt) => {
        var _a, _b;
        console.log(evt.detail.name);
        let eventControl = evt.detail.parent;
        let rowData = {};
        if (passPack.currentRowKey != -1) {
            rowData = (_a = passPack.grid) === null || _a === void 0 ? void 0 : _a.getRow(passPack.currentRowKey);
            if (!rowData)
                rowData = setEmptyRowData(passPack);
            let currentData = rowData[dataPropertyName];
            let currentDataAsString = currentData ? currentData.toString() : "";
            if (currentDataAsString != eventControl.value) {
                //only update if different
                rowData[dataPropertyName] = eventControl.value;
                //passPack.grid?.setValue(passPack.currentRowKey,rowDataFieldProperty, evt.detail.control.value)
                (_b = passPack.grid) === null || _b === void 0 ? void 0 : _b.setRow(passPack.currentRowKey, rowData);
            }
        }
    };
    (_a = c.rules.OnChange) === null || _a === void 0 ? void 0 : _a.addListener(ruleId, callBack);
}
function setEmptyRowData(passPack) {
    var _a;
    let retValue = {};
    //first try copy an existing row
    let firstGridRow = (_a = passPack.grid) === null || _a === void 0 ? void 0 : _a.getRow(0);
    if (firstGridRow) {
        for (const prop in firstGridRow) {
            retValue[prop] = null;
        }
    }
    else {
        //look if we have any smartobject data
        //if non
        //look in the grid columns
    }
    return retValue;
}
//# sourceMappingURL=ControlBinderHelper.js.map