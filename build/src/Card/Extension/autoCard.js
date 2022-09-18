import { ControlType } from "asFramework/src/index";
/**
 * Responsible for searching for tables with keywords to automatically generate a card
 */
const keyword = "sux_md_card";
let _as;
export function run(as) {
    _as = as;
    let tablesToConvert = as
        .getControlsByNameContains(keyword)
        .filter((c) => c.type == ControlType.Table);
    console.log("TCL: tablesToConvert", tablesToConvert);
    tablesToConvert.forEach((tblControl) => {
        convertTableControlToCard(tblControl);
    });
}
function convertTableControlToCard(tblControl) {
    //Get the html element
    //get the sections (media, supporting text and buttons)
}
//# sourceMappingURL=autoCard.js.map