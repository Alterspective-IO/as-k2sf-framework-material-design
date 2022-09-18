var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Framework from "asFramework/src/index";
import { simpliedMaterialCardExtension } from "./Card/Extension";
import { displayFormIfHidden, removeOverflows } from "./Common/StyleHelper";
import { alterspectiveDataTableExtension } from "./DataTables/Extension";
import { addBirdsEffect } from "./demoBirds";
import { alterspectiveExpanderExtension } from "./Expander/Extension";
import { alterspectiveHtmlRepeaterExtension } from "./HTMLRepeater/Extension";
import { alterspectiveMaterialDesignIconExtension } from "./Icons";
// export { Framework } from "asframework/src/Models/framework"
export * as TestSettingHelper from "./Common/settings.Helper";
console.log("simpliedUX Card extension script has loaded");
export { Framework };
let initialised = false;
export const initialize = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (initialised == true)
        return;
    initialised = true;
    let promiseArray = new Array();
    promiseArray.push(Framework.Extensions.registerExtensionModule("dataTableExtension", alterspectiveDataTableExtension).then((m) => {
        console.log("htmlRepeaterExtension - initialized");
        return m;
    }));
    promiseArray.push(Framework.Extensions.registerExtensionModule("materialCardExtension", simpliedMaterialCardExtension).then((m) => {
        console.log("materialCardExtension - initialized");
        return m;
    }));
    promiseArray.push(Framework.Extensions.registerExtensionModule("materialIconExtension", alterspectiveMaterialDesignIconExtension).then((m) => {
        console.log("alterspectiveMaterialDesignIconExtension - initialized");
        return m;
    }));
    promiseArray.push(Framework.Extensions.registerExtensionModule("htmlRepeaterExtension", alterspectiveHtmlRepeaterExtension).then((m) => {
        console.log("htmlRepeaterExtension - initialized");
        return m;
    }));
    promiseArray.push(Framework.Extensions.registerExtensionModule("materialExpander", alterspectiveExpanderExtension).then((m) => {
        console.log("materialExpander - initialized");
        return m;
    }));
    let promissesBack = yield Promise.all(promiseArray);
    displayFormIfHidden();
    removeOverflows();
    addBirdsEffect();
    console.log("------------------- All Alterspective Material Design Modules Initialized  -----------------");
    if ((_a = promissesBack[0]) === null || _a === void 0 ? void 0 : _a.as) {
        return promissesBack[0].as;
    }
});
initialize();
//# sourceMappingURL=index.js.map