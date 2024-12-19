import cssForK2 from "./extension.css";
import {  dataBind } from "../../Common/controlHelpers";
import { AS_MaterialDesign_TagNames, ProcessedTargets, TargetType } from "../../Common/commonSettings";
import { getControlSiblingSettings, getProcessedTargetsForTagName, setupCallbackForWhenTagSettingsChange } from "../../Common/settings.Helper";
import { applySettingsToObject } from "../../Common/ObjectHelpers";
// import { IControl, IFramework, EventTimingOption, ControlType, LogType } from "@alterspective-io/as-k2sf-framework";
// import { Icon, MaterialDesignButton, MaterialDesignIcons } from "@alterspective-io/as-framework-material-design";
// import { AsMaterialdesignButton } from "@alterspective-io/as-framework-material-design/as-materialdesign-button";
import { IControl, IFramework, EventTimingOption, ControlType, IViewInstance } from "../../../framework/src";
// import { AsDataTableExtensionSettings } from "../../DataTables/Extension/settings";
// import { AsMaterialdesignDatatableExtended, IPassPack } from "../../DataTables/Extension/interfaces";
// import { uniqueId } from "lodash";
import { generateUUID } from "../../Common/UID";
import { IPassPack } from "../../DataTables/Extension/interfaces";
import { MaterialDesignIcons } from "../../Common/materialButtons";
import { AsMaterialdesignButton } from "@alterspective-io/as-framework-material-design/as-materialdesign-button";
import { MaterialDesignButton } from "@alterspective-io/as-framework-material-design/supporting";
import { addEventBindingToViewInstanceFieldControls } from "../../DataTables/Extension/ControlBinderHelper";

// import { AsMaterialdesignButton, MaterialDesignButton, MaterialDesignIcons } from "@alterspective-io/as-framework-material-design/dist/types/components";
// import { MaterialDesignButton, MaterialDesignIcons } from "@alterspective-io/as-framework-material-design";

// import * as d from "@alterspective-io/as-framework-material-design/dist/types/components"

declare global {
  var SourceCode: any;
}


export interface convertedListControls {
  info: IPassPack | undefined
}


export interface convertedButtons {
  id: string;
  table: IControl;
  asButton: ASK2Button;
}
export interface AsK2ButtonButton {
  control: IControl;
  button: MaterialDesignButton;
}
export interface ASK2Button { }
export class AlterspectiveMaterialButtonExtension {
  //Dependencies - adjust names as required
  tagName = AS_MaterialDesign_TagNames.button;
  button?: AsMaterialdesignButton;
  as: IFramework;

  dependantViewName = "Simplied.Button";
  currentUserFQN = SourceCode.Forms.SessionManagement.Session.userfqn;
  currentUserDisplayName =
    SourceCode.Forms.SessionManagement.Session.userdisplayname;

  public convertedButtons = new Array<convertedButtons>();
  public convertedTargets = new Array<convertedListControls>();


  materialTables!: IControl[];
  shadowChat: any;
  INDEX = 0;
  targets: ProcessedTargets | undefined;

  constructor(as: IFramework) {
    this.as = as;
    console.log("simpliedMaterialButtonExtension Button Constructor()");


    setupCallbackForWhenTagSettingsChange(
      this.as,
      this.tagName,
      this.tagSettingsChangedEvent.bind(this)
    );

    this.applyTargets();

    //previous
    this.addDependantTopLevelStyles();

  }

  applyTargets() {
    let processedTargetsAndExtensionSettings = getProcessedTargetsForTagName(
      this.as,
      this.tagName
    );
    this.targets = processedTargetsAndExtensionSettings.processedTargets;
   
    this.targets.controls.forEach((target) => {
      if(this.isControlAlreadyConverted(target.referencedK2Object))
      {
        this.findAndImplementSettings(target.referencedK2Object, (target.referencedK2Object.attachedCustomControl!.element as any), target.settings);
        return;
      }
      this.convertedButtons.push({
        id: target.referencedK2Object.id!,
        table: target.referencedK2Object,
        asButton: this.convertK2ButtonToASButton(target.referencedK2Object, target.settings),
      });
      // this.convertedTargets.push({
      //   info: this.convertTableToButton(target.referencedK2Object),
      // });


    });


    //Non targeting system
    this.materialTables = this.getMaterialTableControls();
    console.log(`${this.materialTables.length} - tables to convert`);
    this.materialTables.forEach((tbl) => {
      if(this.isControlAlreadyConverted(tbl))
      {
        //Comment out as handled by sibling setting monitor
        // this.findAndImplementSettings(tbl, (tbl.attachedCustomControl!.element as any), settings);
        return;
      }
      tbl.id = tbl.id || generateUUID()
      this.convertedButtons.push({
        id: tbl.id,
        table: tbl,
        asButton: this.convertK2ButtonToASButton(tbl),
      });
    });


    // this.targets.viewsInstances.forEach((target) => {
    //   this.convertedTargets.push({
    //     info: this.convertTableToButton(target.referencedK2Object),
    //   });
    // });
  }

  isControlAlreadyConverted(ctr: IControl)
  {
    if(ctr.attachedCustomControl)
    {
     // this.findAndImplementSettings(ctr, (ctr.attachedCustomControl.element as any), settings);
      return true
    }
    return false;
  }

  tagSettingsChangedEvent(
    processedTargets: ProcessedTargets,
    extensionSettings: any,
    specificAffectedControl?: IControl | IViewInstance,
    specificChangedSettings?: any
  ) {
    console.log(
      "TCL: alterspectiveDataTableExtension -> tagSettingsChangedEvent"
    );
    console.log("processedTargets", processedTargets);
    console.log("extensionSettings", extensionSettings);

    this.applyTargets();

    // if (specificAffectedControl) {
    //   console.log("specificAffectedControl", specificAffectedControl);
    //   console.log("specificChangedSettings", specificChangedSettings);
    //   if (specificChangedSettings) {
    //     let passPack = (
    //       specificAffectedControl.attachedCustomControl
    //         ?.element as AsMaterialdesignDatatableExtended
    //     ).passPack;
    //     if (passPack) {
    //       passPack.extension.render(passPack);
    //     }
    //     //applySettingsToObject(specificAffectedControl.attachedCustomControl?.element,specificChangedSettings)
    //   }
    // }
  }


  addDependantTopLevelStyles() {
    var link = this.as.window.document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href =
      "https://fonts.googleapis.com/css?family=Material+Icons&display=block";

    // cssForK2.use({ target: this.as.window.document.head, Id: "as-md-extensions" }); //Igor: 19 Dec 2024 - this is not working

    this.as.window.document.head.appendChild(link);
  }

  convertK2ButtonToASButton(k2btn: IControl, settings?: any): ASK2Button {
    // let contents: HTMLSpanElement | undefined = undefined; //placeholder to insert the button contents

    let btnElement = k2btn.getHTMLElement() as HTMLDivElement;
    if(!btnElement)
    {
      console.error("No HTML element found for control")
      return {}
    }
    let jBtnElement = $(btnElement);
  

    
   
    console.log("===============convertK2ButtonToASButton=====================");


    let asButtonButtons = new Array<AsK2ButtonButton>();

   
    btnElement.style.display = "none"; //immediately hide the table we are converting
    
    
   

    //Create the button and return the references

    let newButton = this.createNewButton(btnElement.parentElement!, k2btn);


    newButton.click = () => {
      k2btn.rules.OnClick?.execute();
    } 

    newButton.label= k2btn.value || k2btn.name

    this.mapAgainstK2Button(k2btn, newButton)


    //get the tables set width
    let width = jBtnElement[0].style.width || settings.width || 350;
    console.log("TCL: simpliedMaterialButtonExtension -> width", width)
    newButton.style.width = width;
    newButton.style.maxWidth = width;
    newButton.title = k2btn.value || k2btn.name;


    //newButton.parentElement!.parentElement!.appendChild(newButton)
    //Media, Title, Content, Buttons
    //TODO: add intelligence to derive the sections

    //set visability and add monitoring 
    this.validateControlVisability(k2btn, newButton);
    k2btn.addPropertyListener("SetProperty", EventTimingOption.after, e => {
      btnElement.style.display = "none"; //always make sure origional table element is hidden 
      this.validateControlVisability(k2btn, newButton);
    })


    this.findAndImplementSettings(k2btn, newButton, settings);

    
    console.log(newButton);


    let attached = {
      asButton: newButton,
      asButtonButtons: asButtonButtons,
    } as ASK2Button;

    k2btn.attachedCustomControl = {
      elementId: newButton.id,
      element: newButton,
      additionalInfo : attached
    };

    return attached;

  }

  

  validateControlVisability(tblControl: IControl, button: AsMaterialdesignButton) {
    let isVisable = tblControl.getControlPropertyValue("isvisible");
    if (isVisable)
      button.style.display = "block";
    else
      button.style.display = "none";
  }

  /**
   * this function maps the K2 button to the Material Design Button
   * it also sets the button to be hidden if the K2 control is hidden
   * @param control 
   * @param materialButton 
   */
  private mapAgainstK2Button(
    control: IControl,
    materialButton: AsMaterialdesignButton
  ) {
    let clickFunc = () => {
      control.rules.OnClick?.execute();
    };
    let controlText = control.getControlPropertyValue("Text") as string;

    let controlIsEnabled = this.getK2PropValueAsBoolean(
      control.getControlPropertyValue("IsEnabled")
    );
   
    let controlIsVisible = this.getK2PropValueAsBoolean(
      control.getControlPropertyValue("IsVisible")
    );
   

    let { foundValue, textExcludingValue } = this.regexExtractor(controlText)
    controlText = textExcludingValue
    let icon = foundValue || this.iconTextDeriver(controlText);

    materialButton.label = controlText;
    materialButton.clicked = clickFunc;
    materialButton.icon = icon;
    materialButton.raised = false;
    materialButton.unelevated = false;
    materialButton.outlined = false;
    materialButton.dense = false;
    materialButton.disabled = !controlIsEnabled;
    materialButton.trailingIcon = false;
    materialButton.fullwidth = false;
    materialButton.expandContent = false;
    materialButton.id = control.name;

    // console.log(
    // "TCL: simpliedMaterialButtonExtension -> materialButton",
    // materialButton
    // );

    if (!controlIsVisible == true) {
      materialButton.style!.display = "none";
    }


    let k2ControlBackgroundColor = ""
    let k2ControlColor = ""
    //Get k2 control color settings
    k2ControlBackgroundColor = $(
      control.getHTMLElement()
    ).css("backgroundColor") || "";
    k2ControlColor = $(
      control.getHTMLElement()
    ).css("color") || "";

    let primary = k2ControlBackgroundColor
    let onPrimary = k2ControlColor

    let isStdButton = false;
    let buttonStyle = control.getControlPropertyValue("ButtonStyle") as string;
    switch (buttonStyle) {
      case "destructiveaction":
        // (window as any).test  = $(k2Button.getHTMLElement())
        materialButton.unelevated = true;

        break;
      case "quietaction":
        primary = k2ControlColor
        onPrimary = "" //ignored for outlined

        break;
      case "mainaction":
        materialButton.raised = true;
        // button.style={
        //   "--mdc-theme-primary": "#00abf0",
        //   "--mdc-theme-on-primary": "white"
        // }
        break;
      default:
        // materialButton.outlined = true;
        materialButton.unelevated = true;
        isStdButton = true;
    }


    //here we are checking if the color is an rgba value, if it is we will set the button to the default color
    //we are using  materialButton.style[""] to set the css variables for the button
    //we have to use the @ts-ignore as the typescript compiler does not know about the css variables
    let jElement = $(control.getHTMLElement());
    if (
      !jElement.css("backgroundColor").includes("rgba") &&
      !jElement.css("color").includes("rgba")
    ) {

      //@ts-ignore
       materialButton.mdStyle ["--mdc-theme-primary"] = primary
       //@ts-ignore
      materialButton.mdStyle["--mdc-theme-on-primary"] = onPrimary

      // materialButton.style["--mdc-theme-primary"] = primary

    }
    else {
      console.warn("RGBA!!!")
      //@ts-ignore
       materialButton.mdStyle["--mdc-theme-primary"] = "rgb(255,255,255)"
       //@ts-ignore
       materialButton.mdStyle["--mdc-theme-primary"] = k2ControlColor
    }
  }

  private getK2PropValueAsBoolean(value: any): boolean {
    if (!value) return false;
    if (typeof value == "boolean") return value;
    return value == "true";
  }

  // dataBindButton(newButton: AsMaterialdesignButton, control: IControl, newButton: MaterialDesignButton) {
  //   //add observer for changes to the buttons class, we need to use this to pick up things like disabled events
  //   //Watch for disabling of control event
  //   let classWatcher = new ClassWatcher(control.getHTMLElement(), 'disabled', ()=>{newButton.disabled=true;newButton.buttons = [...newButton.buttons]},()=>{newButton.disabled=false;newButton.buttons = [...newButton.buttons]});
  //   //force web-component to see change in array
  // }

  // private findAndImplementSettings(
  //   firstRow: IControl | undefined,
  //   newButton: AsMaterialdesignButton
  // ) {
  //   if (firstRow) {
  //     let settingsControl = this.getControlsInControl(firstRow!).find((c) =>
  //       c.name.includes("as-button-settings")
  //     );
  //     if (settingsControl) {       
  //         applySettings(newButton, settingsControl);      
  //     }
  //   }
  // }
  private findAndImplementSettings(
    control: IControl,
    newButton: AsMaterialdesignButton,
    pageSettings?: any
  ) {

    let siblingControlSettingsResult = getControlSiblingSettings(control, AS_MaterialDesign_TagNames.button, TargetType.controls)
    let settings = siblingControlSettingsResult.settings

    applySettingsToObject(newButton, settings)
    if (pageSettings) {
      applySettingsToObject(newButton, pageSettings)

      if(pageSettings.width)
      {
        newButton.style.width = pageSettings.width;
        newButton.style.maxWidth = pageSettings.width;
        
      }

    }

    if (siblingControlSettingsResult.settingsControl) {
      siblingControlSettingsResult.settingsControl.rules?.OnChange?.addListener(control.id + "md-button", () => {
        this.findAndImplementSettings(control, newButton)
      })
    }


    // if (settingsControl) {       
    //     applySettings(newButton, settingsControl);      
    // }

  }


  regexExtractor(text: string): { foundValue: string | undefined, textExcludingValue: string } {
    let foundValue;
    let textExcludingValue = text;
    // var regex = /(?<=\()(.*?)(?=\))/; //<-- safari doesnt like
    var regex = /(?:\()(.*?)(?:\))/; //this regex extracts the text between the brackets for example (icon) or (icon1)


    const found = text.match(regex);

    if (found) {
      if (found[1]) {
        foundValue = found[1]
        textExcludingValue = textExcludingValue.replace(`(${foundValue})`, "")
      }
    }

    return { foundValue, textExcludingValue }
  }

  iconTextDeriver(text: string): MaterialDesignIcons {
    text = text.toLocaleLowerCase();
    let ret = MaterialDesignIcons[text as keyof typeof MaterialDesignIcons];
    return ret
  }

  createNewButton(element: HTMLElement, control: IControl): AsMaterialdesignButton {
    let newButton = new AsMaterialdesignButton();
    element.insertBefore(newButton, control.getHTMLElement())
    return newButton;
  }

  private getMaterialTableControls() {
    return this.as
      .getControlsByNameContains(this.tagName)
      .filter((c) => c.type == ControlType.Table);
  }

  getControlsInControl(parentControl: IControl): IControl[] {
    let retValue = new Array<IControl>();

    let IDs = new Array<string>();
    //Get all the IDs in the contained control
    let parentElement = parentControl.getHTMLElement() as HTMLElement;

    [...parentElement.children].forEach((childEle) => {
      // let ctr = this.as.getControlsById(childEle.id,parentControl.parent?.name)[0]
      let ctr = this.as.getControlFromElement(childEle as HTMLElement);
      if (ctr) retValue.push(ctr);
    });
    return retValue;
  }

  bindControlUpdates(control: IControl, obj: object) {
    control.events.smartformEventChanged.addEvent((e: any) => {
      console.log(e);
      console.log(obj);
    });
  }
}
