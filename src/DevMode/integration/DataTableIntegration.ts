/**
 * DataTable Integration Helper
 * Bridges DevMode with the existing DataTable extension
 */

import { IPassPack } from '../../DataTables/Extension/interfaces';
import { AsMaterialdesignDatatableExtended } from '../../DataTables/Extension/interfaces';

/**
 * Apply DevMode changes to DataTable
 */
export function applyDevModeConfiguration(
  dataTable: AsMaterialdesignDatatableExtended,
  configuration: any
): void {
  if (!dataTable || !configuration) {
    console.error('[DevMode] Invalid parameters for applyDevModeConfiguration');
    return;
  }
  
  try {
    const passPack = dataTable.passPack;
    
    if (!passPack) {
      console.warn('[DevMode] No passPack found, applying configuration directly');
      Object.assign(dataTable, configuration);
      return;
    }
    
    // Update the passPack settings
    passPack.processedSettings = {
      ...passPack.processedSettings,
      ...configuration
    };
    
    // Re-render the DataTable with new settings
    if (passPack.extension && passPack.extension.render) {
      passPack.extension.render(passPack);
    } else {
      // Fallback: Update the grid directly
      updateGridDirectly(passPack, configuration);
    }
    
    // Dispatch event for other listeners
    dataTable.dispatchEvent(new CustomEvent('devmode-configuration-applied', {
      detail: configuration,
      bubbles: true
    }));
    
  } catch (error) {
    console.error('[DevMode] Error applying configuration:', error);
  }
}

/**
 * Update TUI Grid instance directly
 */
function updateGridDirectly(passPack: IPassPack, configuration: any): void {
  const grid = passPack.grid;
  
  if (!grid) {
    console.warn('[DevMode] No grid instance found');
    return;
  }
  
  try {
    // Update columns if changed
    if (configuration.optGrid?.columns) {
      const columns = configuration.optGrid.columns;
      
      // Update column models
      if (grid.setColumns) {
        grid.setColumns(columns);
      }
      
      // Update column widths
      columns.forEach((col: any) => {
        if (col.width && grid.setColumnWidth) {
          grid.setColumnWidth(col.name, col.width);
        }
      });
    }
    
    // Update theme
    if (configuration.theme) {
      applyThemeToGrid(grid, configuration.theme);
    }
    
    // Update grid options
    if (configuration.optGrid) {
      updateGridOptions(grid, configuration.optGrid);
    }
    
    // Refresh the grid
    if (grid.refreshLayout) {
      grid.refreshLayout();
    }
    
  } catch (error) {
    console.error('[DevMode] Error updating grid directly:', error);
  }
}

/**
 * Apply theme to TUI Grid
 */
function applyThemeToGrid(grid: any, theme: any): void {
  if (!grid || !theme) return;
  
  // Apply theme using TUI Grid's applyTheme method if available
  if (grid.applyTheme) {
    const tuiTheme = convertToTuiTheme(theme);
    grid.applyTheme('custom', tuiTheme);
  }
}

/**
 * Convert DevMode theme to TUI Grid theme format
 */
function convertToTuiTheme(theme: any): any {
  return {
    area: {
      header: {
        background: theme.colors?.background || '#fff',
        border: theme.colors?.border || '#e0e0e0'
      },
      body: {
        background: theme.colors?.surface || '#fff'
      }
    },
    cell: {
      normal: {
        background: theme.colors?.surface || '#fff',
        text: theme.colors?.text?.primary || '#424242',
        border: theme.colors?.border || '#e0e0e0'
      },
      header: {
        background: theme.colors?.primary || '#667eea',
        text: theme.colors?.text?.primary || '#fff'
      },
      focused: {
        border: theme.colors?.primary || '#667eea'
      }
    }
  };
}

/**
 * Update grid options
 */
function updateGridOptions(grid: any, options: any): void {
  if (!grid || !options) return;
  
  // Update pagination
  if (options.pageOptions && grid.setPagination) {
    grid.setPagination(options.pageOptions);
  }
  
  // Update row height
  if (options.rowHeight && grid.setRowHeight) {
    grid.setRowHeight(options.rowHeight);
  }
  
  // Update selection type
  if (options.selectionUnit && grid.setSelectionUnit) {
    grid.setSelectionUnit(options.selectionUnit);
  }
  
  // Update scrolling
  if (typeof options.scrollX !== 'undefined' && grid.setScrollX) {
    grid.setScrollX(options.scrollX);
  }
  
  if (typeof options.scrollY !== 'undefined' && grid.setScrollY) {
    grid.setScrollY(options.scrollY);
  }
}

/**
 * Extract current configuration from DataTable
 */
export function extractDataTableConfiguration(
  dataTable: AsMaterialdesignDatatableExtended
): any {
  if (!dataTable) {
    return null;
  }
  
  const passPack = dataTable.passPack;
  
  if (passPack && passPack.processedSettings) {
    return JSON.parse(JSON.stringify(passPack.processedSettings));
  }
  
  // Fallback: extract from element properties
  const config: any = {};
  
  // Extract grid options
  if (dataTable.optGrid) {
    config.optGrid = dataTable.optGrid;
  }
  
  // Extract theme
  if (dataTable.theme) {
    config.theme = dataTable.theme;
  }
  
  // Extract other properties
  const properties = ['data', 'columns', 'pageOptions', 'rowHeaders'];
  properties.forEach(prop => {
    if ((dataTable as any)[prop]) {
      config[prop] = (dataTable as any)[prop];
    }
  });
  
  return config;
}

/**
 * Get available K2 controls for binding
 */
export function getAvailableK2Controls(viewInstance: any): string[] {
  if (!viewInstance || !viewInstance.controls) {
    return [];
  }
  
  const controls: string[] = [];
  
  try {
    // Get all controls in the view
    viewInstance.controls.forEach((control: any) => {
      if (control.name) {
        controls.push(control.name);
      }
    });
  } catch (error) {
    console.error('[DevMode] Error getting K2 controls:', error);
  }
  
  return controls;
}

/**
 * Validate configuration before applying
 */
export function validateConfiguration(configuration: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check for required fields
  if (!configuration.optGrid) {
    errors.push('Grid configuration (optGrid) is required');
  }
  
  if (!configuration.optGrid?.columns || configuration.optGrid.columns.length === 0) {
    errors.push('At least one column must be defined');
  }
  
  // Validate columns
  if (configuration.optGrid?.columns) {
    configuration.optGrid.columns.forEach((col: any, index: number) => {
      if (!col.name) {
        errors.push(`Column ${index + 1} must have a name`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}