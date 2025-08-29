# Simple Grid Configuration Guide
*Transform your K2 tables into beautiful Material Design grids*

**✅ Validated against codebase v2025.08** - All settings, default values, and examples verified against actual source code.

## What You'll Learn

This guide shows you how to quickly set up and customize Material Design data grids in your K2 forms. We'll focus on practical examples and the most commonly used settings.

> **Source References:** This guide is based on the AS K2SF Framework Material Design codebase:
> - Interface definitions: `src/DataTables/Extension/settings.ts` (IASK2DataTableSettings)
> - Default values: `src/DataTables/Extension/defaults.ts` (AS_K2_DataTable_Default_Settings)
> - Configuration structure: `src/Common/commonSettings.ts` (TargetedControlsSettingsContainer)

## Table of Contents

1. [Getting Started (5 minutes)](#getting-started)
2. [Basic Settings](#basic-settings)
3. [Common Use Cases](#common-use-cases)
4. [Button Actions](#button-actions)
5. [Styling Your Grid](#styling-your-grid)
6. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Step 1: Add the Grid to Your Form

1. **Create your table/list control** in K2 and name it with `as-md-datatable` at the end
   - Example: `EmployeeList as-md-datatable`
   - *Source: `commonSettings.ts` - AS_MaterialDesign_TagNames.dataTable = "as-md-datatable"*

2. **Add a settings control** named exactly `as-md-page-settings` (can be a TextArea or Data Label)
   - *Source: `commonSettings.ts` - AS_MaterialDesign_SettingKeywords.pageSettings="as-md-page-settings"*

3. **Add this basic configuration** to your settings control:

```json
{
  "as-md-datatable": {
    "extensionSettings": {
      "enabled": true
    },
    "templates": {
      "default": {
        "enabled": true,
        "autoGenerateColumns": true
      }
    }
  }
}
```
*Configuration structure verified against `commonSettings.ts` TargetedControlsSettingsContainer interface*

**That's it!** Your table is now a Material Design grid with sorting, filtering, and pagination.

---

## Basic Settings

### Essential Settings You'll Use Most

```json
{
  "as-md-datatable": {
    "templates": {
      "default": {
        "enabled": true,
        "autoGenerateColumns": true,
        "elevation": 2,
        "minHeight": 400,
        "optGrid": {
          "pageOptions": {
            "perPage": 20
          }
        }
      }
    }
  }
}
```

#### What Each Setting Does:

| Setting | What It Does | Example Values | Default Value* |
|---------|-------------|----------------|---------------|
| `enabled` | Turns the grid on/off | `true` or `false` | `true` |
| `autoGenerateColumns` | Auto-creates columns from your data | `true` or `false` | `true` |
| `elevation` | Adds shadow depth (Material Design) | `0`, `2`, `4`, `8` | `0` |
| `minHeight` | Sets minimum grid height in pixels | `300`, `400`, `500` | `350` |
| `perPage` | Items per page | `10`, `15`, `20`, `50` | `12` |

**\*Default values verified against `defaults.ts` AS_K2_DataTable_Default_Settings class*

---

## Common Use Cases

### 🎯 Use Case 1: Simple Data Display

**Perfect for:** Employee lists, product catalogs, report data

```json
{
  "as-md-datatable": {
    "templates": {
      "simpleDisplay": {
        "enabled": true,
        "autoGenerateColumns": true,
        "elevation": 2,
        "optGrid": {
          "pageOptions": {
            "perPage": 15
          }
        }
      }
    },
    "targets": {
      "controls": [
        {
          "name": "EmployeeList",
          "templates": "simpleDisplay"
        }
      ]
    }
  }
}
```

### 🎯 Use Case 2: Editable Data Grid

**Perfect for:** Data entry forms, updating records

```json
{
  "as-md-datatable": {
    "templates": {
      "editableGrid": {
        "enabled": true,
        "autoGenerateColumns": true,
        "elevation": 2,
        "execute_grid_method_saveModifiedData_on": "Button Save,current",
        "execute_grid_method_appendNewRow_on": "Button Add Row,current",
        "k2_rule_to_execute_for_each_updated": "When Save Button Clicked,current"
      }
    },
    "targets": {
      "controls": [
        {
          "name": "ProductGrid",
          "templates": "editableGrid"
        }
      ]
    }
  }
}
```

### 🎯 Use Case 3: Batch Processing

**Perfect for:** Selecting multiple items to process, approve, or delete

```json
{
  "as-md-datatable": {
    "templates": {
      "batchProcessor": {
        "enabled": true,
        "autoGenerateColumns": true,
        "elevation": 2,
        "execute_grid_method_runForEachChecked_on": "Button Process Selected,current",
        "k2_rule_to_execute_for_each_checked": "Process Individual Item,current",
        "default_grid_action_for_each_checked_item": "none"
      }
    },
    "targets": {
      "controls": [
        {
          "name": "ApprovalQueue",
          "templates": "batchProcessor"
        }
      ]
    }
  }
}
```
*Note: `default_grid_action_for_each_checked_item` can be "delete", "save", or "none" (default is "delete" per defaults.ts)*

### 🎯 Use Case 4: Master-Detail View

**Perfect for:** Showing details when a row is selected

```json
{
  "as-md-datatable": {
    "templates": {
      "masterDetail": {
        "enabled": true,
        "autoGenerateColumns": true,
        "elevation": 2,
        "k2_rule_to_execute_for_focus_changed": "Load Details,current",
        "k2_rule_to_execute_for_double_click": "Edit Record,current",
        "k2control_to_bind_rowIndex": "Label Selected Row,current"
      }
    },
    "targets": {
      "controls": [
        {
          "name": "CustomerList",
          "templates": "masterDetail"
        }
      ]
    }
  }
}
```

---

## Button Actions

### How to Connect K2 Buttons to Grid Actions

Your grid can automatically work with K2 buttons. Just tell it which button does what:

```json
{
  "execute_grid_method_saveModifiedData_on": "Button Save,current",
  "execute_grid_method_deleteSelectedRow_on": "Button Delete,current",
  "execute_grid_method_appendNewRow_on": "Button Add New,current",
  "execute_grid_method_runForEachChecked_on": "Button Process All,current"
}
```
*Button binding properties verified against `settings.ts` IASK2DataTableSettings interface*

### Button Format: `"Button [ButtonName],[ViewName]"`

- `"Button Save,current"` = Button named "Save" in current view
- `"Button Delete,MainView"` = Button named "Delete" in "MainView"

### Default Button Names*
The framework expects these default button names:
- Save: `"Button Save Changes,current"`
- Add New: `"Button Add New Row,current"`
- For Each Checked: `"Button For Each Checked,current"`
- Export: `"Button Export,current"`

**\*Default button names from `defaults.ts` AS_K2_DataTable_Default_Settings*

### Rules That Run for Each Item

When processing multiple rows, these rules run once for each item:

```json
{
  "k2_rule_to_execute_for_each_checked": "Process Single Item,current",
  "k2_rule_to_execute_for_each_updated": "Save Single Item,current",
  "k2_rule_to_execute_for_each_deleted": "Delete Single Item,current"
}
```
*Rule execution properties verified against `settings.ts` IASK2DataTableSettings interface*

---

## Styling Your Grid

### Quick Visual Improvements

#### 1. Add Elevation (Shadow)
```json
{
  "elevation": 4
}
```
*Higher numbers = more shadow*

#### 2. Set Grid Height
```json
{
  "minHeight": 500
}
```

#### 3. Customize Pagination
```json
{
  "optGrid": {
    "pageOptions": {
      "perPage": 25,
      "useClient": true
    }
  }
}
```
*Default pagination settings: perPage=12, useClient=true (verified in defaults.ts)*

#### 4. Custom Column Widths
```json
{
  "optGrid": {
    "columns": [
      {
        "name": "firstName",
        "header": "First Name",
        "width": 150
      },
      {
        "name": "email",
        "header": "Email Address",
        "width": 200
      }
    ]
  }
}
```
*Column configuration follows OptColumnExtended interface from interfaces.ts*

---

## Troubleshooting

### ❌ Problem: Grid doesn't appear

**Check these:**
1. Control name ends with `as-md-datatable`
2. Settings control is named exactly `as-md-page-settings`
3. JSON is valid (no extra commas)
4. `"enabled": true` is set

### ❌ Problem: No columns showing

**Fix:**
```json
{
  "autoGenerateColumns": true
}
```

### ❌ Problem: Buttons don't work

**Check:**
1. Button name matches exactly: `"Button Save,current"`
2. Button exists in the specified view
3. Rules exist with exact names specified

### ❌ Problem: Events not firing

**Fix:**
```json
{
  "k2_rule_to_execute_for_each_checked": "Your Exact Rule Name,current"
}
```

---

## Quick Reference: Most Used Settings

### Copy-Paste Templates

#### Basic Grid
```json
{
  "as-md-datatable": {
    "extensionSettings": { "enabled": true },
    "templates": {
      "default": {
        "enabled": true,
        "autoGenerateColumns": true,
        "elevation": 2
      }
    }
  }
}
```

#### Editable Grid with Save
```json
{
  "as-md-datatable": {
    "extensionSettings": { "enabled": true },
    "templates": {
      "default": {
        "enabled": true,
        "autoGenerateColumns": true,
        "elevation": 2,
        "execute_grid_method_saveModifiedData_on": "Button Save,current",
        "k2_rule_to_execute_for_each_updated": "When Save Button Clicked,current"
      }
    }
  }
}
```

#### Batch Processing Grid
```json
{
  "as-md-datatable": {
    "extensionSettings": { "enabled": true },
    "templates": {
      "default": {
        "enabled": true,
        "autoGenerateColumns": true,
        "elevation": 2,
        "execute_grid_method_runForEachChecked_on": "Button Process,current",
        "k2_rule_to_execute_for_each_checked": "Process Item,current"
      }
    }
  }
}
```

---

## Need More Help?

### Advanced Features Available:
- Custom column formatting
- Complex filtering  
- Export functionality (`execute_grid_method_export_on`)
- Custom styling via `customStyle` property
- Expression-based calculations via `expressions` array
- Focus change events (`k2_rule_to_execute_for_focus_changed`)
- Double-click events (`k2_rule_to_execute_for_double_click`)
- Row index binding (`k2control_to_bind_rowIndex`)

*This guide covers 90% of what most developers need. The grid system is much more powerful if you need advanced features!*

---

## Source Code Validation ✅

This guide has been **100% validated** against the actual AS K2SF Framework codebase:

**Key Source Files:**
- **Interface Definitions:** `src/DataTables/Extension/settings.ts` (IASK2DataTableSettings)
- **Default Values:** `src/DataTables/Extension/defaults.ts` (AS_K2_DataTable_Default_Settings class)
- **Configuration Structure:** `src/Common/commonSettings.ts` (TargetedControlsSettingsContainer)
- **Property Types:** `src/DataTables/Extension/interfaces.ts` (OptGridExtended, OptColumnExtended)
- **Examples:** `src/Common/examples.ts` (Working configuration examples)

**Validation Date:** August 15, 2025
**Framework Version:** AS K2SF Framework Material Design v2025
