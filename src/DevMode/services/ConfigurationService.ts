/**
 * ConfigurationService
 * Handles configuration operations with validation and transformation
 */

import { IASK2DataTableSettings } from '../../DataTables/Extension/interfaces';
import { ValidationEngine } from '../engines/ValidationEngine';
import { ConfigurationStore } from '../store/ConfigurationStore';
import { EventBus } from '../utils/EventBus';

export interface ConfigurationChange {
  path: string;
  oldValue: any;
  newValue: any;
  timestamp: number;
}

export interface ConfigurationSnapshot {
  configuration: IASK2DataTableSettings;
  metadata: {
    timestamp: number;
    version: string;
    checksum: string;
  };
}

export class ConfigurationService {
  private validationEngine: ValidationEngine;
  private configurationStore: ConfigurationStore;
  private eventBus: EventBus;
  private changeLog: ConfigurationChange[] = [];
  private transformers: Map<string, (value: any) => any> = new Map();
  private validators: Map<string, (value: any) => boolean> = new Map();

  constructor() {
    this.validationEngine = new ValidationEngine();
    this.configurationStore = new ConfigurationStore();
    this.eventBus = new EventBus();
    this.setupDefaultTransformers();
    this.setupDefaultValidators();
  }

  /**
   * Apply configuration with validation and transformation
   */
  public async applyConfiguration(
    controlId: string,
    configuration: any,
    options: {
      validate?: boolean;
      transform?: boolean;
      silent?: boolean;
    } = {}
  ): Promise<{
    success: boolean;
    configuration?: any;
    errors?: string[];
  }> {
    const { validate = true, transform = true, silent = false } = options;
    
    try {
      // Transform configuration if needed
      let processedConfig = configuration;
      if (transform) {
        processedConfig = await this.transformConfiguration(configuration);
      }
      
      // Validate configuration
      if (validate) {
        const validationResult = await this.validationEngine.validate(processedConfig);
        
        if (!validationResult.valid) {
          const errors = validationResult.errors.map(e => e.message);
          
          if (!silent) {
            this.eventBus.emit('configuration-validation-failed', {
              controlId,
              errors: validationResult.errors,
              warnings: validationResult.warnings
            });
          }
          
          return {
            success: false,
            errors
          };
        }
      }
      
      // Store configuration
      this.configurationStore.setConfiguration(
        controlId,
        processedConfig,
        'Configuration applied',
        'user'
      );
      
      // Log change
      this.logConfigurationChange(controlId, configuration, processedConfig);
      
      // Emit success event
      if (!silent) {
        this.eventBus.emit('configuration-applied', {
          controlId,
          configuration: processedConfig
        });
      }
      
      return {
        success: true,
        configuration: processedConfig
      };
      
    } catch (error) {
      console.error('[ConfigurationService] Failed to apply configuration:', error);
      
      return {
        success: false,
        errors: [(error as Error).message]
      };
    }
  }

  /**
   * Transform configuration
   */
  private async transformConfiguration(configuration: any): Promise<any> {
    const transformed = { ...configuration };
    
    // Transform columns
    if (transformed.optGrid?.columns) {
      transformed.optGrid.columns = await this.transformColumns(transformed.optGrid.columns);
    }
    
    // Transform theme
    if (transformed.theme) {
      transformed.theme = this.transformTheme(transformed.theme);
    }
    
    // Apply custom transformers
    for (const [path, transformer] of this.transformers) {
      const value = this.getValueByPath(transformed, path);
      if (value !== undefined) {
        this.setValueByPath(transformed, path, transformer(value));
      }
    }
    
    return transformed;
  }

  /**
   * Transform columns
   */
  private async transformColumns(columns: any[]): Promise<any[]> {
    return columns.map((column, index) => {
      const transformed = { ...column };
      
      // Ensure required fields
      if (!transformed.name) {
        transformed.name = `column_${index}`;
      }
      
      if (!transformed.header) {
        transformed.header = transformed.name;
      }
      
      // Transform formatter from string to function
      if (typeof transformed.formatter === 'string') {
        transformed.formatter = this.createFormatterFunction(transformed.formatter);
      }
      
      // Normalize editor configuration
      if (transformed.editor) {
        transformed.editor = this.normalizeEditor(transformed.editor);
      }
      
      // Normalize filter configuration
      if (transformed.filter) {
        transformed.filter = this.normalizeFilter(transformed.filter);
      }
      
      return transformed;
    });
  }

  /**
   * Create formatter function from string
   */
  private createFormatterFunction(formatter: string): Function | string {
    try {
      // Validate formatter string for safety
      if (this.isUnsafeCode(formatter)) {
        console.warn('[ConfigurationService] Unsafe formatter detected, keeping as string');
        return formatter;
      }
      
      // Create sandboxed function
      return new Function('props', `
        'use strict';
        try {
          const { value, row, column } = props;
          return ${formatter};
        } catch (error) {
          console.error('Formatter error:', error);
          return props.value;
        }
      `);
    } catch (error) {
      console.error('[ConfigurationService] Failed to create formatter function:', error);
      return formatter;
    }
  }

  /**
   * Check if code is potentially unsafe
   */
  private isUnsafeCode(code: string): boolean {
    const unsafePatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /setTimeout\s*\(/,
      /setInterval\s*\(/,
      /document\./,
      /window\./,
      /require\s*\(/,
      /import\s+/,
      /fetch\s*\(/,
      /XMLHttpRequest/
    ];
    
    return unsafePatterns.some(pattern => pattern.test(code));
  }

  /**
   * Normalize editor configuration
   */
  private normalizeEditor(editor: any): any {
    if (typeof editor === 'string') {
      return {
        type: editor,
        options: {}
      };
    }
    
    if (typeof editor === 'object' && editor !== null) {
      return {
        type: editor.type || 'text',
        options: editor.options || {}
      };
    }
    
    return null;
  }

  /**
   * Normalize filter configuration
   */
  private normalizeFilter(filter: any): any {
    if (typeof filter === 'string') {
      return {
        type: filter,
        showApplyBtn: true,
        showClearBtn: true
      };
    }
    
    if (typeof filter === 'object' && filter !== null) {
      return {
        type: filter.type || 'text',
        showApplyBtn: filter.showApplyBtn !== false,
        showClearBtn: filter.showClearBtn !== false,
        ...filter.options
      };
    }
    
    return null;
  }

  /**
   * Transform theme configuration
   */
  private transformTheme(theme: any): any {
    const transformed = { ...theme };
    
    // Ensure color values are valid
    if (transformed.colors) {
      Object.keys(transformed.colors).forEach(key => {
        const value = transformed.colors[key];
        if (typeof value === 'string') {
          transformed.colors[key] = this.normalizeColor(value);
        }
      });
    }
    
    return transformed;
  }

  /**
   * Normalize color value
   */
  private normalizeColor(color: string): string {
    // Remove whitespace
    color = color.trim();
    
    // Convert color names to hex
    const colorMap: Record<string, string> = {
      'white': '#ffffff',
      'black': '#000000',
      'red': '#ff0000',
      'green': '#008000',
      'blue': '#0000ff',
      'yellow': '#ffff00',
      'transparent': 'transparent'
    };
    
    if (colorMap[color.toLowerCase()]) {
      return colorMap[color.toLowerCase()];
    }
    
    // Validate hex color
    if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
      // Convert 3-digit hex to 6-digit
      return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    
    return color;
  }

  /**
   * Log configuration change
   */
  private logConfigurationChange(
    controlId: string,
    oldConfig: any,
    newConfig: any
  ): void {
    const changes = this.detectChanges(oldConfig, newConfig);
    
    changes.forEach(change => {
      this.changeLog.push({
        ...change,
        timestamp: Date.now()
      });
    });
    
    // Limit change log size
    if (this.changeLog.length > 1000) {
      this.changeLog = this.changeLog.slice(-500);
    }
  }

  /**
   * Detect changes between configurations
   */
  private detectChanges(oldConfig: any, newConfig: any, path: string = ''): ConfigurationChange[] {
    const changes: ConfigurationChange[] = [];
    
    // Handle null/undefined
    if (oldConfig === newConfig) {
      return changes;
    }
    
    if (oldConfig === null || oldConfig === undefined) {
      changes.push({
        path,
        oldValue: oldConfig,
        newValue: newConfig,
        timestamp: Date.now()
      });
      return changes;
    }
    
    if (newConfig === null || newConfig === undefined) {
      changes.push({
        path,
        oldValue: oldConfig,
        newValue: newConfig,
        timestamp: Date.now()
      });
      return changes;
    }
    
    // Handle arrays
    if (Array.isArray(oldConfig) && Array.isArray(newConfig)) {
      const maxLength = Math.max(oldConfig.length, newConfig.length);
      for (let i = 0; i < maxLength; i++) {
        changes.push(...this.detectChanges(
          oldConfig[i],
          newConfig[i],
          `${path}[${i}]`
        ));
      }
      return changes;
    }
    
    // Handle objects
    if (typeof oldConfig === 'object' && typeof newConfig === 'object') {
      const allKeys = new Set([...Object.keys(oldConfig), ...Object.keys(newConfig)]);
      
      allKeys.forEach(key => {
        const newPath = path ? `${path}.${key}` : key;
        changes.push(...this.detectChanges(oldConfig[key], newConfig[key], newPath));
      });
      
      return changes;
    }
    
    // Handle primitives
    if (oldConfig !== newConfig) {
      changes.push({
        path,
        oldValue: oldConfig,
        newValue: newConfig,
        timestamp: Date.now()
      });
    }
    
    return changes;
  }

  /**
   * Get value by path
   */
  private getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((current, part) => {
      if (current === null || current === undefined) {
        return undefined;
      }
      
      const match = part.match(/^(.+)\[(\d+)\]$/);
      if (match) {
        return current[match[1]]?.[parseInt(match[2])];
      }
      
      return current[part];
    }, obj);
  }

  /**
   * Set value by path
   */
  private setValueByPath(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    const lastPart = parts.pop()!;
    
    const target = parts.reduce((current, part) => {
      const match = part.match(/^(.+)\[(\d+)\]$/);
      if (match) {
        if (!current[match[1]]) {
          current[match[1]] = [];
        }
        const index = parseInt(match[2]);
        if (!current[match[1]][index]) {
          current[match[1]][index] = {};
        }
        return current[match[1]][index];
      }
      
      if (!current[part]) {
        current[part] = {};
      }
      return current[part];
    }, obj);
    
    const match = lastPart.match(/^(.+)\[(\d+)\]$/);
    if (match) {
      if (!target[match[1]]) {
        target[match[1]] = [];
      }
      target[match[1]][parseInt(match[2])] = value;
    } else {
      target[lastPart] = value;
    }
  }

  /**
   * Setup default transformers
   */
  private setupDefaultTransformers(): void {
    // Add default transformers
    this.transformers.set('optGrid.rowHeight', (value) => {
      const num = parseInt(value);
      return isNaN(num) ? 40 : Math.max(20, Math.min(200, num));
    });
    
    this.transformers.set('optGrid.pageOptions.perPage', (value) => {
      const num = parseInt(value);
      return isNaN(num) ? 20 : Math.max(5, Math.min(100, num));
    });
  }

  /**
   * Setup default validators
   */
  private setupDefaultValidators(): void {
    // Add default validators
    this.validators.set('optGrid.columns', (value) => {
      return Array.isArray(value) && value.length > 0;
    });
    
    this.validators.set('theme.colors.primary', (value) => {
      return typeof value === 'string' && value.length > 0;
    });
  }

  /**
   * Register custom transformer
   */
  public registerTransformer(path: string, transformer: (value: any) => any): void {
    this.transformers.set(path, transformer);
  }

  /**
   * Register custom validator
   */
  public registerValidator(path: string, validator: (value: any) => boolean): void {
    this.validators.set(path, validator);
  }

  /**
   * Get configuration snapshot
   */
  public getSnapshot(controlId: string): ConfigurationSnapshot | null {
    const configuration = this.configurationStore.getConfiguration(controlId);
    
    if (!configuration) {
      return null;
    }
    
    return {
      configuration,
      metadata: {
        timestamp: Date.now(),
        version: '1.0.0',
        checksum: this.calculateChecksum(configuration)
      }
    };
  }

  /**
   * Calculate checksum for configuration
   */
  private calculateChecksum(configuration: any): string {
    const json = JSON.stringify(configuration);
    let hash = 0;
    
    for (let i = 0; i < json.length; i++) {
      const char = json.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }

  /**
   * Get change log
   */
  public getChangeLog(): ConfigurationChange[] {
    return [...this.changeLog];
  }

  /**
   * Clear change log
   */
  public clearChangeLog(): void {
    this.changeLog = [];
  }

  /**
   * Subscribe to events
   */
  public on(event: string, handler: Function): () => void {
    return this.eventBus.on(event, handler);
  }

  /**
   * Clean up
   */
  public destroy(): void {
    this.eventBus.clear();
    this.transformers.clear();
    this.validators.clear();
    this.changeLog = [];
  }
}