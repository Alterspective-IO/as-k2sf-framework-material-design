import { IPassPack, AsMaterialdesignDatatableExtended } from "./interfaces";


  export function applyCustomStylings(
    passPack: IPassPack,
    newDataTable: AsMaterialdesignDatatableExtended
  ) {
    if (passPack.processedSettings.customStyle) {
      let customStyle = Array.isArray(passPack.processedSettings.customStyle)
        ? passPack.processedSettings.customStyle.join(" ")
        : passPack.processedSettings.customStyle;
      let newStyle = document.createElement("style");
      newStyle.id = "as-datagrid-custom-style";
      newStyle.innerHTML = customStyle;
      newDataTable.querySelector("#as-datagrid-custom-style")?.remove();
      newDataTable.appendChild(newStyle);
    }
  }