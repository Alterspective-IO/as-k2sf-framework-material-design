import { IControl, IFramework } from "asFramework/src/index";
import cssForK2 from "./extension.css";
import { AsHtmlRepeater } from "alterspective-k2-smartfroms/dist/components/as-html-repeater"
import { AS_MaterialDesign_TagNames } from "../../Common/commonSettings";

declare global {
  var SourceCode: any;
}

export interface convertedListControls {
  control: IControl;
  repeater: AsHtmlRepeater;
}

export interface ASK2HTMLRepeaterSettings {
  enabled?: boolean;
  htmlTemplateRowSource?:string,
  htmlTemplateContainerSource?:string,
  elevation?: number
}

export class alterspectiveHtmlRepeaterExtension {
  //Dependencies - adjust names as required
  keyword = AS_MaterialDesign_TagNames.htmlRepeater;
  HTMLRepeater?: AsHtmlRepeater;
  as: IFramework;
  dependantViewName = "Alterspective.HTMLRepeater";
  currentUserFQN = SourceCode.Forms.SessionManagement.Session.userfqn;
  currentUserDisplayName =
    SourceCode.Forms.SessionManagement.Session.userdisplayname;

  public convertedCards = new Array<convertedListControls>();

  repeaterControls!: IControl[];
  INDEX = 0;

  constructor(as: IFramework) {
    this.as = as;
    console.log("alterspective HTML Repeater Constructor()");

    this.addDependantTopLevelStyles();
    this.repeaterControls = this.getHTMLRepeaterTargets();
    console.log(`${this.repeaterControls.length} - lists to convert`);
    this.repeaterControls.forEach((repeaterControl) => {
      this.convertedCards.push({
        control: repeaterControl,
        repeater: this.convertListToHTMLRepeater(repeaterControl),
      });
    });
  }
  

  addDependantTopLevelStyles() {
    var link = this.as.window.document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href =
      "https://fonts.googleapis.com/css?family=Material+Icons&display=block";

    cssForK2.use({ target: this.as.window.document.head, Id:"as-md-htmlrepeater" });

    this.as.window.document.head.appendChild(link);
  }

  convertListToHTMLRepeater(listControl: IControl): AsHtmlRepeater {
    let contents: HTMLSpanElement | undefined = undefined; //placeholder to insert the card contents
    let listControlElement = listControl.getHTMLElement() as HTMLDivElement;
    let jListControlElement = $(listControlElement);
   
    let originalDisplay =  listControlElement.style.display    
    
    let newHTMLRepeater = this.createNewHTMLRepeater(listControlElement.parentElement!);

    let width = jListControlElement.css("width");

    newHTMLRepeater.style.maxWidth = width;

    newHTMLRepeater.htmlContainerTemplate = "<div style='border:1px solid black;'>rows here: --rows--</div>"

    listControl.events.smartformEventPopulated.addEvent(()=>
    {
      this.render( listControl, listControlElement, newHTMLRepeater, originalDisplay);
    })
    this.render( listControl, listControlElement, newHTMLRepeater, originalDisplay);
    
    console.log(newHTMLRepeater);
  

    if (contents) newHTMLRepeater.appendChild(contents);
    return newHTMLRepeater
  }

  
  private render(listControl: IControl, listControlElement: HTMLDivElement, newHTMLRepeater: AsHtmlRepeater, originalDisplay: string) {
    let settings = this.findSettings(listControl);
    if (settings.enabled == true) {

      listControlElement.style.display = "none"; //immediately hide the control we are converting
      newHTMLRepeater.style.display = "block";

      if (settings.htmlTemplateRowSource) {
        let htmlControlRowTemplate = this.as.getControlsByName(settings.htmlTemplateRowSource, listControl.parent?.name)[0];
        newHTMLRepeater.htmlRowTemplate = htmlControlRowTemplate.value || "<div>{{carMake}} - ${item.Joins[0].Folio}</div>";
      }

      if (settings.htmlTemplateContainerSource) {
        let htmlTemplateContainerSource = this.as.getControlsByName(settings.htmlTemplateContainerSource, listControl.parent?.name)[0];
        newHTMLRepeater.htmlContainerTemplate = htmlTemplateContainerSource.value || "<div>--rows--</div>";
      }

      newHTMLRepeater.elevation = settings.elevation || 0;
      newHTMLRepeater.data = [];

      if (listControl.smartobject.items) {
        newHTMLRepeater.data = listControl.smartobject.items;
      }
    }
    else {
      listControlElement.style.display = originalDisplay;
      newHTMLRepeater.style.display = "none";
    }
  }

  private getK2PropValueAsBoolean(value: any): boolean {
    if (!value) return false;
    if (typeof value == "boolean") return value;
    return value == "true";
  }

  // dataBindButton(newCard: SuxMaterialdesignCard, control: IControl, newButton: MaterialDesignButton) {
  //   //add observer for changes to the buttons class, we need to use this to pick up things like disabled events
  //   //Watch for disabling of control event
  //   let classWatcher = new ClassWatcher(control.getHTMLElement(), 'disabled', ()=>{newButton.disabled=true;newCard.buttons = [...newCard.buttons]},()=>{newButton.disabled=false;newCard.buttons = [...newCard.buttons]});
  //   //force web-component to see change in array
  // }

  private findSettings(
    control: IControl | undefined
  ) : ASK2HTMLRepeaterSettings {
    if (control) {
      let controlParentElement = control.getHTMLElement().parentElement

      let parentControl = this.as.getControlFromElement(controlParentElement!);
      let settingsControl = this.getControlsInControl(parentControl!).find((c) =>
        c.name.includes("as-settings")
      );
      if (settingsControl) {
        if (settingsControl.value) {
          try {
            return JSON.parse(settingsControl.value!);
          } catch (err) {
            console.warn("Error reading card settings: " + err);
          }
        }
      }
    }
    return {}
  }

  private dataBind(obj: any, prop: string, control: IControl) {
    if (control) {
      obj[prop] = control.value || "";
      control.events.smartformEventChanged.addEvent((e: any) => {
        obj[prop] = e.control.value || "";
      });


    }
  }



  createNewHTMLRepeater(element: HTMLElement): AsHtmlRepeater {
    let htmlRepeater = new AsHtmlRepeater();
    htmlRepeater.elevation = 0;
    // newCard.style.all = "initial";
    htmlRepeater.style.overflow = "visible";
    element.appendChild(htmlRepeater);
    return htmlRepeater;
  }

  private getHTMLRepeaterTargets() {
    return this.as
      .getControlsByNameContains(this.keyword)
      
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
