import "./extension.css";
import {  dataBind } from "../../Common/controlHelpers";
import { AS_MaterialDesign_TagNames, ProcessedTargets, TargetType } from "../../Common/commonSettings";
import { getControlSiblingSettings, getProcessedTargetsForTagName, setupCallbackForWhenTagSettingsChange } from "../../Common/settings.Helper";
import { applySettingsToObject } from "../../Common/ObjectHelpers";
// import { IControl, IFramework, EventTimingOption, ControlType, LogType } from "@alterspective-io/as-k2sf-framework";
// import { Icon, MaterialDesignText, MaterialDesignIcons } from "@alterspective-io/as-framework-material-design";
// import { AsMaterialdesignText } from "@alterspective-io/as-framework-material-design/as-materialdesign-button";
import { IControl, IFramework, EventTimingOption, ControlType, IViewInstance } from "../../../framework/src";
// import { AsDataTableExtensionSettings } from "../../DataTables/Extension/settings";
// import { AsMaterialdesignDatatableExtended, IPassPack } from "../../DataTables/Extension/interfaces";
// import { uniqueId } from "lodash";
import { generateUUID } from "../../Common/UID";
import { IPassPack } from "../../DataTables/Extension/interfaces";
import { AsMaterialdesignText } from "@alterspective-io/as-framework-material-design/as-materialdesign-text";
import { MaterialDesignIcons } from "../../Common/materialButtons";
import { getAdjustedFontSizeToReferenceElement } from "../../Common/StyleHelper";
import { insertAndScaleVariablesForComponent } from "../../Common/cssVariableFinder";


// import { AsMaterialdesignText, MaterialDesignText, MaterialDesignIcons } from "@alterspective-io/as-framework-material-design/dist/types/components";
// import { MaterialDesignText, MaterialDesignIcons } from "@alterspective-io/as-framework-material-design";

// import * as d from "@alterspective-io/as-framework-material-design/dist/types/components"

declare global {
  var SourceCode: any;
}


export interface convertedListControls {
  info: IPassPack | undefined
}


export interface convertedTexts {
  id: string;
  table: IControl;
  asText: ASK2Text;
}
export interface AsK2Text {
  control: IControl;
  button: AsMaterialdesignText;
}
export interface ASK2Text { }
export class AlterspectiveMaterialTextExtension {
  //Dependencies - adjust names as required
  tagName = AS_MaterialDesign_TagNames.text;
  text?: AsMaterialdesignText;
  as: IFramework;

  dependantViewName = "Simplied.Text";
  currentUserFQN = SourceCode.Forms.SessionManagement.Session.userfqn;
  currentUserDisplayName =
    SourceCode.Forms.SessionManagement.Session.userdisplayname;

  public convertedTexts = new Array<convertedTexts>();
  public convertedTargets = new Array<convertedListControls>();


  materialTables!: IControl[];
  shadowChat: any;
  INDEX = 0;
  targets: ProcessedTargets | undefined;

  constructor(as: IFramework) {
    this.as = as;
    console.log("simpliedMaterialTextExtension Text Constructor()");


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
      this.convertedTexts.push({
        id: target.referencedK2Object.id!,
        table: target.referencedK2Object,
        asText: this.convertK2TextToASText(target.referencedK2Object, target.settings),
      });
      // this.convertedTargets.push({
      //   info: this.convertTableToText(target.referencedK2Object),
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
      this.convertedTexts.push({
        id: tbl.id,
        table: tbl,
        asText: this.convertK2TextToASText(tbl),
      });
    });


    // this.targets.viewsInstances.forEach((target) => {
    //   this.convertedTargets.push({
    //     info: this.convertTableToText(target.referencedK2Object),
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


  async addDependantTopLevelStyles() {
    var link = this.as.window.document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href =
      "https://fonts.googleapis.com/css?family=Material+Icons&display=block";
      this.as.window.document.head.appendChild(link);

 

        await import('./extension.css');  
    // cssForK2.use({ target: this.as.window.document.head, Id: "as-md-extensions" }); //Igor: 19 Dec 2024 - this is not working


  }

  convertK2TextToASText(k2txt: IControl, settings?: any): ASK2Text {
    // let contents: HTMLSpanElement | undefined = undefined; //placeholder to insert the button contents

    let txtElement = k2txt.getHTMLElement() as HTMLDivElement;
    if(!txtElement)
    {
      console.error("No HTML element found for control")
      return {}
    }
    let jtxtElement = $(txtElement);
  

    
   
    console.log("===============convertK2TextToASText=====================");


    let asTextTexts = new Array<AsK2Text>();

   
    txtElement.style.display = "none"; //immediately hide the table we are converting
    
    
   


    //Create the button and return the references

    let newText = this.createNewText(txtElement.parentElement!, k2txt);

    // getAdjustedFontSizeToReferenceElement(newText, 16)

    // insertAndScaleVariablesForComponent("as-materialdesign-text",1.5);



    newText.click = () => {
      k2txt.rules.OnClick?.execute();
    } 

    newText.addEventListener("change", (event) => {
      console.log("TCL: simpliedMaterialTextExtension -> event", event)
      k2txt.value = newText.value;
      // k2txt.rules.OnChange?.execute();
    });

    newText.onchange = (event) => {
      console.log("TCL: simpliedMaterialTextExtension -> event", event)
      k2txt.value = newText.value;
      // k2txt.rules.OnChange?.execute();
    }

    k2txt.events.smartformEventChanged.addEvent((e: any) => {
      console.log(e);
      console.log(k2txt);
      console.log(newText);
      newText.value = k2txt.value || "";
    });

    //add style to k2txt

    let newStyle = document.createElement("style");
    newStyle.innerHTML = `
    
     :host { --mdc-typography-subtitle1-font-size: 1.500rem,
      --mdc-typography-caption-font-size: 1.125rem,
      --mdc-typography-headline1-font-size: 9.000rem,
      --mdc-typography-headline2-font-size: 5.625rem,
      --mdc-typography-headline3-font-size: 4.500rem,
      --mdc-typography-headline4-font-size: 3.188rem,
      --mdc-typography-headline5-font-size: 2.250rem,
      --mdc-typography-headline6-font-size: 1.875rem,
      --mdc-typography-subtitle2-font-size: 1.313rem,
      --mdc-typography-body1-font-size: 1.500rem,
      --mdc-typography-body2-font-size: 1.313rem,
      --mdc-typography-button-font-size: 1.313rem,
      --mdc-typography-overline-font-size: 1.125rem
  }
    `
    newText.shadowRoot!.appendChild(newStyle);


    


    newText.label= k2txt.value || k2txt.name

    this.mapAgainstK2Text(k2txt, newText)


    //get the tables set width
    let width = jtxtElement[0].style.width || settings.width || 350;
    console.log("TCL: simpliedMaterialTextExtension -> width", width)
    newText.style.width = width;
    newText.style.maxWidth = width;

    let lbl =  k2txt.getPropertyValue("WaterMarkText") || k2txt.value || k2txt.name ;

    

    newText.label = lbl;


    //newText.parentElement!.parentElement!.appendChild(newText)
    //Media, Title, Content, Texts
    //TODO: add intelligence to derive the sections

    //set visability and add monitoring 
    this.validateControlVisability(k2txt, newText);
    k2txt.addPropertyListener("SetProperty", EventTimingOption.after, e => {
      txtElement.style.display = "none"; //always make sure origional table element is hidden 
      this.validateControlVisability(k2txt, newText);
    })


    this.findAndImplementSettings(k2txt, newText, settings);

    
    console.log(newText);


    let attached = {
      asText: newText,
      asTextTexts: asTextTexts,
    } as ASK2Text;

    k2txt.attachedCustomControl = {
      elementId: newText.id,
      element: newText,
      additionalInfo : attached
    };

    return attached;

  }

  

  validateControlVisability(tblControl: IControl, button: AsMaterialdesignText) {
    let isVisable = tblControl.getControlPropertyValue("isvisible");
    if (isVisable)
      button.style.display = "block";
    else
      button.style.display = "none";
  }

  /**
   * this function maps the K2 button to the Material Design Text
   * it also sets the button to be hidden if the K2 control is hidden
   * @param control 
   * @param materialText 
   */
  private mapAgainstK2Text(
    control: IControl,
    materialText: AsMaterialdesignText
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

    materialText.label = controlText;
    materialText.onclick = clickFunc;
    materialText.icon = icon;
    materialText.outlined = false;
    materialText.disabled = !controlIsEnabled;
    materialText.id = control.name;

    // console.log(
    // "TCL: simpliedMaterialTextExtension -> materialText",
    // materialText
    // );

    if (!controlIsVisible == true) {
      materialText.style!.display = "none";
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



    //here we are checking if the color is an rgba value, if it is we will set the button to the default color
    //we are using  materialText.style[""] to set the css variables for the button
    //we have to use the @ts-ignore as the typescript compiler does not know about the css variables
    let jElement = $(control.getHTMLElement());
    if (
      !jElement.css("backgroundColor").includes("rgba") &&
      !jElement.css("color").includes("rgba")
    ) {

      //@ts-ignore
       materialText.mdStyle ["--mdc-theme-primary"] = primary
       //@ts-ignore
      materialText.mdStyle["--mdc-theme-on-primary"] = onPrimary

      // materialText.style["--mdc-theme-primary"] = primary

    }
    else {
      console.warn("RGBA!!!")
      //@ts-ignore
       materialText.mdStyle["--mdc-theme-primary"] = "rgb(255,255,255)"
       //@ts-ignore
       materialText.mdStyle["--mdc-theme-primary"] = k2ControlColor
    }
  }

  private getK2PropValueAsBoolean(value: any): boolean {
    if (!value) return false;
    if (typeof value == "boolean") return value;
    return value == "true";
  }

  // dataBindText(newText: AsMaterialdesignText, control: IControl, newText: MaterialDesignText) {
  //   //add observer for changes to the buttons class, we need to use this to pick up things like disabled events
  //   //Watch for disabling of control event
  //   let classWatcher = new ClassWatcher(control.getHTMLElement(), 'disabled', ()=>{newText.disabled=true;newText.buttons = [...newText.buttons]},()=>{newText.disabled=false;newText.buttons = [...newText.buttons]});
  //   //force web-component to see change in array
  // }

  // private findAndImplementSettings(
  //   firstRow: IControl | undefined,
  //   newText: AsMaterialdesignText
  // ) {
  //   if (firstRow) {
  //     let settingsControl = this.getControlsInControl(firstRow!).find((c) =>
  //       c.name.includes("as-button-settings")
  //     );
  //     if (settingsControl) {       
  //         applySettings(newText, settingsControl);      
  //     }
  //   }
  // }
  private findAndImplementSettings(
    control: IControl,
    newText: AsMaterialdesignText,
    pageSettings?: any
  ) {

    let siblingControlSettingsResult = getControlSiblingSettings(control, AS_MaterialDesign_TagNames.button, TargetType.controls)
    let settings = siblingControlSettingsResult.settings

    applySettingsToObject(newText, settings)
    if (pageSettings) {
      applySettingsToObject(newText, pageSettings)

      if(pageSettings.width)
      {
        newText.style.width = pageSettings.width;
        newText.style.maxWidth = pageSettings.width;
        
      }

    }

    if (siblingControlSettingsResult.settingsControl) {
      siblingControlSettingsResult.settingsControl.rules?.OnChange?.addListener(control.id + "md-button", () => {
        this.findAndImplementSettings(control, newText)
      })
    }


    // if (settingsControl) {       
    //     applySettings(newText, settingsControl);      
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

  createNewText(element: HTMLElement, control: IControl): AsMaterialdesignText {
    let newText = new AsMaterialdesignText();
    element.insertBefore(newText, control.getHTMLElement())
    return newText;
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

  //  importVariableUnitPolyfill = () => {
  //   const parseString = (cssStr: string) => cssStr
  //     .replace(/(\d+)(--[a-zA-Z-]+)/g, 'calc($1 * var($2))')
  
  //   const parseStyle = (style: { textContent: string; }) => {
  //     style.textContent = parseString(style.textContent)
  //   }
  
  //   const parseStyles = (styles: any) => {
  //     for (const style of styles) parseStyle(style)
  //   }
  
  //   const parseTemplate = (template: { content: { querySelectorAll: (arg0: string) => any; }; }) => {
  //     const styles = template.content.querySelectorAll('style')
  //     parseStyles(styles)
  //   }
  
  //   const parseTemplates = (templates: any) => {
  //     for (const template of templates) parseTemplate(template)
  //   }
  
  //   return {
  //     parseString,
  //     parseTemplate,
  //     parseTemplates,
  //     parseStyle,
  //     parseStyles,
  //   }
  // }
}
