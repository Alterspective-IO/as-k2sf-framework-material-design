/**
 * AS K2SF Configuration Editor Component
 * Shared configuration editor for all TUI Grid examples
 */

class K2SFConfigEditor {
    constructor(containerId, initialConfig, debugLogger) {
        this.containerId = containerId;
        this.currentConfig = initialConfig || this.getDefaultConfig();
        this.debugLog = debugLogger || console.log;
        this.grid = null;
        this.gridElementId = null;
        this.gridData = [];
        this.customFormatters = {};
        
        this.init();
    }
    
    getDefaultConfig() {
        return {
            "as-md-datatable": {
                "extensionSettings": {
                    "optGrid": {
                        "columns": [
                            {
                                "name": "id",
                                "header": "ID",
                                "width": 80,
                                "align": "center"
                            },
                            {
                                "name": "name",
                                "header": "Name",
                                "width": 150,
                                "editor": "text"
                            },
                            {
                                "name": "value",
                                "header": "Value",
                                "width": 120,
                                "editor": "text"
                            }
                        ],
                        "pageOptions": {
                            "perPage": 10,
                            "useClient": true
                        },
                        "selectionUnit": "row",
                        "rowHeaders": ["rowNum"]
                    }
                },
                "templates": {
                    "default": {
                        "type": "grid",
                        "settings": {
                            "enableSorting": true,
                            "enableFiltering": true
                        }
                    }
                },
                "targets": {
                    "controls": [
                        {
                            "name": "GridControlName",
                            "templates": "default"
                        }
                    ]
                }
            }
        };
    }
    
    init() {
        this.createHTML();
        this.setupEventListeners();
        this.loadConfiguration();
    }
    
    createHTML() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID '${this.containerId}' not found`);
            return;
        }
        
        container.innerHTML = `
            <div class="k2sf-config-editor-panel">
                <div class="k2sf-config-header">
                    <h3>📝 AS K2SF Configuration Editor</h3>
                    <div class="k2sf-config-controls">
                        <mwc-button id="k2sf-loadConfigBtn" outlined>Load Config</mwc-button>
                        <mwc-button id="k2sf-applyConfigBtn" raised>Apply Changes</mwc-button>
                        <mwc-button id="k2sf-exportConfigBtn" outlined>Export</mwc-button>
                        <mwc-button id="k2sf-importConfigBtn" outlined>Import</mwc-button>
                        <input type="file" id="k2sf-configFileInput" accept=".json" style="display: none;">
                    </div>
                </div>
                
                <div class="k2sf-config-content">
                    <div class="k2sf-config-textarea-container">
                        <textarea 
                            id="k2sf-configEditor" 
                            placeholder="AS K2SF configuration will be loaded here..."
                            spellcheck="false">
                        </textarea>
                    </div>
                    <div class="k2sf-config-validation" id="k2sf-configValidation">
                        <span class="k2sf-validation-status">Ready to load configuration</span>
                    </div>
                </div>
            </div>
        `;
        
        this.injectCSS();
    }
    
    injectCSS() {
        if (document.getElementById('k2sf-config-editor-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'k2sf-config-editor-styles';
        style.textContent = `
            .k2sf-config-editor-panel {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                margin-bottom: 2rem;
                overflow: hidden;
            }

            .k2sf-config-header {
                background: #667eea;
                color: white;
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .k2sf-config-header h3 {
                margin: 0;
                font-size: 1.1rem;
            }

            .k2sf-config-controls {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }

            .k2sf-config-content {
                padding: 1rem;
            }

            .k2sf-config-textarea-container {
                position: relative;
                margin-bottom: 1rem;
            }

            #k2sf-configEditor {
                width: 100%;
                height: 300px;
                padding: 1rem;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 13px;
                line-height: 1.4;
                background: white;
                resize: vertical;
                tab-size: 2;
            }

            #k2sf-configEditor:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
            }

            .k2sf-config-validation {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem;
                border-radius: 4px;
                font-size: 0.9rem;
            }

            .k2sf-config-validation.valid {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }

            .k2sf-config-validation.invalid {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }

            .k2sf-config-validation.loading {
                background: #fff3cd;
                color: #856404;
                border: 1px solid #ffeaa7;
            }

            .k2sf-validation-status::before {
                content: "ℹ️";
                margin-right: 0.5rem;
            }

            .k2sf-config-validation.valid .k2sf-validation-status::before {
                content: "✅";
            }

            .k2sf-config-validation.invalid .k2sf-validation-status::before {
                content: "❌";
            }

            .k2sf-config-validation.loading .k2sf-validation-status::before {
                content: "⏳";
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'k2sf-loadConfigBtn') {
                this.loadConfiguration();
            } else if (e.target.id === 'k2sf-applyConfigBtn') {
                this.applyConfiguration();
            } else if (e.target.id === 'k2sf-exportConfigBtn') {
                this.exportConfiguration();
            } else if (e.target.id === 'k2sf-importConfigBtn') {
                this.importConfiguration();
            }
        });
        
        document.addEventListener('change', (e) => {
            if (e.target.id === 'k2sf-configFileInput') {
                this.handleFileImport(e);
            }
        });
        
        document.addEventListener('input', (e) => {
            if (e.target.id === 'k2sf-configEditor') {
                this.validateConfiguration();
            }
        });
    }
    
    loadConfiguration() {
        const configEditor = document.getElementById('k2sf-configEditor');
        if (!configEditor) return;
        
        configEditor.value = JSON.stringify(this.currentConfig, null, 2);
        this.validateConfiguration();
        this.debugLog('📝 Configuration editor loaded with AS K2SF schema');
    }
    
    validateConfiguration() {
        const configEditor = document.getElementById('k2sf-configEditor');
        const configValidation = document.getElementById('k2sf-configValidation');
        
        if (!configEditor || !configValidation) return false;
        
        try {
            const config = JSON.parse(configEditor.value);
            
            // Basic AS K2SF schema validation
            if (!config['as-md-datatable']) {
                throw new Error('Missing required "as-md-datatable" root object');
            }
            
            if (!config['as-md-datatable'].extensionSettings) {
                throw new Error('Missing "extensionSettings" in configuration');
            }
            
            if (!config['as-md-datatable'].extensionSettings.optGrid) {
                throw new Error('Missing "optGrid" in extensionSettings');
            }
            
            if (!config['as-md-datatable'].extensionSettings.optGrid.columns) {
                throw new Error('Missing "columns" array in optGrid');
            }
            
            // Validate columns
            const columns = config['as-md-datatable'].extensionSettings.optGrid.columns;
            if (!Array.isArray(columns) || columns.length === 0) {
                throw new Error('Columns must be a non-empty array');
            }
            
            for (let i = 0; i < columns.length; i++) {
                const col = columns[i];
                if (!col.name || !col.header) {
                    throw new Error(`Column ${i + 1} missing required "name" or "header" property`);
                }
            }
            
            this.currentConfig = config;
            configValidation.className = 'k2sf-config-validation valid';
            configValidation.innerHTML = '<span class="k2sf-validation-status">✅ Valid AS K2SF configuration</span>';
            
            return true;
        } catch (error) {
            configValidation.className = 'k2sf-config-validation invalid';
            configValidation.innerHTML = `<span class="k2sf-validation-status">❌ ${error.message}</span>`;
            return false;
        }
    }
    
    applyConfiguration() {
        if (!this.validateConfiguration()) {
            this.debugLog('❌ Cannot apply invalid configuration');
            return;
        }
        
        this.debugLog('🔄 Applying AS K2SF configuration to grid...');
        
        try {
            this.rebuildGridFromConfig(this.currentConfig);
            this.debugLog('✅ Configuration applied successfully');
        } catch (error) {
            this.debugLog(`❌ Error applying configuration: ${error.message}`);
        }
    }
    
    setGrid(grid, gridElementId, gridData = []) {
        this.grid = grid;
        this.gridElementId = gridElementId;
        this.gridData = gridData;
    }
    
    setCustomFormatters(formatters) {
        this.customFormatters = formatters || {};
    }
    
    rebuildGridFromConfig(config) {
        if (!this.gridElementId) {
            throw new Error('Grid element ID not set. Call setGrid() first.');
        }
        
        const gridConfig = config['as-md-datatable'].extensionSettings.optGrid;
        
        // Convert AS K2SF configuration to TUI Grid format
        const tuiGridOptions = this.convertK2ConfigToTUIGrid(gridConfig);
        
        // Destroy existing grid if it exists
        if (this.grid) {
            this.grid.destroy();
        }
        
        // Create new grid with updated configuration
        this.grid = new tui.Grid(tuiGridOptions);
        
        // Trigger rebuild event for parent to handle additional setup
        const rebuildEvent = new CustomEvent('k2sf-grid-rebuilt', {
            detail: { grid: this.grid, config: config }
        });
        document.dispatchEvent(rebuildEvent);
        
        this.debugLog(`🔄 Grid rebuilt with ${tuiGridOptions.columns.length} columns`);
        
        return this.grid;
    }
    
    convertK2ConfigToTUIGrid(k2sfGridConfig) {
        const tuiConfig = {
            el: document.getElementById(this.gridElementId),
            data: this.gridData,
            columns: [],
            pageOptions: k2sfGridConfig.pageOptions || { perPage: 10, useClient: true },
            scrollX: k2sfGridConfig.scrollX !== undefined ? k2sfGridConfig.scrollX : false,
            scrollY: k2sfGridConfig.scrollY !== undefined ? k2sfGridConfig.scrollY : false,
            bodyHeight: k2sfGridConfig.bodyHeight || 400,
            selectionUnit: k2sfGridConfig.selectionUnit || 'row',
            rowHeaders: k2sfGridConfig.rowHeaders || ['rowNum']
        };
        
        // Convert columns
        tuiConfig.columns = k2sfGridConfig.columns.map(col => {
            const tuiCol = {
                header: col.header,
                name: col.name,
                width: col.width,
                align: col.align
            };
            
            // Handle editor configuration
            if (col.editor) {
                if (typeof col.editor === 'string') {
                    tuiCol.editor = col.editor;
                } else {
                    tuiCol.editor = col.editor;
                }
            }
            
            // Handle validation
            if (col.validation) {
                tuiCol.validation = col.validation;
            }
            
            // Handle special formatters
            if (col.formatter) {
                if (typeof col.formatter === 'string' && this.customFormatters[col.formatter]) {
                    tuiCol.formatter = this.customFormatters[col.formatter];
                } else {
                    switch (col.formatter) {
                        case 'currency':
                            tuiCol.formatter = function(e) {
                                return '$' + Number(e.value || 0).toFixed(2);
                            };
                            break;
                        case 'boolean':
                            tuiCol.formatter = function(e) {
                                return e.value ? '✅ Yes' : '❌ No';
                            };
                            break;
                        case 'rating':
                            tuiCol.formatter = function(e) {
                                const rating = parseInt(e.value) || 0;
                                return '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating})`;
                            };
                            break;
                        default:
                            if (typeof col.formatter === 'function') {
                                tuiCol.formatter = col.formatter;
                            }
                    }
                }
            }
            
            // Handle white space
            if (col.whiteSpace) {
                tuiCol.whiteSpace = col.whiteSpace;
            }
            
            // Handle renderer (for custom buttons and complex content)
            if (col.renderer) {
                tuiCol.renderer = col.renderer;
            }
            
            return tuiCol;
        });
        
        return tuiConfig;
    }
    
    exportConfiguration() {
        if (!this.validateConfiguration()) {
            this.debugLog('❌ Cannot export invalid configuration');
            return;
        }
        
        const dataStr = JSON.stringify(this.currentConfig, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'k2sf-grid-config.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.debugLog('📤 Configuration exported as JSON file');
    }
    
    importConfiguration() {
        document.getElementById('k2sf-configFileInput').click();
    }
    
    handleFileImport(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    document.getElementById('k2sf-configEditor').value = e.target.result;
                    this.validateConfiguration();
                    this.debugLog('📥 Configuration imported from file');
                } catch (error) {
                    this.debugLog(`❌ Error importing configuration: ${error.message}`);
                }
            };
            reader.readAsText(file);
        }
    }
    
    // Update configuration with current grid state
    updateConfigFromGrid() {
        if (!this.grid) return;
        
        const columns = this.grid.getColumns();
        const updatedColumns = columns.map(col => ({
            name: col.name,
            header: col.header,
            width: col.width,
            align: col.align,
            editor: col.editor,
            formatter: col.formatter ? 'custom' : undefined,
            validation: col.validation
        })).filter(col => col.name !== '_number' && col.name !== '_checked');
        
        this.currentConfig['as-md-datatable'].extensionSettings.optGrid.columns = updatedColumns;
        this.loadConfiguration();
    }
    
    // Get current configuration
    getConfig() {
        return this.currentConfig;
    }
    
    // Set configuration
    setConfig(config) {
        this.currentConfig = config;
        this.loadConfiguration();
    }
}

// Make it globally available
window.K2SFConfigEditor = K2SFConfigEditor;
