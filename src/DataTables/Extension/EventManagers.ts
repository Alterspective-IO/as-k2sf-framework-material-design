import { IViewInstance, Log, ViewInstanceEventTypeOption ,IControl} from "@alterspective-io/as-k2sf-framework"

import { TargetType } from "../../Common/commonSettings";
import { IPassPack } from "./interfaces";



export function attachToSmartObjectsRefreshedEvent(passPack: IPassPack, callback: (passPack:IPassPack)=>void) {
    let target = passPack.target
    
    if (target.type == TargetType.controls) {
      (target.referencedK2Object as IControl).rules.Populating?.addListener(target.referencedK2Object.id + passPack.extension.tagName,
        (evt) => {
          Log("Testing populating", { color: "red", data: evt });
        }
      );

      (
        target.referencedK2Object as IControl
      ).events.smartformEventPopulated.addEvent(
        () => {
            callback(passPack);
        },
        null,
        `renderDataTable`
      );
    } else {
      (target.referencedK2Object as IViewInstance).addListener(
        ViewInstanceEventTypeOption.list,
        (e) => {
          console.log(e);
          callback(passPack);
        }
      );
    }
  }