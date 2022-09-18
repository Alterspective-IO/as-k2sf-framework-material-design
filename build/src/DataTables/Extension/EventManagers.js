import { Log, ViewInstanceEventTypeOption } from "asFramework/src/index";
import { TargetType } from "../../Common/commonSettings";
export function attachToSmartObjectsRefreshedEvent(passPack, callback) {
    var _a;
    let target = passPack.target;
    if (target.type == TargetType.controls) {
        (_a = target.referencedK2Object.rules.Populating) === null || _a === void 0 ? void 0 : _a.addListener(target.referencedK2Object.id + passPack.extension.tagName, (evt) => {
            Log("Testing populating", { color: "red", data: evt });
        });
        target.referencedK2Object.events.smartformEventPopulated.addEvent(() => {
            callback(passPack);
        }, null, `renderDataTable`);
    }
    else {
        target.referencedK2Object.addListener(ViewInstanceEventTypeOption.list, (e) => {
            console.log(e);
            callback(passPack);
        });
    }
}
//# sourceMappingURL=EventManagers.js.map