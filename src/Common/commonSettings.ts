
import { Icon } from "alterspective-k2-smartfroms"
import { Control,TypeView,ControlType,IControl, IViewInstance, } from "asFramework/src/index"
import { TUIGridExtended } from "../DataTables/Extension/interfaces"

  export interface Templates {
    [name:string]: any,
    default?:any
  }
    
  export interface Targets {
    controls: TargetControl[]
    views: TargetView[]
  }
  
  export interface ProcessedTargets {
    tag:AS_MaterialDesign_TagNames 
    controls: ProcessedTarget<IControl, any>[]
    viewsInstances: ProcessedTarget<IViewInstance,any>[]
  }
  
export interface Target 
{   name?: string
    match?:"exact" | "contains" | "startsWith" | "endsWith"    
    templates?:string | Array<string>
    enabled?:boolean
    note?: string   
    settings?: any
}

export enum TargetType
{
  controls="controls",
  views="views"
}

export interface ProcessedTarget<T extends IControl | IViewInstance, SettingsType> extends Target
{
    tag: AS_MaterialDesign_TagNames
    templateReferences:Array<{templateName:string,templateSettings:any}>
    appliedSettings:Array<{from:string,settings:any, fromInfo:any|undefined}>
    settings:SettingsType
    referencedK2Object: T
    type: TargetType
}

// export interface ProcessedTargetControl extends ProcessedTarget
// {
//   k2Control: IControl
// }
// export interface ProcessedTargetViewInstance extends ProcessedTarget
// {
//   viewInstance: IViewInstance
// }

export interface TargetView extends Target{
  typeOfView?:TypeView
} 

  export interface TargetControl extends Target {
    viewName?: string
    controlsToTarget? : ControlType   
  }


export type ExtensionSettings =
{
  enabled: boolean
  [name:string]: any
}

/**
 * JSON structure with extension settings, templates and target settings
 */
export type TargetedControlSettings<TExtensionSettings extends ExtensionSettings>=
{
    extensionSettings: TExtensionSettings
    templates?:Templates,
    targets?:Targets    
}

export type ProcessedTargetedControlSettings=
{
    tag?:AS_MaterialDesign_TagNames
    templates?:Templates,
    targets?:ProcessedTargets
}




export enum AS_MaterialDesign_TagNames {
    dataTable = "as-md-datatable",
    expander = "as-md-expander",
    card = "sux-md-card",
    htmlRepeater = "as-md-htmlrepeater",
    icon = "as-md-icon"
}

export type TargetedControlsSettingsContainer = {
    [key in AS_MaterialDesign_TagNames]? : TargetedControlSettings<any>
}

export type ProcessedTargetedControlsSettingsContainer = {
  [key in AS_MaterialDesign_TagNames]? : ProcessedTargetedControlSettings
}



export enum AS_MaterialDesign_SettingKeywords
{
    pageSettings="as-md-page-settings",
    mdSiblingControlSetting="as-settings"
}


let example : TargetedControlsSettingsContainer = 
{
    "as-md-datatable": {
      "extensionSettings":{},
      "templates": {
        "default": {
          "settingFromDefault1": "1",
          "settingFromDefault2": 1,
          "neverOverrideSettingFromDefault": "dont override me",
          "complexSettingFromDefault": {
            "complexInt": 1,
            "complexBool": true,
            "complexString": "default string",
            "complexObject": {
              "complexObjectInt": 1,
              "complexObjectBool": true,
              "complexObjectString": "object default string"
            },
            "complexArray": [111, 112, 113]
          },
          "minHeight": 1000
        },
        "extra": {
          "settingFromDefault1": "extra",
          "extra": "extra extra",
          "complexSettingFromDefault": {
            "complexInt": 2,
            "complexBool": false,
            "complexExtraAddition1": "1 added by extra",
            "complexExtraAddition2": "2 added by extra",
            "complexArray": [222, 222, 222],
            "complexObject": {
              "complexObjectString": "overridden by more",
              "complexObjectInt": 2,
              "extraComplexObject1": "1 added by extra",
              "extraComplexObject2": "2 added by extra"
            }
          }
        },
        "more": {
          "settingFromDefault1": "more",
          "settingFromDefault2": "more 2",
          "more": "more more",
          "complexSettingFromDefault": {
            "complexInt": 3,
            "complexExtraAddition2": "overridden by more",
            "moreAddedComplexObject": {
              "more1": 1,
              "more2": 2
            },
            "complexObject": {
              "complexObjectInt": 3,
              "extraComplexObject2": "overridden by more",
              "moreComplexObject": "added by more"
            }
          }
        }
      },
      "targets": {
        "controls": [
          {
            "enabled": false,
            "controlsToTarget":ControlType.TextArea,
            "templates": "!default",
            "note": "this will target all TextBox controls and not use the default but will not run as enabled is false",
            "settings": {
              "ASettingForAllTextBoxControls": "control setting"
            }
          },
          {
            "name": "Choice as-md-datatable",
            "viewName": "EPMO.Project.Summary.PurchaseOrder",
            "templates": "extra",
            "note": "this will find the control on the view / viewInstance and apply the default and extra templates "
          },
          {
            "name": "Reportable",         
            "settings": {
                "blablabla": "test",
              "ReportableSpecialSetting": "applied at control settings",
              "settingFromDefault1": "overridden by reportable control settings",
              "settingFromDefault2": "overridden by reportable control settings"
            },
            "note": "this will find the control on any view/viewInstance and apply only default and any control specified settings as priority "
          },
          {
            "name": "Tranche",
            "match": "contains",
            "templates": "extra,more",
            "note": "find all controls containing Tranche and apply default, extra and more templates"
          },
          {
            "name": "Manager",
            "match": "contains",
            "controlsToTarget": ControlType.Label ,
            "templates": "extra,more",
            "settings": {
              "settingFromDefault3": "Manager",
              "WeShouldBeLabelManager": "true"
            },
            "note": "find all Label controls on any view/viewInstance containing manager and apply default, extra and more templates + specified settings"
          },
          {
            "name": "Manager",
            "match": "contains",
            "controlsToTarget": ControlType.TextBox,
            "settings": {
              "WeShouldBeTextBoxManager": "true",
              "complexSettingFromDefault": {
                "complexInt": "overridden by Manager TextBox control settings"
              }
            },
            "note": "find all TextBox controls on any view/viewInstance containing manager and apply default, extra and more templates + specified settings"
          },
          {
            "name": "ID",
            "match": "endsWith",
            "controlsToTarget": ControlType.TextBox,
            "templates": "!default",
            "settings": {
              "IAMATextBoxWithCapitals": "true"
            },
            "note": "find all TextBox controls that end with ID and apply only the settings"
          },
          {
            "name": "Id",
            "match": "contains",
            "controlsToTarget": ControlType.TextBox,
            "settings": {
              "IAmSmallId": "false"
            },
            "templates": "more",
            "note": "find all TextBox controls that contain ID and apply only the default template and settings"
          },
          {
            "name": "RAID_Id Data Label",
            "viewName": "EPMO.Project Area Item4",
            "settings": {
              "MyIDIs": "5c63eb5c-c30a-4541-c27f-2f112a0c4a05_efab2e42-241a-4e05-a849-3685a0635fd5"
            },
            "note": "this specific control on any view or view instance with this name and apply default template and basic setting"
          }
        ],
        "views": [
          {
            "name": "EPMO.Project.Summary.List",
            "typeOfView": TypeView.List,
            "settings": {
              "autoGeneateColumns": false,
              "optGrid": {
                "columns": {}
              },
              "note": "Find any views/viewinstances with this name and appy, if there are more than one viewInstance that is a child of a view with this name it will be targeted"
            }
          }
        ]
      }
    }
  }
  