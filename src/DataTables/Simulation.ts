import { ListViewInstance } from "../../framework/src";
import { TargetType } from "../Common/commonSettings";
import { IPassPack, RowExtended } from "./Extension/interfaces";


export function simulateUserActionAgainstListView(
    passPack: IPassPack,
    rowKey: number,
    action: "dblclick" | "click"
  ) {
    if (passPack.target.type != TargetType.views) return; //this is only for converted list views
    let rowData = passPack.grid?.getRow(rowKey) as RowExtended;
    if (!rowData) return;
    if (passPack.target.type == TargetType.views) {
      let counter = rowData._linkedHiddenHash?.counter;
      if (counter) {
        passPack.viewInstance
          .as(ListViewInstance)
          .simulateUserEventAgainstCounterRow(counter, action);
      }
    }
  }