import { TypeView, ControlType, } from "asFramework/src/index";
export var TargetType;
(function (TargetType) {
    TargetType["controls"] = "controls";
    TargetType["views"] = "views";
})(TargetType || (TargetType = {}));
export var AS_MaterialDesign_TagNames;
(function (AS_MaterialDesign_TagNames) {
    AS_MaterialDesign_TagNames["dataTable"] = "as-md-datatable";
    AS_MaterialDesign_TagNames["expander"] = "as-md-expander";
    AS_MaterialDesign_TagNames["card"] = "sux-md-card";
    AS_MaterialDesign_TagNames["htmlRepeater"] = "as-md-htmlrepeater";
    AS_MaterialDesign_TagNames["icon"] = "as-md-icon";
})(AS_MaterialDesign_TagNames || (AS_MaterialDesign_TagNames = {}));
export var AS_MaterialDesign_SettingKeywords;
(function (AS_MaterialDesign_SettingKeywords) {
    AS_MaterialDesign_SettingKeywords["pageSettings"] = "as-md-page-settings";
    AS_MaterialDesign_SettingKeywords["mdSiblingControlSetting"] = "as-settings";
})(AS_MaterialDesign_SettingKeywords || (AS_MaterialDesign_SettingKeywords = {}));
let example = {
    "as-md-datatable": {
        "extensionSettings": {},
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
                    "controlsToTarget": ControlType.TextArea,
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
                    "controlsToTarget": ControlType.Label,
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
};
//# sourceMappingURL=commonSettings.js.map