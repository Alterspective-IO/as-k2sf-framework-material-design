
/**
 * Responsible for searching for tables with keywords to automatically generate a card
 */
import {Framework, ControlType} from "@alterspective-io/as-k2sf-framework"


const keyword = "as_md_card";
let _as: Framework;

export function run(as: Framework) {
  _as = as;
  let tablesToConvert = as
    .getControlsByNameContains(keyword)
    .filter((c) => c.type == ControlType.Table);
  console.log("TCL: tablesToConvert", tablesToConvert);

  tablesToConvert.forEach((tblControl) => {
    convertTableControlToCard(tblControl);
  });
}

function convertTableControlToCard(tblControl: any) {
  //Get the html element
  //get the sections (media, supporting text and buttons)
}

