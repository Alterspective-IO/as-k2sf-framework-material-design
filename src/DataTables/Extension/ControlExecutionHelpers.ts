import { EmittedControlEvent } from "asFramework/src/index";
import { method } from "lodash";
import { AsMaterialdesignDatatableExtended, IPassPack } from "./interfaces";

/**
 * Sets the databound K2 Controls for each row in the data array and executes all K2 rules based on the configurationName
 * @param ruleConfigurationName - the configuration name of the rule to execute "name" | "name,viewInstanceName" | "name,current" for the current ViewInstance
 * @param passPack
 * @param dataArray
 * @returns
 */
export async function executeK2RuleForEachRow(
  ruleConfigurationName: string | undefined,
  passPack: IPassPack,
  dataArray: Array<any>
) {
  console.log(
    "TCL: executeK2RuleForEachRow -> k2RuleToExecuteForEachRow",
    ruleConfigurationName
  );
  if (!dataArray) return;
  if (dataArray.length == 0) return;

  if (ruleConfigurationName) {
    let rules = window.as.getRulesByConfigurationName(
      ruleConfigurationName,
      passPack.viewInstance
    );
    if (rules.length > 0) {
      let modifiedRows: Array<any> = dataArray;
      for (let index = 0; index < modifiedRows.length; index++) {
        const modifiedRow = modifiedRows[index];
        console.log("TCL: executeK2RuleForEachRow -> modifiedRow", modifiedRow);
        updateAllK2ControlsBoundToGridColumns(passPack, modifiedRow); //Update all bound K2 Rules to the current data row
        //execute the rules synchronously
        for (let index = 0; index < rules.length; index++) {
          const rule = rules[index];
          console.log("TCL: executeK2RuleForEachRow -> rule", rule);
          await rule.execute();
        }
      }
    }
  }
}

/**
 * Updates the value of K2 Controls with the passed in data, both implicitly bound controls in Column settings.optGrid.Column[].k2Control and auto bound ViewInstance controls
 * when settings.autoBindToViewControls=true
 * @param pack
 * @param dataObject :  a single instance of some name value type JSON data
 */
export function updateAllK2ControlsBoundToGridColumns(
  pack: IPassPack,
  dataObject: any
) {
  //todo check working 100%
  // console.log(`bindRowDataToK2Controls -> rowData :`, dataObject);
  if (pack.processedSettings.autoBindToViewControls == true)
    window.as.updateK2ControlsWithViewSmartObjectFields(
      pack.viewInstance,
      dataObject
    );
  updateK2ControlsAppliedInColumnSettings(pack, dataObject);
}

/**
 * Updates all K2 controls that have been configured in settings.OptGrid.column[].k2Control
 * @param pack
 * @param dataObject - a single instance of some name value type JSON data
 */
function updateK2ControlsAppliedInColumnSettings(
  pack: IPassPack,
  dataObject: any
) {
  for (
    let index = 0;
    index < pack.processedSettings.optGrid!.columns.length;
    index++
  ) {
    const col = pack.processedSettings.optGrid!.columns[index];
    const k2control_to_bind_to = col.k2control_to_bind_to; //get the K2 control to push data to from the column settings
    if (k2control_to_bind_to) {
      //if we find one then update the control
      try {
        let colRowData = dataObject[col.name];
        window.as
          .getControlsByConfigurationName(
            k2control_to_bind_to,
            pack.viewInstance
          )
          .forEach((c) => (c.value = colRowData || ""));
      } catch (err) {
        console.warn(err);
      }
    }
  }
}

/**
 * Attach to K2 events and execute method passing in the event and passPack
 * Ensures that the event is always the latest and no duplicated events are attached using the EventId `MdDataTable${passPack.control.id}`
 * @param dataTable
 * @param k2ConfigurationName - format [rule|control:name,viewInstance] or [rule|control:name] or  [rule|control:name,current] for current view instance
 * @param method
 */
export function implementK2ControlToGridAction(
  dataTable: AsMaterialdesignDatatableExtended,
  k2ConfigurationName: string | undefined,
  method: Function
) {
  let passPack = dataTable.passPack!;
  if (k2ConfigurationName)
    if (k2ConfigurationName.length > 0) {
      let attachType = k2ConfigurationName.split(":")[0];
      let nameAndView = k2ConfigurationName.split(":")[1];

      if (!nameAndView) {
        //Means we dont have the format type:name,view so default to control at the type
        attachType = "control";
        nameAndView = k2ConfigurationName;
      }

      if (attachType == "control") {
        window.as
          .getControlsByConfigurationName(
            nameAndView,
            dataTable.passPack!.viewInstance
          )
          .forEach(async (c) => {
            console.log(
              "TCL: implementK2ControlToGridAction -> add event to  -> c",
              c
            );
            c.events.smartFormEventClick.addEvent(
              async (e: EmittedControlEvent) => {
                console.log(
                  "TCL: event -> implementK2ControlToGridAction -> e",
                  e
                );
                method(e, dataTable);
              },
              null,
              `MdDataTable${passPack.target.referencedK2Object.id}`
            );
          });
      } else {
        // this.as
        // .getRulesByConfigurationName(nameAndView, dataTable.passPack!.control.parent as IViewInstance)
        // .forEach(async (c) => {
        //   console.log("TCL: implementK2ControlToGridAction -> add event to  -> c", c);
        //   c.handlers
        //   c.events.smartFormEventClick.addEvent(
        //     async (e: EmittedControlEvent) => {
        //       console.log("TCL: event -> implementK2ControlToGridAction -> e", e);
        //             method(e,dataTable);
        //     },
        //     null,
        //     `MdDataTable${passPack.control.id}`
        //   );
        // });
      }
    }
}
