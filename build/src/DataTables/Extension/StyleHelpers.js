export function applyCustomStylings(passPack, newDataTable) {
    var _a;
    if (passPack.processedSettings.customStyle) {
        let customStyle = Array.isArray(passPack.processedSettings.customStyle)
            ? passPack.processedSettings.customStyle.join(" ")
            : passPack.processedSettings.customStyle;
        let newStyle = document.createElement("style");
        newStyle.id = "as-datagrid-custom-style";
        newStyle.innerHTML = customStyle;
        (_a = newDataTable.querySelector("#as-datagrid-custom-style")) === null || _a === void 0 ? void 0 : _a.remove();
        newDataTable.appendChild(newStyle);
    }
}
//# sourceMappingURL=StyleHelpers.js.map