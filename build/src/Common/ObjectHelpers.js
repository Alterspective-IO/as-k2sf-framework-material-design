/*
 * Recursively merge properties of two objects
 */
export function applySettingsToObject(primary, settings, priorityTo = "settings", parent, parentKey) {
    var _a;
    if ((_a = window.alterspective) === null || _a === void 0 ? void 0 : _a.Framework) {
        if (settings instanceof window.alterspective.Framework)
            return;
    }
    for (var p in settings) {
        if (p == "passPack")
            continue;
        if (p == "extraInfo")
            continue;
        try {
            // Property in destination object set; update its value.
            //if ( settings[p].constructor==Object ) {
            if (typeof settings[p] == "object") {
                //primary[p] = applySettingsToObject(primary[p], settings[p], priorityTo);
                if (typeof primary[p] == "undefined") {
                    primary[p] = settings[p];
                }
                else {
                    applySettingsToObject(primary[p], settings[p], priorityTo, primary, p);
                }
            }
            else {
                if (typeof primary[p] == "undefined")
                    primary[p] = settings[p];
                if (priorityTo == "settings") {
                    primary[p] = settings[p]; //if priority to settings then set it
                }
            }
        }
        catch (e) {
            // Property in destination object not set; create it and set its value.
            primary[p] = settings[p];
        }
    }
}
//# sourceMappingURL=ObjectHelpers.js.map