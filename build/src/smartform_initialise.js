"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield import("https://k2ux.simplied.io/MaterialDesignForK2/dist/main.alterspective.materialdesignforK2.js").then(() => {
        main_alterspective_materialdesignforK2.initialize();
        console.log("Material Design for K2 Loaded..");
    });
}))();
//# sourceMappingURL=smartform_initialise.js.map