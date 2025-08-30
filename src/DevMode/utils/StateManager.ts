/**
 * StateManager - Centralized state management for DevMode
 * Ensures proper state synchronization between components
 */

import { EventBus } from './EventBus';
import { DevModeState, SelectedControl, ConfigurationHistoryEntry } from '../types';

export interface StateUpdate {
  type: 'SET_SELECTED_CONTROL' | 'UPDATE_CONFIGURATION' | 'ADD_HISTORY' | 'SET_PANEL_STATE' | 'UPDATE_PREFERENCES';
  payload: any;
}

export class StateManager {
  private state: DevModeState;
  private eventBus: EventBus;
  private subscribers: Map<string, (state: DevModeState) => void> = new Map();
  private updateQueue: StateUpdate[] = [];
  private isProcessing: boolean = false;
  private stateHistory: DevModeState[] = [];
  private maxHistorySize: number = 50;

  constructor(initialState: DevModeState) {
    this.state = this.deepClone(initialState);
    this.eventBus = new EventBus();
    this.setupStateValidation();
  }

  /**
   * Get current state (immutable)
   */
  public getState(): DevModeState {
    return this.deepClone(this.state);
  }

  /**
   * Update state with validation
   */
  public setState(updates: Partial<DevModeState>): void {
    try {
      // Validate updates
      this.validateStateUpdate(updates);
      
      // Store previous state
      this.addToHistory(this.state);
      
      // Apply updates
      this.state = {
        ...this.state,
        ...updates
      };
      
      // Notify subscribers
      this.notifySubscribers();
      
      // Emit state change event
      this.eventBus.emit('state-changed', this.state);
      
    } catch (error) {
      console.error('[StateManager] State update failed:', error);
      this.rollbackState();
      throw error;
    }
  }

  /**
   * Subscribe to state changes
   */
  public subscribe(id: string, callback: (state: DevModeState) => void): () => void {
    this.subscribers.set(id, callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(id);
    };
  }

  /**
   * Batch state updates
   */
  public batchUpdate(updates: StateUpdate[]): void {
    this.updateQueue.push(...updates);
    
    if (!this.isProcessing) {
      this.processBatchedUpdates();
    }
  }

  /**
   * Process batched updates
   */
  private async processBatchedUpdates(): Promise<void> {
    if (this.updateQueue.length === 0) {
      this.isProcessing = false;
      return;
    }
    
    this.isProcessing = true;
    
    try {
      // Group updates by type for efficiency
      const groupedUpdates = this.groupUpdatesByType(this.updateQueue);
      
      // Apply grouped updates
      for (const [type, updates] of groupedUpdates) {
        await this.applyGroupedUpdate(type, updates);
      }
      
      // Clear queue
      this.updateQueue = [];
      
    } catch (error) {
      console.error('[StateManager] Batch update failed:', error);
      this.updateQueue = [];
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Group updates by type
   */
  private groupUpdatesByType(updates: StateUpdate[]): Map<string, StateUpdate[]> {
    const grouped = new Map<string, StateUpdate[]>();
    
    updates.forEach(update => {
      if (!grouped.has(update.type)) {
        grouped.set(update.type, []);
      }
      grouped.get(update.type)!.push(update);
    });
    
    return grouped;
  }

  /**
   * Apply grouped update
   */
  private async applyGroupedUpdate(type: string, updates: StateUpdate[]): Promise<void> {
    switch (type) {
      case 'UPDATE_CONFIGURATION':
        // Merge all configuration updates
        const mergedConfig = updates.reduce((acc, update) => ({
          ...acc,
          ...update.payload
        }), {});
        
        if (this.state.selectedControl) {
          this.setState({
            selectedControl: {
              ...this.state.selectedControl,
              configuration: mergedConfig
            }
          });
        }
        break;
        
      case 'ADD_HISTORY':
        // Add all history entries
        const historyEntries = updates.map(u => u.payload);
        this.setState({
          configurationHistory: [
            ...this.state.configurationHistory,
            ...historyEntries
          ].slice(-this.maxHistorySize)
        });
        break;
        
      default:
        // Apply updates sequentially
        for (const update of updates) {
          await this.applySingleUpdate(update);
        }
    }
  }

  /**
   * Apply single update
   */
  private async applySingleUpdate(update: StateUpdate): Promise<void> {
    switch (update.type) {
      case 'SET_SELECTED_CONTROL':
        this.setState({ selectedControl: update.payload });
        break;
        
      case 'UPDATE_CONFIGURATION':
        if (this.state.selectedControl) {
          this.setState({
            selectedControl: {
              ...this.state.selectedControl,
              configuration: update.payload
            }
          });
        }
        break;
        
      case 'SET_PANEL_STATE':
        this.setState(update.payload);
        break;
        
      default:
        console.warn('[StateManager] Unknown update type:', update.type);
    }
  }

  /**
   * Validate state update
   */
  private validateStateUpdate(updates: Partial<DevModeState>): void {
    // Validate selectedControl
    if (updates.selectedControl !== undefined) {
      if (updates.selectedControl && !updates.selectedControl.element) {
        throw new Error('Selected control must have an element');
      }
    }
    
    // Validate history index
    if (updates.currentHistoryIndex !== undefined) {
      const historyLength = updates.configurationHistory?.length || this.state.configurationHistory.length;
      if (updates.currentHistoryIndex < -1 || updates.currentHistoryIndex >= historyLength) {
        throw new Error('Invalid history index');
      }
    }
    
    // Validate view mode
    if (updates.viewMode && !['visual', 'json', 'split'].includes(updates.viewMode)) {
      throw new Error('Invalid view mode');
    }
    
    // Validate preview mode
    if (updates.previewMode && !['live', 'manual'].includes(updates.previewMode)) {
      throw new Error('Invalid preview mode');
    }
  }

  /**
   * Setup state validation
   */
  private setupStateValidation(): void {
    // Add validation middleware
    this.eventBus.on('state-changed', (state: DevModeState) => {
      try {
        this.validateState(state);
      } catch (error) {
        console.error('[StateManager] State validation failed:', error);
        this.rollbackState();
      }
    });
  }

  /**
   * Validate entire state
   */
  private validateState(state: DevModeState): void {
    if (!state) {
      throw new Error('State cannot be null');
    }
    
    if (typeof state.enabled !== 'boolean') {
      throw new Error('State.enabled must be boolean');
    }
    
    if (typeof state.panelOpen !== 'boolean') {
      throw new Error('State.panelOpen must be boolean');
    }
    
    if (!Array.isArray(state.configurationHistory)) {
      throw new Error('State.configurationHistory must be array');
    }
  }

  /**
   * Add to state history
   */
  private addToHistory(state: DevModeState): void {
    this.stateHistory.push(this.deepClone(state));
    
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift();
    }
  }

  /**
   * Rollback to previous state
   */
  private rollbackState(): void {
    if (this.stateHistory.length > 0) {
      this.state = this.stateHistory.pop()!;
      this.notifySubscribers();
    }
  }

  /**
   * Notify all subscribers
   */
  private notifySubscribers(): void {
    const stateCopy = this.getState();
    this.subscribers.forEach(callback => {
      try {
        callback(stateCopy);
      } catch (error) {
        console.error('[StateManager] Subscriber error:', error);
      }
    });
  }

  /**
   * Deep clone object
   */
  private deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime()) as any;
    }
    
    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item)) as any;
    }
    
    if (obj instanceof Object) {
      const clonedObj: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // Skip HTML elements and other non-cloneable objects
          if (obj[key] instanceof HTMLElement) {
            clonedObj[key] = obj[key];
          } else {
            clonedObj[key] = this.deepClone(obj[key]);
          }
        }
      }
      return clonedObj;
    }
    
    return obj;
  }

  /**
   * Get state snapshot
   */
  public getSnapshot(): string {
    const snapshot = {
      state: this.state,
      timestamp: Date.now(),
      version: '1.0.0'
    };
    
    return JSON.stringify(snapshot, (key, value) => {
      // Skip HTML elements in serialization
      if (value instanceof HTMLElement) {
        return { type: 'HTMLElement', id: value.id };
      }
      return value;
    });
  }

  /**
   * Restore from snapshot
   */
  public restoreSnapshot(snapshot: string): void {
    try {
      const parsed = JSON.parse(snapshot);
      
      if (parsed.version !== '1.0.0') {
        throw new Error('Incompatible snapshot version');
      }
      
      this.setState(parsed.state);
      
    } catch (error) {
      console.error('[StateManager] Failed to restore snapshot:', error);
      throw error;
    }
  }

  /**
   * Clear state
   */
  public clear(): void {
    this.subscribers.clear();
    this.updateQueue = [];
    this.stateHistory = [];
    this.eventBus.clear();
  }
}