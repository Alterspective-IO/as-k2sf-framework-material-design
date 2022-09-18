var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ControlType } from "asFramework/src/index";
import cssForK2 from "./extension.css";
import { dataBind, getControlsInControl } from "../../Common/controlHelpers";
import { applySettingsToObject } from "../../Common/ObjectHelpers";
import { AS_MaterialDesign_TagNames, TargetType } from "../../Common/commonSettings";
import { AsExpansionPanel } from "alterspective-k2-smartfroms/dist/components/as-expansion-panel";
import { getControlSiblingSettings } from "../../Common/settings.Helper";
export class alterspectiveExpanderExtension {
    constructor(as) {
        //Dependencies - adjust names as required
        this.keyword = AS_MaterialDesign_TagNames.expander;
        this.currentUserFQN = SourceCode.Forms.SessionManagement.Session.userfqn;
        this.currentUserDisplayName = SourceCode.Forms.SessionManagement.Session.userdisplayname;
        this.convertedTables = new Array();
        this.INDEX = 0;
        this.as = as;
        console.log("alterspective alterspectiveExpanderExtension Constructor()");
        this.addDependantTopLevelStyles();
        this.repeaterControls = this.getDataTableTargets();
        console.log(`${this.repeaterControls.length} - lists to convert`);
        this.repeaterControls.forEach((tableControl) => {
            this.convertedTables.push({
                control: tableControl,
                expander: this.convertTableToExpander(tableControl),
            });
        });
    }
    addDependantTopLevelStyles() {
        //TODO: need better way as duplicates could happen
        var link = this.as.window.document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href =
            "https://fonts.googleapis.com/css?family=Material+Icons&display=block";
        cssForK2.use({ target: this.as.window.document.head });
        this.as.window.document.head.appendChild(link);
    }
    convertTableToExpander(k2Control) {
        let contents = undefined; //placeholder to insert the card contents
        let k2ControlElement = k2Control.getHTMLElement();
        let jk2ControlElement = $(k2ControlElement);
        let originalDisplay = k2ControlElement.style.display;
        let newExpander = this.createNewExpander(k2ControlElement.parentElement);
        this.render(k2Control, k2ControlElement, newExpander, originalDisplay);
        console.log(newExpander);
        if (contents)
            newExpander.appendChild(contents);
        return newExpander;
    }
    render(k2Control, k2ControlElement, newExpander, originalDisplay) {
        return __awaiter(this, void 0, void 0, function* () {
            let settings;
            //TODO- set any default settings
            if (!settings)
                settings = getControlSiblingSettings(k2Control, AS_MaterialDesign_TagNames.expander, TargetType.controls).settings || {};
            let htmlRows = k2ControlElement.children; //get all the roes in the table
            console.log(`Rows found ${htmlRows.length}`);
            let titleSection = this.as.getControlFromElement(htmlRows[0]);
            if (titleSection) {
                titleSection.setControlVisibility(false);
                let titleSectionControls = getControlsInControl(titleSection);
                if (titleSectionControls) {
                    let titleCounter = 0;
                    let titleSlot;
                    for (let index = 0; index < titleSectionControls.length; index++) {
                        const foundControl = titleSectionControls[index];
                        if (foundControl.type == ControlType.Table) {
                            //tables get put into slots
                            if (!titleSlot) {
                                //if we have tables then make sure we have a slot to put them in
                                titleSlot = document.createElement("span");
                                titleSlot.slot = "title-slot";
                            }
                            titleSlot.appendChild(foundControl.getHTMLElement());
                            continue;
                        }
                        if (titleCounter == 0) {
                            dataBind(newExpander, "collapsedTitle", foundControl);
                        }
                        else {
                            dataBind(newExpander, "expandedTitle", foundControl);
                        }
                        titleCounter++;
                    }
                    if (titleSlot)
                        newExpander.appendChild(titleSlot); //if we had tables then  tableSlot would be present so add into expander
                }
            }
            // if (settings.enabled == true) {
            let passPack = {
                extension: this,
                settings: settings,
                control: k2Control,
                expander: newExpander,
            };
            newExpander.appendChild(k2ControlElement);
            applySettingsToObject(newExpander, settings, "settings");
            newExpander.style.maxWidth = k2ControlElement.style.width;
            k2ControlElement.style.width = "100%"; //we set the container to its side and so the item get reset to 100%
            console.log("TCL: k2ControlElement.style.width", k2ControlElement.style.width);
            if (!newExpander.style.width)
                newExpander.style.width = "100%";
            newExpander.elevation = settings.elevation || 0;
        });
    }
    createNewExpander(element) {
        let expander = new AsExpansionPanel();
        expander.elevation = 0;
        expander.classList.add("as-theme");
        element.appendChild(expander);
        return expander;
    }
    getDataTableTargets() {
        return this.as.getControlsByNameContains(this.keyword);
    }
}
//# sourceMappingURL=index.js.map