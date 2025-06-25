# Control Targetting with page settings
///Users/igor/Documents/GitHub/as-k2sf-framework/package.json

A global page setting(s) can be utilised where a textarea/datalabel is found on the form called: **"as-md-page-settings"**

If there is a Data Control ( list control with smartobject ) found on the page called "**as-page-settings** " it will be searched using the following criteria:
SubCategory = **"as-md-page-settings"**


All found "**as-md-page-settings**" will be applied, so if there are multiple found that will extend and override.

"as-md-page-settings" data control will be applied after and found "**as-md-page-settings** " controls.

Structure of "**as-md-page-settings**" is as follows:**

```json
{
  "custom-control-tag-name": {
    "extensionSettings": {},
    "templates": {
      "default": {
        "note": "this is the default template that will be applied by default unless specifically excluded using !default",
        "SettingName": "Setting Value"
      },
      "ExampleTemplate1": {
        "note": "Additional templates can be added, they need to be specifically applied",
        "SettingName": "ExampleTemplate1 Setting Value",
        "AnotherSetting": "ExampleTemplate1 AnotherSetting Value"
      },
      "ExampleTemplate2": {
        "note": "Additional templates can be added, they need to be specifically applied",
        "SettingName": "ExampleTemplate2 Setting Value",
        "AnotherSetting": "ExampleTemplate2 AnotherSetting Value"
      }
    },
    "targets": {
      "controls": [
        {
          "enabled": false,
          "controlsToTarget": "TextArea",
          "note": "Target all TextAreas control but doesnt run as enabled is false",
          "settings": {}
        },
        {
          "enabled": true,
          "name": "NameOfControl",
          "viewName": "SystemNameOfView/NameOfViewInstanceOnPage",
          "note": "this will find the control on the view / viewInstance and apply the default",
          "settings": {
            "SettingName": "This settings will override the default template",
            "AnotherSpecificValue": "An additional setting applied"
          }
        },
        {
          "enabled": true,
          "name": "NameOfControl",
          "viewName": "SystemNameOfView/NameOfViewInstanceOnPage",
          "templates": "!default",
          "note": "this will find the control on the view / viewInstance and WILL NOT apply the default template",
          "settings": {}
        },
        {
          "name": "NameOfControl",
          "settings": {
            "SettingName": "This settings will override the default template"
          },
          "note": "this will find the control on any view/viewInstance and apply only default and any control specified settings as priority"
        },
        {
          "name": "NameOfControl",
          "match": "contains",
          "templates": "ExampleTemplate1,ExampleTemplate2",
          "note": "find all controls containing NameOfControl and apply default, ExampleTemplate1 and ExampleTemplate2 templates"
        },
        {
          "name": "NameOfControl",
          "match": "contains",
          "controlsToTarget": "Label",
          "templates": "!default,ExampleTemplate1,ExampleTemplate2",
          "settings": {
            "SpecificSetting": "Manager"
          },
          "note": "find all Label controls on any view/viewInstance containing NameOfControl and DOES NOT apply default, applied  ExampleTemplate1 and ExampleTemplate2 templates + specified settings"
        },
        {
          "name": "ID",
          "match": "endsWith",
          "controlsToTarget": "TextBox",
          "templates": "!default",
          "settings": {
            "IAMATextBoxWithCapitals": "true"
          },
          "note": "find all TextBox controls that end with ID and apply only the settings"
        },
        {
          "name": "Id",
          "match": "contains",
          "controlsToTarget": "TextBox",
          "settings": {
            "IAmSmallId": "false"
          },
          "templates": "ExampleTemplate1",
          "note": "find all TextBox controls that contain ID and apply only the default template, ExampleTemplate1 template and settings"
        }
      ],
      "views": [
        {
          "enabled": false,
          "typeOfView": "List",
          "settings": {
            "note": "Find any List views/viewinstances, does not run as enabled is false"
          }
        },
        {
          "name": "SystemNameOfView/NameOfViewInstance",
          "typeOfView": "List",
          "settings": {
            "note": "Find any views/viewinstances with this name and appy, if there are more than one viewInstance that is a child of a view with this name it will be targeted"
          }
        }
      ]
    }
  }
}

```

## Knowledge Extraction Processor

A small utility for extracting keyword frequencies from text is available via `AlterspectiveKnowledgeExtractionAIProcessor`. Stop words can be customized using the exported `DEFAULT_STOP_WORDS` list.

