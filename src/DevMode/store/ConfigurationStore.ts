/**
 * ConfigurationStore - Centralized state management for configurations
 */

import { EventBus } from '../utils/EventBus';
import { LocalStorageManager } from '../utils/LocalStorageManager';
import { DeepPartial } from '../types';

/**
 * Store event types
 */
export enum StoreEvent {
  CONFIGURATION_UPDATED = 'configuration:updated',
  CONFIGURATION_SAVED = 'configuration:saved',
  CONFIGURATION_LOADED = 'configuration:loaded',
  CONFIGURATION_RESET = 'configuration:reset',
  HISTORY_CHANGED = 'history:changed'
}

/**
 * Configuration history entry
 */
interface HistoryEntry {
  id: string;
  timestamp: number;
  configuration: any;
  description: string;
  source: 'user' | 'template' | 'import' | 'ai';
}

/**
 * ConfigurationStore Class
 * Manages configuration state with history and persistence
 */
export class ConfigurationStore {
  private configurations: Map<string, any> = new Map();
  private history: Map<string, HistoryEntry[]> = new Map();
  private currentIndex: Map<string, number> = new Map();
  private eventBus: EventBus;
  private storage: LocalStorageManager;
  private maxHistorySize: number = 50;
  
  constructor() {
    this.eventBus = new EventBus();
    this.storage = new LocalStorageManager('devmode-config');
    this.loadFromStorage();
  }
  
  /**
   * Get configuration for a control
   */
  public getConfiguration(controlId: string): any | null {
    return this.configurations.get(controlId) || null;
  }
  
  /**
   * Set configuration for a control
   */
  public setConfiguration(
    controlId: string, 
    configuration: any, 
    description: string = 'Manual update',
    source: HistoryEntry['source'] = 'user'
  ): void {
    // Store previous configuration in history
    const current = this.configurations.get(controlId);
    if (current) {
      this.addToHistory(controlId, current, description, source);
    }
    
    // Update configuration
    this.configurations.set(controlId, configuration);
    
    // Save to storage
    this.saveToStorage(controlId);
    
    // Emit event
    this.eventBus.emit(StoreEvent.CONFIGURATION_UPDATED, {
      controlId,
      configuration,
      description,
      source
    });
  }
  
  /**
   * Update partial configuration
   */
  public updateConfiguration(
    controlId: string,
    updates: DeepPartial<any>,
    description: string = 'Partial update'
  ): void {
    const current = this.getConfiguration(controlId) || {};
    const updated = this.deepMerge(current, updates);
    this.setConfiguration(controlId, updated, description);
  }
  
  /**
   * Add to history
   */
  private addToHistory(
    controlId: string,
    configuration: any,
    description: string,
    source: HistoryEntry['source']
  ): void {
    const history = this.history.get(controlId) || [];
    const currentIdx = this.currentIndex.get(controlId) || history.length;
    
    // Remove any entries after current index (for redo functionality)
    const newHistory = history.slice(0, currentIdx);
    
    // Add new entry
    const entry: HistoryEntry = {
      id: `${controlId}-${Date.now()}`,
      timestamp: Date.now(),
      configuration: JSON.parse(JSON.stringify(configuration)),
      description,
      source
    };
    
    newHistory.push(entry);
    
    // Limit history size
    if (newHistory.length > this.maxHistorySize) {
      newHistory.shift();
    }
    
    // Update history and index
    this.history.set(controlId, newHistory);
    this.currentIndex.set(controlId, newHistory.length);
    
    // Emit event
    this.eventBus.emit(StoreEvent.HISTORY_CHANGED, {
      controlId,
      history: newHistory,
      currentIndex: newHistory.length
    });
  }
  
  /**
   * Undo last change
   */
  public undo(controlId: string): boolean {
    const history = this.history.get(controlId) || [];
    const currentIdx = this.currentIndex.get(controlId) || history.length;
    
    if (currentIdx > 0) {
      const newIndex = currentIdx - 1;
      const entry = history[newIndex];
      
      if (entry) {
        this.configurations.set(controlId, entry.configuration);
        this.currentIndex.set(controlId, newIndex);
        
        this.eventBus.emit(StoreEvent.CONFIGURATION_UPDATED, {
          controlId,
          configuration: entry.configuration,
          description: `Undo: ${entry.description}`,
          source: 'user'
        });
        
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Redo last undone change
   */
  public redo(controlId: string): boolean {
    const history = this.history.get(controlId) || [];
    const currentIdx = this.currentIndex.get(controlId) || history.length;
    
    if (currentIdx < history.length - 1) {
      const newIndex = currentIdx + 1;
      const entry = history[newIndex];
      
      if (entry) {
        this.configurations.set(controlId, entry.configuration);
        this.currentIndex.set(controlId, newIndex);
        
        this.eventBus.emit(StoreEvent.CONFIGURATION_UPDATED, {
          controlId,
          configuration: entry.configuration,
          description: `Redo: ${entry.description}`,
          source: 'user'
        });
        
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Can undo check
   */
  public canUndo(controlId: string): boolean {
    const currentIdx = this.currentIndex.get(controlId) || 0;
    return currentIdx > 0;
  }
  
  /**
   * Can redo check
   */
  public canRedo(controlId: string): boolean {
    const history = this.history.get(controlId) || [];
    const currentIdx = this.currentIndex.get(controlId) || history.length;
    return currentIdx < history.length - 1;
  }
  
  /**
   * Get history for a control
   */
  public getHistory(controlId: string): HistoryEntry[] {
    return this.history.get(controlId) || [];
  }
  
  /**
   * Clear history for a control
   */
  public clearHistory(controlId: string): void {
    this.history.delete(controlId);
    this.currentIndex.delete(controlId);
    
    this.eventBus.emit(StoreEvent.HISTORY_CHANGED, {
      controlId,
      history: [],
      currentIndex: 0
    });
  }
  
  /**
   * Reset configuration to original
   */
  public reset(controlId: string, originalConfiguration: any): void {
    this.configurations.set(controlId, originalConfiguration);
    this.clearHistory(controlId);
    
    this.eventBus.emit(StoreEvent.CONFIGURATION_RESET, {
      controlId,
      configuration: originalConfiguration
    });
  }
  
  /**
   * Export configuration
   */
  public exportConfiguration(controlId: string): string {
    const configuration = this.getConfiguration(controlId);
    const history = this.getHistory(controlId);
    
    const exportData = {
      version: '1.0.0',
      timestamp: Date.now(),
      controlId,
      configuration,
      history
    };
    
    return JSON.stringify(exportData, null, 2);
  }
  
  /**
   * Import configuration
   */
  public importConfiguration(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.configuration && data.controlId) {
        this.setConfiguration(
          data.controlId,
          data.configuration,
          'Imported configuration',
          'import'
        );
        
        if (data.history) {
          this.history.set(data.controlId, data.history);
        }
        
        this.eventBus.emit(StoreEvent.CONFIGURATION_LOADED, {
          controlId: data.controlId,
          configuration: data.configuration
        });
      }
    } catch (error) {
      console.error('Error importing configuration:', error);
      throw new Error('Invalid configuration format');
    }
  }
  
  /**
   * Save to localStorage
   */
  private saveToStorage(controlId: string): void {
    const configuration = this.configurations.get(controlId);
    const history = this.history.get(controlId);
    
    if (configuration) {
      this.storage.set(`config-${controlId}`, {
        configuration,
        history,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    // This would iterate through all stored configurations
    // For now, we'll just initialize empty
    console.log('[ConfigurationStore] Loading from storage...');
  }
  
  /**
   * Subscribe to store events
   */
  public subscribe(event: StoreEvent, handler: Function): () => void {
    return this.eventBus.on(event, handler);
  }
  
  /**
   * Deep merge objects
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
  
  /**
   * Clear all configurations
   */
  public clear(): void {
    this.configurations.clear();
    this.history.clear();
    this.currentIndex.clear();
  }
  
  /**
   * Get all configuration IDs
   */
  public getConfigurationIds(): string[] {
    return Array.from(this.configurations.keys());
  }
  
  /**
   * Has configuration check
   */
  public hasConfiguration(controlId: string): boolean {
    return this.configurations.has(controlId);
  }
}