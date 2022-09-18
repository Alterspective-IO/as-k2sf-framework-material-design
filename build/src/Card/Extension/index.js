import { ControlType, EventTimingOption } from "asFramework/src/index";
import { SuxMaterialdesignCard } from "alterspective-k2-smartfroms/dist/components/sux-materialdesign-card";
import { MaterialDesignIcons } from "alterspective-k2-smartfroms/dist/components";
import cssForK2 from "./extension.css";
import { dataBind } from "../../Common/controlHelpers";
import { AS_MaterialDesign_TagNames, TargetType } from "../../Common/commonSettings";
import { getControlSiblingSettings } from "../../Common/settings.Helper";
import { applySettingsToObject } from "../../Common/ObjectHelpers";
export class simpliedMaterialCardExtension {
    constructor(as) {
        //Dependencies - adjust names as required
        this.keyword = AS_MaterialDesign_TagNames.card;
        this.dependantViewName = "Simplied.Card";
        this.currentUserFQN = SourceCode.Forms.SessionManagement.Session.userfqn;
        this.currentUserDisplayName = SourceCode.Forms.SessionManagement.Session.userdisplayname;
        this.convertedCards = new Array();
        this.INDEX = 0;
        this.as = as;
        console.log("simpliedMaterialCardExtension Card Constructor()");
        this.addDependantTopLevelStyles();
        this.materialTables = this.getMaterialTableControls();
        console.log(`${this.materialTables.length} - tables to convert`);
        this.materialTables.forEach((tbl) => {
            this.convertedCards.push({
                table: tbl,
                suxCard: this.convertTableToCard(tbl),
            });
        });
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
    convertTableToCard(tbl) {
        let contents = undefined; //placeholder to insert the card contents
        let tblElement = tbl.getHTMLElement();
        let jTblElement = $(tblElement);
        let suxCardButtons = new Array();
        tblElement.style.display = "none"; //immediately hide the table we are converting
        let htmlRows = tblElement.children; //get all the roes in the table
        console.log(`Rows found ${htmlRows.length}`);
        //Create the card and return the references
        let newCard = this.createNewCard(tblElement.parentElement, tbl);
        //get the tables set width
        let width = jTblElement[0].style.width;
        console.log("TCL: simpliedMaterialCardExtension -> width", width);
        newCard.style.width = width;
        newCard.style.maxWidth = width;
        //newCard.parentElement!.parentElement!.appendChild(newCard)
        //Media, Title, Content, Buttons
        //TODO: add intelligence to derive the sections
        let firstRow = this.as.getControlFromElement(htmlRows[0]);
        let mediaSection = this.as.getControlFromElement(htmlRows[0]);
        let titleSection = this.as.getControlFromElement(htmlRows[0]);
        let contentSection = this.as.getControlFromElement(htmlRows[1]);
        let buttonsSection = this.as.getControlFromElement(htmlRows[2]);
        //set visability and add monitoring 
        this.validateControlVisability(tbl, newCard);
        tbl.addPropertyListener("SetProperty", EventTimingOption.after, e => {
            tblElement.style.display = "none"; //always make sure origional table element is hidden 
            this.validateControlVisability(tbl, newCard);
        });
        this.findAndImplementSettings(tbl, newCard);
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
                var _a;
                if (control) {
                    let newButton = {
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
                    control.addPropertyListener("SetProperty", EventTimingOption.after, (evt) => {
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
                    (_a = newCard.buttons) === null || _a === void 0 ? void 0 : _a.push(newButton);
                    suxCardButtons.push({
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
        if (contents)
            newCard.appendChild(contents);
        return {
            suxCard: newCard,
            titleSection: titleSection,
            contentSection: contentSection,
            mediaSection: mediaSection,
            buttonsSection: buttonsSection,
            suxCardButtons: suxCardButtons,
        };
    }
    validateControlVisability(tblControl, card) {
        let isVisable = tblControl.getControlPropertyValue("isvisible");
        if (isVisable)
            card.style.display = "block";
        else
            card.style.display = "none";
    }
    mapAgainstK2Button(control, materialButton) {
        let clickFunc = () => {
            var _a;
            (_a = control.rules.OnClick) === null || _a === void 0 ? void 0 : _a.execute();
        };
        //console.log(control.name);
        let controlText = control.getControlPropertyValue("Text");
        // console.log(
        // "TCL: simpliedMaterialCardExtension -> controlText:",
        // controlText
        // );
        let controlIsEnabled = this.getK2PropValueAsBoolean(control.getControlPropertyValue("IsEnabled"));
        // console.log(
        // "TCL: simpliedMaterialCardExtension -> control.controlIsEnabled",
        // control.getControlPropertyValue("IsEnabled")
        // );
        // console.log(
        // "TCL: simpliedMaterialCardExtension -> controlIsEnabled:",
        // controlIsEnabled
        // );
        let controlIsVisible = this.getK2PropValueAsBoolean(control.getControlPropertyValue("IsVisible"));
        // console.log(
        // "TCL: simpliedMaterialCardExtension -> control.controlIsVisible",
        // control.getControlPropertyValue("IsVisible")
        // );
        // console.log(
        // "TCL: simpliedMaterialCardExtension -> controlIsVisible:",
        // controlIsVisible
        // );
        // debugger;
        let { foundValue, textExcludingValue } = this.regexExtractor(controlText);
        controlText = textExcludingValue;
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
            materialButton.style.display = "none";
        }
        let k2ControlBackgroundColor = "";
        let k2ControlColor = "";
        //Get k2 control color settings
        k2ControlBackgroundColor = $(control.getHTMLElement()).css("backgroundColor") || "";
        k2ControlColor = $(control.getHTMLElement()).css("color") || "";
        let primary = k2ControlBackgroundColor;
        let onPrimary = k2ControlColor;
        let isStdButton = false;
        let buttonStyle = control.getControlPropertyValue("ButtonStyle");
        switch (buttonStyle) {
            case "destructiveaction":
                // (window as any).test  = $(k2Button.getHTMLElement())
                materialButton.unelevated = true;
                break;
            case "quietaction":
                primary = k2ControlColor;
                onPrimary = ""; //ignored for outlined
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
        if (!jElement.css("backgroundColor").includes("rgba") &&
            !jElement.css("color").includes("rgba")) {
            materialButton.style["--mdc-theme-primary"] = primary;
            materialButton.style["--mdc-theme-on-primary"] = onPrimary;
        }
        else {
            console.warn("RGBA!!!");
            materialButton.style["--mdc-theme-primary"] = "rgb(255,255,255)";
            materialButton.style["--mdc-theme-primary"] = k2ControlColor;
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
    // private findAndImplementSettings(
    //   firstRow: IControl | undefined,
    //   newCard: SuxMaterialdesignCard
    // ) {
    //   if (firstRow) {
    //     let settingsControl = this.getControlsInControl(firstRow!).find((c) =>
    //       c.name.includes("sux-card-settings")
    //     );
    //     if (settingsControl) {       
    //         applySettings(newCard, settingsControl);      
    //     }
    //   }
    // }
    findAndImplementSettings(control, newCard) {
        var _a, _b;
        let siblingControlSettingsResult = getControlSiblingSettings(control, AS_MaterialDesign_TagNames.card, TargetType.controls);
        let settings = siblingControlSettingsResult.settings;
        applySettingsToObject(newCard, settings);
        if (siblingControlSettingsResult.settingsControl) {
            (_b = (_a = siblingControlSettingsResult.settingsControl.rules) === null || _a === void 0 ? void 0 : _a.OnChange) === null || _b === void 0 ? void 0 : _b.addListener(control.id + "md-card", () => {
                this.findAndImplementSettings(control, newCard);
            });
        }
        // if (settingsControl) {       
        //     applySettings(newCard, settingsControl);      
        // }
    }
    regexExtractor(text) {
        let foundValue;
        let textExcludingValue = text;
        // var regex = /(?<=\()(.*?)(?=\))/; //<-- safari doesnt like
        var regex = /(?:\()(.*?)(?:\))/;
        const found = text.match(regex);
        if (found) {
            if (found[0]) {
                foundValue = found[0];
                textExcludingValue = textExcludingValue.replace(`(${found[0]})`, "");
            }
        }
        return { foundValue, textExcludingValue };
    }
    iconTextDeriver(text) {
        text = text.toLocaleLowerCase();
        let ret = MaterialDesignIcons[text];
        return ret;
    }
    createNewCard(element, control) {
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
        let newCard = new SuxMaterialdesignCard();
        newCard.elevation = 0;
        // newCard.style.all = "initial";
        // newCard.style.overflow = "visible";
        //  newCard.style.filter="drop-shadow(30px 10px 4px #4444dd)"
        // newCard.style.fontSizeAdjust;
        element.insertBefore(newCard, control.getHTMLElement());
        // element.appendChild(newCard);
        // let html = (
        //   <sux-materialdesign-card ref={cardRef}>
        //     <div
        //       ref={contentRef}
        //       class={"mdc-elevation--z21"}
        //       style={"width:100%;max-width:400px;margin:5px"}
        //     ></div>
        //   </sux-materialdesign-card>
        // );
        //render(html, element);
        return newCard;
    }
    getMaterialTableControls() {
        return this.as
            .getControlsByNameContains(this.keyword)
            .filter((c) => c.type == ControlType.Table);
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