import { AS_MaterialDesign_TagNames } from "../Common/commonSettings";
export class alterspectiveMaterialDesignIconExtension {
    constructor(as) {
        //Dependencies - adjust names as required
        this.keyword = AS_MaterialDesign_TagNames.icon;
        as.collections.viewInstanceControls.filter(c => c.name.toLocaleLowerCase().includes(this.keyword)).forEach(c => {
            var _a, _b;
            console.log("got");
            let settings = (_a = c.value) === null || _a === void 0 ? void 0 : _a.split(" ");
            if (settings) {
                let iconName = settings[0] || "";
                let iconSize = settings[1] || "";
                let newIcon = document.createElement("mwc-icon");
                if (iconSize) {
                    // newIcon.style.color = "#03a9f4";
                    newIcon.style.setProperty("--mdc-icon-size", iconSize);
                }
                newIcon.append(iconName);
                (_b = c.getHTMLElement().parentElement) === null || _b === void 0 ? void 0 : _b.replaceChild(newIcon, c.getHTMLElement());
            }
        });
    }
}
//# sourceMappingURL=index.js.map