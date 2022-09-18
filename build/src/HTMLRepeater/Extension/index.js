import cssForK2 from "./extension.css";
import { AsHtmlRepeater } from "alterspective-k2-smartfroms/dist/components/as-html-repeater";
import { AS_MaterialDesign_TagNames } from "../../Common/commonSettings";
export class alterspectiveHtmlRepeaterExtension {
    constructor(as) {
        //Dependencies - adjust names as required
        this.keyword = AS_MaterialDesign_TagNames.htmlRepeater;
        this.dependantViewName = "Alterspective.HTMLRepeater";
        this.currentUserFQN = SourceCode.Forms.SessionManagement.Session.userfqn;
        this.currentUserDisplayName = SourceCode.Forms.SessionManagement.Session.userdisplayname;
        this.convertedCards = new Array();
        this.INDEX = 0;
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
        cssForK2.use({ target: this.as.window.document.head, Id: "as-md-htmlrepeater" });
        this.as.window.document.head.appendChild(link);
    }
    convertListToHTMLRepeater(listControl) {
        let contents = undefined; //placeholder to insert the card contents
        let listControlElement = listControl.getHTMLElement();
        let jListControlElement = $(listControlElement);
        let originalDisplay = listControlElement.style.display;
        let newHTMLRepeater = this.createNewHTMLRepeater(listControlElement.parentElement);
        let width = jListControlElement.css("width");
        newHTMLRepeater.style.maxWidth = width;
        newHTMLRepeater.htmlContainerTemplate = "<div style='border:1px solid black;'>rows here: --rows--</div>";
        listControl.events.smartformEventPopulated.addEvent(() => {
            this.render(listControl, listControlElement, newHTMLRepeater, originalDisplay);
        });
        this.render(listControl, listControlElement, newHTMLRepeater, originalDisplay);
        console.log(newHTMLRepeater);
        if (contents)
            newHTMLRepeater.appendChild(contents);
        return newHTMLRepeater;
    }
    render(listControl, listControlElement, newHTMLRepeater, originalDisplay) {
        var _a, _b;
        let settings = this.findSettings(listControl);
        if (settings.enabled == true) {
            listControlElement.style.display = "none"; //immediately hide the control we are converting
            newHTMLRepeater.style.display = "block";
            if (settings.htmlTemplateRowSource) {
                let htmlControlRowTemplate = this.as.getControlsByName(settings.htmlTemplateRowSource, (_a = listControl.parent) === null || _a === void 0 ? void 0 : _a.name)[0];
                newHTMLRepeater.htmlRowTemplate = htmlControlRowTemplate.value || "<div>{{carMake}} - ${item.Joins[0].Folio}</div>";
            }
            if (settings.htmlTemplateContainerSource) {
                let htmlTemplateContainerSource = this.as.getControlsByName(settings.htmlTemplateContainerSource, (_b = listControl.parent) === null || _b === void 0 ? void 0 : _b.name)[0];
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
    getK2PropValueAsBoolean(value) {
        if (!value)
            return false;
        if (typeof value == "boolean")
            return value;
        return value == "true";
    }
    // dataBindButton(newCard: SuxMaterialdesignCard, control: IControl, newButton: MaterialDesignButton) {
    //   //add observer for changes to the buttons class, we need to use this to pick up things like disabled events
    //   //Watch for disabling of control event
    //   let classWatcher = new ClassWatcher(control.getHTMLElement(), 'disabled', ()=>{newButton.disabled=true;newCard.buttons = [...newCard.buttons]},()=>{newButton.disabled=false;newCard.buttons = [...newCard.buttons]});
    //   //force web-component to see change in array
    // }
    findSettings(control) {
        if (control) {
            let controlParentElement = control.getHTMLElement().parentElement;
            let parentControl = this.as.getControlFromElement(controlParentElement);
            let settingsControl = this.getControlsInControl(parentControl).find((c) => c.name.includes("as-settings"));
            if (settingsControl) {
                if (settingsControl.value) {
                    try {
                        return JSON.parse(settingsControl.value);
                    }
                    catch (err) {
                        console.warn("Error reading card settings: " + err);
                    }
                }
            }
        }
        return {};
    }
    dataBind(obj, prop, control) {
        if (control) {
            obj[prop] = control.value || "";
            control.events.smartformEventChanged.addEvent((e) => {
                obj[prop] = e.control.value || "";
            });
        }
    }
    createNewHTMLRepeater(element) {
        let htmlRepeater = new AsHtmlRepeater();
        htmlRepeater.elevation = 0;
        // newCard.style.all = "initial";
        htmlRepeater.style.overflow = "visible";
        element.appendChild(htmlRepeater);
        return htmlRepeater;
    }
    getHTMLRepeaterTargets() {
        return this.as
            .getControlsByNameContains(this.keyword);
    }
    getControlsInControl(parentControl) {
        let retValue = new Array();
        let IDs = new Array();
        //Get all the IDs in the contained control
        let parentElement = parentControl.getHTMLElement();
        [...parentElement.children].forEach((childEle) => {
            // let ctr = this.as.getControlsById(childEle.id,parentControl.parent?.name)[0]
            let ctr = this.as.getControlFromElement(childEle);
            if (ctr)
                retValue.push(ctr);
        });
        return retValue;
    }
    bindControlUpdates(control, obj) {
        control.events.smartformEventChanged.addEvent((e) => {
            console.log(e);
            console.log(obj);
        });
    }
}
//# sourceMappingURL=index.js.map