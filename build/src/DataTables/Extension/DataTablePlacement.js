import { AsMaterialdesignDatatable } from "alterspective-k2-smartfroms/dist/components/as-materialdesign-datatable";
import { applySettingsToObject } from "../../Common/ObjectHelpers";
export function insertGridUsingControl(passPack) {
    var _a;
    let targetControlHTMLElement = passPack.target.referencedK2Object.getHTMLElement();
    let newDataTable = createNewDataTable(passPack.target.referencedK2Object.id);
    passPack.dataTable = newDataTable;
    newDataTable.passPack = passPack;
    let as = passPack.target.referencedK2Object._as;
    (_a = targetControlHTMLElement.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(newDataTable);
    if (as.developerMode.debugMode == false)
        targetControlHTMLElement.style.display = "none";
    if (targetControlHTMLElement.style.width) {
        newDataTable.style.width =
            targetControlHTMLElement.style.width;
    }
    return passPack;
}
/**
 * Creates a new DataTable and inserts into the smartform
 * @param passPack
 * @returns
 */
export function insertGridUsingListView(passPack) {
    let targetControlHTMLElement = passPack.target.referencedK2Object.getHTMLElement();
    let innerPannelGrid = targetControlHTMLElement.querySelector(".innerpanel .grid");
    let newDataTable = createNewDataTable(passPack.target.referencedK2Object.id);
    passPack.dataTable = newDataTable;
    newDataTable.passPack = passPack;
    let k2GridBody = targetControlHTMLElement.querySelector(".innerpanel .grid .grid-body");
    if (innerPannelGrid) {
        // (innerPannelGrid as HTMLElement).style.all = "initial";
        // (innerPannelGrid as HTMLElement).style.width = "95%";
        innerPannelGrid.style.boxShadow = "none";
        innerPannelGrid.style.border = "none";
        innerPannelGrid === null || innerPannelGrid === void 0 ? void 0 : innerPannelGrid.insertBefore(newDataTable, k2GridBody);
        // innerPannelGrid?.appendChild(newDataTable)
        if (k2GridBody) {
            if (passPack.target.referencedK2Object._as.developerMode.debugMode == false)
                k2GridBody.style.display = "none";
        }
        // targetControlHTMLElement.appendChild(newDataTable);
        newDataTable.style.width = "100%";
        applySettingsToObject(newDataTable.passPack.savedResetSettings, newDataTable);
        newDataTable.passPack.savedResetSettings = {};
        addTopToolbar(passPack);
    }
    return passPack;
}
/**
* Create the new as-material-datatable and appends to the element
* @param element - parent element where the dataTable will be rendered
* @returns
*/
function createNewDataTable(id) {
    let dataTable = new AsMaterialdesignDatatable();
    dataTable.elevation = 0;
    dataTable.structureGenerated = false;
    dataTable.classList.add("as-theme");
    // newCard.style.all = "initial";
    dataTable.style.overflow = "visible";
    dataTable.style.zIndex = "1";
    dataTable.id = id + "_" + "dataTable";
    return dataTable;
}
//finds the listViewToolbar and adds it to the top of the dataGrid
function addTopToolbar(passPack) {
    var _a;
    let targetControlHTMLElement = passPack.viewInstance.getHTMLElement();
    //let k2ToolBarTable = passPack.viewInstance.controls?.find((c) => c.type == "ToolbarTable");
    let k2ToolBar = targetControlHTMLElement.querySelector(".innerpanel .grid .grid-toolbars");
    let k2GridHeader = targetControlHTMLElement.querySelector(".grid-header-wrapper");
    if (!k2ToolBar)
        return;
    // if (!k2ToolBarTable) return;
    // let toolbarElement = k2ToolBarTable.getHTMLElement();
    // if (!toolbarElement) return;
    (_a = passPack.dataTable) === null || _a === void 0 ? void 0 : _a.appendChild(k2ToolBar);
    if (!k2GridHeader)
        return;
    k2GridHeader.style.backgroundColor = "transparent";
    targetControlHTMLElement.classList.add("mdc-card");
    targetControlHTMLElement.classList.add("mdc-card--outlined");
    // if (k2ToolBar)
    // (k2ToolBar as HTMLElement).style.display = "none";
}
//# sourceMappingURL=DataTablePlacement.js.map