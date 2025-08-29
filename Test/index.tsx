
// import { AS_K2_DataTable_Default_Column_Settings, AS_K2_DataTable_Default_Settings } from "../src/DataTables/Extension/defaults";
// import { applySettingsToObject } from "../src/Common/ObjectHelpers";
// import { AsMaterialdesignCard } from "@alterspective-io/as-framework-material-design/dist/components/as-materialdesign-card";
// import { AsExpansionPanel } from "@alterspective-io/as-framework-material-design/dist/components/as-expansion-panel";
// import { AsMaterialdesignDatatable } from "@alterspective-io/as-framework-material-design/dist/components/as-materialdesign-datatable";
// import { OptColumn } from "@alterspective-io/as-framework-material-design/dist/types";


import { AsExpansionPanel} from "@alterspective-io/as-framework-material-design/as-expansion-panel";
import { AsMaterialdesignDatatable } from "@alterspective-io/as-framework-material-design/as-materialdesign-datatable";
import { AsMaterialdesignCard } from "@alterspective-io/as-framework-material-design/as-materialdesign-card";
import { AsMaterialdesignButton } from "@alterspective-io/as-framework-material-design/as-materialdesign-button";


import { AS_K2_DataTable_Default_Settings } from "../src/DataTables/Extension/defaults";
import { applySettingsToObject } from "../src/Common/ObjectHelpers";
import {AS_K2_DataTable_Default_Column_Settings} from "../src/DataTables/Extension/defaults";
import { MaterialDesignButton, OptColumn } from "@alterspective-io/as-framework-material-design/supporting";
import { MaterialDesignIcons } from "../src/Common/materialButtons";
import { AsMaterialdesignSlider } from "@alterspective-io/as-framework-material-design/as-materialdesign-slider";
import { AsMaterialdesignText } from "@alterspective-io/as-framework-material-design/as-materialdesign-text";
// import { AsMaterialdesignText } from "@alterspective-io/as-framework-material-design/";


//find the placeholder div
let placeholder = document.getElementById("placeholder");
let phDataGrid1 = document.getElementById("phDataGrid1");
let phDataGrid2 = document.getElementById("phDataGrid2");

// AsMaterialdesignText
let txt = new AsMaterialdesignText();
txt.label = "Hello World"
txt.value = "Hello World"

placeholder!.appendChild(txt)


if (!placeholder) {
    placeholder = document.createElement("div");
    placeholder.id = "placeholder";
    document.body.appendChild(placeholder);
}

 

// let slider = new Slider()
// slider.style.width = "100%"
// slider.min=0;
// slider.max=100;
// slider.discrete=true;
// slider.withTickMarks=true;

// document.body.appendChild(slider)

let dbutton = new AsMaterialdesignButton();
dbutton.label ="Button Std";
dbutton.icon =MaterialDesignIcons.airline_seat_legroom_reduced;
dbutton.onclick = (e) => {
    alert("Button clicked")
}   

let dbutton2 = new AsMaterialdesignButton();
dbutton2.label ="Button raised";
dbutton2.icon =MaterialDesignIcons.airline_seat_legroom_reduced;
dbutton2.raised = true;
dbutton2.onclick = (e) => {
    alert("Button clicked")
}   

let dbutton3 = new AsMaterialdesignButton();
dbutton3.label ="Button outlined";
dbutton3.icon =MaterialDesignIcons.airline_seat_legroom_reduced;
dbutton3.outlined = true;
dbutton3.onclick = (e) => {
    alert("Button clicked")
}   

let expander = new AsExpansionPanel();
expander.elevation = 0;
expander.classList.add("as-theme");
expander.title = "Dynamicly created expander";

// newCard.style.all = "initial";

expander.style.overflow = "visible";
expander.style.zIndex = "1";
expander.appendChild(dbutton);
expander.appendChild(dbutton2);
expander.appendChild(dbutton3);

placeholder.appendChild(expander);

let dataTable1 = new AsMaterialdesignDatatable();
(window as any).testDataTable = dataTable1
dataTable1.elevation = 0;
dataTable1.classList.add("as-theme");

applySettingsToObject(dataTable1, new AS_K2_DataTable_Default_Settings(), "settings")

applyDataToDataTable(dataTable1)
phDataGrid1!.appendChild(dataTable1);



let dataTable2 = new AsMaterialdesignDatatable();
dataTable2.useMaterialDesign = true;
(window as any).testDataTable = dataTable2
dataTable2.elevation = 0;
dataTable2.classList.add("as-theme");


applySettingsToObject(dataTable2, new AS_K2_DataTable_Default_Settings(), "settings")

applyDataToDataTable(dataTable2)
phDataGrid2!.appendChild(dataTable2);

    // newCard.style.all = "initial";

    // dataTable1.style.overflow = "visible";
    // dataTable1.style.zIndex = "1";
   


    let newCard = new AsMaterialdesignCard()

    newCard.cardTitle = "Title"
    newCard.cardSubTitle = "Sub title"
    newCard.width="450px"


    placeholder.appendChild(newCard); 


    let slider = new AsMaterialdesignSlider();
    slider.style.width = "100%"
    slider.min=0;
    slider.max=100;
    slider.discrete=true;
    slider.withTickMarks=true;
    slider.value=50;
    placeholder.appendChild(slider)



    function applyDataToDataTable(dataTable: AsMaterialdesignDatatable) {

        let cols = 6
        for (let duplicates = 0; duplicates < 1; duplicates++) {
            for (let index = 0; index < cols; index++) {
                let newCol: OptColumn = {
                    name: `test${index}`,
                    header: `Test ${index}`,
                    minWidth: index * 100,
                };
                //apply system defaults
                applySettingsToObject(
                    newCol,
                    new AS_K2_DataTable_Default_Column_Settings,
                    "primary"
                );
                dataTable.optGrid.columns.push(newCol)
            }
    
            for (let r = 0; r < 100; r++) {
                let newRow: any = {}
                for (let c = 0; c < cols; c++) {
    
                    newRow[`test${c}`] = `${r}-${c}`
                }
                dataTable.data.push(newRow)
    
            }
        }
    }