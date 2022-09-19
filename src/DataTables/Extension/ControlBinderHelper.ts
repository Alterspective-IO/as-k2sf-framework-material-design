
import { IViewInstance,IControl,Rule } from "@alterspective-io/as-k2sf-framework"
import { addEventToK2ControlToUpdateGridCurrentColumnRow } from ".";
import { ProcessedTarget, TargetType } from "../../Common/commonSettings";
import { executeK2RuleForEachRow, implementK2ControlToGridAction } from "./ControlExecutionHelpers";
import { AsMaterialdesignDatatableExtended, IPassPack } from "./interfaces";
import { IASK2DataTableSettings, DataGridExecutionActions } from "./settings";



  export function bingColumnsToK2Controls(
    target: ProcessedTarget<IViewInstance | IControl, IASK2DataTableSettings>,
    passPack: IPassPack
  ) {
    let thisViewInstance =
      target.type == TargetType.controls
        ? (target.referencedK2Object.parent as IViewInstance)
        : (target.referencedK2Object as IViewInstance);
    //add K2 Controls to columns with specified controls to bind to
    //TODO - make this a generic replacer
    passPack.processedSettings.optGrid?.columns.forEach((col) => {
      //First bind to explicitly set k2 controls set by the user
      if (col.k2control_to_bind_to) {
        col.dataBoundK2Controls = window.as.getControlsByConfigurationName(
          col.k2control_to_bind_to,
          thisViewInstance
        );
      }

      if (col.dataBoundK2Controls) {
        col.dataBoundK2Controls.forEach((boundControl) => {
          addEventToK2ControlToUpdateGridCurrentColumnRow(
            boundControl,
            col,
            passPack!
          );
        });
      }
    });

    //Then if we are auto binding to view controls then run through all columns
    addEventBindingToViewInstanceFieldControls(passPack);
  }


  export function addEventBindingToViewInstanceFieldControls(passPack: IPassPack) {
    let thisViewInstance = passPack.viewInstance;

    if (passPack!.processedSettings.autoBindToViewControls) {
      let foundFieldControls = thisViewInstance.controls!.filter(
        (c) => c.field?.name
      );

      for (let index = 0; index < foundFieldControls.length; index++) {
        const foundFieldControl = foundFieldControls[index];
        //If this control has not already been bound to a explicitly set column then do the even binding
        if (
          !passPack.processedSettings.optGrid?.columns.find((gc) =>
            gc.dataBoundK2Controls?.find((c) => c.id == foundFieldControl.id)
          )
        ) {
          if (foundFieldControl.field?.name) {
            addEventToK2ControlToUpdateGridCurrentRowData(
              foundFieldControl,
              foundFieldControl.field?.name,
              passPack
            );
          }
        }
      }
    }
  }


  /**
   * Implements all binding of K2 Controls and K2 Rules events and methods
   * @param dataTable
   */
   export function  implementK2ExecutionControlBindings(
    dataTable: AsMaterialdesignDatatableExtended
  ) {
    //Bind to Save Button Events
    implementSaveBinding(dataTable);

    //Bind to K2 Execute for Each Button Events
    implementK2ControlToGridAction(
      dataTable,
      dataTable.passPack?.processedSettings.execute_grid_method_runForEachChecked_on,
      async (event: any, eDataTable: AsMaterialdesignDatatableExtended) => {
        let data = eDataTable
          .passPack!.grid!.getData()
          .filter((d: any) => d._attributes.checked == true);
        await executeK2RuleForEachRow(
          eDataTable!.passPack!.processedSettings!.k2_rule_to_execute_for_each_checked,
          eDataTable.passPack!,
          data
        ).then((e: any) => {
          console.log(
            "TCL: after K2 rule executeForEachCheckedK2Control -> e",
            e
          );
        });
        if (
          eDataTable.passPack!.processedSettings!
            .default_grid_action_for_each_checked_item ==
          DataGridExecutionActions.Delete
        ) {
          eDataTable.passPack!.grid!.removeRows(data.map((d: any) => d.rowKey));
        }
      }
    );

    //Bind to K2 Export Button Event
    implementK2ControlToGridAction(
      dataTable,
      dataTable.passPack?.processedSettings.execute_grid_method_deleteSelectedRow_on,
      async (event: any, eDataTable: any) => {
        console.log("TCL: exportK2Control");
        if (eDataTable.passPack.grid) {
          let data = eDataTable.passPack.grid
            .getData()
            .filter((d: any) => d._attributes.checked == true);
          await executeK2RuleForEachRow(
            eDataTable.passPack.settings.k2RuleForEachChecked,
            eDataTable.passPack,
            data
          ).then((e: any) => {
            console.log("TCL: after K2 rule exportK2Control -> e", e);
          });
          if (
            eDataTable.passPack.settings.dataGridActionForEachChecked ==
            DataGridExecutionActions.Delete
          ) {
            eDataTable.passPack.grid.removeRows(data.map((d: any) => d.rowKey));
          }
        }
      }
    );

    implementK2ControlToGridAction(
      dataTable,
      dataTable.passPack?.processedSettings.execute_grid_method_appendNewRow_on,
      (event: any, edataTable: any) => {
        if (edataTable.passPack?.grid) {
          edataTable.passPack.grid.appendRow({}, { at: 0 });
          edataTable.passPack.grid.focusAt(0, 0, true);
        }
      }
    );

    implementK2ControlToGridAction(
      dataTable,
      dataTable.passPack?.processedSettings.execute_grid_method_export_on,
      (event: any, edataTable: AsMaterialdesignDatatableExtended) => {
        debugger;
        if (edataTable.passPack?.grid) {
          let exportSettings = {};
          if (edataTable.passPack.processedSettings.exportSettings) {
            debugger;
          }
        }
      }
    );
  }



  /**
   * Implements rules to execute when the K2 Control in settings.saveK2Control is clicked.
   * @param dataTable
   */
   export function implementSaveBinding(dataTable: AsMaterialdesignDatatableExtended) {
    implementK2ControlToGridAction(
      dataTable,
      dataTable.passPack?.processedSettings.execute_grid_method_saveModifiedData_on,
      async (event: any, eDataTable: any) => {
        if (eDataTable.passPack.grid) {
          let dataManager = (eDataTable.passPack.grid as any).dataManager;
          if (dataManager) {
            //Execute Update Rows
            await executeK2RuleForEachRow(
              eDataTable.passPack.settings.k2RuleForEachUpdated,
              eDataTable.passPack,
              dataManager.getAllModifiedData()["updatedRows"]
            );
            //Execute Create Rows
            await executeK2RuleForEachRow(
              eDataTable.passPack.settings.k2RuleForEachCreated,
              eDataTable.passPack,
              dataManager.getAllModifiedData()["createdRows"]
            );
            //Execute Delete Rows
            await executeK2RuleForEachRow(
              eDataTable.passPack.settings.k2RuleForEachDeleted,
              eDataTable.passPack,
              dataManager.getAllModifiedData()["deletedRows"]
            );
            //Execute Checked Rows
            await executeK2RuleForEachRow(
              eDataTable.passPack.settings.k2RuleForEachChecked,
              eDataTable.passPack,
              eDataTable.passPack.grid
                .getData()
                .filter((d: any) => d._attributes.checked == true)
            );
          }
        }
      }
    );
    }


  export function addEventToK2ControlToUpdateGridCurrentRowData(
    c: IControl,
    dataPropertyName: string,
    passPack: IPassPack
  ) {

    if(!passPack.dataTable) return

    let ruleId = c.id + passPack.dataTable.id + "OnChange"

    let callBack = (evt:CustomEvent<Rule>) => {
      console.log(evt.detail.name)
      let eventControl = evt.detail.parent as IControl;
      let rowData: any = {};
      if (passPack.currentRowKey != -1) {
        rowData = passPack.grid?.getRow(passPack.currentRowKey);
        if (!rowData) rowData = setEmptyRowData(passPack);
        let currentData = rowData[dataPropertyName];
        let currentDataAsString = currentData ? currentData.toString() : "";

        if (currentDataAsString != eventControl.value) {
          //only update if different
          rowData[dataPropertyName] = eventControl.value;
          //passPack.grid?.setValue(passPack.currentRowKey,rowDataFieldProperty, evt.detail.control.value)
          passPack.grid?.setRow(passPack.currentRowKey, rowData);
        }
      }
    }

   
    c.rules.OnChange?.addListener(ruleId,callBack);
  }


  function setEmptyRowData(passPack: IPassPack): unknown {
    let retValue: any = {};
    //first try copy an existing row
    let firstGridRow = passPack.grid?.getRow(0);
    if (firstGridRow) {
      for (const prop in firstGridRow) {
        retValue[prop] = null;
      }
    } else {
      //look if we have any smartobject data
      //if non
      //look in the grid columns
    }

    return retValue;
  }
