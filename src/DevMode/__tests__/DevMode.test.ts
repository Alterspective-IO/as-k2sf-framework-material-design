/**
 * DevMode Test Suite
 * Comprehensive tests for DevMode functionality
 */

import { DevModeManager } from '../DevModeManager';
import { ConfigurationService } from '../services/ConfigurationService';
import { StateManager } from '../utils/StateManager';
import { TuiGridAdapter } from '../integration/TuiGridAdapter';
import { ValidationEngine } from '../engines/ValidationEngine';

describe('DevMode Test Suite', () => {
  let devModeManager: DevModeManager;
  let mockFramework: any;
  
  beforeEach(() => {
    // Setup mock framework
    mockFramework = {
      window: window,
      document: document,
      getControlsByConfigurationName: jest.fn(() => []),
      getRulesByConfigurationName: jest.fn(() => []),
      collections: {
        viewInstanceControls: []
      }
    };
    
    // Add query parameter for DevMode
    const url = new URL(window.location.href);
    url.searchParams.set('devmode', 'true');
    window.history.pushState({}, '', url.toString());
  });
  
  afterEach(() => {
    // Cleanup
    if (devModeManager) {
      devModeManager.destroy();
    }
    
    // Reset URL
    const url = new URL(window.location.href);
    url.searchParams.delete('devmode');
    window.history.pushState({}, '', url.toString());
  });
  
  describe('Initialization', () => {
    test('should initialize when devmode query parameter is present', async () => {
      devModeManager = DevModeManager.getInstance(mockFramework);
      const initialized = await devModeManager.initialize();
      
      expect(initialized).toBe(true);
      expect(devModeManager.getState().enabled).toBe(true);
    });
    
    test('should not initialize without devmode query parameter', async () => {
      // Remove query parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('devmode');
      window.history.pushState({}, '', url.toString());
      
      devModeManager = DevModeManager.getInstance(mockFramework);
      const initialized = await devModeManager.initialize();
      
      expect(initialized).toBe(false);
    });
    
    test('should be singleton', () => {
      const instance1 = DevModeManager.getInstance(mockFramework);
      const instance2 = DevModeManager.getInstance(mockFramework);
      
      expect(instance1).toBe(instance2);
    });
  });
  
  describe('State Management', () => {
    let stateManager: StateManager;
    
    beforeEach(() => {
      stateManager = new StateManager({
        enabled: true,
        panelOpen: false,
        selectedControl: null,
        configurationHistory: [],
        currentHistoryIndex: -1,
        aiAssistantEnabled: false,
        previewMode: 'live',
        viewMode: 'visual'
      });
    });
    
    test('should update state correctly', () => {
      stateManager.setState({ panelOpen: true });
      const state = stateManager.getState();
      
      expect(state.panelOpen).toBe(true);
    });
    
    test('should notify subscribers on state change', (done) => {
      stateManager.subscribe('test', (state) => {
        expect(state.panelOpen).toBe(true);
        done();
      });
      
      stateManager.setState({ panelOpen: true });
    });
    
    test('should batch updates efficiently', () => {
      const updates = [
        { type: 'SET_PANEL_STATE', payload: { panelOpen: true } },
        { type: 'SET_PANEL_STATE', payload: { viewMode: 'json' } }
      ];
      
      stateManager.batchUpdate(updates);
      
      // Wait for batch processing
      setTimeout(() => {
        const state = stateManager.getState();
        expect(state.panelOpen).toBe(true);
        expect(state.viewMode).toBe('json');
      }, 100);
    });
    
    test('should validate state updates', () => {
      expect(() => {
        stateManager.setState({ viewMode: 'invalid' as any });
      }).toThrow('Invalid view mode');
    });
  });
  
  describe('Configuration Service', () => {
    let configService: ConfigurationService;
    
    beforeEach(() => {
      configService = new ConfigurationService();
    });
    
    test('should validate configuration', async () => {
      const config = {
        optGrid: {
          columns: [
            { name: 'id', header: 'ID' },
            { name: 'name', header: 'Name' }
          ]
        }
      };
      
      const result = await configService.applyConfiguration('test', config);
      
      expect(result.success).toBe(true);
      expect(result.configuration).toBeDefined();
    });
    
    test('should reject invalid configuration', async () => {
      const config = {
        optGrid: {
          columns: []
        }
      };
      
      const result = await configService.applyConfiguration('test', config);
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain('At least one column must be defined');
    });
    
    test('should transform configuration', async () => {
      const config = {
        optGrid: {
          columns: [
            { name: 'test', formatter: 'props.value.toUpperCase()' }
          ]
        }
      };
      
      const result = await configService.applyConfiguration('test', config, {
        transform: true
      });
      
      expect(result.success).toBe(true);
      expect(typeof result.configuration.optGrid.columns[0].formatter).toBe('function');
    });
    
    test('should detect unsafe code in formatters', async () => {
      const config = {
        optGrid: {
          columns: [
            { name: 'test', formatter: 'eval("dangerous code")' }
          ]
        }
      };
      
      const result = await configService.applyConfiguration('test', config);
      
      // Should keep as string when unsafe
      expect(typeof result.configuration.optGrid.columns[0].formatter).toBe('string');
    });
  });
  
  describe('Validation Engine', () => {
    let validationEngine: ValidationEngine;
    
    beforeEach(() => {
      validationEngine = new ValidationEngine();
    });
    
    test('should validate required fields', async () => {
      const config = {};
      const result = await validationEngine.validate(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].field).toBe('optGrid');
    });
    
    test('should validate column configuration', async () => {
      const config = {
        optGrid: {
          columns: [
            { header: 'Test' } // Missing name
          ]
        }
      };
      
      const result = await validationEngine.validate(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('name'))).toBe(true);
    });
    
    test('should validate formatter expressions', async () => {
      const config = {
        optGrid: {
          columns: [
            { name: 'test', formatter: 'invalid javascript {' }
          ]
        }
      };
      
      const result = await validationEngine.validate(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('formatter'))).toBe(true);
    });
    
    test('should provide warnings for best practices', async () => {
      const config = {
        optGrid: {
          columns: [
            { name: 'test' } // Missing header
          ],
          pageOptions: {
            perPage: 200 // Large page size
          }
        }
      };
      
      const result = await validationEngine.validate(config);
      
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.field.includes('header'))).toBe(true);
      expect(result.warnings.some(w => w.field.includes('perPage'))).toBe(true);
    });
  });
  
  describe('TUI Grid Adapter', () => {
    let adapter: TuiGridAdapter;
    let mockGrid: any;
    
    beforeEach(() => {
      mockGrid = {
        setColumns: jest.fn(),
        setColumnWidth: jest.fn(),
        hideColumn: jest.fn(),
        showColumn: jest.fn(),
        refreshLayout: jest.fn(),
        applyTheme: jest.fn(),
        setRowHeight: jest.fn(),
        getSelection: jest.fn(() => []),
        getScrollTop: jest.fn(() => 0),
        getScrollLeft: jest.fn(() => 0)
      };
      
      adapter = new TuiGridAdapter(mockGrid);
    });
    
    test('should update columns', () => {
      const columns = [
        { name: 'id', header: 'ID', width: 100 },
        { name: 'name', header: 'Name', hidden: true }
      ];
      
      adapter.updateColumns(columns);
      
      expect(mockGrid.setColumns).toHaveBeenCalled();
      expect(mockGrid.setColumnWidth).toHaveBeenCalledWith('id', 100);
      expect(mockGrid.hideColumn).toHaveBeenCalledWith('name');
      expect(mockGrid.refreshLayout).toHaveBeenCalled();
    });
    
    test('should preserve state during updates', () => {
      const selection = [{ rowKey: 0, columnName: 'id' }];
      mockGrid.getSelection.mockReturnValue(selection);
      
      adapter.updateColumns([], {
        preserveSelection: true,
        preserveScroll: true
      });
      
      expect(mockGrid.getSelection).toHaveBeenCalled();
      expect(mockGrid.getScrollTop).toHaveBeenCalled();
      expect(mockGrid.getScrollLeft).toHaveBeenCalled();
    });
    
    test('should transform theme to TUI format', () => {
      const theme = {
        colors: {
          primary: '#667eea',
          background: '#ffffff'
        }
      };
      
      adapter.updateTheme(theme);
      
      expect(mockGrid.applyTheme).toHaveBeenCalledWith('custom', expect.any(Object));
    });
    
    test('should update grid options', () => {
      const options = {
        rowHeight: 40,
        pageOptions: {
          perPage: 20
        }
      };
      
      adapter.updateOptions(options);
      
      expect(mockGrid.setRowHeight).toHaveBeenCalledWith(40);
    });
  });
  
  describe('Error Handling', () => {
    test('should handle missing passPack gracefully', async () => {
      const element = document.createElement('div');
      element.tagName = 'AS-MATERIALDESIGN-DATATABLE';
      
      devModeManager = DevModeManager.getInstance(mockFramework);
      await devModeManager.initialize();
      
      // Should not throw
      expect(() => {
        devModeManager.sendMessage({
          action: 'SELECT_CONTROL',
          data: { element }
        });
      }).not.toThrow();
    });
    
    test('should handle configuration errors', async () => {
      const configService = new ConfigurationService();
      
      // Invalid configuration
      const result = await configService.applyConfiguration('test', null as any);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });
  
  describe('Integration', () => {
    test('should integrate with existing DataTable', () => {
      // Create mock DataTable element
      const dataTable = document.createElement('as-materialdesign-datatable');
      dataTable.id = 'test-datatable';
      (dataTable as any).passPack = {
        target: { name: 'TestTable' },
        processedSettings: {
          optGrid: {
            columns: [
              { name: 'id', header: 'ID' }
            ]
          }
        },
        grid: mockGrid
      };
      
      document.body.appendChild(dataTable);
      
      devModeManager = DevModeManager.getInstance(mockFramework);
      devModeManager.initialize();
      
      // Should detect and allow configuration
      const controls = document.querySelectorAll('as-materialdesign-datatable');
      expect(controls.length).toBe(1);
      
      // Cleanup
      document.body.removeChild(dataTable);
    });
  });
  
  describe('Memory Management', () => {
    test('should clean up properly on destroy', () => {
      devModeManager = DevModeManager.getInstance(mockFramework);
      devModeManager.initialize();
      
      // Add some state
      devModeManager.sendMessage({
        action: 'TOGGLE_PANEL',
        data: {}
      });
      
      // Destroy
      devModeManager.destroy();
      
      // Check cleanup
      expect(document.getElementById('devmode-indicator')).toBeNull();
      expect(document.getElementById('devmode-styles')).toBeNull();
      expect((window as any).__devMode).toBeUndefined();
    });
    
    test('should prevent memory leaks in state management', () => {
      const stateManager = new StateManager({
        enabled: true,
        panelOpen: false,
        selectedControl: null,
        configurationHistory: [],
        currentHistoryIndex: -1,
        aiAssistantEnabled: false,
        previewMode: 'live',
        viewMode: 'visual'
      });
      
      // Add many history entries
      for (let i = 0; i < 100; i++) {
        stateManager.setState({
          configurationHistory: [...stateManager.getState().configurationHistory, {
            timestamp: Date.now(),
            configuration: { test: i },
            description: `Entry ${i}`,
            source: 'user'
          }]
        });
      }
      
      // Should limit history size
      expect(stateManager.getState().configurationHistory.length).toBeLessThanOrEqual(50);
      
      stateManager.clear();
    });
  });
});