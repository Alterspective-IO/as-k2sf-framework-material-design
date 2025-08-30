/**
 * DevModeManager - Main orchestrator for development mode features
 * Handles initialization, state management, and component coordination
 */

import { IFramework } from "../../framework/src";
import { 
  DevModeState, 
  DevModeEvent, 
  DevModeEventType, 
  SelectedControl,
  ConfigurationHistoryEntry,
  UserPreferences,
  DevModeMessage,
  DevModeAction
} from "./types";
import { ConfigurationPanel } from "./components/ConfigurationPanel";
import { ConfigurationStore } from "./store/ConfigurationStore";
import { LivePreviewEngine } from "./engines/LivePreviewEngine";
import { ValidationEngine } from "./engines/ValidationEngine";
import { EventBus } from "./utils/EventBus";
import { LocalStorageManager } from "./utils/LocalStorageManager";

/**
 * DevModeManager Class
 * Singleton pattern for managing development mode functionality
 */
export class DevModeManager {
  private static instance: DevModeManager | null = null;
  
  // Core properties
  private framework: IFramework;
  private state: DevModeState;
  private configurationStore: ConfigurationStore;
  private livePreviewEngine: LivePreviewEngine;
  private validationEngine: ValidationEngine;
  private eventBus: EventBus;
  private storageManager: LocalStorageManager;
  private configurationPanel: ConfigurationPanel | null = null;
  
  // User preferences
  private userPreferences: UserPreferences;
  
  // State management
  private isInitialized: boolean = false;
  private observers: Set<(state: DevModeState) => void> = new Set();
  
  // DOM elements
  private devModeIndicator: HTMLElement | null = null;
  private keyboardShortcutHandler: ((e: KeyboardEvent) => void) | null = null;

  /**
   * Private constructor for singleton pattern
   */
  private constructor(framework: IFramework) {
    this.framework = framework;
    
    // Initialize state
    this.state = this.getInitialState();
    
    // Initialize services
    this.configurationStore = new ConfigurationStore();
    this.livePreviewEngine = new LivePreviewEngine(framework);
    this.validationEngine = new ValidationEngine();
    this.eventBus = new EventBus();
    this.storageManager = new LocalStorageManager('k2-devmode');
    
    // Load user preferences
    this.userPreferences = this.loadUserPreferences();
    
    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Get or create singleton instance
   */
  public static getInstance(framework: IFramework): DevModeManager {
    if (!DevModeManager.instance) {
      DevModeManager.instance = new DevModeManager(framework);
    }
    return DevModeManager.instance;
  }

  /**
   * Initialize DevMode if query parameter is present
   */
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      console.log('[DevMode] Already initialized');
      return true;
    }

    // Check for devmode query parameter
    if (!this.isDevModeEnabled()) {
      console.log('[DevMode] Not enabled - no devmode query parameter found');
      return false;
    }

    console.log('[DevMode] Initializing...');

    try {
      // Create and inject DevMode UI
      await this.createDevModeUI();
      
      // Initialize configuration panel
      this.configurationPanel = new ConfigurationPanel({
        state: this.state,
        onStateChange: this.handleStateChange.bind(this),
        onConfigurationChange: this.handleConfigurationChange.bind(this),
        onClose: this.handlePanelClose.bind(this)
      });
      
      // Scan for convertible controls
      await this.scanForControls();
      
      // Set up keyboard shortcuts
      this.setupKeyboardShortcuts();
      
      // Apply user preferences
      this.applyUserPreferences();
      
      // Mark as initialized
      this.isInitialized = true;
      
      // Emit initialization event
      this.emitEvent({
        type: 'CONFIGURATION_CHANGED',
        payload: { initialized: true },
        timestamp: Date.now(),
        source: 'DevModeManager'
      });
      
      console.log('[DevMode] Initialization complete');
      return true;
      
    } catch (error) {
      console.error('[DevMode] Initialization failed:', error);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Check if DevMode should be enabled
   */
  private isDevModeEnabled(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('devmode') && urlParams.get('devmode') !== 'false';
  }

  /**
   * Get initial state
   */
  private getInitialState(): DevModeState {
    const savedState = this.storageManager?.get('state');
    
    return {
      enabled: this.isDevModeEnabled(),
      panelOpen: false,
      selectedControl: null,
      configurationHistory: [],
      currentHistoryIndex: -1,
      aiAssistantEnabled: false,
      previewMode: 'live',
      viewMode: 'visual',
      ...savedState
    };
  }

  /**
   * Load user preferences from storage
   */
  private loadUserPreferences(): UserPreferences {
    const savedPreferences = this.storageManager?.get('preferences');
    
    return {
      theme: 'auto',
      autoSave: true,
      autoSaveInterval: 30000, // 30 seconds
      showTooltips: true,
      animationsEnabled: true,
      defaultViewMode: 'visual',
      aiSuggestions: true,
      keyboardShortcuts: true,
      accessibility: {
        highContrast: false,
        reducedMotion: false,
        screenReaderAnnouncements: true,
        keyboardNavigation: true,
        focusIndicators: true
      },
      ...savedPreferences
    };
  }

  /**
   * Create DevMode UI elements
   */
  private async createDevModeUI(): Promise<void> {
    // Create DevMode indicator
    this.devModeIndicator = document.createElement('div');
    this.devModeIndicator.id = 'devmode-indicator';
    this.devModeIndicator.className = 'devmode-indicator';
    this.devModeIndicator.innerHTML = `
      <div class="devmode-indicator__content">
        <span class="devmode-indicator__icon">🔧</span>
        <span class="devmode-indicator__text">DevMode</span>
        <button class="devmode-indicator__toggle" title="Toggle Configuration Panel (Ctrl+Shift+D)">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
      </div>
    `;
    
    // Add click handler for toggle button
    const toggleButton = this.devModeIndicator.querySelector('.devmode-indicator__toggle');
    toggleButton?.addEventListener('click', () => this.togglePanel());
    
    // Add to document
    document.body.appendChild(this.devModeIndicator);
    
    // Add DevMode styles
    this.injectDevModeStyles();
  }

  /**
   * Inject DevMode styles into the document
   */
  private injectDevModeStyles(): void {
    const styleId = 'devmode-styles';
    
    // Check if styles already exist
    if (document.getElementById(styleId)) {
      return;
    }
    
    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
      /* DevMode Indicator Styles */
      .devmode-indicator {
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 999999;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        animation: slideIn 0.3s ease-out;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .devmode-indicator:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1);
      }
      
      .devmode-indicator__content {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .devmode-indicator__icon {
        font-size: 18px;
        animation: rotate 2s linear infinite;
      }
      
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      .devmode-indicator__text {
        font-weight: 600;
        letter-spacing: 0.5px;
      }
      
      .devmode-indicator__toggle {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 4px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      
      .devmode-indicator__toggle:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
        transform: scale(1.05);
      }
      
      .devmode-indicator__toggle:active {
        transform: scale(0.95);
      }
      
      /* Highlight effect for selected controls */
      .devmode-control-highlight {
        position: relative;
        outline: 2px dashed #667eea !important;
        outline-offset: 2px;
        animation: pulse 2s ease-in-out infinite;
      }
      
      @keyframes pulse {
        0%, 100% {
          outline-color: #667eea;
        }
        50% {
          outline-color: #764ba2;
        }
      }
      
      .devmode-control-highlight::before {
        content: attr(data-devmode-label);
        position: absolute;
        top: -25px;
        left: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        white-space: nowrap;
        z-index: 999998;
        pointer-events: none;
      }
      
      /* Accessibility focus indicators */
      .devmode-focusable:focus-visible {
        outline: 3px solid #667eea;
        outline-offset: 2px;
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .devmode-indicator,
        .devmode-indicator__toggle,
        .devmode-control-highlight {
          animation: none;
          transition: none;
        }
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .devmode-indicator {
          border: 2px solid white;
        }
        
        .devmode-control-highlight {
          outline-width: 3px;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }

  /**
   * Scan the page for convertible controls
   */
  private async scanForControls(): Promise<void> {
    console.log('[DevMode] Scanning for controls...');
    
    // Get all converted DataTables
    const dataTables = document.querySelectorAll('as-materialdesign-datatable');
    console.log(`[DevMode] Found ${dataTables.length} DataTable(s)`);
    
    // Get all converted Cards
    const cards = document.querySelectorAll('as-materialdesign-card');
    console.log(`[DevMode] Found ${cards.length} Card(s)`);
    
    // Add hover handlers for selection
    [...dataTables, ...cards].forEach(element => {
      this.addControlSelectionHandlers(element as HTMLElement);
    });
  }

  /**
   * Add selection handlers to a control element
   */
  private addControlSelectionHandlers(element: HTMLElement): void {
    if (!element) return;
    
    // Store event handlers for cleanup
    const mouseEnterHandler = () => {
      if (!this.state.selectedControl || this.state.selectedControl.element !== element) {
        element.classList.add('devmode-control-highlight');
        element.setAttribute('data-devmode-label', `Click to configure ${element.tagName}`);
      }
    };
    
    const mouseLeaveHandler = () => {
      if (!this.state.selectedControl || this.state.selectedControl.element !== element) {
        element.classList.remove('devmode-control-highlight');
        element.removeAttribute('data-devmode-label');
      }
    };
    
    const clickHandler = (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
      this.selectControl(element);
    };
    
    // Add event listeners
    element.addEventListener('mouseenter', mouseEnterHandler);
    element.addEventListener('mouseleave', mouseLeaveHandler);
    element.addEventListener('click', clickHandler);
    
    // Store handlers for cleanup
    (element as any).__devModeHandlers = {
      mouseEnter: mouseEnterHandler,
      mouseLeave: mouseLeaveHandler,
      click: clickHandler
    };
  }

  /**
   * Select a control for configuration
   */
  private async selectControl(element: HTMLElement): Promise<void> {
    console.log('[DevMode] Selecting control:', element);
    
    // Remove highlight from previous selection
    if (this.state.selectedControl) {
      this.state.selectedControl.element.classList.remove('devmode-control-highlight');
      this.state.selectedControl.element.removeAttribute('data-devmode-label');
    }
    
    // Get control information
    const controlInfo = await this.getControlInfo(element);
    
    if (!controlInfo) {
      console.error('[DevMode] Could not get control information');
      return;
    }
    
    // Update state
    this.setState({
      selectedControl: controlInfo,
      panelOpen: true
    });
    
    // Highlight selected control
    element.classList.add('devmode-control-highlight');
    element.setAttribute('data-devmode-label', `Configuring ${controlInfo.name}`);
    
    // Load configuration into panel
    if (this.configurationPanel) {
      await this.configurationPanel.loadControl(controlInfo);
    }
  }

  /**
   * Get control information from element
   */
  private async getControlInfo(element: HTMLElement): Promise<SelectedControl | null> {
    try {
      // Get the passPack from the element
      const passPack = (element as any).passPack;
      
      if (!passPack) {
        console.warn('[DevMode] No passPack found on element, attempting alternative detection');
        
        // Try alternative methods to get configuration
        const tagName = element.tagName.toLowerCase();
        const controlType = tagName.includes('datatable') ? 'DataTable' :
                           tagName.includes('card') ? 'Card' :
                           tagName.includes('expander') ? 'Expander' : 
                           'HTMLRepeater';
        
        // Try to extract configuration from element properties
        const configuration = this.extractConfigurationFromElement(element);
        
        return {
          id: element.id || `control-${Date.now()}`,
          name: element.getAttribute('name') || element.id || 'Unnamed Control',
          type: controlType as any,
          element: element,
          k2Control: null,
          configuration: configuration,
          originalConfiguration: JSON.parse(JSON.stringify(configuration))
        };
      }
      
      const controlType = element.tagName.toLowerCase().includes('datatable') ? 'DataTable' :
                         element.tagName.toLowerCase().includes('card') ? 'Card' :
                         element.tagName.toLowerCase().includes('expander') ? 'Expander' : 
                         'HTMLRepeater';
      
      // Safely clone configuration
      let originalConfig = {};
      try {
        originalConfig = JSON.parse(JSON.stringify(passPack.processedSettings || {}));
      } catch (e) {
        console.warn('[DevMode] Could not clone configuration, using empty object');
        originalConfig = {};
      }
      
      return {
        id: element.id || `control-${Date.now()}`,
        name: passPack.target?.name || element.getAttribute('name') || 'Unnamed Control',
        type: controlType as any,
        element: element,
        k2Control: passPack.target?.referencedK2Object || null,
        configuration: passPack.processedSettings || {},
        originalConfiguration: originalConfig
      };
    } catch (error) {
      console.error('[DevMode] Error getting control info:', error);
      return null;
    }
  }
  
  /**
   * Extract configuration from element properties
   */
  private extractConfigurationFromElement(element: HTMLElement): any {
    const config: any = {};
    
    // Try to extract relevant properties
    const properties = ['optGrid', 'theme', 'data', 'columns', 'settings'];
    
    properties.forEach(prop => {
      if ((element as any)[prop]) {
        config[prop] = (element as any)[prop];
      }
    });
    
    // Check for data attributes
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        const key = attr.name.replace('data-', '').replace(/-./g, x => x[1].toUpperCase());
        try {
          // Try to parse as JSON
          config[key] = JSON.parse(attr.value);
        } catch {
          // If not JSON, use as string
          config[key] = attr.value;
        }
      }
    });
    
    return config;
  }

  /**
   * Set up keyboard shortcuts
   */
  private setupKeyboardShortcuts(): void {
    this.keyboardShortcutHandler = (e: KeyboardEvent) => {
      // Ctrl+Shift+D - Toggle panel
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.togglePanel();
      }
      
      // Ctrl+Z - Undo
      if (e.ctrlKey && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        this.undo();
      }
      
      // Ctrl+Y or Ctrl+Shift+Z - Redo
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        this.redo();
      }
      
      // Ctrl+S - Save configuration
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.saveConfiguration();
      }
      
      // Escape - Close panel
      if (e.key === 'Escape' && this.state.panelOpen) {
        this.togglePanel();
      }
    };
    
    document.addEventListener('keydown', this.keyboardShortcutHandler);
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Listen for configuration changes
    this.eventBus.on('configuration-changed', (config: any) => {
      this.handleConfigurationChange(config);
    });
    
    // Listen for validation events
    this.eventBus.on('validation-error', (error: any) => {
      console.error('[DevMode] Validation error:', error);
    });
    
    // Auto-save timer
    if (this.userPreferences.autoSave) {
      setInterval(() => {
        this.saveConfiguration();
      }, this.userPreferences.autoSaveInterval);
    }
  }

  /**
   * Apply user preferences
   */
  private applyUserPreferences(): void {
    // Apply theme
    if (this.userPreferences.theme === 'dark') {
      document.body.classList.add('devmode-dark-theme');
    } else if (this.userPreferences.theme === 'light') {
      document.body.classList.remove('devmode-dark-theme');
    } else {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('devmode-dark-theme', prefersDark);
    }
    
    // Apply accessibility settings
    if (this.userPreferences.accessibility.reducedMotion) {
      document.body.classList.add('devmode-reduced-motion');
    }
    
    if (this.userPreferences.accessibility.highContrast) {
      document.body.classList.add('devmode-high-contrast');
    }
  }

  /**
   * Toggle configuration panel
   */
  public togglePanel(): void {
    this.setState({
      panelOpen: !this.state.panelOpen
    });
    
    if (this.configurationPanel) {
      if (this.state.panelOpen) {
        this.configurationPanel.open();
      } else {
        this.configurationPanel.close();
      }
    }
  }

  /**
   * Handle state changes
   */
  private handleStateChange(newState: Partial<DevModeState>): void {
    this.setState(newState);
  }

  /**
   * Handle configuration changes
   */
  private async handleConfigurationChange(configuration: any): Promise<void> {
    if (!this.state.selectedControl) {
      return;
    }
    
    // Validate configuration
    const validationResult = await this.validationEngine.validate(configuration);
    
    if (!validationResult.valid) {
      console.error('[DevMode] Configuration validation failed:', validationResult.errors);
      // Still apply but show warnings
    }
    
    // Add to history
    this.addToHistory({
      timestamp: Date.now(),
      configuration: configuration,
      description: 'Manual configuration change',
      source: 'user'
    });
    
    // Apply configuration to control
    if (this.state.previewMode === 'live') {
      await this.livePreviewEngine.applyConfiguration(
        this.state.selectedControl.element,
        configuration
      );
    }
    
    // Update state
    this.setState({
      selectedControl: {
        ...this.state.selectedControl,
        configuration: configuration
      }
    });
    
    // Emit event
    this.emitEvent({
      type: 'CONFIGURATION_CHANGED',
      payload: configuration,
      timestamp: Date.now(),
      source: 'user'
    });
  }

  /**
   * Handle panel close
   */
  private handlePanelClose(): void {
    this.setState({
      panelOpen: false
    });
  }

  /**
   * Add configuration to history
   */
  private addToHistory(entry: ConfigurationHistoryEntry): void {
    // Remove any entries after current index
    const newHistory = this.state.configurationHistory.slice(0, this.state.currentHistoryIndex + 1);
    
    // Add new entry
    newHistory.push(entry);
    
    // Limit history size
    const maxHistorySize = 50;
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }
    
    // Update state
    this.setState({
      configurationHistory: newHistory,
      currentHistoryIndex: newHistory.length - 1
    });
  }

  /**
   * Undo last change
   */
  public undo(): void {
    if (this.state.currentHistoryIndex > 0) {
      const newIndex = this.state.currentHistoryIndex - 1;
      const entry = this.state.configurationHistory[newIndex];
      
      if (entry && this.state.selectedControl) {
        this.livePreviewEngine.applyConfiguration(
          this.state.selectedControl.element,
          entry.configuration
        );
        
        this.setState({
          currentHistoryIndex: newIndex,
          selectedControl: {
            ...this.state.selectedControl,
            configuration: entry.configuration
          }
        });
      }
    }
  }

  /**
   * Redo last undone change
   */
  public redo(): void {
    if (this.state.currentHistoryIndex < this.state.configurationHistory.length - 1) {
      const newIndex = this.state.currentHistoryIndex + 1;
      const entry = this.state.configurationHistory[newIndex];
      
      if (entry && this.state.selectedControl) {
        this.livePreviewEngine.applyConfiguration(
          this.state.selectedControl.element,
          entry.configuration
        );
        
        this.setState({
          currentHistoryIndex: newIndex,
          selectedControl: {
            ...this.state.selectedControl,
            configuration: entry.configuration
          }
        });
      }
    }
  }

  /**
   * Save current configuration
   */
  private saveConfiguration(): void {
    if (!this.state.selectedControl) {
      return;
    }
    
    // Save to local storage
    this.storageManager.set(`config-${this.state.selectedControl.id}`, {
      configuration: this.state.selectedControl.configuration,
      timestamp: Date.now()
    });
    
    console.log('[DevMode] Configuration saved');
  }

  /**
   * Update state and notify observers
   */
  private setState(newState: Partial<DevModeState>): void {
    this.state = {
      ...this.state,
      ...newState
    };
    
    // Save state to storage
    this.storageManager.set('state', this.state);
    
    // Notify observers
    this.observers.forEach(observer => observer(this.state));
  }

  /**
   * Subscribe to state changes
   */
  public subscribe(observer: (state: DevModeState) => void): () => void {
    this.observers.add(observer);
    
    // Return unsubscribe function
    return () => {
      this.observers.delete(observer);
    };
  }

  /**
   * Emit DevMode event
   */
  private emitEvent(event: DevModeEvent): void {
    this.eventBus.emit(event.type, event);
  }

  /**
   * Clean up and destroy DevMode
   */
  public destroy(): void {
    try {
      // Remove event listeners from all controls
      const allControls = document.querySelectorAll('as-materialdesign-datatable, as-materialdesign-card');
      allControls.forEach(element => {
        const handlers = (element as any).__devModeHandlers;
        if (handlers) {
          element.removeEventListener('mouseenter', handlers.mouseEnter);
          element.removeEventListener('mouseleave', handlers.mouseLeave);
          element.removeEventListener('click', handlers.click);
          delete (element as any).__devModeHandlers;
        }
        
        // Remove any highlight classes
        element.classList.remove('devmode-control-highlight');
        element.removeAttribute('data-devmode-label');
      });
      
      // Remove keyboard event listeners
      if (this.keyboardShortcutHandler) {
        document.removeEventListener('keydown', this.keyboardShortcutHandler);
        this.keyboardShortcutHandler = null;
      }
      
      // Remove UI elements
      if (this.devModeIndicator) {
        this.devModeIndicator.remove();
        this.devModeIndicator = null;
      }
      
      // Remove styles
      const styles = document.getElementById('devmode-styles');
      if (styles) {
        styles.remove();
      }
      
      // Destroy panel
      if (this.configurationPanel) {
        this.configurationPanel.destroy();
        this.configurationPanel = null;
      }
      
      // Clean up services
      if (this.livePreviewEngine) {
        this.livePreviewEngine.destroy();
      }
      
      if (this.configurationStore) {
        this.configurationStore.clear();
      }
      
      if (this.eventBus) {
        this.eventBus.clear();
      }
      
      // Clear observers
      this.observers.clear();
      
      // Remove global reference
      if ((window as any).__devMode === this) {
        delete (window as any).__devMode;
      }
      
      // Reset instance
      DevModeManager.instance = null;
      
      console.log('[DevMode] Destroyed successfully');
    } catch (error) {
      console.error('[DevMode] Error during cleanup:', error);
    }
  }

  /**
   * Get current state
   */
  public getState(): DevModeState {
    return this.state;
  }

  /**
   * Send message to DevMode components
   */
  public sendMessage(message: DevModeMessage): void {
    switch (message.action) {
      case 'SELECT_CONTROL':
        if (message.data?.element) {
          this.selectControl(message.data.element);
        }
        break;
        
      case 'UPDATE_CONFIGURATION':
        if (message.data) {
          this.handleConfigurationChange(message.data);
        }
        break;
        
      case 'TOGGLE_PANEL':
        this.togglePanel();
        break;
        
      case 'UNDO':
        this.undo();
        break;
        
      case 'REDO':
        this.redo();
        break;
        
      case 'SAVE':
        this.saveConfiguration();
        break;
        
      default:
        console.warn('[DevMode] Unknown message action:', message.action);
    }
    
    // Call callback if provided
    if (message.callback) {
      message.callback({ success: true });
    }
  }
}