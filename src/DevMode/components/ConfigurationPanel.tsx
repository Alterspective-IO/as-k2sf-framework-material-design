/**
 * ConfigurationPanel Component
 * Main panel UI for DevMode configuration with Material Design
 */

import { h, Component, Fragment } from 'preact';
import { render } from 'preact';
import { 
  DevModeState, 
  SelectedControl, 
  ConfigurationPanelProps,
  ColumnConfiguration,
  ThemeConfiguration,
  ValidationResult
} from '../types';
import { ColumnBuilder } from './ColumnBuilder';
import { ThemeBuilder } from './ThemeBuilder';
import { AIAssistant } from './AIAssistant';
import { JSONEditor } from './JSONEditor';
import { TemplateGallery } from './TemplateGallery';
import { ValidationPanel } from './ValidationPanel';

/**
 * Tab configuration for the panel
 */
interface TabConfig {
  id: string;
  label: string;
  icon: string;
  component: any;
  badge?: number;
}

/**
 * ConfigurationPanel Component State
 */
interface ConfigurationPanelState {
  activeTab: string;
  isMinimized: boolean;
  isDragging: boolean;
  panelWidth: number;
  searchQuery: string;
  validationResults: ValidationResult | null;
  hasUnsavedChanges: boolean;
}

/**
 * Main Configuration Panel Component
 */
export class ConfigurationPanel extends Component<ConfigurationPanelProps, ConfigurationPanelState> {
  private panelRef: HTMLDivElement | null = null;
  private resizeHandleRef: HTMLDivElement | null = null;
  private containerRef: HTMLDivElement | null = null;
  private startX: number = 0;
  private startWidth: number = 0;

  constructor(props: ConfigurationPanelProps) {
    super(props);
    
    // Initialize component state
    this.state = {
      activeTab: 'columns',
      isMinimized: false,
      isDragging: false,
      panelWidth: 400,
      searchQuery: '',
      validationResults: null,
      hasUnsavedChanges: false
    };
  }

  /**
   * Component mounted lifecycle
   */
  componentDidMount(): void {
    // Create container and render
    this.createContainer();
    this.renderPanel();
    
    // Add resize handlers
    this.addResizeHandlers();
    
    // Add keyboard event listeners
    this.addKeyboardListeners();
  }

  /**
   * Component will unmount lifecycle
   */
  componentWillUnmount(): void {
    // Remove event listeners
    this.removeResizeHandlers();
    this.removeKeyboardListeners();
    
    // Remove container
    if (this.containerRef) {
      this.containerRef.remove();
    }
  }

  /**
   * Create the panel container
   */
  private createContainer(): void {
    this.containerRef = document.createElement('div');
    this.containerRef.id = 'devmode-configuration-panel';
    this.containerRef.className = 'devmode-panel-container';
    document.body.appendChild(this.containerRef);
  }

  /**
   * Render the panel
   */
  private renderPanel(): void {
    if (!this.containerRef) return;
    
    render(this.render(), this.containerRef);
  }

  /**
   * Main render method
   */
  render() {
    const { state } = this.props;
    const { activeTab, isMinimized, panelWidth, searchQuery, validationResults, hasUnsavedChanges } = this.state;
    
    if (!state.panelOpen) {
      return null;
    }

    const tabs = this.getTabs();
    const activeTabConfig = tabs.find(tab => tab.id === activeTab);

    return (
      <div 
        class={`devmode-panel ${isMinimized ? 'devmode-panel--minimized' : ''}`}
        style={{ width: `${panelWidth}px` }}
        ref={(ref) => this.panelRef = ref}
      >
        {/* Panel Header */}
        <div class="devmode-panel__header">
          <div class="devmode-panel__header-left">
            <h2 class="devmode-panel__title">
              Configuration Builder
              {hasUnsavedChanges && <span class="devmode-panel__unsaved">•</span>}
            </h2>
            {state.selectedControl && (
              <div class="devmode-panel__control-info">
                <span class="devmode-panel__control-type">{state.selectedControl.type}</span>
                <span class="devmode-panel__control-name">{state.selectedControl.name}</span>
              </div>
            )}
          </div>
          
          <div class="devmode-panel__header-actions">
            <button 
              class="devmode-panel__action-btn"
              onClick={() => this.handleUndo()}
              title="Undo (Ctrl+Z)"
              disabled={!this.canUndo()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
              </svg>
            </button>
            
            <button 
              class="devmode-panel__action-btn"
              onClick={() => this.handleRedo()}
              title="Redo (Ctrl+Y)"
              disabled={!this.canRedo()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>
              </svg>
            </button>
            
            <button 
              class="devmode-panel__action-btn"
              onClick={() => this.handleSave()}
              title="Save Configuration (Ctrl+S)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
              </svg>
            </button>
            
            <button 
              class="devmode-panel__action-btn"
              onClick={() => this.toggleMinimize()}
              title={isMinimized ? "Expand" : "Minimize"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d={isMinimized ? "M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" : "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"}/>
              </svg>
            </button>
            
            <button 
              class="devmode-panel__action-btn devmode-panel__close-btn"
              onClick={() => this.props.onClose()}
              title="Close Panel (Esc)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {!isMinimized && (
          <div class="devmode-panel__search">
            <svg class="devmode-panel__search-icon" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input 
              type="text"
              class="devmode-panel__search-input"
              placeholder="Search configuration options..."
              value={searchQuery}
              onInput={(e) => this.handleSearch((e.target as HTMLInputElement).value)}
            />
            {searchQuery && (
              <button 
                class="devmode-panel__search-clear"
                onClick={() => this.handleSearch('')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Validation Messages */}
        {validationResults && !validationResults.valid && !isMinimized && (
          <ValidationPanel 
            results={validationResults}
            onDismiss={() => this.setState({ validationResults: null })}
          />
        )}

        {/* Tab Navigation */}
        {!isMinimized && (
          <div class="devmode-panel__tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                class={`devmode-panel__tab ${activeTab === tab.id ? 'devmode-panel__tab--active' : ''}`}
                onClick={() => this.setState({ activeTab: tab.id })}
                title={tab.label}
              >
                <span class="devmode-panel__tab-icon" dangerouslySetInnerHTML={{ __html: tab.icon }} />
                <span class="devmode-panel__tab-label">{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <span class="devmode-panel__tab-badge">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Tab Content */}
        {!isMinimized && state.selectedControl && activeTabConfig && (
          <div class="devmode-panel__content">
            {this.renderTabContent(activeTabConfig)}
          </div>
        )}

        {/* No Control Selected Message */}
        {!isMinimized && !state.selectedControl && (
          <div class="devmode-panel__empty">
            <svg class="devmode-panel__empty-icon" width="64" height="64" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h3 class="devmode-panel__empty-title">No Control Selected</h3>
            <p class="devmode-panel__empty-message">
              Click on any highlighted DataTable, Card, or other control on the page to begin configuration.
            </p>
          </div>
        )}

        {/* Resize Handle */}
        <div 
          class="devmode-panel__resize-handle"
          ref={(ref) => this.resizeHandleRef = ref}
          onMouseDown={(e) => this.handleResizeStart(e)}
        />

        {/* Footer */}
        {!isMinimized && (
          <div class="devmode-panel__footer">
            <div class="devmode-panel__footer-left">
              <span class="devmode-panel__view-mode">
                View Mode: {state.viewMode}
              </span>
              <span class="devmode-panel__preview-mode">
                Preview: {state.previewMode}
              </span>
            </div>
            <div class="devmode-panel__footer-right">
              <button 
                class="devmode-panel__footer-btn"
                onClick={() => this.handleExport()}
                title="Export Configuration"
              >
                Export
              </button>
              <button 
                class="devmode-panel__footer-btn"
                onClick={() => this.handleImport()}
                title="Import Configuration"
              >
                Import
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /**
   * Get tab configurations
   */
  private getTabs(): TabConfig[] {
    const { state } = this.props;
    
    return [
      {
        id: 'columns',
        label: 'Columns',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>',
        component: ColumnBuilder
      },
      {
        id: 'theme',
        label: 'Theme',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>',
        component: ThemeBuilder
      },
      {
        id: 'templates',
        label: 'Templates',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>',
        component: TemplateGallery,
        badge: 12 // Number of available templates
      },
      {
        id: 'json',
        label: 'JSON',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>',
        component: JSONEditor
      },
      {
        id: 'ai',
        label: 'AI Assistant',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 0 0 1.99 12v2a1 1 0 0 0 1 1H3v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 0 0 1-1v-1.938a1.006 1.006 0 0 0-.072-.455zM5 20V8h14l.001 3.996L19 12v2l.001.005.001 5.995H5z"/><ellipse cx="8.5" cy="12" rx="1.5" ry="2"/><ellipse cx="15.5" cy="12" rx="1.5" ry="2"/><path fill="currentColor" d="M8 16h8v2H8z"/></svg>',
        component: AIAssistant
      }
    ];
  }

  /**
   * Render tab content
   */
  private renderTabContent(tab: TabConfig) {
    const { state, onConfigurationChange } = this.props;
    const TabComponent = tab.component;
    
    if (!state.selectedControl) return null;
    
    switch(tab.id) {
      case 'columns':
        return (
          <ColumnBuilder
            columns={this.getColumns()}
            selectedColumn={null}
            onColumnSelect={(id) => console.log('Column selected:', id)}
            onColumnUpdate={(column) => this.handleColumnUpdate(column)}
            onColumnAdd={() => this.handleColumnAdd()}
            onColumnRemove={(id) => this.handleColumnRemove(id)}
            onColumnReorder={(from, to) => this.handleColumnReorder(from, to)}
          />
        );
        
      case 'theme':
        return (
          <ThemeBuilder
            theme={this.getTheme()}
            onThemeChange={(theme) => this.handleThemeChange(theme)}
            onPresetSelect={(preset) => this.handlePresetSelect(preset)}
            onReset={() => this.handleThemeReset()}
          />
        );
        
      case 'templates':
        return (
          <TemplateGallery
            onTemplateSelect={(template) => this.handleTemplateSelect(template)}
            currentConfiguration={state.selectedControl.configuration}
          />
        );
        
      case 'json':
        return (
          <JSONEditor
            configuration={state.selectedControl.configuration}
            onChange={(config) => onConfigurationChange(config)}
            readOnly={false}
          />
        );
        
      case 'ai':
        return (
          <AIAssistant
            config={this.getAIConfig()}
            context={this.getAIContext()}
            onSuggestionApply={(config) => onConfigurationChange(config)}
            onConfigUpdate={(config) => this.handleAIConfigUpdate(config)}
          />
        );
        
      default:
        return null;
    }
  }

  /**
   * Get columns from configuration
   */
  private getColumns(): ColumnConfiguration[] {
    const { state } = this.props;
    if (!state.selectedControl || !state.selectedControl.configuration) {
      return [];
    }
    
    const columns = state.selectedControl.configuration?.optGrid?.columns || [];
    
    // Ensure columns is an array
    if (!Array.isArray(columns)) {
      console.warn('[DevMode] Columns is not an array:', columns);
      return [];
    }
    
    return columns.map((col: any, index: number) => ({
      ...col,
      id: col?.id || `column-${index}`,
      order: index,
      name: col?.name || '',
      header: col?.header || col?.name || '',
      validation: undefined // Will be set by validation engine
    }));
  }

  /**
   * Get theme from configuration
   */
  private getTheme(): ThemeConfiguration {
    const { state } = this.props;
    if (!state.selectedControl) return this.getDefaultTheme();
    
    const theme = state.selectedControl.configuration?.theme;
    return theme || this.getDefaultTheme();
  }

  /**
   * Get default theme
   */
  private getDefaultTheme(): ThemeConfiguration {
    return {
      preset: 'light',
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        background: '#ffffff',
        surface: '#f7fafc',
        error: '#f56565',
        warning: '#ed8936',
        info: '#4299e1',
        success: '#48bb78',
        text: {
          primary: '#2d3748',
          secondary: '#718096',
          disabled: '#cbd5e0'
        }
      },
      typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: {
          small: '12px',
          medium: '14px',
          large: '16px'
        },
        fontWeight: {
          light: 300,
          regular: 400,
          medium: 500,
          bold: 700
        },
        lineHeight: {
          tight: 1.2,
          normal: 1.5,
          relaxed: 1.8
        }
      },
      spacing: {
        unit: 8,
        padding: {
          small: '8px',
          medium: '16px',
          large: '24px'
        },
        margin: {
          small: '8px',
          medium: '16px',
          large: '24px'
        }
      },
      effects: {
        borderRadius: {
          small: '4px',
          medium: '8px',
          large: '12px'
        },
        shadow: {
          small: '0 1px 3px rgba(0,0,0,0.12)',
          medium: '0 4px 6px rgba(0,0,0,0.1)',
          large: '0 10px 20px rgba(0,0,0,0.15)'
        },
        transition: {
          fast: '150ms ease',
          normal: '250ms ease',
          slow: '350ms ease'
        }
      }
    };
  }

  /**
   * Get AI configuration
   */
  private getAIConfig(): any {
    return {
      apiKey: '',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000
    };
  }

  /**
   * Get AI context
   */
  private getAIContext(): any {
    const { state } = this.props;
    return {
      currentConfiguration: state.selectedControl?.configuration,
      availableControls: [],
      dataStructure: {}
    };
  }

  // Event Handlers

  private handleSearch(query: string): void {
    this.setState({ searchQuery: query });
  }

  private handleUndo(): void {
    this.props.onStateChange({ /* undo logic */ });
  }

  private handleRedo(): void {
    this.props.onStateChange({ /* redo logic */ });
  }

  private handleSave(): void {
    console.log('Saving configuration...');
    this.setState({ hasUnsavedChanges: false });
  }

  private handleExport(): void {
    console.log('Exporting configuration...');
  }

  private handleImport(): void {
    console.log('Importing configuration...');
  }

  private handleColumnUpdate(column: ColumnConfiguration): void {
    console.log('Updating column:', column);
    this.setState({ hasUnsavedChanges: true });
  }

  private handleColumnAdd(): void {
    console.log('Adding new column');
    this.setState({ hasUnsavedChanges: true });
  }

  private handleColumnRemove(id: string): void {
    console.log('Removing column:', id);
    this.setState({ hasUnsavedChanges: true });
  }

  private handleColumnReorder(from: number, to: number): void {
    console.log('Reordering columns:', from, to);
    this.setState({ hasUnsavedChanges: true });
  }

  private handleThemeChange(theme: Partial<ThemeConfiguration>): void {
    console.log('Theme changed:', theme);
    this.setState({ hasUnsavedChanges: true });
  }

  private handlePresetSelect(preset: ThemeConfiguration['preset']): void {
    console.log('Preset selected:', preset);
    this.setState({ hasUnsavedChanges: true });
  }

  private handleThemeReset(): void {
    console.log('Theme reset');
    this.setState({ hasUnsavedChanges: true });
  }

  private handleTemplateSelect(template: any): void {
    console.log('Template selected:', template);
    this.setState({ hasUnsavedChanges: true });
  }

  private handleAIConfigUpdate(config: any): void {
    console.log('AI config updated:', config);
  }

  private toggleMinimize(): void {
    this.setState({ isMinimized: !this.state.isMinimized });
  }

  private canUndo(): boolean {
    const { state } = this.props;
    return state.currentHistoryIndex > 0;
  }

  private canRedo(): boolean {
    const { state } = this.props;
    return state.currentHistoryIndex < state.configurationHistory.length - 1;
  }

  // Resize Handlers

  private handleResizeStart(e: MouseEvent): void {
    this.startX = e.clientX;
    this.startWidth = this.state.panelWidth;
    this.setState({ isDragging: true });
    
    document.addEventListener('mousemove', this.handleResizeMove);
    document.addEventListener('mouseup', this.handleResizeEnd);
  }

  private handleResizeMove = (e: MouseEvent): void => {
    if (!this.state.isDragging) return;
    
    const diff = this.startX - e.clientX;
    const newWidth = Math.min(Math.max(300, this.startWidth + diff), 800);
    
    this.setState({ panelWidth: newWidth });
  }

  private handleResizeEnd = (): void => {
    this.setState({ isDragging: false });
    
    document.removeEventListener('mousemove', this.handleResizeMove);
    document.removeEventListener('mouseup', this.handleResizeEnd);
  }

  private addResizeHandlers(): void {
    // Already added in render via ref
  }

  private removeResizeHandlers(): void {
    document.removeEventListener('mousemove', this.handleResizeMove);
    document.removeEventListener('mouseup', this.handleResizeEnd);
  }

  // Keyboard Handlers

  private addKeyboardListeners(): void {
    // Keyboard shortcuts are handled by DevModeManager
  }

  private removeKeyboardListeners(): void {
    // Cleanup if needed
  }

  // Public Methods

  public open(): void {
    this.renderPanel();
  }

  public close(): void {
    if (this.containerRef) {
      render(null, this.containerRef);
    }
  }

  public async loadControl(control: SelectedControl): Promise<void> {
    // Load control configuration
    console.log('Loading control:', control);
    this.renderPanel();
  }

  public destroy(): void {
    this.componentWillUnmount();
  }
}