import { ControlType, TypeView } from "../../framework/src";
import { EXAMPLE_DATA_TABLE_SETTINGS } from "../DataTables/Examples/Validate_RawData";
import { TargetedControlsSettingsContainer } from "./commonSettings";


export function applyExampleSettings(controlValue:string | undefined) : string | undefined
{
  if(!controlValue)
  {
    return undefined;
  }

  if(controlValue.toUpperCase()==="SIMPLE_EXAMPLE_PAGE_SETTING")
    { 
      return JSON.stringify(SIMPLE_EXAMPLE_PAGE_SETTING,null,2);
    }

    if(controlValue.toUpperCase()==="INFO_EXAMPLE_PAGE_SETTING")
    { 
      return JSON.stringify(INFO_EXAMPLE_PAGE_SETTING,null,2);
    }

    if(controlValue.toUpperCase()==="WITH_EXAMPLE_DATA_TABLE_SETTINGS") 
    { 
      return JSON.stringify(WITH_EXAMPLE_DATA_TABLE_SETTINGS,null,2);
    }
    return controlValue;
}

export const SIMPLE_EXAMPLE_PAGE_SETTING: TargetedControlsSettingsContainer = {
 "as-md-datatable": {
    extensionSettings: {},
    templates: {
      default: {
        minHeight: 1000,
      },
    },
    targets: {
        controls: [],
        views: [
            {
                enabled: true,
                typeOfView: TypeView.List,
                templates:"default",
                settings: {
                    autoGeneateColumns: false,
                    optGrid: {
                      columns: {},
                    },
                    note: "Find any views/viewinstances with this name and appy, if there are more than one viewInstance that is a child of a view with this name it will be targeted",
                  },
            }
        ]
    }
  },

};

//EXAMPLE_DATA_TABLE_SETTINGS

export const WITH_EXAMPLE_DATA_TABLE_SETTINGS: TargetedControlsSettingsContainer = {
  "as-md-datatable": {
     extensionSettings: {},
     templates: {
       default: {
         minHeight: 1000,
       },
     },
     targets: {
         controls: [],
         views: [
             {
                 enabled: true,
                 typeOfView: TypeView.List,
                 templates:"default",
                 settings: EXAMPLE_DATA_TABLE_SETTINGS
             }
         ]
     }
   },
 
 };
export const INFO_EXAMPLE_PAGE_SETTING: TargetedControlsSettingsContainer = 
{
    "as-md-datatable": {
      extensionSettings: {},
      templates: {
        default: {
          note: "this is the default template that will be applied by default unless specifically excluded using !default",
          SettingName: "Setting Value"
        },
        ExampleTemplate1: {
          note: "Additional templates can be added, they need to be specifically applied",
          SettingName: "ExampleTemplate1 Setting Value",
          AnotherSetting: "ExampleTemplate1 AnotherSetting Value"
        },
        ExampleTemplate2: {
          note: "Additional templates can be added, they need to be specifically applied",
          SettingName: "ExampleTemplate2 Setting Value",
          AnotherSetting: "ExampleTemplate2 AnotherSetting Value"
        }
      },
      targets: {
        controls: [
          {
            enabled: false,
            controlsToTarget: ControlType.TextArea,
            note: "Target all TextAreas control but doesnt run as enabled is false",
            settings: {}
          },
          {
            enabled: true,
            name: "NameOfControl",
            viewName: "SystemNameOfView/NameOfViewInstanceOnPage",
            note: "this will find the control on the view / viewInstance and apply the default",
            settings: {
              SettingName: "This settings will override the default template",
              AnotherSpecificValue: "An additional setting applied"
            }
          },
          {
            enabled: true,
            name: "NameOfControl",
            viewName: "SystemNameOfView/NameOfViewInstanceOnPage",
            templates: "!default",
            note: "this will find the control on the view / viewInstance and WILL NOT apply the default template",
            settings: {}
          },
          {
            name: "NameOfControl",
            settings: {
              SettingName: "This settings will override the default template"
            },
            note: "this will find the control on any view/viewInstance and apply only default and any control specified settings as priority"
          },
          {
            name: "NameOfControl",
            match: "contains",
            templates: "ExampleTemplate1,ExampleTemplate2",
            note: "find all controls containing NameOfControl and apply default, ExampleTemplate1 and ExampleTemplate2 templates"
          },
          {
            name: "NameOfControl",
            match: "contains",
            controlsToTarget: ControlType.Label,
            templates: "!default,ExampleTemplate1,ExampleTemplate2",
            settings: {
              SpecificSetting: "Manager"
            },
            note: "find all Label controls on any view/viewInstance containing NameOfControl and DOES NOT apply default, applied  ExampleTemplate1 and ExampleTemplate2 templates + specified settings"
          },
          {
            name: "ID",
            match: "endsWith",
            controlsToTarget:ControlType.TextBox,
            templates: "!default",
            settings: {
              IAMATextBoxWithCapitals: "true"
            },
            note: "find all TextBox controls that end with ID and apply only the settings"
          },
          {
            name: "Id",
            match: "contains",
            controlsToTarget: ControlType.TextBox,
            settings: {
              IAmSmallId: "false"
            },
            templates: "ExampleTemplate1",
            note: "find all TextBox controls that contain ID and apply only the default template, ExampleTemplate1 template and settings"
          }
        ],
        views: [
          {
            enabled: false,
            typeOfView: TypeView.List,
            settings: {
              note: "Find any List views/viewinstances, does not run as enabled is false"
            }
          },
          {
            name: "SystemNameOfView/NameOfViewInstance",
            typeOfView: TypeView.List,
            settings: {
              note: "Find any views/viewinstances with this name and appy, if there are more than one viewInstance that is a child of a view with this name it will be targeted"
            }
          }
        ]
      }
    }
  }



export const COMPLEX_EXAMPLE_PAGE_SETTING: TargetedControlsSettingsContainer = {
  "as-md-datatable": {
    extensionSettings: {},
    templates: {
      default: {
        settingFromDefault1: "1",
        settingFromDefault2: 1,
        neverOverrideSettingFromDefault: "dont override me",
        complexSettingFromDefault: {
          complexInt: 1,
          complexBool: true,
          complexString: "default string",
          complexObject: {
            complexObjectInt: 1,
            complexObjectBool: true,
            complexObjectString: "object default string",
          },
          complexArray: [111, 112, 113],
        },
        minHeight: 1000,
      },
      extra: {
        settingFromDefault1: "extra",
        extra: "extra extra",
        complexSettingFromDefault: {
          complexInt: 2,
          complexBool: false,
          complexExtraAddition1: "1 added by extra",
          complexExtraAddition2: "2 added by extra",
          complexArray: [222, 222, 222],
          complexObject: {
            complexObjectString: "overridden by more",
            complexObjectInt: 2,
            extraComplexObject1: "1 added by extra",
            extraComplexObject2: "2 added by extra",
          },
        },
      },
      more: {
        settingFromDefault1: "more",
        settingFromDefault2: "more 2",
        more: "more more",
        complexSettingFromDefault: {
          complexInt: 3,
          complexExtraAddition2: "overridden by more",
          moreAddedComplexObject: {
            more1: 1,
            more2: 2,
          },
          complexObject: {
            complexObjectInt: 3,
            extraComplexObject2: "overridden by more",
            moreComplexObject: "added by more",
          },
        },
      },
    },
    targets: {
      controls: [
        {
          enabled: false,
          controlsToTarget: ControlType.TextArea,
          templates: "!default",
          note: "this will target all TextBox controls and not use the default but will not run as enabled is false",
          settings: {
            ASettingForAllTextBoxControls: "control setting",
          },
        },
        {
          name: "Choice as-md-datatable",
          viewName: "EPMO.Project.Summary.PurchaseOrder",
          templates: "extra",
          note: "this will find the control on the view / viewInstance and apply the default and extra templates ",
        },
        {
          name: "Reportable",
          settings: {
            blablabla: "test",
            ReportableSpecialSetting: "applied at control settings",
            settingFromDefault1: "overridden by reportable control settings",
            settingFromDefault2: "overridden by reportable control settings",
          },
          note: "this will find the control on any view/viewInstance and apply only default and any control specified settings as priority ",
        },
        {
          name: "Tranche",
          match: "contains",
          templates: "extra,more",
          note: "find all controls containing Tranche and apply default, extra and more templates",
        },
        {
          name: "Manager",
          match: "contains",
          controlsToTarget: ControlType.Label,
          templates: "extra,more",
          settings: {
            settingFromDefault3: "Manager",
            WeShouldBeLabelManager: "true",
          },
          note: "find all Label controls on any view/viewInstance containing manager and apply default, extra and more templates + specified settings",
        },
        {
          name: "Manager",
          match: "contains",
          controlsToTarget: ControlType.TextBox,
          settings: {
            WeShouldBeTextBoxManager: "true",
            complexSettingFromDefault: {
              complexInt: "overridden by Manager TextBox control settings",
            },
          },
          note: "find all TextBox controls on any view/viewInstance containing manager and apply default, extra and more templates + specified settings",
        },
        {
          name: "ID",
          match: "endsWith",
          controlsToTarget: ControlType.TextBox,
          templates: "!default",
          settings: {
            IAMATextBoxWithCapitals: "true",
          },
          note: "find all TextBox controls that end with ID and apply only the settings",
        },
        {
          name: "Id",
          match: "contains",
          controlsToTarget: ControlType.TextBox,
          settings: {
            IAmSmallId: "false",
          },
          templates: "more",
          note: "find all TextBox controls that contain ID and apply only the default template and settings",
        },
        {
          name: "RAID_Id Data Label",
          viewName: "EPMO.Project Area Item4",
          settings: {
            MyIDIs:
              "5c63eb5c-c30a-4541-c27f-2f112a0c4a05_efab2e42-241a-4e05-a849-3685a0635fd5",
          },
          note: "this specific control on any view or view instance with this name and apply default template and basic setting",
        },
      ],
      views: [
        {
          name: "EPMO.Project.Summary.List",
          typeOfView: TypeView.List,
          settings: {
            autoGeneateColumns: false,
            optGrid: {
              columns: {},
            },
            note: "Find any views/viewinstances with this name and appy, if there are more than one viewInstance that is a child of a view with this name it will be targeted",
          },
        },
      ],
    },
  },
};
