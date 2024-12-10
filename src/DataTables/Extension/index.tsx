import cssForK2 from "./extension.css";
import * as _ from "lodash";
import {
  IPassPack,
  OptColumnExtended,
  AsMaterialdesignDatatableExtended,
  convertedListControls,
  RowExtended,
} from "./interfaces";

import {
  AsDataTableExtensionSettings,
  IASK2DataTableSettings,
  DataGridExecutionActions,
} from "./settings";

import { applySettingsToObject } from "../../Common/ObjectHelpers";
import { addDependantTopLevelStyles } from "../../Common/StyleHelper";
// import { Log, LogIn, LogOut } from "../../Common/Logging";

import {
  AS_MaterialDesign_TagNames,
  ProcessedTarget,
  ProcessedTargets,
  TargetType,
} from "../../Common/commonSettings";

// import { IFramework, LogType, Log, PerformanceSession,  IControl, IViewInstance, ListViewInstance, ISmartObject } from "@alterspective-io/as-k2sf-framework"
import { configureColumns } from "./ColumnConfigurators";
import {
  insertGridUsingControl,
  insertGridUsingListView,
} from "./DataTablePlacement";
import { attachToSmartObjectsRefreshedEvent } from "./EventManagers";
import { applyDefaultSettings } from "./SettingsHelper";
import {
  addCustomGridMethodBindings,
  bingColumnsToK2Controls,
  implementK2ExecutionControlBindings,
} from "./ControlBinderHelper";
import { convertExpressions, convertRenderers } from "./expressionConverters";
import { applyCustomStylings } from "./StyleHelpers";
import { updateAllK2ControlsBoundToGridColumns } from "./ControlExecutionHelpers";
import {
  getProcessedTargetsForTagName,
  refreshSettings,
  setupCallbackForWhenTagSettingsChange,
} from "../../Common/settings.Helper";
import {
  IFramework,
  PerformanceSession,
  LogType,
  IControl,
  IViewInstance,
  Log,
  ISmartObject,
  ListViewInstance,
} from "../../../framework/src";
import { simulateUserActionAgainstListView } from "../Simulation";

// import { AsMaterialdesignDatatable } from "alterspective-k2-smartfroms";
declare global {
  var SourceCode: any;
}

export class alterspectiveDataTableExtension {
  //Dependencies - adjust names as required
  tagName = AS_MaterialDesign_TagNames.dataTable;
  DataTable?: AsMaterialdesignDatatableExtended;
  as: IFramework;
  // dependantViewName = "Alterspective.DataTable";
  currentUserFQN = SourceCode.Forms.SessionManagement.Session.userfqn;
  currentUserDisplayName =
    SourceCode.Forms.SessionManagement.Session.userdisplayname;

  public convertedTargets = new Array<convertedListControls>();

  targets: ProcessedTargets | undefined;
  INDEX = 0;
  name: any;
  extensionSettings: AsDataTableExtensionSettings | undefined;

  constructor(as: IFramework) {
    this.as = as;
    let p1 = new PerformanceSession(
      "alterspectiveDataTableExtension",
      LogType.extensions
    );

    setupCallbackForWhenTagSettingsChange(
      this.as,
      this.tagName,
      this.tagSettingsChangedEvent.bind(this)
    );

    this.implementStylingRules();

    // this.targets.controls.forEach((target) => {
    //   this.convertedTargets.push({
    //     target: target,
    //     dataTable: this.convertTargetToDataTable(target),
    //   });
    // });
    // this.targets.viewsInstances.forEach((target) => {
    //   this.convertedTargets.push({
    //     target: target,
    //     dataTable: this.convertTargetToDataTable(target),
    //   });
    // });

    this.applyTargets();

    p1.finish();
  }

  applyTargets() {
    let processedTargetsAndExtensionSettings = getProcessedTargetsForTagName(
      this.as,
      this.tagName
    );
    this.targets = processedTargetsAndExtensionSettings.processedTargets;
    this.extensionSettings = new AsDataTableExtensionSettings(); //create new extension setting with defaults
    applySettingsToObject(
      this.extensionSettings,
      processedTargetsAndExtensionSettings.extensionSettings
    ); //merge in anu users extension settings

    this.targets.controls.forEach((target) => {
      this.convertedTargets.push({
        info: this.convertTargetToDataTable(target),
      });
    });
    this.targets.viewsInstances.forEach((target) => {
      this.convertedTargets.push({
        info: this.convertTargetToDataTable(target),
      });
    });
  }

  async implementStylingRules() {
    let p1 = new PerformanceSession(
      "implementStylingRules",
      LogType.extensions
    );

    cssForK2.use({
      target: this.as.window.document.head,
      Id: "as-md-datatable",
    });

    addDependantTopLevelStyles(this.as);
    var root = document.querySelector(":root") as HTMLElement;
    if (this.extensionSettings?.wrapHeaders == true && root) {
      //  --as_md_datatable_header-white-space: break-spaces;
      // --as_md_datatable_--header-word-break: break-word;
      root.style.setProperty(
        "--as_md_datatable_header-white-space",
        "break-spaces"
      );
      root.style.setProperty(
        "-  --as_md_datatable_header-word-break",
        "break-word"
      );
    } else {
      root.style.setProperty("--as_md_datatable_header-white-space", "nowrap");
      root.style.setProperty(
        "-  --as_md_datatable_header-word-break",
        "normal"
      );
    }
    p1.finish();
  }

  tagSettingsChangedEvent(
    processedTargets: ProcessedTargets,
    extensionSettings: any,
    specificAffectedControl?: IControl | IViewInstance,
    specificChangedSettings?: any
  ) {
    console.log(
      "TCL: alterspectiveDataTableExtension -> tagSettingsChangedEvent"
    );
    console.log("processedTargets", processedTargets);
    console.log("extensionSettings", extensionSettings);

    this.applyTargets();

    if (specificAffectedControl) {
      console.log("specificAffectedControl", specificAffectedControl);
      console.log("specificChangedSettings", specificChangedSettings);
      if (specificChangedSettings) {
        let passPack = (
          specificAffectedControl.attachedCustomControl
            ?.element as AsMaterialdesignDatatableExtended
        ).passPack;
        if (passPack) {
          passPack.extension.render(passPack);
        }
        //applySettingsToObject(specificAffectedControl.attachedCustomControl?.element,specificChangedSettings)
      }
    }
  }

  convertTargetToDataTable(
    target: ProcessedTarget<IControl | IViewInstance, IASK2DataTableSettings>
  ): IPassPack | undefined {
    let p1 = new PerformanceSession(
      `convertListToDataTable - ${target.name}`,
      LogType.extensions
    );

    let contents: HTMLSpanElement | undefined = undefined; //placeholder to insert the card contents

    //TODO: this should be in render
    let targetControlHTMLElement = target.referencedK2Object.getHTMLElement();
    let targetControlWith = targetControlHTMLElement.style.width;
    let settings = target.settings;

    let passPack: IPassPack = {
      extension: this,
      target: target,
      dataTable: undefined,
      grid: undefined,
      currentRowKey: -1,
      viewInstance:
        target.type == TargetType.controls
          ? (target.referencedK2Object.parent as IViewInstance)
          : (target.referencedK2Object as IViewInstance),
      processedSettings: settings,
    };

    if (target.type == TargetType.views) {
      passPack = insertGridUsingListView(passPack);
    } else {
      passPack = insertGridUsingControl(passPack);
    }

    target.referencedK2Object.attachedCustomControl = {
      elementId: passPack.dataTable!.id,
      element: passPack.dataTable!,
    };

    //Attach to the event when the target control is populatred with data
    attachToSmartObjectsRefreshedEvent(passPack, this.render);
    addCustomGridMethodBindings(passPack);
    this.render(passPack);
    if (contents) passPack.dataTable?.appendChild(contents);
    p1.finish();
    return passPack;
  }

  /**
   * Render the DataTable
   * @param clondedTarget
   * @param listControlElement
   * @param newDataTable
   * @param originalDisplay
   */
  private async render(passPack: IPassPack) {
    let target = passPack.target;
    let newDataTable = passPack.dataTable;

    if (!target) return;
    if (!newDataTable) return;

    (newDataTable! as any).optGrid = {};
    // Object.assign(newDataTable,passPack.savedResetSettings)

    refreshSettings(passPack.target);

    // let target = _.cloneDeep(target)
    let p1 = new PerformanceSession(
      `render - ${target.name}`,
      LogType.extensions
    );

    try {
      //get latest settings
      // target = getProcessedTargetsForTagName(
      //   this.as,
      //   AS_MaterialDesign_TagNames.dataTable
      // ).viewsInstances.find(
      //   (vi) => vi.referencedK2Object.id == target.referencedK2Object.id
      // )!;

      //getPageSettings(this.as)["as-md-datatable"]?.targets?.views.find((t)=>(t as ProcessedTarget<IViewInstance>).referencedK2Object.id==target.referencedK2Object.id)

      let settings = applyDefaultSettings(target);
      passPack.processedSettings = settings;

      if (settings.enabled == false) {
        Log(`${target.name} - is not enabled in settings `);
        p1.finish();
      }

      let configColResult = configureColumns(passPack, settings);
      settings.optGrid.columns = configColResult?.columns || [];
      if (!settings.optGrid.header) settings.optGrid.header = {};
      settings.optGrid.header.columns = configColResult?.headers || [];

      // this.updateGridColumnsWithDataBoundK2Controls(newDataTable.passPack);
      //Merge custom settings into newDataTable
      //Set after applying defaults and before running converters

      passPack.finalSettings = _.cloneDeep(settings);
     //  bingColumnsToK2Controls(target, passPack);

      //After this point the setting are injected with objects
      passPack.processedSettings = convertExpressions(
        passPack.processedSettings,
        passPack
      );
      passPack.processedSettings = convertRenderers(
        passPack.processedSettings,
        passPack
      );

      //set the dataTables settings
      applySettingsToObject(
        newDataTable,
        passPack.processedSettings,
        "settings"
      );
      applyCustomStylings(passPack, newDataTable);

      //Set the paging size, if we have a list view then we can get the page size from the list view if its set
      //#region Set the pagin size  

      let pageSizeInt: number | undefined = undefined
      let pageSize = target.referencedK2Object.rawData.properties.property.find(
        (p: any) => p.name == "PageSize"
      );

      if (pageSize) {
        pageSizeInt = Number.parseInt(pageSize._);
      }

      pageSizeInt =
        passPack.processedSettings.optGrid?.pageOptions?.perPage || pageSizeInt || 100; //default to 100
      passPack.processedSettings.optGrid!.pageOptions = passPack.processedSettings.optGrid!.pageOptions || {};
      passPack.processedSettings.optGrid!.pageOptions.perPage = pageSizeInt;

      //#endregion page size

      newDataTable.data = target.referencedK2Object.smartobject.items || [];

      if (!newDataTable.data) {
        console.error(`Something wrong ${target.referencedK2Object.name}`);
      }

      if (passPack) {
        passPack.grid = await newDataTable.getGrid();
        passPack.grid.parent = newDataTable;
      }

      passPack?.grid?.on("selection", (e: any) => {
        Log("selection", { data: e, color: "pink" });
      });
      passPack?.grid?.on("check", (e: any) => {
        Log("check", { data: e, color: "pink" });
        //setTaretedControlValue(passPack,e, [e.rowKey]) //commented out as we only set current selected.
      });

      passPack?.grid?.on("beforeChange", (e: any) => {
        Log("beforeChange", { data: e, color: "pink" });
      });

      passPack?.grid?.on("focusChange", (e: any) => {
        console.log("TCL: focusChange -> e", e);

        Log("focusChange", { data: e, color: "pink" });

        setTargetedControlValue(passPack, e);
        // newDataTable.applyMaterialClasses();
        executeK2Rule(
          passPack?.processedSettings.k2_rule_to_execute_for_focus_changed,
          passPack,
          "focusChanged"
        );
        updateAllK2ControlsWithDataForTheRowKey(passPack!, e.rowKey);
        simulateUserActionAgainstListView(passPack!, e.rowKey, "click");
      });

      passPack?.grid?.on("dblclick", (e: any) => {
        Log("dblclick", { data: e, color: "pink", enabled: true });
        // newDataTable.applyMaterialClasses();
        executeK2Rule(
          passPack?.processedSettings.k2_rule_to_execute_for_double_click,
          passPack,
          "dblclick"
        );
        simulateUserActionAgainstListView(passPack!, e.rowKey, "dblclick");
      });

      passPack?.grid?.on("afterChange", (e: any) => {
        e.changes.forEach(
          (change: {
            columnName: string;
            prevValue: string;
            rowKey: number;
            value: string;
          }) => {
            //small hack to get the grid to update the renderers that have calculated values.
            let rowDisabledState = passPack?.grid?.getRow(change.rowKey)
              ?._attributes.disabled;
            if (rowDisabledState) {
              passPack?.grid?.disableRow(change.rowKey);
            } else {
              passPack?.grid?.enableRow(change.rowKey);
            }
          }
        );

        if (passPack?.currentRowKey) {
          updateAllK2ControlsWithDataForTheRowKey(
            passPack!,
            passPack?.currentRowKey
          );
        }
      });

      implementK2ExecutionControlBindings(newDataTable);

      //TODO: reenable for stling fixes
      // watchAndApplyStyle(passPack);

      p1.finish();
    } catch (err) {
      console.error(
        `Something went wrong with [${target.referencedK2Object.containerType}] [${target.referencedK2Object.name}] `,
        err
      );
    }
  }

  convertSmartobjectItemToCorrectDataTypes(smartobject: ISmartObject): any[] {
    if (!smartobject.items) return [];
    if (smartobject.fieldInfo.length == 0) return smartobject.items;

    return smartobject.items.map((soItem) => {
      let convertedResult: any = {};
      for (const key in soItem) {
        let fieldInfo = smartobject.fieldInfo.find(
          (fi) => fi.propertyName == key
        );
        if (fieldInfo) {
          convertedResult[key] = fieldInfo.javascriptType.parse(soItem[key]);
        } else {
          convertedResult[key] = soItem[key];
        }
      }
      return convertedResult;
    });
  }

  // /**
  //  *
  //  * @param dataTable
  //  *
  //  */
  // private implementExecuteForEachBinding(dataTable: AsMaterialdesignDatatableExtended) {
  //   let k2ControlToBindTo = dataTable.passPack?.settings.executeForEachCheckedK2Control;
  //   let passPack = dataTable.passPack!;

  //   if (k2ControlToBindTo)
  //     if (k2ControlToBindTo.length > 0) {
  //       this.as
  //         .getControlsByConfigurationName(k2ControlToBindTo, dataTable.passPack!.control.parent as IViewInstance)
  //         .forEach(async (c) => {
  //           console.log("TCL: implementSaveBinding -> add event to  -> c", c);
  //           c.events.smartFormEventClick.addEvent(
  //             async (e: EmittedControlEvent) => {
  //               console.log("TCL: event -> implementSaveBinding -> e", e);

  //               if (passPack.grid) {

  //                 let data = passPack.grid.getData().filter((d:any)=>d._attributes.checked==true);

  //                   await this.executeK2RuleForEachRow(
  //                     passPack.settings.k2RuleForEachChecked,
  //                     passPack,
  //                     data
  //                   ).then((e:any)=>
  //                   {
  //                       console.log("TCL: after K2 rule implementExecuteForEachBinding -> e", e)
  //                   })
  //                   if(passPack.settings.dataGridActionForEachChecked==DataGridExecutionActions.Delete)
  //                   {
  //                     passPack.grid.removeRows(data.map((d:any)=>d.rowKey))
  //                   }

  //               }
  //             },
  //             null,
  //             `MdDataTable${passPack.control.id}`
  //           );
  //         });
  //     }
  // }

  //   /**
  //    *
  //    * @param passPack
  //    */
  //   public updateGridColumnsWithDataBoundK2Controls(passPack: IPassPack)
  // {
  //     let currentView = passPack.control.parent as IViewInstance

  //     //run through all configured columns
  //      passPack.settings.optGrid?.columns.forEach((col: OptColumnExtended)=>
  //       {
  //         if(col.k2control_to_bind_to)
  //         {
  //             let k2Controls = this.as.getControlsByConfigurationName(col.k2control_to_bind_to, currentView)
  //             col.dataBoundK2Controls = k2Controls
  //             k2Controls.forEach(c=>{
  //               this.addEventToK2ControlToUpdateGridCurrentRow(c, passPack);
  //             })
  //         }
  //       })
  // }

  public getK2PropValueAsBoolean(value: any): boolean {
    if (!value) return false;
    if (typeof value == "boolean") return value;
    return value == "true";
  }

  // /**
  //  * Convert functions found in settings.OptGrid.column[].formatter into executable functions
  //  * @param instance
  //  * @returns
  //  */
  // convertFormatters(instance: AsMaterialdesignDatatableExtended) {
  //   console.log("TCL: convertFormatters -> instance", instance);
  //   //Convert input configuration custom renderer to functions
  //   if (!instance.optGrid.columns) return;
  //   for (let index = 0; index < instance.optGrid.columns.length; index++) {
  //     const col = instance.optGrid.columns[index];
  //     if (col.formatter) {
  //       let formatter = col.formatter as string;
  //       try {
  //         col.formatter = Function(`"use strict";
  //         return ( (props)=>
  //         {
  //           let retValue = props.value;
  //           try{
  //             if(props)
  //             if(props.value)
  //             {
  //               retValue = ${col.formatter};
  //             }
  //           }
  //           catch (err)
  //           {
  //             console.warn(err);
  //           }
  //           return retValue;
  //         })`)();
  //       } catch (err) {
  //         console.warn(err);
  //       }
  //     }
  //   }
  // }

  /**
   * Convert renderer found in settings.OptGrid.column[].renderer into appropriate render Type or custom Renderer
   * @param instance
   * @returns
   */
  // convertRenderer(settings:OptGridExtended, passPack: IPassPack) {
  //Convert input configuration custom renderer to functions
  // if (!instance.optGrid.columns) return;
  // for (let index = 0; index < instance.optGrid.columns.length; index++) {
  //   const col = instance.optGrid.columns[index];
  //   if (col.renderer) {
  //     console.log("TCL: convertRenderer -> col.renderer", col.renderer);
  //     let render = col.renderer as any;
  //     let options: DataGridRenderOptions = render.options;

  //     if (!options)
  //       options = {
  //         as: this.as,
  //         passPack: instance.passPack!,
  //       };
  //     else {
  //       options.as = this.as;
  //       options.passPack = instance.passPack!;
  //     }
  //     render.options = options;

  //     switch (render.type) {
  //       case "CustomButtonRenderer":
  //         render.type = CustomButtonRenderer;
  //         break;
  //       case "CustomSliderRenderer":
  //         render.type = CustomSliderRenderer;
  //         break;
  //         case "CustomColumnHeader":
  //           render.type = CustomColumnHeader;
  //           break;
  //       default:
  //         render.type = OverriddenDefaultRenderer;
  //         break;
  //     }
  //   } else {
  //     col.renderer = {};
  //     col.renderer.type = OverriddenDefaultRenderer;
  //   }
  // }
  //this.convertRenderers(settings, passPack)
  // }
}

function executeK2Rule(
  ruleConfigurationName: string | undefined | null,
  passPack: IPassPack | undefined,
  eventName: string | undefined
) {
  if (!passPack) return;
  if (typeof ruleConfigurationName == "string") {
    let rules = window.as.getRulesByConfigurationName(
      ruleConfigurationName,
      passPack.viewInstance
    );

    rules.forEach((r) => {
      Log(`Executing rule ${r.name} for event ${eventName}`, {});
      r.execute();
    });
  }
}

/**
 * Get the data of the rowKey and updates all bound K2 Control
 * @param passPack
 * @param rowKey
 * @returns
 */
export function updateAllK2ControlsWithDataForTheRowKey(
  passPack: IPassPack,
  rowKey: number
) {
  //TODO
  // console.log("bindSelectedRowColumnData - TCL: pack", passPack);
  passPack.currentRowKey = -1;
  if (rowKey == undefined) return;
  passPack.currentRowKey = rowKey; //could not find a way to find the current row key
  setCurrentRowKey(passPack, rowKey);
  let rowData = passPack.grid?.getRow(rowKey);
  if (!rowData) return;
  updateAllK2ControlsBoundToGridColumns(passPack, rowData);
}



/**
 * Updates K2 Control found in settings.currentRowDataK2Control with the rowKey
 * @param pack
 * @param rowKey
 */
function setCurrentRowKey(pack: IPassPack, rowKey: number) {
  // console.log("TCL: setCurrentRowKey -> rowKey", rowKey);
  if (pack.processedSettings.k2control_to_bind_rowIndex) {
    window.as.collections.viewInstanceControls
      .filter(
        (c) => c.name == pack.processedSettings.k2control_to_bind_rowIndex
      )
      .forEach((c) => {
        c.value = rowKey.toString();
      });
  }
}

export function addEventToK2ControlToUpdateGridCurrentColumnRow(
  c: IControl,
  col: OptColumnExtended,
  passPack: IPassPack
) {
  if (!passPack.dataTable) return;

  let ruleId = c.id + passPack.dataTable.id + "OnChange";
  c.rules.OnChange?.addListener(ruleId, (evt) => {
    let rowData: any = {};
    let eventControl = evt.detail.parent as IControl;
    if (passPack.currentRowKey != -1) {
      //rowData = passPack.grid?.getRow(passPack.currentRowKey);
      //if (!rowData) rowData = this.setEmptyRowData(passPack);
      //let rowDataFieldProperty = rowData[col.name];
      //rowData[rowDataFieldProperty] = evt.detail.control.value;
      passPack.grid?.setValue(
        passPack.currentRowKey,
        col.name,
        eventControl.value
      );
      //passPack.grid?.setRow(passPack.currentRowKey, rowData)
      // passPack.dataTable.applyMaterialClasses();
    }
  });
}

/**
 * Update the original K2 control with the value of the selected item(s)
 * @param passPack
 * @param arg1
 */
function setTargetedControlValue(passPack: IPassPack, e: any) {
  if (passPack.target.type == TargetType.controls) {
    let control = passPack.target.referencedK2Object as IControl;

    let valueProperty = control.getPropertyValue("ValueProperty");
    let delimiter = control.getPropertyValue("Delimiter") as string;

    let valueToSet: number;
    valueToSet = e.instance.getData().find((d: any) => d.rowKey == e.rowKey)[
      valueProperty
    ] as number;

    // valueToSet =values.map(v=>v);
    // valueToSet = values.map(v=>
    //    {
    //      let foundValue=  e.instance.getData().find((d:any)=>d.rowKey==v)[valueProperty]
    //      return foundValue
    //    });

    // e.instance.getData().find((d:any)=>d.rowKey==values[0])[valueProperty]

    (passPack.target.referencedK2Object as IControl).value =
      valueToSet.toString();
  }
}
