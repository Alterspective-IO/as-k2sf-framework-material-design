/**
 * ValidationEngine - Validates DataTable configurations
 */

import { ValidationResult, ValidationError, ValidationWarning } from '../types';
import { IASK2DataTableSettings } from '../../DataTables/Extension/interfaces';

/**
 * ValidationEngine Class
 * Provides comprehensive validation for DataTable configurations
 */
export class ValidationEngine {
  
  /**
   * Validate a complete configuration
   */
  public async validate(configuration: any): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Validate required fields
    this.validateRequiredFields(configuration, errors);
    
    // Validate column configuration
    this.validateColumns(configuration, errors, warnings);
    
    // Validate theme configuration
    this.validateTheme(configuration, errors, warnings);
    
    // Validate grid options
    this.validateGridOptions(configuration, errors, warnings);
    
    // Validate K2 bindings
    this.validateK2Bindings(configuration, warnings);
    
    // Validate formatters and expressions
    await this.validateExpressions(configuration, errors, warnings);
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Validate required fields
   */
  private validateRequiredFields(config: any, errors: ValidationError[]): void {
    if (!config.optGrid) {
      errors.push({
        field: 'optGrid',
        message: 'Grid configuration (optGrid) is required',
        severity: 'critical'
      });
    }
    
    if (!config.optGrid?.columns || config.optGrid.columns.length === 0) {
      errors.push({
        field: 'optGrid.columns',
        message: 'At least one column must be defined',
        severity: 'error'
      });
    }
  }
  
  /**
   * Validate column configuration
   */
  private validateColumns(
    config: any, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    const columns = config.optGrid?.columns || [];
    const columnNames = new Set<string>();
    
    columns.forEach((column: any, index: number) => {
      // Check for required column fields
      if (!column.name) {
        errors.push({
          field: `columns[${index}].name`,
          message: `Column ${index + 1} must have a name`,
          severity: 'error'
        });
      } else {
        // Check for duplicate column names
        if (columnNames.has(column.name)) {
          errors.push({
            field: `columns[${index}].name`,
            message: `Duplicate column name: ${column.name}`,
            severity: 'error'
          });
        }
        columnNames.add(column.name);
      }
      
      // Check for header
      if (!column.header) {
        warnings.push({
          field: `columns[${index}].header`,
          message: `Column ${column.name || index + 1} has no header text`,
          suggestion: 'Add a header property for better user experience'
        });
      }
      
      // Validate formatter if present
      if (column.formatter && typeof column.formatter === 'string') {
        this.validateFormatter(column.formatter, `columns[${index}].formatter`, errors);
      }
      
      // Validate editor configuration
      if (column.editor && typeof column.editor === 'object') {
        this.validateEditor(column.editor, `columns[${index}].editor`, warnings);
      }
      
      // Validate renderer configuration
      if (column.renderer && typeof column.renderer === 'object') {
        this.validateRenderer(column.renderer, `columns[${index}].renderer`, warnings);
      }
    });
  }
  
  /**
   * Validate formatter expression
   */
  private validateFormatter(
    formatter: string, 
    field: string, 
    errors: ValidationError[]
  ): void {
    try {
      // Try to create a function from the formatter string
      new Function('props', formatter);
    } catch (error) {
      errors.push({
        field,
        message: `Invalid formatter expression: ${(error as Error).message}`,
        severity: 'error'
      });
    }
  }
  
  /**
   * Validate editor configuration
   */
  private validateEditor(
    editor: any, 
    field: string, 
    warnings: ValidationWarning[]
  ): void {
    const validEditorTypes = ['text', 'number', 'select', 'checkbox', 'radio', 'datePicker'];
    
    if (editor.type && !validEditorTypes.includes(editor.type)) {
      warnings.push({
        field: `${field}.type`,
        message: `Unknown editor type: ${editor.type}`,
        suggestion: `Use one of: ${validEditorTypes.join(', ')}`
      });
    }
    
    if (editor.type === 'select' && !editor.options?.listItems) {
      warnings.push({
        field: `${field}.options.listItems`,
        message: 'Select editor requires listItems in options',
        suggestion: 'Add listItems array with text and value properties'
      });
    }
  }
  
  /**
   * Validate renderer configuration
   */
  private validateRenderer(
    renderer: any, 
    field: string, 
    warnings: ValidationWarning[]
  ): void {
    const knownRenderers = [
      'CustomButtonRenderer', 
      'CustomSliderRenderer', 
      'CustomColumnHeader',
      'OverriddenDefaultRenderer'
    ];
    
    if (renderer.type && typeof renderer.type === 'string') {
      if (!knownRenderers.includes(renderer.type)) {
        warnings.push({
          field: `${field}.type`,
          message: `Unknown renderer type: ${renderer.type}`,
          suggestion: `Known types: ${knownRenderers.join(', ')}`
        });
      }
    }
  }
  
  /**
   * Validate theme configuration
   */
  private validateTheme(
    config: any, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    if (!config.theme) {
      return; // Theme is optional
    }
    
    const theme = config.theme;
    
    // Validate color values
    const colorFields = [
      'pagination.background',
      'pagination.text',
      'area.body.background',
      'area.header.background',
      'selection.background',
      'cell.normal.text'
    ];
    
    colorFields.forEach(field => {
      const value = this.getNestedValue(theme, field);
      if (value && !this.isValidColor(value)) {
        warnings.push({
          field: `theme.${field}`,
          message: `Invalid color value: ${value}`,
          suggestion: 'Use hex (#fff), rgb(255,255,255), or color names'
        });
      }
    });
  }
  
  /**
   * Validate grid options
   */
  private validateGridOptions(
    config: any, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    const gridOptions = config.optGrid;
    if (!gridOptions) return;
    
    // Validate row height
    if (gridOptions.rowHeight && gridOptions.rowHeight < 20) {
      warnings.push({
        field: 'optGrid.rowHeight',
        message: `Row height ${gridOptions.rowHeight} is very small`,
        suggestion: 'Consider using a height of at least 30px for better readability'
      });
    }
    
    // Validate pagination
    if (gridOptions.pageOptions) {
      const perPage = gridOptions.pageOptions.perPage;
      if (perPage && perPage > 100) {
        warnings.push({
          field: 'optGrid.pageOptions.perPage',
          message: `Large page size (${perPage}) may impact performance`,
          suggestion: 'Consider using pagination with 50 or fewer items per page'
        });
      }
    }
  }
  
  /**
   * Validate K2 control bindings
   */
  private validateK2Bindings(config: any, warnings: ValidationWarning[]): void {
    const columns = config.optGrid?.columns || [];
    const k2Controls = new Set<string>();
    
    columns.forEach((column: any, index: number) => {
      if (column.k2Control) {
        if (k2Controls.has(column.k2Control)) {
          warnings.push({
            field: `columns[${index}].k2Control`,
            message: `K2 control "${column.k2Control}" is bound to multiple columns`,
            suggestion: 'Each K2 control should typically be bound to only one column'
          });
        }
        k2Controls.add(column.k2Control);
      }
    });
    
    // Check for save control binding
    if (!config.saveK2Control) {
      warnings.push({
        field: 'saveK2Control',
        message: 'No save control specified',
        suggestion: 'Add saveK2Control to enable data persistence'
      });
    }
  }
  
  /**
   * Validate expressions and formatters
   */
  private async validateExpressions(
    config: any, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): Promise<void> {
    const columns = config.optGrid?.columns || [];
    
    for (const column of columns) {
      if (column.formatter && typeof column.formatter === 'string') {
        try {
          // Test the formatter with sample data
          const testFunc = new Function('props', `return ${column.formatter}`);
          testFunc({ value: 'test', row: {}, column: {} });
        } catch (error) {
          warnings.push({
            field: `column.${column.name}.formatter`,
            message: 'Formatter may have runtime errors',
            suggestion: 'Test your formatter with actual data'
          });
        }
      }
    }
  }
  
  /**
   * Check if a value is a valid CSS color
   */
  private isValidColor(color: string): boolean {
    if (!color) return false;
    
    // Check for hex colors
    if (/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(color)) {
      return true;
    }
    
    // Check for rgb/rgba
    if (/^rgba?\(/.test(color)) {
      return true;
    }
    
    // Check for color names (basic check)
    const colorNames = ['white', 'black', 'red', 'green', 'blue', 'yellow', 'gray', 'transparent'];
    if (colorNames.includes(color.toLowerCase())) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, part) => current?.[part], obj);
  }
  
  /**
   * Validate a single column configuration
   */
  public validateColumn(column: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    if (!column.name) {
      errors.push({
        field: 'name',
        message: 'Column name is required',
        severity: 'error'
      });
    }
    
    if (!column.header) {
      warnings.push({
        field: 'header',
        message: 'Column header is recommended',
        suggestion: 'Add a header for better user experience'
      });
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}