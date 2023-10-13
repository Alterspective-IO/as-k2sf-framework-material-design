
import { AsMaterialdesignDatatable } from "@alterspective-io/as-framework-material-design/dist/components/as-materialdesign-datatable"
import { applySettingsToObject } from "../../Common/ObjectHelpers";
import { AsMaterialdesignDatatableExtended, IPassPack } from "./interfaces";


 export function insertGridUsingControl(passPack:IPassPack) : IPassPack
 {
    let targetControlHTMLElement = passPack.target.referencedK2Object.getHTMLElement()
    let newDataTable = createNewDataTable(passPack.target.referencedK2Object.id!);
    passPack.dataTable = newDataTable
    newDataTable.passPack = passPack

    let as = passPack.target.referencedK2Object._as

    targetControlHTMLElement.parentElement?.appendChild(newDataTable);
    if (as.developerMode.debugMode == false)
      targetControlHTMLElement.style.display = "none";
    if (targetControlHTMLElement.style.width) {
      newDataTable.style.width =
      targetControlHTMLElement.style.width;
    }

    return passPack
 }

 /**
  * Creates a new DataTable and inserts into the smartform 
  * @param passPack 
  * @returns 
  */
  export function insertGridUsingListView(passPack : IPassPack) : IPassPack {
    let targetControlHTMLElement = passPack.target.referencedK2Object.getHTMLElement()
    let innerPannelGrid = targetControlHTMLElement.querySelector(".innerpanel .grid");
    let newDataTable = createNewDataTable(passPack.target.referencedK2Object.id!);
    passPack.dataTable = newDataTable
    newDataTable.passPack = passPack

    let k2GridBody = targetControlHTMLElement.querySelector(
      ".innerpanel .grid .grid-body"
    );
   

    if (innerPannelGrid) {
      // (innerPannelGrid as HTMLElement).style.all = "initial";
      // (innerPannelGrid as HTMLElement).style.width = "95%";
      (innerPannelGrid as HTMLElement).style.boxShadow = "none";
      (innerPannelGrid as HTMLElement).style.border = "none";
      
      

      let placeHolderDiv : HTMLDivElement;
      placeHolderDiv = innerPannelGrid.querySelector(".as-placeholder") as HTMLDivElement;
      
      if(!placeHolderDiv)
      {
        placeHolderDiv = document.createElement("div");
        placeHolderDiv.classList.add("as-placeholder");
      }

      placeHolderDiv.innerHTML = "";
      placeHolderDiv.appendChild(newDataTable);
      

      innerPannelGrid?.insertBefore(placeHolderDiv, k2GridBody!);
     

      // innerPannelGrid?.appendChild(newDataTable)
      if (k2GridBody) {
        if (passPack.target.referencedK2Object._as.developerMode.debugMode == false)
          (k2GridBody as HTMLElement).style.display = "none";
      }
      // targetControlHTMLElement.appendChild(newDataTable);
      newDataTable.style.width = "100%";
      newDataTable.passPack.savedResetSettings ={}
      applySettingsToObject(newDataTable.passPack.savedResetSettings, newDataTable)
    
     

      addTopToolbar(passPack);

      
    }
    return passPack
  }



    /**
   * Create the new as-material-datatable and appends to the element
   * @param element - parent element where the dataTable will be rendered
   * @returns
   */
function createNewDataTable(id:string): AsMaterialdesignDatatableExtended {
        let dataTable = new AsMaterialdesignDatatable() as AsMaterialdesignDatatableExtended;
        dataTable.elevation = 0;
        dataTable.structureGenerated=false;
        
        dataTable.classList.add("as-theme");
        // newCard.style.all = "initial";
    
        dataTable.style.overflow = "visible";
        dataTable.style.zIndex = "1";
        dataTable.id = id + "_" + "dataTable"

        return dataTable;
      }




//finds the listViewToolbar and adds it to the top of the dataGrid
  function addTopToolbar(passPack: IPassPack) {
      let targetControlHTMLElement = passPack.viewInstance.getHTMLElement()
     //let k2ToolBarTable = passPack.viewInstance.controls?.find((c) => c.type == "ToolbarTable");
     let k2ToolBar = targetControlHTMLElement.querySelector(
        ".innerpanel .grid .grid-toolbars"
      );

      let k2GridHeader = targetControlHTMLElement.querySelector(
        ".grid-header-wrapper"
      );

     if (!k2ToolBar) return;
    // if (!k2ToolBarTable) return;


   // let toolbarElement = k2ToolBarTable.getHTMLElement();
   // if (!toolbarElement) return;

    
    passPack.dataTable?.appendChild(k2ToolBar)


    if(!k2GridHeader) return
   (k2GridHeader as HTMLElement).style.backgroundColor = "transparent";
    (targetControlHTMLElement as HTMLElement).classList.add("mdc-card");
    (targetControlHTMLElement as HTMLElement).classList.add("mdc-card--outlined");
     

    // if (k2ToolBar)
    // (k2ToolBar as HTMLElement).style.display = "none";
  }