/**
 * TuiGridAdapter
 * Adapter for proper TUI Grid integration with DevMode
 */

import Grid from 'tui-grid';

export interface GridUpdateOptions {
  preserveSelection?: boolean;
  preserveScroll?: boolean;
  preserveFocus?: boolean;
  animated?: boolean;
}

export class TuiGridAdapter {
  private grid: any;
  private lastState: {
    selection?: any;
    scroll?: { x: number; y: number };
    focus?: { rowKey: number; columnName: string };
  } = {};

  constructor(grid: any) {
    this.grid = grid;
  }

  /**
   * Update columns with proper TUI Grid API
   */
  public updateColumns(columns: any[], options: GridUpdateOptions = {}): void {
    if (!this.grid || !columns) return;
    
    try {
      // Preserve state if requested
      if (options.preserveSelection || options.preserveScroll || options.preserveFocus) {
        this.preserveState(options);
      }
      
      // Update columns using TUI Grid API
      if (this.grid.setColumns) {
        // Transform columns to TUI Grid format
        const tuiColumns = this.transformColumnsToTuiFormat(columns);
        this.grid.setColumns(tuiColumns);
      } else if (this.grid.resetColumns) {
        // Alternative API for older versions
        this.grid.resetColumns(columns);
      }
      
      // Update column widths
      columns.forEach(column => {
        if (column.width && this.grid.setColumnWidth) {
          this.grid.setColumnWidth(column.name, column.width);
        }
      });
      
      // Update visibility
      columns.forEach(column => {
        if (column.hidden !== undefined) {
          if (column.hidden && this.grid.hideColumn) {
            this.grid.hideColumn(column.name);
          } else if (!column.hidden && this.grid.showColumn) {
            this.grid.showColumn(column.name);
          }
        }
      });
      
      // Restore state if preserved
      if (options.preserveSelection || options.preserveScroll || options.preserveFocus) {
        this.restoreState(options);
      }
      
      // Refresh layout
      this.refreshGrid();
      
    } catch (error) {
      console.error('[TuiGridAdapter] Failed to update columns:', error);
    }
  }

  /**
   * Transform columns to TUI Grid format
   */
  private transformColumnsToTuiFormat(columns: any[]): any[] {
    return columns.map(column => {
      const tuiColumn: any = {
        name: column.name,
        header: column.header || column.name
      };
      
      // Map properties
      if (column.width) tuiColumn.width = column.width;
      if (column.minWidth) tuiColumn.minWidth = column.minWidth;
      if (column.resizable !== undefined) tuiColumn.resizable = column.resizable;
      if (column.sortable !== undefined) tuiColumn.sortable = column.sortable;
      if (column.align) tuiColumn.align = column.align;
      if (column.valign) tuiColumn.valign = column.valign;
      if (column.className) tuiColumn.className = column.className;
      if (column.hidden) tuiColumn.hidden = column.hidden;
      if (column.rowSpan !== undefined) tuiColumn.rowSpan = column.rowSpan;
      
      // Handle formatter
      if (column.formatter) {
        if (typeof column.formatter === 'function') {
          tuiColumn.formatter = column.formatter;
        } else if (typeof column.formatter === 'string') {
          tuiColumn.formatter = this.createFormatter(column.formatter);
        }
      }
      
      // Handle editor
      if (column.editor) {
        tuiColumn.editor = this.transformEditor(column.editor);
      }
      
      // Handle renderer
      if (column.renderer) {
        tuiColumn.renderer = this.transformRenderer(column.renderer);
      }
      
      // Handle validation
      if (column.validation) {
        tuiColumn.validation = column.validation;
      }
      
      return tuiColumn;
    });
  }

  /**
   * Create formatter function
   */
  private createFormatter(formatter: string): Function {
    return (props: any) => {
      try {
        // Create safe context
        const context = {
          value: props.value,
          row: props.row,
          column: props.column
        };
        
        // Execute formatter
        return new Function('props', `
          const { value, row, column } = props;
          return ${formatter};
        `)(context);
      } catch (error) {
        console.error('[TuiGridAdapter] Formatter error:', error);
        return props.value;
      }
    };
  }

  /**
   * Transform editor configuration
   */
  private transformEditor(editor: any): any {
    if (!editor) return null;
    
    if (typeof editor === 'string') {
      // Simple editor type
      return { type: editor };
    }
    
    if (typeof editor === 'object') {
      const tuiEditor: any = { type: editor.type || 'text' };
      
      // Handle options based on type
      switch (editor.type) {
        case 'select':
        case 'checkbox':
        case 'radio':
          if (editor.options?.listItems) {
            tuiEditor.options = {
              listItems: editor.options.listItems
            };
          }
          break;
          
        case 'datePicker':
          tuiEditor.options = {
            format: editor.options?.format || 'yyyy-MM-dd',
            ...editor.options
          };
          break;
          
        default:
          if (editor.options) {
            tuiEditor.options = editor.options;
          }
      }
      
      return tuiEditor;
    }
    
    return null;
  }

  /**
   * Transform renderer configuration
   */
  private transformRenderer(renderer: any): any {
    if (!renderer) return null;
    
    if (typeof renderer === 'object' && renderer.type) {
      // Custom renderer
      return {
        type: renderer.type,
        options: renderer.options || {}
      };
    }
    
    return renderer;
  }

  /**
   * Update theme
   */
  public updateTheme(theme: any): void {
    if (!this.grid || !theme) return;
    
    try {
      // Use TUI Grid's applyTheme API
      if (this.grid.applyTheme) {
        const tuiTheme = this.transformThemeToTuiFormat(theme);
        this.grid.applyTheme('custom', tuiTheme);
      } else {
        // Fallback: Update CSS variables
        this.updateThemeViaCSS(theme);
      }
      
      this.refreshGrid();
      
    } catch (error) {
      console.error('[TuiGridAdapter] Failed to update theme:', error);
    }
  }

  /**
   * Transform theme to TUI Grid format
   */
  private transformThemeToTuiFormat(theme: any): any {
    return {
      selection: {
        background: theme.selection?.background || '#4dabf7',
        border: theme.selection?.border || '#4dabf7'
      },
      scrollbar: {
        background: theme.scrollbar?.background || '#f1f3f5',
        thumb: theme.scrollbar?.thumb || '#adb5bd',
        active: theme.scrollbar?.active || '#868e96'
      },
      frozenBorder: {
        border: theme.frozenBorder?.border || '#adb5bd'
      },
      area: {
        header: {
          background: theme.area?.header?.background || '#f8f9fa',
          border: theme.area?.header?.border || '#e9ecef'
        },
        body: {
          background: theme.area?.body?.background || '#fff'
        },
        summary: {
          background: theme.area?.summary?.background || '#fff',
          border: theme.area?.summary?.border || '#e9ecef'
        }
      },
      row: {
        even: {
          background: theme.row?.even?.background || '#fff',
          text: theme.row?.even?.text || '#212529'
        },
        odd: {
          background: theme.row?.odd?.background || '#f8f9fa',
          text: theme.row?.odd?.text || '#212529'
        },
        hover: {
          background: theme.row?.hover?.background || '#f1f3f5'
        },
        dummy: {
          background: theme.row?.dummy?.background || '#fff'
        }
      },
      cell: {
        normal: {
          background: theme.cell?.normal?.background || '#fff',
          border: theme.cell?.normal?.border || '#e9ecef',
          text: theme.cell?.normal?.text || '#212529',
          showVerticalBorder: theme.cell?.normal?.showVerticalBorder !== false,
          showHorizontalBorder: theme.cell?.normal?.showHorizontalBorder !== false
        },
        header: {
          background: theme.cell?.header?.background || '#f8f9fa',
          border: theme.cell?.header?.border || '#e9ecef',
          text: theme.cell?.header?.text || '#212529',
          showVerticalBorder: theme.cell?.header?.showVerticalBorder !== false,
          showHorizontalBorder: theme.cell?.header?.showHorizontalBorder !== false
        },
        rowHeader: {
          background: theme.cell?.rowHeader?.background || '#f8f9fa',
          border: theme.cell?.rowHeader?.border || '#e9ecef',
          text: theme.cell?.rowHeader?.text || '#212529',
          showVerticalBorder: theme.cell?.rowHeader?.showVerticalBorder !== false,
          showHorizontalBorder: theme.cell?.rowHeader?.showHorizontalBorder !== false
        },
        summary: {
          background: theme.cell?.summary?.background || '#fff',
          border: theme.cell?.summary?.border || '#e9ecef',
          text: theme.cell?.summary?.text || '#212529',
          showVerticalBorder: theme.cell?.summary?.showVerticalBorder !== false,
          showHorizontalBorder: theme.cell?.summary?.showHorizontalBorder !== false
        },
        selectedHeader: {
          background: theme.cell?.selectedHeader?.background || '#e3f2fd'
        },
        selectedRowHeader: {
          background: theme.cell?.selectedRowHeader?.background || '#e3f2fd'
        },
        focused: {
          border: theme.cell?.focused?.border || '#4dabf7'
        },
        focusedInactive: {
          border: theme.cell?.focusedInactive?.border || '#adb5bd'
        },
        required: {
          background: theme.cell?.required?.background || '#fff4e6'
        },
        editable: {
          background: theme.cell?.editable?.background || '#fff'
        },
        disabled: {
          background: theme.cell?.disabled?.background || '#f8f9fa',
          text: theme.cell?.disabled?.text || '#adb5bd'
        },
        invalid: {
          background: theme.cell?.invalid?.background || '#fff5f5',
          text: theme.cell?.invalid?.text || '#ff6b6b'
        }
      }
    };
  }

  /**
   * Update theme via CSS variables
   */
  private updateThemeViaCSS(theme: any): void {
    const gridElement = this.grid.el;
    if (!gridElement) return;
    
    const style = gridElement.style;
    
    // Set CSS variables
    if (theme.colors) {
      style.setProperty('--tui-grid-primary-color', theme.colors.primary || '#4dabf7');
      style.setProperty('--tui-grid-background-color', theme.colors.background || '#fff');
      style.setProperty('--tui-grid-text-color', theme.colors.text?.primary || '#212529');
    }
    
    if (theme.typography) {
      style.setProperty('--tui-grid-font-family', theme.typography.fontFamily || 'inherit');
      style.setProperty('--tui-grid-font-size', theme.typography.fontSize?.medium || '14px');
    }
  }

  /**
   * Update grid options
   */
  public updateOptions(options: any): void {
    if (!this.grid || !options) return;
    
    try {
      // Update pagination
      if (options.pageOptions) {
        this.updatePagination(options.pageOptions);
      }
      
      // Update row height
      if (options.rowHeight && this.grid.setRowHeight) {
        this.grid.setRowHeight(options.rowHeight);
      }
      
      // Update selection
      if (options.selectionUnit && this.grid.setSelectionUnit) {
        this.grid.setSelectionUnit(options.selectionUnit);
      }
      
      // Update scrolling
      if (options.scrollX !== undefined && this.grid.setScrollX) {
        this.grid.setScrollX(options.scrollX);
      }
      
      if (options.scrollY !== undefined && this.grid.setScrollY) {
        this.grid.setScrollY(options.scrollY);
      }
      
      // Update column options
      if (options.columnOptions && this.grid.setColumnOptions) {
        this.grid.setColumnOptions(options.columnOptions);
      }
      
      // Update summary
      if (options.summary && this.grid.setSummaryColumnContent) {
        Object.keys(options.summary).forEach(columnName => {
          this.grid.setSummaryColumnContent(columnName, options.summary[columnName]);
        });
      }
      
      this.refreshGrid();
      
    } catch (error) {
      console.error('[TuiGridAdapter] Failed to update options:', error);
    }
  }

  /**
   * Update pagination
   */
  private updatePagination(pageOptions: any): void {
    if (!this.grid) return;
    
    if (this.grid.setPaginationOptions) {
      this.grid.setPaginationOptions(pageOptions);
    } else if (this.grid.setPerPage) {
      // Fallback for older versions
      if (pageOptions.perPage) {
        this.grid.setPerPage(pageOptions.perPage);
      }
    }
  }

  /**
   * Preserve grid state
   */
  private preserveState(options: GridUpdateOptions): void {
    if (!this.grid) return;
    
    this.lastState = {};
    
    if (options.preserveSelection && this.grid.getSelection) {
      this.lastState.selection = this.grid.getSelection();
    }
    
    if (options.preserveScroll) {
      this.lastState.scroll = {
        x: this.grid.getScrollLeft ? this.grid.getScrollLeft() : 0,
        y: this.grid.getScrollTop ? this.grid.getScrollTop() : 0
      };
    }
    
    if (options.preserveFocus && this.grid.getFocusedCell) {
      this.lastState.focus = this.grid.getFocusedCell();
    }
  }

  /**
   * Restore grid state
   */
  private restoreState(options: GridUpdateOptions): void {
    if (!this.grid || !this.lastState) return;
    
    setTimeout(() => {
      if (options.preserveSelection && this.lastState.selection) {
        if (this.grid.setSelection) {
          this.grid.setSelection(this.lastState.selection);
        }
      }
      
      if (options.preserveScroll && this.lastState.scroll) {
        if (this.grid.setScrollLeft) {
          this.grid.setScrollLeft(this.lastState.scroll.x);
        }
        if (this.grid.setScrollTop) {
          this.grid.setScrollTop(this.lastState.scroll.y);
        }
      }
      
      if (options.preserveFocus && this.lastState.focus) {
        if (this.grid.focusAt) {
          this.grid.focusAt(
            this.lastState.focus.rowKey,
            this.lastState.focus.columnName
          );
        }
      }
    }, 50);
  }

  /**
   * Refresh grid layout
   */
  private refreshGrid(): void {
    if (!this.grid) return;
    
    // Try different refresh methods
    if (this.grid.refreshLayout) {
      this.grid.refreshLayout();
    } else if (this.grid.render) {
      this.grid.render();
    } else if (this.grid.paint) {
      this.grid.paint();
    }
  }

  /**
   * Update data
   */
  public updateData(data: any[]): void {
    if (!this.grid || !data) return;
    
    try {
      if (this.grid.resetData) {
        this.grid.resetData(data);
      } else if (this.grid.setData) {
        this.grid.setData(data);
      }
      
      this.refreshGrid();
      
    } catch (error) {
      console.error('[TuiGridAdapter] Failed to update data:', error);
    }
  }

  /**
   * Get grid instance
   */
  public getGridInstance(): any {
    return this.grid;
  }

  /**
   * Destroy adapter
   */
  public destroy(): void {
    this.lastState = {};
    this.grid = null;
  }
}