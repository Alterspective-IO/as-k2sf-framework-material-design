import { AsExpansionPanel } from "alterspective-k2-smartfroms/dist/components/as-expansion-panel";
import { Slider } from "alterspective-k2-smartfroms/dist/components";
import { AsMaterialdesignDatatable } from "alterspective-k2-smartfroms/dist/components/as-materialdesign-datatable";
import { AS_K2_DataTable_Default_Column_Settings, AS_K2_DataTable_Default_Settings } from "../src/DataTables/Extension/defaults";
import { applySettingsToObject } from "../src/Common/ObjectHelpers";
import { SuxMaterialdesignCard } from "alterspective-k2-smartfroms/dist/components/sux-materialdesign-card";
console.log("ffdfd");
let slider = new Slider();
slider.style.width = "100%";
slider.min = 0;
slider.max = 100;
slider.discrete = true;
slider.withTickMarks = true;
document.body.appendChild(slider);
let expander = new AsExpansionPanel();
expander.elevation = 0;
expander.classList.add("as-theme");
expander.title = "Default";
// newCard.style.all = "initial";
expander.style.overflow = "visible";
expander.style.zIndex = "1";
document.body.appendChild(expander);
let dataTable = new AsMaterialdesignDatatable();
window.testDataTable = dataTable;
dataTable.elevation = 0;
dataTable.classList.add("as-theme");
applySettingsToObject(dataTable, new AS_K2_DataTable_Default_Settings(), "settings");
let cols = 6;
for (let duplicates = 0; duplicates < 1; duplicates++) {
    for (let index = 0; index < cols; index++) {
        let newCol = {
            name: `test${index}`,
            header: `Test ${index}`,
            minWidth: index * 100,
        };
        //apply system defaults
        applySettingsToObject(newCol, new AS_K2_DataTable_Default_Column_Settings, "primary");
        dataTable.optGrid.columns.push(newCol);
    }
    for (let r = 0; r < 100; r++) {
        let newRow = {};
        for (let c = 0; c < cols; c++) {
            newRow[`test${c}`] = `${r}-${c}`;
        }
        dataTable.data.push(newRow);
    }
}
// newCard.style.all = "initial";
dataTable.style.overflow = "visible";
dataTable.style.zIndex = "1";
document.body.appendChild(dataTable);
let newCard = new SuxMaterialdesignCard();
newCard.cardTitle = "Title";
newCard.cardSubTitle = "Sub title";
// newCard.width="450px"
document.body.appendChild(newCard);
//# sourceMappingURL=index.js.map