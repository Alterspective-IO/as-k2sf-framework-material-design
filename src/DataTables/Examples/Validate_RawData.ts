import { IASK2DataTableSettings } from "../Extension/settings";


let test : IASK2DataTableSettings =
{
  "theme": {},
  "autoBindToViewControls": false,
  "data": [],
  "autoGenerateColumns": false,
  "execute_grid_method_saveModifiedData_on": "undefined",
  "execute_grid_method_deleteSelectedRow_on": "undefined",
  "execute_grid_method_runForEachChecked_on": "undefined",
  "execute_grid_method_appendNewRow_on": "undefined",
  "execute_grid_method_export_on": "undefined",
  "k2_rule_to_execute_for_each_updated": "SaveItem,current",
  "k2_rule_to_execute_for_each_created": "CreateItem,current",
  "k2_rule_to_execute_for_each_deleted": "DeleteItem,current",
  "enabled": true,
  "elevation": 0,
  "minHeight": 340,
  "optGrid": {
    "scrollX": true,
    "rowHeight": 52,
    "rowHeaders": ["checkbox"],
    "scrollY": false,
    "header": { "height": 70 },
    "pageOptions": {
      "useClient": true,
      "perPage": 12
    },
    "columns": [
      {
        "name": "id",
        "k2control_to_bind_to": "Text Box Id,current",
        "header": "Id",
        "hidden": true
      },
      {
        "name": "cardBackground",
        "k2control_to_bind_to": "Text Box Card Background,current",
        "header": "Id",
        "hidden": true
      },
      {
        "name": "start",
        "k2control_to_bind_to": "Text Box start,current",
        "minWidth": 180,
        "header": "Start",
        "sortable": true,
        "resizable": true,
        "formatter": {
          "exp": "new Date(props.value).toDateString()"
        },
        "editor": "datePicker",
        "filter": {
          "type": "date",
          "options": {
            "format": "yyyy.MM.dd"
          }
        }
      },
      {
        "name": "carMake",
        "header": "Car Make",
        "k2control_to_bind_to": "Text Box carMake,current",
        "formatter": { "exp": "props.value.toString().toUpperCase()" },
        "filter": "text",
        "editor": {
          "type": "select",
          "options": {
            "listItems": [
              {
                "text": "Porsche",
                "value": "Porsche"
              },
              {
                "text": "Mazda",
                "value": "Mazda"
              },
              {
                "text": "Toyota",
                "value": "Toyota"
              }
            ]
          }
        },
        "sortable": true,
        "resizable": true
      },
      {
        "name": "carModel",
        "header": "Car Model",
        "k2control_to_bind_to": "Text Box carModel,current",
        "editor": "text",
        "filter": "text",
        "sortable": true,
        "rowSpan": true,
        "resizable": true
      },
      {
        "name": "contactFirstName",
        "k2control_to_bind_to": "Text Box firstName,current",
        "header": "First Name",
        "sortable": true,
        "filter": {
          "type": "text",
          "showApplyBtn": true,
          "showClearBtn": true
        }
      },
      {
        "name": "slider",
        "header": "Slider",
        "k2control_to_bind_to": "Text Box Silder,current",
        "renderer": {
          "type": "slider",
          "options": {
            "min": 0,
            "max": 30
          }
        }
      },
      {
        "name": "action",
        "header": "Action",
        "renderer": {
          "type": "button",
          "options": {
            "toggleValueOnClick": true,
            "targetColumn": "browser",
            "icon": "code",
            "outlined": false,
            "raised": true,
            "trailingIcon": true,
            "label": "Approve",
            "k2control_to_bind_to": "ApprovedClicked,current",
            "style": {
              "width": "100%"
            }
          }
        }
      },
      {
        "header": "Approved",
        "name": "browser",
        "k2control_to_bind_to": "Text Box Approved,current",
        "formatter": {
          "exp": ["(value=value||3,(value==1) ? ",
            "`<div style='display:flex;align-content:center;justify-content:center'>",
            "<img height='40px' src='https://cdn-icons-png.flaticon.com/512/4157/4157035.png' /></div>`",
            " :  ",
            "((value==0)?",
            "`<div style='display:flex;align-content:center;justify-content:center'>",
            "<img height='40px' src='https://cdn-icons-png.flaticon.com/512/3712/3712216.png' />",
            "</div>`:'undecided'))"]
        },
        "editor": {
          "type": "radio",
          "options": {
            "listItems": [
              {
                "text": "Approve",
                "value": 1
              },
              {
                "text": "Decline",
                "value": 0
              },
              {
                "text": "Undecided",
                "value": 2
              }
            ]
          }
        }
      }
    ]
  }
}
