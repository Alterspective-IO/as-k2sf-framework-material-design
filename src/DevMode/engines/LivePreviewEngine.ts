/**
 * LivePreviewEngine
 * Handles real-time updates to DataTable configurations without page reload
 */

import { IFramework } from "../../../framework/src";
import { IASK2DataTableSettings } from "../../DataTables/Extension/interfaces";
import { ThemeConfiguration } from "../types";
import { debounce } from "../utils/debounce";
import { applyDevModeConfiguration } from "../integration/DataTableIntegration";

/**
 * Configuration change types for optimization
 */
enum ChangeType {
  COLUMN_ADD = 'COLUMN_ADD',
  COLUMN_REMOVE = 'COLUMN_REMOVE',
  COLUMN_UPDATE = 'COLUMN_UPDATE',
  COLUMN_REORDER = 'COLUMN_REORDER',
  THEME_UPDATE = 'THEME_UPDATE',
  GRID_OPTIONS = 'GRID_OPTIONS',
  DATA_UPDATE = 'DATA_UPDATE',
  FULL_REFRESH = 'FULL_REFRESH'
}

/**
 * Change detection result
 */
interface ChangeDetection {
  type: ChangeType;
  details: any;
  requiresFullRefresh: boolean;
}

/**
 * LivePreviewEngine Class
 * Manages real-time configuration updates with minimal re-rendering
 */
export class LivePreviewEngine {
  private framework: IFramework;
  private updateQueue: Map<string, any> = new Map();
  private isProcessing: boolean = false;
  private previousConfigurations: Map<string, any> = new Map();
  
  // Debounced update functions for performance
  private debouncedThemeUpdate: Function;
  private debouncedColumnUpdate: Function;
  private debouncedGridUpdate: Function;

  constructor(framework: IFramework) {
    this.framework = framework;
    
    // Create debounced update functions
    this.debouncedThemeUpdate = debounce(this.applyThemeChanges.bind(this), 100);
    this.debouncedColumnUpdate = debounce(this.applyColumnChanges.bind(this), 200);
    this.debouncedGridUpdate = debounce(this.applyGridChanges.bind(this), 150);
  }

  /**
   * Apply configuration changes to a DataTable element
   */
  public async applyConfiguration(
    element: HTMLElement | null | undefined, 
    configuration: IASK2DataTableSettings
  ): Promise<void> {
    if (!element) {
      console.error('[LivePreview] No element provided');
      return;
    }
    
    console.log('[LivePreview] Applying configuration to element:', element);
    
    try {
      // Get the passPack from the element
      const passPack = (element as any).passPack;
      
      if (!passPack) {
        console.warn('[LivePreview] No passPack found on element, attempting direct configuration');
        // Try to apply configuration directly to the element
        Object.assign(element, configuration);
        return;
      }
      
      // Detect what changed
      const changes = this.detectChanges(
        this.previousConfigurations.get(element.id) || {},
        configuration
      );
      
      console.log('[LivePreview] Detected changes:', changes);
      
      // Apply changes based on type for optimal performance
      if (changes.requiresFullRefresh) {
        await this.fullRefresh(element, configuration, passPack);
      } else {
        await this.incrementalUpdate(element, configuration, changes, passPack);
      }
      
      // Store configuration for next comparison
      this.previousConfigurations.set(element.id, JSON.parse(JSON.stringify(configuration)));
      
      console.log('[LivePreview] Configuration applied successfully');
      
    } catch (error) {
      console.error('[LivePreview] Error applying configuration:', error);
      throw error;
    }
  }

  /**
   * Detect what changed between configurations
   */
  private detectChanges(
    oldConfig: any, 
    newConfig: any
  ): ChangeDetection {
    // Check for column changes
    const oldColumns = oldConfig.optGrid?.columns || [];
    const newColumns = newConfig.optGrid?.columns || [];
    
    if (oldColumns.length !== newColumns.length) {
      return {
        type: oldColumns.length < newColumns.length ? ChangeType.COLUMN_ADD : ChangeType.COLUMN_REMOVE,
        details: { oldColumns, newColumns },
        requiresFullRefresh: true
      };
    }
    
    // Check for column reordering
    const columnsReordered = oldColumns.some((col: any, index: number) => 
      col.name !== newColumns[index]?.name
    );
    
    if (columnsReordered) {
      return {
        type: ChangeType.COLUMN_REORDER,
        details: { oldColumns, newColumns },
        requiresFullRefresh: true
      };
    }
    
    // Check for theme changes
    if (JSON.stringify(oldConfig.theme) !== JSON.stringify(newConfig.theme)) {
      return {
        type: ChangeType.THEME_UPDATE,
        details: { 
          oldTheme: oldConfig.theme, 
          newTheme: newConfig.theme 
        },
        requiresFullRefresh: false
      };
    }
    
    // Check for column updates
    const columnUpdates = this.findColumnUpdates(oldColumns, newColumns);
    if (columnUpdates.length > 0) {
      return {
        type: ChangeType.COLUMN_UPDATE,
        details: { updates: columnUpdates },
        requiresFullRefresh: false
      };
    }
    
    // Check for grid options changes
    if (JSON.stringify(oldConfig.optGrid) !== JSON.stringify(newConfig.optGrid)) {
      return {
        type: ChangeType.GRID_OPTIONS,
        details: { 
          oldOptions: oldConfig.optGrid, 
          newOptions: newConfig.optGrid 
        },
        requiresFullRefresh: false
      };
    }
    
    // Default to full refresh if we can't determine specific changes
    return {
      type: ChangeType.FULL_REFRESH,
      details: {},
      requiresFullRefresh: true
    };
  }

  /**
   * Find specific column updates
   */
  private findColumnUpdates(oldColumns: any[], newColumns: any[]): any[] {
    const updates: any[] = [];
    
    newColumns.forEach((newCol, index) => {
      const oldCol = oldColumns[index];
      if (oldCol && JSON.stringify(oldCol) !== JSON.stringify(newCol)) {
        updates.push({
          index,
          oldColumn: oldCol,
          newColumn: newCol,
          changes: this.getColumnDifferences(oldCol, newCol)
        });
      }
    });
    
    return updates;
  }

  /**
   * Get specific differences between two column configurations
   */
  private getColumnDifferences(oldCol: any, newCol: any): string[] {
    const differences: string[] = [];
    
    Object.keys(newCol).forEach(key => {
      if (JSON.stringify(oldCol[key]) !== JSON.stringify(newCol[key])) {
        differences.push(key);
      }
    });
    
    return differences;
  }

  /**
   * Perform a full refresh of the DataTable
   */
  private async fullRefresh(
    element: HTMLElement, 
    configuration: any, 
    passPack: any
  ): Promise<void> {
    console.log('[LivePreview] Performing full refresh');
    
    // Update the passPack configuration
    passPack.processedSettings = configuration;
    
    // Get the grid instance
    const grid = passPack.grid;
    
    if (grid) {
      // Store current selection and scroll position
      const scrollTop = grid.getScrollTop ? grid.getScrollTop() : 0;
      const scrollLeft = grid.getScrollLeft ? grid.getScrollLeft() : 0;
      const selection = grid.getSelection ? grid.getSelection() : null;
      
      // Apply new configuration
      await this.applySettingsToDataTable(element, configuration, passPack);
      
      // Restore state after refresh
      setTimeout(() => {
        if (grid.setScrollTop) grid.setScrollTop(scrollTop);
        if (grid.setScrollLeft) grid.setScrollLeft(scrollLeft);
        if (selection && grid.setSelection) {
          grid.setSelection(selection);
        }
      }, 100);
    } else {
      // No grid instance, apply settings directly
      await this.applySettingsToDataTable(element, configuration, passPack);
    }
  }

  /**
   * Perform incremental updates for better performance
   */
  private async incrementalUpdate(
    element: HTMLElement, 
    configuration: any, 
    changes: ChangeDetection,
    passPack: any
  ): Promise<void> {
    console.log('[LivePreview] Performing incremental update:', changes.type);
    
    switch (changes.type) {
      case ChangeType.THEME_UPDATE:
        this.debouncedThemeUpdate(element, changes.details.newTheme);
        break;
        
      case ChangeType.COLUMN_UPDATE:
        this.debouncedColumnUpdate(element, changes.details.updates, passPack);
        break;
        
      case ChangeType.GRID_OPTIONS:
        this.debouncedGridUpdate(element, changes.details.newOptions, passPack);
        break;
        
      default:
        // Fall back to full refresh
        await this.fullRefresh(element, configuration, passPack);
    }
  }

  /**
   * Apply theme changes without full refresh
   */
  private applyThemeChanges(element: HTMLElement, theme: ThemeConfiguration): void {
    console.log('[LivePreview] Applying theme changes');
    
    // Apply CSS variables for theme
    const root = element as HTMLElement;
    
    if (theme.colors) {
      root.style.setProperty('--dt-primary-color', theme.colors.primary);
      root.style.setProperty('--dt-secondary-color', theme.colors.secondary);
      root.style.setProperty('--dt-background-color', theme.colors.background);
      root.style.setProperty('--dt-surface-color', theme.colors.surface);
      root.style.setProperty('--dt-text-primary', theme.colors.text.primary);
      root.style.setProperty('--dt-text-secondary', theme.colors.text.secondary);
    }
    
    if (theme.typography) {
      root.style.setProperty('--dt-font-family', theme.typography.fontFamily);
      root.style.setProperty('--dt-font-size-small', theme.typography.fontSize.small);
      root.style.setProperty('--dt-font-size-medium', theme.typography.fontSize.medium);
      root.style.setProperty('--dt-font-size-large', theme.typography.fontSize.large);
    }
    
    if (theme.spacing) {
      root.style.setProperty('--dt-spacing-small', theme.spacing.padding.small);
      root.style.setProperty('--dt-spacing-medium', theme.spacing.padding.medium);
      root.style.setProperty('--dt-spacing-large', theme.spacing.padding.large);
    }
    
    if (theme.effects) {
      root.style.setProperty('--dt-border-radius-small', theme.effects.borderRadius.small);
      root.style.setProperty('--dt-border-radius-medium', theme.effects.borderRadius.medium);
      root.style.setProperty('--dt-border-radius-large', theme.effects.borderRadius.large);
      root.style.setProperty('--dt-shadow-small', theme.effects.shadow.small);
      root.style.setProperty('--dt-shadow-medium', theme.effects.shadow.medium);
      root.style.setProperty('--dt-shadow-large', theme.effects.shadow.large);
    }
    
    // Trigger re-render of the grid to apply theme
    const grid = (element as any).passPack?.grid;
    if (grid && grid.refreshLayout) {
      grid.refreshLayout();
    }
  }

  /**
   * Apply column changes without full refresh
   */
  private applyColumnChanges(
    element: HTMLElement, 
    updates: any[], 
    passPack: any
  ): void {
    console.log('[LivePreview] Applying column changes:', updates);
    
    const grid = passPack.grid;
    if (!grid) return;
    
    updates.forEach(update => {
      const { index, newColumn, changes } = update;
      
      // Update specific column properties
      if (changes.includes('header') && grid.setColumnHeaders) {
        const headers = grid.getColumnHeaders();
        headers[index] = newColumn.header;
        grid.setColumnHeaders(headers);
      }
      
      if (changes.includes('width') && grid.setColumnWidth) {
        grid.setColumnWidth(newColumn.name, newColumn.width);
      }
      
      if (changes.includes('hidden') && grid.hideColumn && grid.showColumn) {
        if (newColumn.hidden) {
          grid.hideColumn(newColumn.name);
        } else {
          grid.showColumn(newColumn.name);
        }
      }
      
      if (changes.includes('formatter')) {
        // Formatter changes require column model update
        this.updateColumnFormatter(grid, newColumn);
      }
    });
    
    // Refresh the grid layout
    if (grid.refreshLayout) {
      grid.refreshLayout();
    }
  }

  /**
   * Apply grid option changes
   */
  private applyGridChanges(
    element: HTMLElement, 
    gridOptions: any, 
    passPack: any
  ): void {
    console.log('[LivePreview] Applying grid option changes:', gridOptions);
    
    const grid = passPack.grid;
    if (!grid) return;
    
    // Apply pagination changes
    if (gridOptions.pageOptions && grid.setPagination) {
      grid.setPagination(gridOptions.pageOptions);
    }
    
    // Apply row height changes
    if (gridOptions.rowHeight && grid.setRowHeight) {
      grid.setRowHeight(gridOptions.rowHeight);
    }
    
    // Apply scroll settings
    if (typeof gridOptions.scrollX !== 'undefined' && grid.setScrollX) {
      grid.setScrollX(gridOptions.scrollX);
    }
    
    if (typeof gridOptions.scrollY !== 'undefined' && grid.setScrollY) {
      grid.setScrollY(gridOptions.scrollY);
    }
    
    // Refresh layout
    if (grid.refreshLayout) {
      grid.refreshLayout();
    }
  }

  /**
   * Update column formatter
   */
  private updateColumnFormatter(grid: any, column: any): void {
    if (!grid.getColumns || !grid.setColumns) return;
    
    const columns = grid.getColumns();
    const targetColumn = columns.find((col: any) => col.name === column.name);
    
    if (targetColumn) {
      // Convert formatter string to function
      if (typeof column.formatter === 'string') {
        try {
          targetColumn.formatter = new Function('props', `
            try {
              return ${column.formatter};
            } catch (e) {
              console.error('Formatter error:', e);
              return props.value;
            }
          `);
        } catch (error) {
          console.error('[LivePreview] Error creating formatter function:', error);
        }
      } else {
        targetColumn.formatter = column.formatter;
      }
      
      // Update columns
      grid.setColumns(columns);
    }
  }

  /**
   * Apply settings to DataTable element
   */
  private async applySettingsToDataTable(
    element: HTMLElement, 
    configuration: any, 
    passPack: any
  ): Promise<void> {
    // This would call the existing DataTable extension's render method
    // or apply configuration directly to the TUI Grid instance
    
    try {
      // Update element properties
      Object.assign(element, configuration);
      
      // If there's a render method on the extension, call it
      if (passPack.extension && passPack.extension.render) {
        await passPack.extension.render(passPack);
      }
      
      // Trigger custom event for configuration change
      element.dispatchEvent(new CustomEvent('configuration-changed', {
        detail: configuration,
        bubbles: true
      }));
      
    } catch (error) {
      console.error('[LivePreview] Error applying settings:', error);
      throw error;
    }
  }

  /**
   * Queue an update for batch processing
   */
  public queueUpdate(elementId: string, configuration: any): void {
    this.updateQueue.set(elementId, configuration);
    
    if (!this.isProcessing) {
      this.processUpdateQueue();
    }
  }

  /**
   * Process queued updates
   */
  private async processUpdateQueue(): Promise<void> {
    if (this.updateQueue.size === 0) {
      this.isProcessing = false;
      return;
    }
    
    this.isProcessing = true;
    
    // Process all queued updates
    for (const [elementId, configuration] of this.updateQueue) {
      const element = document.getElementById(elementId);
      
      if (element) {
        try {
          await this.applyConfiguration(element, configuration);
        } catch (error) {
          console.error(`[LivePreview] Error processing update for ${elementId}:`, error);
        }
      }
      
      this.updateQueue.delete(elementId);
    }
    
    this.isProcessing = false;
    
    // Check if new updates were added while processing
    if (this.updateQueue.size > 0) {
      this.processUpdateQueue();
    }
  }

  /**
   * Clear cached configurations
   */
  public clearCache(): void {
    this.previousConfigurations.clear();
    this.updateQueue.clear();
  }

  /**
   * Destroy the engine and clean up
   */
  public destroy(): void {
    this.clearCache();
    this.isProcessing = false;
  }
}