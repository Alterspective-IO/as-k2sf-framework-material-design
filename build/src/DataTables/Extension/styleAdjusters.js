import * as _ from "lodash";
function overserverCallback(mutations, observer) {
    // console.log(`overserverCallback`);
    let extendedObserver = observer;
    observer.disconnect(); //maybe implement disconnect all observers?
    //run all fixers
    extendedObserver.alterpsective.extension.fixers.forEach((f) => {
        f(extendedObserver.alterpsective.extension.passPack, extendedObserver.alterpsective.extension.targetSelector);
    });
    //start observing again
    let newObserver = new ObserverExtension(extendedObserver.alterpsective.extension);
    newObserver.observe();
}
class ObserverExtension extends MutationObserver {
    constructor(extension) {
        var _a, _b;
        super(overserverCallback);
        this.enabled = true;
        this.alterpsective = {
            extension: extension,
        };
        let as = this.alterpsective.extension;
        this.counterId = ObserverExtension.counter++;
        // console.log(`New Observer ${this.counterId}`);
        let existing = ObserverExtension.observerExtensionCollection.filter((o) => { var _a, _b; return o.observer.alterpsective.extension.targetSelector == extension.targetSelector && ((_a = o.passPack.dataTable) === null || _a === void 0 ? void 0 : _a.id) == ((_b = extension.passPack.dataTable) === null || _b === void 0 ? void 0 : _b.id); });
        if (existing.length > 0) {
            console.log(`${existing.length} already watching`);
        }
        ObserverExtension.observerExtensionCollection.push({ passPack: this.alterpsective.extension.passPack, observer: this });
        // console.log(`Adding ${as.targetSelector} to oversevers`);
        this.targetElement =
            (_b = (_a = this.alterpsective.extension.passPack) === null || _a === void 0 ? void 0 : _a.dataTable) === null || _b === void 0 ? void 0 : _b.querySelector(as.targetSelector);
        if (this.targetElement == null) {
            console.error(`Cannot watch for changed on ${as.passPack.target.referencedK2Object.containerType} ${as.passPack.target.referencedK2Object.name} target select [${as.targetSelector}] as it is undefined `);
            return;
        }
    }
    observe() {
        if (this.targetElement != null) {
            super.observe(this.targetElement, this.alterpsective.extension.options);
        }
    }
    disconnect() {
        _.remove(ObserverExtension.observerExtensionCollection, (o) => {
            var _a, _b;
            return o.observer.alterpsective.extension.targetSelector ==
                this.alterpsective.extension.targetSelector && ((_a = o.passPack.dataTable) === null || _a === void 0 ? void 0 : _a.id) == ((_b = this.alterpsective.extension.passPack.dataTable) === null || _b === void 0 ? void 0 : _b.id);
        });
        // console.log(
        //   `Removing ${this.alterpsective.extension.targetSelector} from oversevers`
        // );
        super.disconnect();
    }
}
ObserverExtension.observerExtensionCollection = new Array();
ObserverExtension.counter = 1;
function fixAndObserveContinues(passPack, selector, fixers) {
    //run fixers
    fixers.forEach((f) => {
        f(passPack, selector);
    });
    const config = { attributes: false, childList: true, subtree: true };
    const observer = new ObserverExtension({
        targetSelector: selector,
        passPack: passPack,
        fixers: fixers,
        options: { attributes: true, childList: true, subtree: true },
    });
    observer.observe();
}
let applySortAndFilterToNewLine = (passPack, selector) => {
    //#region applySortAndFilterToNewLine
    //Note:Commented out as to complex and better set using CSS rules 
    // if(passPack.processedSettings.applySortAndFilterToNewLine==false) return;
    // passPack.dataTable?.querySelectorAll(".tui-grid-cell-header")
    //   .forEach((ele) => {
    //     let exitingDiv: HTMLDivElement | undefined;
    //     if (
    //       ele.getElementsByTagName("div").length > 0 &&
    //       ele.childNodes.length > 1
    //     ) {
    //       exitingDiv = ele.getElementsByTagName("div")[0];
    //     }
    //     let aTags = ele.querySelectorAll(":scope > a")
    //     if (!exitingDiv) {
    //       exitingDiv = document.createElement("div");
    //       exitingDiv.classList.add("as-newline");
    //     }
    //     //If the div doesnt have kids we need to add then, but if it does and so does the parent then we need to remove the ones from the partent.
    //     if (exitingDiv.children.length == 0) {
    //       aTags.forEach((aTag) => {
    //         if (exitingDiv) exitingDiv.appendChild(aTag);
    //       });
    //     }
    //     else
    //     {
    //       aTags.forEach(aTag=>
    //         {
    //           aTag.remove()
    //         })
    //     }
    //     ele.appendChild(exitingDiv);
    //   });
    //#endregion
};
let adjustHeaderHeight = (passPack, selector) => {
    var _a, _b;
    if (!((_b = (_a = passPack.processedSettings.optGrid) === null || _a === void 0 ? void 0 : _a.header) === null || _b === void 0 ? void 0 : _b.height)) {
        if (!passPack.dataTable)
            return;
        let tuiGridHeaderArea = passPack.dataTable.querySelectorAll(".tui-grid-header-area");
        tuiGridHeaderArea.forEach((n) => {
            n.style.height = "max-content";
        });
        // console.log("fixing table height", tuiGridHeaderArea);
    }
};
export function watchAndApplyStyle(passPack) {
    //Header Styling Watch
    //let headerElementToWatch = passPack.dataTable.querySelectorAll(".tui-grid-header-area")
    fixAndObserveContinues(passPack, ".tui-grid-header-area", [
        adjustHeaderHeight,
        applySortAndFilterToNewLine,
    ]);
}
//# sourceMappingURL=styleAdjusters.js.map