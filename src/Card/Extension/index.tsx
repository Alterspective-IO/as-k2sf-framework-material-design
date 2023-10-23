import cssForK2 from "./extension.css";
import { applySettings, dataBind } from "../../Common/controlHelpers";
import { AS_MaterialDesign_TagNames, ProcessedTargets, TargetType } from "../../Common/commonSettings";
import { getControlSiblingSettings, getProcessedTargetsForTagName, setupCallbackForWhenTagSettingsChange } from "../../Common/settings.Helper";
import { applySettingsToObject } from "../../Common/ObjectHelpers";
// import { IControl, IFramework, EventTimingOption, ControlType, LogType } from "@alterspective-io/as-k2sf-framework";
import { Icon, MaterialDesignButton, MaterialDesignIcons } from "@alterspective-io/as-framework-material-design";
import { AsMaterialdesignCard } from "@alterspective-io/as-framework-material-design/dist/components/as-materialdesign-card";
import { IControl, IFramework, EventTimingOption, ControlType, IViewInstance } from "../../../framework/src";
import { AsDataTableExtensionSettings } from "../../DataTables/Extension/settings";
import { AsMaterialdesignDatatableExtended, IPassPack } from "../../DataTables/Extension/interfaces";
import { uniqueId } from "lodash";
import { generateUUID } from "../../Common/UID";

declare global {
  var SourceCode: any;
}


export interface convertedListControls {
  info: IPassPack | undefined
}


export type CardSections = "media" | "title" | "content" | "buttons";
export interface convertedCards {
  id: string;
  table: IControl;
  asCard: ASK2Card;
}
export interface AsK2CardButton {
  control: IControl;
  button: MaterialDesignButton;
}
export interface ASK2Card { }
export class simpliedMaterialCardExtension {
  //Dependencies - adjust names as required
  tagName = AS_MaterialDesign_TagNames.card;
  card?: AsMaterialdesignCard;
  as: IFramework;

  dependantViewName = "Simplied.Card";
  currentUserFQN = SourceCode.Forms.SessionManagement.Session.userfqn;
  currentUserDisplayName =
    SourceCode.Forms.SessionManagement.Session.userdisplayname;

  public convertedCards = new Array<convertedCards>();
  public convertedTargets = new Array<convertedListControls>();


  materialTables!: IControl[];
  shadowChat: any;
  INDEX = 0;
  targets: ProcessedTargets | undefined;

  constructor(as: IFramework) {
    this.as = as;
    console.log("simpliedMaterialCardExtension Card Constructor()");


    setupCallbackForWhenTagSettingsChange(
      this.as,
      this.tagName,
      this.tagSettingsChangedEvent.bind(this)
    );

    this.applyTargets();

    //previous
    this.addDependantTopLevelStyles();
    // this.materialTables = this.getMaterialTableControls();
    // console.log(`${this.materialTables.length} - tables to convert`);
    // this.materialTables.forEach((tbl) => {
    //   this.convertedCards.push({
    //     table: tbl,
    //     asCard: this.convertTableToCard(tbl),
    //   });
    // });
  }

  applyTargets() {
    let processedTargetsAndExtensionSettings = getProcessedTargetsForTagName(
      this.as,
      this.tagName
    );
    this.targets = processedTargetsAndExtensionSettings.processedTargets;
    // this.extensionSettings = new AsDataTableExtensionSettings(); //create new extension setting with defaults
    // applySettingsToObject(
    //   this.extensionSettings,
    //   processedTargetsAndExtensionSettings.extensionSettings
    // ); //merge in anu users extension settings

    


    this.targets.controls.forEach((target) => {
      if(this.isControlAlreadyConverted(target.referencedK2Object))
      {
        this.findAndImplementSettings(target.referencedK2Object, (target.referencedK2Object.attachedCustomControl!.element as any), target.settings);
        return;
      }
      this.convertedCards.push({
        id: target.referencedK2Object.id!,
        table: target.referencedK2Object,
        asCard: this.convertTableToCard(target.referencedK2Object, target.settings),
      });
      // this.convertedTargets.push({
      //   info: this.convertTableToCard(target.referencedK2Object),
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
      this.convertedCards.push({
        id: tbl.id,
        table: tbl,
        asCard: this.convertTableToCard(tbl),
      });
    });


    // this.targets.viewsInstances.forEach((target) => {
    //   this.convertedTargets.push({
    //     info: this.convertTableToCard(target.referencedK2Object),
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

    cssForK2.use({ target: this.as.window.document.head, Id: "as-md-extensions" });

    this.as.window.document.head.appendChild(link);
  }

  convertTableToCard(tbl: IControl, settings?: any): ASK2Card {
    let contents: HTMLSpanElement | undefined = undefined; //placeholder to insert the card contents
    let tblElement = tbl.getHTMLElement() as HTMLDivElement;
    let jTblElement = $(tblElement);

    
   


    let asCardButtons = new Array<AsK2CardButton>();
    tblElement.style.display = "none"; //immediately hide the table we are converting
    let htmlRows = tblElement.children; //get all the roes in the table
    console.log(`Rows found ${htmlRows.length}`);

    //Create the card and return the references

    let newCard = this.createNewCard(tblElement.parentElement!, tbl);

   

    //get the tables set width
    let width = jTblElement[0].style.width || settings.width || 350;
    console.log("TCL: simpliedMaterialCardExtension -> width", width)
    newCard.style.width = width;
    newCard.style.maxWidth = width;

    //newCard.parentElement!.parentElement!.appendChild(newCard)
    //Media, Title, Content, Buttons
    //TODO: add intelligence to derive the sections

    let firstRow = this.as.getControlFromElement(htmlRows[0] as HTMLElement);

    let mediaSection = this.as.getControlFromElement(
      htmlRows[0] as HTMLElement
    );
    let titleSection = this.as.getControlFromElement(
      htmlRows[0] as HTMLElement
    );
    let contentSection = this.as.getControlFromElement(
      htmlRows[1] as HTMLSpanElement
    );
    let buttonsSection = this.as.getControlFromElement(
      htmlRows[2] as HTMLSpanElement
    );

    //set visability and add monitoring 
    this.validateControlVisability(tbl, newCard);
    tbl.addPropertyListener("SetProperty", EventTimingOption.after, e => {
      tblElement.style.display = "none"; //always make sure origional table element is hidden 
      this.validateControlVisability(tbl, newCard);
    })


    this.findAndImplementSettings(tbl, newCard, settings);

    //check if first row has image, if it does its media
    //Title Sections
    if (titleSection) {
      let titleSectionControls = this.getControlsInControl(titleSection);

      if (titleSectionControls) {
        let titleCounter = 0;
        for (let index = 0; index < titleSectionControls.length; index++) {
          const foundControl = titleSectionControls[index];



          if (!foundControl.name.includes("settings")) {
            if (titleCounter == 0) {
              dataBind(newCard, "cardTitle", foundControl);
            }
            else {
              dataBind(newCard, "cardSubTitle", foundControl);
              break;
            }
            titleCounter++;
          }
        }
      }
    }

    //Content Section
    if (contentSection) {
      let contentSectionElement = contentSection.getHTMLElement();
      //contentSectionElement.classList.value = "demo-card__secondary mdc-typography mdc-typography--body1";
      // contentSectionElement.style.cssText = "";
      contents = contentSectionElement;
    }

    //Buttons
    if (buttonsSection) {
      newCard.buttons = [];

      this.getControlsInControl(buttonsSection)
        .filter((control) => control.type == ControlType.Button)
        .forEach((control) => {
          if (control) {
            let newButton: MaterialDesignButton = {
              label: "",
              raised: false,
              unelevated: false,
              outlined: false,
              dense: false,
              disabled: false,
              trailingIcon: false,
              fullwidth: false,
              expandContent: false,
              id: "",
            };

            this.mapAgainstK2Button(control, newButton);

            console.log(newButton);
            //TODO: need to find the event that happens when the K2 button tet is changed. code below doesnt work
            // control.events.smartformEventChanged.addEvent((e:any)=>
            // {
            //   newButton.label = e.control.getControlPropertyValue("Text") as string
            // })




            control.addPropertyListener("SetProperty", EventTimingOption.after, (evt: any) => {
              console.log("K2 Button Changed, update web-component");
              console.log(evt.detail);

              // let cardFoundButton = newCard.buttons.find(b=>b.id==newButton.id)
              // if(cardFoundButton)
              // {
              // //  debugger
              //   this.mapAgainstK2Button(control, cardFoundButton);
              // }
              this.mapAgainstK2Button(control, newButton);
              console.log(newButton);
              newCard.buttons = [...newCard.buttons];
              // newCard.rerender()
            });

            //this.dataBindButton(newCard,control,newButton)

            newCard.buttons?.push(newButton);

            asCardButtons.push({
              control: control,
              button: newButton,
            });
          }
        });
    }

    //Media

    //newCard.render();
    console.log(newCard);
    // newCard.header_background = media; //TODO

    if (contents) newCard.appendChild(contents);

    let attached = {
      asCard: newCard,
      titleSection: titleSection,
      contentSection: contentSection,
      mediaSection: mediaSection,
      buttonsSection: buttonsSection,
      asCardButtons: asCardButtons,
    } as ASK2Card;

    tbl.attachedCustomControl = {
      elementId: newCard.id,
      element: newCard,
      additionalInfo : attached
    };

    return attached;

  }

  validateControlVisability(tblControl: IControl, card: AsMaterialdesignCard) {
    let isVisable = tblControl.getControlPropertyValue("isvisible");
    if (isVisable)
      card.style.display = "block";
    else
      card.style.display = "none";
  }

  private mapAgainstK2Button(
    control: IControl,
    materialButton: MaterialDesignButton
  ) {
    let clickFunc = () => {
      control.rules.OnClick?.execute();
    };
    //console.log(control.name);
    let controlText = control.getControlPropertyValue("Text") as string;
    // console.log(
    // "TCL: simpliedMaterialCardExtension -> controlText:",
    // controlText
    // );
    let controlIsEnabled = this.getK2PropValueAsBoolean(
      control.getControlPropertyValue("IsEnabled")
    );
    // console.log(
    // "TCL: simpliedMaterialCardExtension -> control.controlIsEnabled",
    // control.getControlPropertyValue("IsEnabled")
    // );
    // console.log(
    // "TCL: simpliedMaterialCardExtension -> controlIsEnabled:",
    // controlIsEnabled
    // );
    let controlIsVisible = this.getK2PropValueAsBoolean(
      control.getControlPropertyValue("IsVisible")
    );
    // console.log(
    // "TCL: simpliedMaterialCardExtension -> control.controlIsVisible",
    // control.getControlPropertyValue("IsVisible")
    // );
    // console.log(
    // "TCL: simpliedMaterialCardExtension -> controlIsVisible:",
    // controlIsVisible
    // );

    // debugger;

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
    materialButton.style = {};

    // console.log(
    // "TCL: simpliedMaterialCardExtension -> materialButton",
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

    let jElement = $(control.getHTMLElement());
    if (
      !jElement.css("backgroundColor").includes("rgba") &&
      !jElement.css("color").includes("rgba")
    ) {
      materialButton.style["--mdc-theme-primary"] = primary
      materialButton.style["--mdc-theme-on-primary"] = onPrimary
    }
    else {
      console.warn("RGBA!!!")
      materialButton.style["--mdc-theme-primary"] = "rgb(255,255,255)"
      materialButton.style["--mdc-theme-primary"] = k2ControlColor
    }
  }

  private getK2PropValueAsBoolean(value: any): boolean {
    if (!value) return false;
    if (typeof value == "boolean") return value;
    return value == "true";
  }

  // dataBindButton(newCard: AsMaterialdesignCard, control: IControl, newButton: MaterialDesignButton) {
  //   //add observer for changes to the buttons class, we need to use this to pick up things like disabled events
  //   //Watch for disabling of control event
  //   let classWatcher = new ClassWatcher(control.getHTMLElement(), 'disabled', ()=>{newButton.disabled=true;newCard.buttons = [...newCard.buttons]},()=>{newButton.disabled=false;newCard.buttons = [...newCard.buttons]});
  //   //force web-component to see change in array
  // }

  // private findAndImplementSettings(
  //   firstRow: IControl | undefined,
  //   newCard: AsMaterialdesignCard
  // ) {
  //   if (firstRow) {
  //     let settingsControl = this.getControlsInControl(firstRow!).find((c) =>
  //       c.name.includes("as-card-settings")
  //     );
  //     if (settingsControl) {       
  //         applySettings(newCard, settingsControl);      
  //     }
  //   }
  // }
  private findAndImplementSettings(
    control: IControl,
    newCard: AsMaterialdesignCard,
    pageSettings?: any
  ) {

    let siblingControlSettingsResult = getControlSiblingSettings(control, AS_MaterialDesign_TagNames.card, TargetType.controls)
    let settings = siblingControlSettingsResult.settings

    applySettingsToObject(newCard, settings)
    if (pageSettings) {
      applySettingsToObject(newCard, pageSettings)

      if(pageSettings.width)
      {
        newCard.style.width = pageSettings.width;
        newCard.style.maxWidth = pageSettings.width;
        
      }

    }

    if (siblingControlSettingsResult.settingsControl) {
      siblingControlSettingsResult.settingsControl.rules?.OnChange?.addListener(control.id + "md-card", () => {
        this.findAndImplementSettings(control, newCard)
      })
    }


    // if (settingsControl) {       
    //     applySettings(newCard, settingsControl);      
    // }

  }


  regexExtractor(text: string): { foundValue: string | undefined, textExcludingValue: string } {
    let foundValue;
    let textExcludingValue = text;
    // var regex = /(?<=\()(.*?)(?=\))/; //<-- safari doesnt like
    var regex = /(?:\()(.*?)(?:\))/;

    const found = text.match(regex);

    if (found) {
      if (found[0]) {
        foundValue = found[0]
        textExcludingValue = textExcludingValue.replace(`(${found[0]})`, "")
      }
    }

    return { foundValue, textExcludingValue }
  }

  iconTextDeriver(text: string): MaterialDesignIcons {
    text = text.toLocaleLowerCase();
    let ret = MaterialDesignIcons[text as keyof typeof MaterialDesignIcons];
    return ret
  }

  createNewCard(element: HTMLElement, control: IControl): AsMaterialdesignCard {
    // let cardRef = createRef();
    // let contentRef = createRef();
    // let html = (
    //   <as-material-design-card
    //     ref={cardRef}
    //     style="width:100%;max-width:400px;margin:5px"
    //     class="mdc-elevation--z21"
    //   >
    //     <div ref={contentRef}></div>
    //   </as-material-design-card>
    // );

    let newCard = new AsMaterialdesignCard();
    // newCard.elevation = 0;

    // newCard.style.all = "initial";
    // newCard.style.overflow = "visible";
    //  newCard.style.filter="drop-shadow(30px 10px 4px #4444dd)"
    // newCard.style.fontSizeAdjust;
    element.insertBefore(newCard, control.getHTMLElement())

    // element.appendChild(newCard);
    // let html = (
    //   <as-materialdesign-card ref={cardRef}>
    //     <div
    //       ref={contentRef}
    //       class={"mdc-elevation--z21"}
    //       style={"width:100%;max-width:400px;margin:5px"}
    //     ></div>
    //   </as-materialdesign-card>
    // );

    //render(html, element);

    return newCard;
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
