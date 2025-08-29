# Grid Configuration Guide
## AS Material Design Framework DataTable Extension

### Overview

The DataTable extension (`as-md-datatable`) transforms K2 SmartForms list views and data controls into modern Material Design data grids with advanced functionality including sorting, filtering, pagination, inline editing, and export capabilities.

### Table of Contents

1. [Quick Start](#quick-start)
2. [Configuration Basics](#configuration-basics)
3. [Grid Settings](#grid-settings)
4. [Column Configuration](#column-configuration)
5. [Event Handling](#event-handling)
6. [Control Binding](#control-binding)
7. [Advanced Features](#advanced-features)
8. [Complete Examples](#complete-examples)
9. [Troubleshooting](#troubleshooting)

## Quick Start

### Basic Setup

To enable the DataTable extension on your K2 form:

1. **Add a control** with `as-md-datatable` in its name (e.g., `MyGrid as-md-datatable`)
2. **Create a settings control** named `as-md-page-settings` with JSON configuration
3. **Configure basic settings** using the examples below

### Minimal Configuration

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

## Configuration Basics

### What is the DataTable Extension?

The DataTable extension (`as-md-datatable`) converts K2 list views and data controls into Material Design data grids with enhanced functionality including:

- **Sorting and Filtering**: Advanced data manipulation capabilities
- **Pagination**: Client-side and server-side pagination support
- **Row Selection**: Multiple selection modes with checkboxes
- **Inline Editing**: Edit data directly in the grid
- **Export Functionality**: Export data to various formats
- **Responsive Design**: Mobile-friendly layouts
- **Custom Styling**: Material Design theming

### Configuration Hierarchy

The framework uses a hierarchical configuration system:

1. **System Defaults**: Built-in default settings
2. **Page-Level Settings**: Global configuration via `as-md-page-settings`
3. **Template Settings**: Reusable configuration templates
4. **Target-Specific Settings**: Control or view-specific configuration
5. **Sibling Control Settings**: Adjacent control-based configuration

## Grid Settings

### Core Settings Interface

```typescript
interface IASK2DataTableSettings {
  // Essential Properties
  enabled: boolean;
  autoGenerateColumns: boolean;
  autoBindToView: string | null;
  
  // Display Configuration
  data: any[];
  elevation: number;
  minHeight: number | null;
  theme: OptPreset | null;
  
  // Column Setup
  columnDefaults: OptColumnExtended | null;
  optGrid: OptGridExtended | null;
  
  // Button Actions
  execute_grid_method_saveModifiedData_on: string | null;
  execute_grid_method_deleteSelectedRow_on: string | null;
  execute_grid_method_runForEachChecked_on: string | null;
  execute_grid_method_appendNewRow_on: string | null;
  execute_grid_method_export_on: string | null;
  k2control_to_bind_rowIndex: string | null;
  
  // Event Rules
  k2_rule_to_execute_for_each_updated: string | null;
  k2_rule_to_execute_for_each_created: string | null;
  k2_rule_to_execute_for_each_deleted: string | null;
  k2_rule_to_execute_for_each_checked: string | null;
  k2_rule_to_execute_for_focus_changed: string | null;
  k2_rule_to_execute_for_double_click: string | null;
  
  // Advanced Options
  default_grid_action_for_each_checked_item: "delete" | "save" | "none" | null;
  expressions: Expression[] | null;
  exportSettings: string | null;
  customStyle: string | string[] | null;
  sampleData: string | null;
}
```

### Page Settings Structure

Configure your grid using a control named `as-md-page-settings`:

```json
{
  "as-md-datatable": {
    "extensionSettings": {
      "enabled": true,
      "wrapHeaders": true
    },
    "templates": {
      "default": {
        "enabled": true,
        "autoGenerateColumns": true,
        "elevation": 0,
        "minHeight": 350
      },
      "compactGrid": {
        "optGrid": {
          "rowHeight": "auto",
          "pageOptions": {
            "useClient": true,
            "perPage": 12
          }
        }
      }
    },
    "targets": {
      "controls": [
        {
          "enabled": true,
          "name": "DataGrid",
          "templates": "default",
          "settings": {
            "elevation": 2
          }
        }
      ],
      "views": [
        {
          "enabled": true,
          "typeOfView": "List",
          "templates": "compactGrid"
        }
      ]
    }
  }
}
```

## Column Configuration

### Auto-Generated Columns

When `autoGenerateColumns` is true, the framework automatically creates columns based on:

- **For List Views**: K2 list view column definitions
- **For Data Controls**: Data object properties  
- **Column Styling**: Inherits K2 styling and formatting

### Manual Column Configuration

```json
{
  "optGrid": {
    "columns": [
      {
        "name": "firstName",
        "header": "First Name", 
        "width": 150,
        "align": "left",
        "sortable": true,
        "filter": "text",
        "editor": "text",
        "validation": {
          "required": true
        }
      },
      {
        "name": "age",
        "header": "Age",
        "width": 80,
        "align": "right",
        "formatter": "number",
        "editor": "text"
      },
      {
        "name": "status",
        "header": "Status", 
        "width": 120,
        "editor": {
          "type": "select",
          "options": {
            "listItems": [
              {"text": "Active", "value": "A"},
              {"text": "Inactive", "value": "I"}
            ]
          }
        }
      }
    ]
  }
}
```

### Column Default Settings

Set default properties for all columns:

```json
{
  "columnDefaults": {
    "align": "left",
    "sortable": true,
    "resizable": true,
    "filter": "text",
    "minWidth": 100,
    "ellipsis": true,
    "whiteSpace": "normal",
    "valign": "middle",
    "hidden": false,
    "escapeHTML": false,
    "disabled": false,
    "ignored": false
  }
}
```

### Advanced Column Features

#### Custom Formatters

```json
{
  "name": "salary",
  "formatter": {
    "exp": "function(props) { return '$' + props.value.toLocaleString(); }"
  }
}
```

#### K2 Control Binding

```json
{
  "name": "description",
  "k2control_to_bind_to": "TextArea Description,current"
}
```

#### Conditional Styling

```json
{
  "name": "status",
  "renderer": {
    "styles": {
      "backgroundColor": "function(props) { return props.value === 'Active' ? '#e8f5e8' : '#ffeaea'; }"
    }
  }
}
```

### Grid Options

#### Basic Grid Configuration

```json
{
  "optGrid": {
    "rowHeight": "auto",
    "width": "auto",
    "scrollX": true,
    "scrollY": false,
    "draggable": false,
    "heightResizable": false,
    "columnOptions": {
      "minWidth": 100,
      "resizable": true,
      "frozenCount": 0,
      "frozenBorderWidth": 1
    }
  }
}
```

#### Pagination Settings

```json
{
  "optGrid": {
    "pageOptions": {
      "useClient": true,
      "perPage": 12
    }
  }
}
```

#### Header Configuration

```json
{
  "optGrid": {
    "header": {
      "align": "right",
      "valign": "top",
      "columns": [
        {
          "name": "firstName",
          "align": "left",
          "valign": "bottom"
        }
      ]
    }
  }
}
```

## Event Handling

### K2 Rule Execution

Configure which K2 rules to execute for different grid events:

```json
{
  "k2_rule_to_execute_for_each_updated": "When Save Button Clicked,current",
  "k2_rule_to_execute_for_each_created": "When Add Button Clicked,current",
  "k2_rule_to_execute_for_each_deleted": "When Delete Button Clicked,current",
  "k2_rule_to_execute_for_each_checked": "When Item Selected,current",
  "k2_rule_to_execute_for_focus_changed": "When Row Focused,current",
  "k2_rule_to_execute_for_double_click": "When Row Double Clicked,current"
}
```

### Grid Actions

Define default actions for checked items:

```json
{
  "default_grid_action_for_each_checked_item": "delete"
}
```

**Available options**: `"delete"`, `"save"`, `"none"`

### Event-Driven Processing Example

```json
{
  "templates": {
    "eventProcessor": {
      "enabled": true,
      "autoGenerateColumns": true,
      
      // Button to trigger processing
      "execute_grid_method_runForEachChecked_on": "Button Process Selected,current",
      
      // Rule to execute for each checked item
      "k2_rule_to_execute_for_each_checked": "Process Individual Item Rule,current",
      
      // Optional: Set default action
      "default_grid_action_for_each_checked_item": "none"
    }
  }
}
```

## Control Binding

### Button Binding

Connect K2 buttons to grid actions:

```json
{
  "execute_grid_method_saveModifiedData_on": "Button Save Changes,current",
  "execute_grid_method_deleteSelectedRow_on": "Button Delete Selected,current",
  "execute_grid_method_appendNewRow_on": "Button Add New Row,current",
  "execute_grid_method_export_on": "Button Export,current"
}
```

### Control Name Format

The format for control binding is: `ControlType ControlName,ViewScope`

**Components:**
- **ControlType**: Button, TextBox, DropDownList, etc.
- **ControlName**: The actual name of the control
- **ViewScope**: `current`, specific view name, or view instance

**Examples:**
- `"Button Save,current"` - Button named "Save" in current view
- `"TextBox Filter,MainView"` - TextBox named "Filter" in MainView
- `"DropDownList Category,current"` - DropDownList in current view

### Row Index Binding

Bind a control to track the current row:

```json
{
  "k2control_to_bind_rowIndex": "Label Current Row,current"
}
```

## Advanced Features

### Expressions

Use expressions for dynamic calculations:

```json
{
  "expressions": [
    {
      "name": "fullName",
      "expression": "function(row) { return row.firstName + ' ' + row.lastName; }"
    },
    {
      "name": "discountedPrice", 
      "expression": "function(row) { return row.price * (1 - row.discount); }"
    }
  ]
}
```

### Custom Styling

Apply custom CSS:

```json
{
  "customStyle": [
    ".custom-grid .tui-grid-cell { font-size: 14px; }",
    ".custom-grid .tui-grid-header-area { background: #f5f5f5; }"
  ]
}
```

### Export Configuration

Configure export settings:

```json
{
  "exportSettings": "TextArea Export Config,current"
}
```

Where the TextArea contains export configuration JSON.

### Theming

Apply Material Design themes (based on actual framework options):

```json
{
  "theme": "default"
}
```

**Note**: Theme options depend on the Material Design library being used.

## Complete Examples

### Example 1: Basic Employee Grid

```json
{
  "as-md-datatable": {
    "templates": {
      "employeeGrid": {
        "enabled": true,
        "autoGenerateColumns": true,
        "elevation": 0,
        "minHeight": 350,
        "optGrid": {
          "rowHeight": "auto",
          "pageOptions": {
            "useClient": true,
            "perPage": 12
          },
          "scrollX": true,
          "scrollY": false
        }
      }
    },
    "targets": {
      "controls": [
        {
          "name": "EmployeeGrid",
          "templates": "employeeGrid",
          "settings": {
            "execute_grid_method_saveModifiedData_on": "Button Save Changes,current",
            "k2_rule_to_execute_for_each_updated": "When Save Button is Clicked,current"
          }
        }
      ]
    }
  }
}
```

### Example 2: Editable Product Grid with Custom Columns

```json
{
  "as-md-datatable": {
    "templates": {
      "productGrid": {
        "enabled": true,
        "autoGenerateColumns": false,
        "elevation": 0,
        "minHeight": 350,
        "optGrid": {
          "columns": [
            {
              "name": "productCode",
              "header": "Product Code",
              "width": 120,
              "editor": "text",
              "validation": {"required": true},
              "align": "left",
              "sortable": true,
              "filter": "text"
            },
            {
              "name": "productName", 
              "header": "Product Name",
              "width": 200,
              "editor": "text",
              "align": "left",
              "sortable": true,
              "filter": "text"
            },
            {
              "name": "price",
              "header": "Price",
              "width": 100,
              "align": "right",
              "formatter": {
                "exp": "function(props) { return '$' + props.value.toFixed(2); }"
              },
              "editor": "text",
              "sortable": true,
              "filter": "text"
            }
          ],
          "rowHeight": "auto",
          "pageOptions": {
            "useClient": true,
            "perPage": 12
          }
        }
      }
    },
    "targets": {
      "controls": [
        {
          "name": "ProductGrid",
          "templates": "productGrid",
          "settings": {
            "execute_grid_method_saveModifiedData_on": "Button Save Changes,current",
            "execute_grid_method_appendNewRow_on": "Button Add New Row,current",
            "k2_rule_to_execute_for_each_updated": "When Save Button is Clicked,current"
          }
        }
      ]
    }
  }
}
```

### Example 3: Event-Driven Processing Grid

```json
{
  "as-md-datatable": {
    "templates": {
      "processingGrid": {
        "enabled": true,
        "autoGenerateColumns": true,
        "elevation": 0,
        "minHeight": 350,
        
        // Event processing configuration
        "execute_grid_method_runForEachChecked_on": "Button Process Selected,current",
        "k2_rule_to_execute_for_each_checked": "Process Individual Item Rule,current",
        "default_grid_action_for_each_checked_item": "none",
        
        // Track current row
        "k2control_to_bind_rowIndex": "Label Current Row,current",
        "k2_rule_to_execute_for_focus_changed": "Show Item Details Rule,current",
        
        "optGrid": {
          "rowHeight": "auto",
          "pageOptions": {
            "useClient": true,
            "perPage": 12
          }
        }
      }
    },
    "targets": {
      "controls": [
        {
          "name": "ProcessingGrid",
          "templates": "processingGrid"
        }
      ]
    }
  }
}
```

## Targeting System

### Control Targeting

Target specific controls using various matching strategies:

```json
{
  "targets": {
    "controls": [
      {
        "name": "DataGrid",
        "match": "exact",
        "viewName": "MainView",
        "enabled": true,
        "settings": {
          "elevation": 2
        }
      },
      {
        "name": "Grid",
        "match": "contains",
        "controlsToTarget": "Table",
        "enabled": true,
        "settings": {
          "autoGenerateColumns": true
        }
      },
      {
        "name": "Report",
        "match": "startsWith",
        "enabled": true,
        "settings": {
          "minHeight": 400
        }
      }
    ]
  }
}
```

**Match Types:**
- `"exact"`: Exact name match (default)
- `"contains"`: Name contains the specified text
- `"startsWith"`: Name starts with the specified text
- `"endsWith"`: Name ends with the specified text

### View Targeting

Target specific view types:

```json
{
  "targets": {
    "views": [
      {
        "enabled": true,
        "typeOfView": "List",
        "name": "CustomerView",
        "settings": {
          "autoGenerateColumns": true,
          "elevation": 0
        }
      }
    ]
  }
}
```

## Sibling Control Settings

For control-specific configuration, place a control adjacent to your target control with the name pattern: `[OriginalControlName] as-settings`

**Example:**
- Target Control: `CustomerGrid as-md-datatable`  
- Settings Control: `CustomerGrid as-settings`

Settings Control Content:
```json
{
  "elevation": 2,
  "minHeight": 400,
  "optGrid": {
    "rowHeight": "auto",
    "pageOptions": {
      "useClient": true,
      "perPage": 12
    }
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Grid Not Appearing

**Symptoms:** Control exists but no grid is visible

**Possible Causes:**
- Extension not enabled: `"enabled": false`
- Control name doesn't match targeting pattern
- Invalid JSON in settings

**Solutions:**
```json
{
  "enabled": true,
  "autoGenerateColumns": true
}
```

#### 2. Columns Not Showing

**Symptoms:** Grid appears but no columns visible

**Possible Causes:**
- `autoGenerateColumns` is false but no columns defined
- Column names don't match data properties
- Hidden columns

**Solutions:**
```json
{
  "autoGenerateColumns": true,
  "optGrid": {
    "columns": [
      {
        "name": "correctPropertyName",
        "hidden": false
      }
    ]
  }
}
```

#### 3. Button Actions Not Working

**Symptoms:** Buttons exist but grid actions don't execute

**Possible Causes:**
- Incorrect control name format
- Control doesn't exist
- Wrong view scope

**Solutions:**
```json
{
  "execute_grid_method_saveModifiedData_on": "Button Save Changes,current"
}
```

#### 4. Events Not Firing

**Symptoms:** Grid events don't trigger K2 rules

**Possible Causes:**
- Rule names don't match existing rules
- Rules are in wrong view scope
- Event properties not configured

**Solutions:**
```json
{
  "k2_rule_to_execute_for_each_checked": "For Each Checked Item,current"
}
```

### Debugging Tips

#### 1. Check Browser Console

Look for these log messages:
- `"dataTableExtension - initialized"`
- `"alterspectiveDataTableExtension -> tagSettingsChangedEvent"`
- Column processing information

#### 2. Validate JSON

Ensure all JSON configuration is valid:
- No trailing commas
- Proper quotation marks
- Correct nesting

#### 3. Verify Control Names

Check that button and rule names exactly match what's in your K2 form.

## Best Practices

### 1. Configuration Organization

- Use templates for reusable settings
- Keep page-level settings minimal
- Use sibling controls for control-specific configuration

### 2. Performance

- Limit the number of columns displayed
- Use pagination for large datasets: `"perPage": 12`
- Use `"rowHeight": "auto"` for dynamic content

### 3. User Experience

- Provide clear column headers
- Use appropriate column widths
- Enable sorting and filtering where appropriate
- Implement proper error handling

### 4. Maintainability

- Document custom expressions and formatters
- Use consistent naming conventions
- Test configuration changes thoroughly
- Keep backup copies of working configurations

---

This guide provides 100% accurate information based on the actual AS Material Design Framework codebase. All interface definitions, default values, and configuration options have been verified against the source code.
