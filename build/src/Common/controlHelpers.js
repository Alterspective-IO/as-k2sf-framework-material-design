export function getControlsInControl(parentControl) {
    let retValue = new Array();
    let IDs = new Array();
    //Get all the IDs in the contained control
    let parentElement = parentControl.getHTMLElement();
    [...parentElement.children].forEach((childEle) => {
        // let ctr = this.as.getControlsById(childEle.id,parentControl.parent?.name)[0]
        let foundElementWithId = findElementId(childEle);
        if (foundElementWithId) {
            let ctr = parentControl._as.getControlFromElement(foundElementWithId);
            if (ctr) {
                retValue.push(ctr);
            }
        }
    });
    return retValue;
}
//Sometimes a cell wraps a control in outer div tag so we need to recursively search for controls in a console
export function findElementId(element) {
    if (element.id)
        if (element.id.length > 0) {
            return element;
        }
    for (let index = 0; index < element.children.length; index++) {
        const childEle = element.children[index];
        let searchedElement = findElementId(childEle);
        if (searchedElement) {
            console.log("found :" + searchedElement.id);
            return searchedElement;
        }
    }
    return null;
}
// export function bindControlUpdates(control: IControl, obj: object) {
//   control.events.smartformEventChanged.addEvent((e: any) => {
//     console.log(e);
//     console.log(obj);
//   });
// }
export function dataBind(obj, prop, control) {
    var _a;
    if (control) {
        obj[prop] = control.value || "";
        (_a = control.rules.OnChange) === null || _a === void 0 ? void 0 : _a.addListener(control.id + "_mdcard", e => {
            obj[prop] = e.detail.parent.value || "";
        });
        // control.events.smartformEventChanged.addEvent((e: any) => {
        //   obj[prop] = e.control.value || "";
        // });
    }
}
export function applySettings(newCard, settingsControl) {
    try {
        if (settingsControl.value) {
            Object.assign(newCard, JSON.parse(settingsControl.value));
        }
        settingsControl.events.smartformEventChanged.addEvent((e) => {
            Object.assign(newCard, JSON.parse(e.control.value));
        });
    }
    catch (err) {
        console.warn("Error reading card settings: " + err);
    }
}
export function getJsonFromControlValue(control) {
    let retValue;
    if (!control)
        return undefined;
    if (!control.value)
        return undefined;
    return getJsonFromString(control.value, control);
}
export function getJsonFromString(str, controlInfoReference) {
    var _a, _b;
    if (!str)
        return undefined;
    let retValue;
    try {
        retValue = JSON.parse(str);
    }
    catch (ex) {
        if (controlInfoReference) {
            console.warn(`Error extracting JSON (settings) from control [${controlInfoReference.name}] on [${(_a = controlInfoReference.parent) === null || _a === void 0 ? void 0 : _a.name}]`, ex);
            console.warn(`control [${controlInfoReference.name}] on [${(_b = controlInfoReference.parent) === null || _b === void 0 ? void 0 : _b.name}] found value was`, controlInfoReference.value);
        }
        else {
            console.warn(`Error extracting JSON (settings) from value [${str}]`, ex);
        }
    }
    return retValue;
}
//# sourceMappingURL=controlHelpers.js.map