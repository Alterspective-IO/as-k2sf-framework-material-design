// import { ControlType, IControl, IFramework } from "@alterspective-io/as-k2sf-framework"

import cssForK2 from "./extension.css";
import { dataBind, getControlsInControl } from "../../Common/controlHelpers";
import { applySettingsToObject } from "../../Common/ObjectHelpers";
import { AS_MaterialDesign_TagNames, TargetType } from "../../Common/commonSettings";
import { getControlSiblingSettings } from "../../Common/settings.Helper";
import { IControl, IFramework, ControlType } from "../../../framework/src";
import { AsExpansionPanel } from "@alterspective-io/as-framework-material-design/as-expansion-panel";

declare global {

  var SourceCode: any;
}

interface ControlSettingPack {
  control: IControl;
  expander:  AsExpansionPanel;
  settings: AsExpansionPanel;
  extension: alterspectiveExpanderExtension;
}

export interface convertedTables {
  control: IControl;
  expander: AsExpansionPanel;
}

export class alterspectiveExpanderExtension {
  //Dependencies - adjust names as required
  keyword = AS_MaterialDesign_TagNames.expander;
  expander?: AsExpansionPanel;
  as: IFramework;

  currentUserFQN = SourceCode.Forms.SessionManagement.Session.userfqn;
  currentUserDisplayName =
    SourceCode.Forms.SessionManagement.Session.userdisplayname;

  public convertedTables = new Array<convertedTables>();

  repeaterControls!: IControl[];
  INDEX = 0;

  constructor(as: IFramework) {
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

    // cssForK2.use({ target: this.as.window.document.head }); //Igor: 19 Dec 2024 - this is not working

    this.as.window.document.head.appendChild(link);
  }

  convertTableToExpander(k2Control: IControl): AsExpansionPanel {
    let contents: HTMLSpanElement | undefined = undefined; //placeholder to insert the card contents
    let k2ControlElement = k2Control.getHTMLElement() as HTMLDivElement;
    let jk2ControlElement = $(k2ControlElement);

    let originalDisplay = k2ControlElement.style.display;

    let newExpander = this.createNewExpander(k2ControlElement.parentElement!);
    this.render(k2Control, k2ControlElement, newExpander, originalDisplay);

    console.log(newExpander);

    if (contents) newExpander.appendChild(contents);
    return newExpander;
  }

  private async render(
    k2Control: IControl,
    k2ControlElement: HTMLDivElement,
    newExpander: AsExpansionPanel,
    originalDisplay: string
  ) {
    let settings: AsExpansionPanel | undefined;
    //TODO- set any default settings
    if (!settings) settings = getControlSiblingSettings(k2Control,AS_MaterialDesign_TagNames.expander,TargetType.controls).settings || {}


    let htmlRows = k2ControlElement.children; //get all the roes in the table
    console.log(`Rows found ${htmlRows.length}`);

    let titleSection = this.as.getControlFromElement(
      htmlRows[0] as HTMLElement
    );
    if (titleSection) {
      titleSection.setControlVisibility(false);
      let titleSectionControls = getControlsInControl(titleSection);

      if (titleSectionControls) {
        let titleCounter = 0;
        let titleSlot : HTMLSpanElement | undefined
        for (let index = 0; index < titleSectionControls.length; index++) {
          const foundControl = titleSectionControls[index];

          if (foundControl.type == ControlType.Table) {
            //tables get put into slots
          
             if(!titleSlot) 
             {
              //if we have tables then make sure we have a slot to put them in
              titleSlot = document.createElement("span")
              titleSlot.slot="title-slot"
             }
             titleSlot.appendChild(foundControl.getHTMLElement());      
            continue;
          }

         
          if (titleCounter == 0) {
              dataBind(newExpander, "collapsedTitle", foundControl);
            } else {
              dataBind(newExpander, "expandedTitle", foundControl);
            }
            titleCounter++;
          
        }
        if(titleSlot) newExpander.appendChild(titleSlot) //if we had tables then  tableSlot would be present so add into expander
      }
    }
    // if (settings.enabled == true) {

    let passPack: ControlSettingPack = {
      extension: this,
      settings: settings!,
      control: k2Control,
      expander: newExpander,
    };

    newExpander.appendChild(k2ControlElement);


    applySettingsToObject(newExpander, settings, "settings");
    
    newExpander.style.maxWidth = k2ControlElement.style.width;
    k2ControlElement.style.width = "100%"; //we set the container to its side and so the item get reset to 100%
    console.log(
      "TCL: k2ControlElement.style.width",
      k2ControlElement.style.width
    );
    if (!newExpander.style.width) newExpander.style.width = "100%";
    newExpander.elevation = settings!.elevation || 0;
  }

  createNewExpander(element: HTMLElement): AsExpansionPanel {
    let expander = new AsExpansionPanel();
    expander.elevation = 0;
    expander.classList.add("as-theme");
    element.appendChild(expander);
    return expander;
  }

  private getDataTableTargets() {
    return this.as.getControlsByNameContains(this.keyword);
  }
}
