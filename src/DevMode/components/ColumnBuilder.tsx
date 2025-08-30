/**
 * ColumnBuilder Component
 * Visual interface for building and configuring DataTable columns
 */

import { h, Component, Fragment } from 'preact';
import { ColumnBuilderProps, ColumnConfiguration } from '../types';

/**
 * Column types with their configurations
 */
const COLUMN_TYPES = {
  text: { label: 'Text', icon: '📝', defaultEditor: 'text' },
  number: { label: 'Number', icon: '🔢', defaultEditor: 'number' },
  date: { label: 'Date', icon: '📅', defaultEditor: 'datePicker' },
  checkbox: { label: 'Checkbox', icon: '☑️', defaultEditor: 'checkbox' },
  select: { label: 'Select', icon: '📋', defaultEditor: 'select' },
  button: { label: 'Button', icon: '🔘', defaultEditor: null },
  custom: { label: 'Custom', icon: '⚙️', defaultEditor: null }
};

/**
 * Component state interface
 */
interface ColumnBuilderState {
  draggedColumn: string | null;
  dragOverColumn: string | null;
  expandedColumn: string | null;
  editingColumn: string | null;
  showAddDialog: boolean;
  newColumnType: keyof typeof COLUMN_TYPES;
  searchFilter: string;
}

/**
 * ColumnBuilder Component
 */
export class ColumnBuilder extends Component<ColumnBuilderProps, ColumnBuilderState> {
  private draggedElement: HTMLElement | null = null;

  constructor(props: ColumnBuilderProps) {
    super(props);
    
    this.state = {
      draggedColumn: null,
      dragOverColumn: null,
      expandedColumn: null,
      editingColumn: null,
      showAddDialog: false,
      newColumnType: 'text',
      searchFilter: ''
    };
  }

  render() {
    const { columns, selectedColumn } = this.props;
    const { 
      draggedColumn, 
      dragOverColumn, 
      expandedColumn, 
      editingColumn,
      showAddDialog,
      newColumnType,
      searchFilter 
    } = this.state;

    // Filter columns based on search
    const filteredColumns = columns.filter(col => 
      !searchFilter || 
      col.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      col.header?.toLowerCase().includes(searchFilter.toLowerCase())
    );

    return (
      <div class="column-builder">
        {/* Header with actions */}
        <div class="column-builder__header">
          <div class="column-builder__title">
            <h3>Column Configuration</h3>
            <span class="column-builder__count">{columns.length} columns</span>
          </div>
          
          <div class="column-builder__actions">
            <button 
              class="column-builder__add-btn"
              onClick={() => this.setState({ showAddDialog: true })}
              title="Add New Column"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add Column
            </button>
            
            <button 
              class="column-builder__auto-detect-btn"
              onClick={() => this.autoDetectColumns()}
              title="Auto-detect columns from data"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Auto Detect
            </button>
          </div>
        </div>

        {/* Search/Filter Bar */}
        <div class="column-builder__search">
          <svg class="column-builder__search-icon" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input 
            type="text"
            class="column-builder__search-input"
            placeholder="Search columns..."
            value={searchFilter}
            onInput={(e) => this.setState({ searchFilter: (e.target as HTMLInputElement).value })}
          />
        </div>

        {/* Column List */}
        <div class="column-builder__list">
          {filteredColumns.length === 0 ? (
            <div class="column-builder__empty">
              <svg width="48" height="48" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              <p>No columns found. Add your first column to get started.</p>
            </div>
          ) : (
            filteredColumns.map((column, index) => (
              <div
                key={column.id}
                class={`column-item ${selectedColumn === column.id ? 'column-item--selected' : ''} 
                        ${draggedColumn === column.id ? 'column-item--dragging' : ''}
                        ${dragOverColumn === column.id ? 'column-item--drag-over' : ''}`}
                draggable={true}
                onDragStart={(e) => this.handleDragStart(e, column)}
                onDragOver={(e) => this.handleDragOver(e, column)}
                onDragEnd={() => this.handleDragEnd()}
                onDrop={(e) => this.handleDrop(e, index)}
                onClick={() => this.props.onColumnSelect(column.id)}
              >
                {/* Drag Handle */}
                <div class="column-item__drag-handle">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 20h6v-2H9v2zm0-6h6v-2H9v2zm0-8v2h6V6H9z"/>
                  </svg>
                </div>

                {/* Column Info */}
                <div class="column-item__info">
                  <div class="column-item__header">
                    <span class="column-item__order">{index + 1}</span>
                    <span class="column-item__icon">
                      {this.getColumnTypeIcon(column)}
                    </span>
                    <span class="column-item__name">{column.header || column.name}</span>
                    {column.hidden && (
                      <span class="column-item__badge column-item__badge--hidden">Hidden</span>
                    )}
                    {column.sortable && (
                      <span class="column-item__badge column-item__badge--sortable">Sortable</span>
                    )}
                    {column.resizable && (
                      <span class="column-item__badge column-item__badge--resizable">Resizable</span>
                    )}
                  </div>
                  
                  <div class="column-item__details">
                    <span class="column-item__field">Field: {column.name}</span>
                    {column.k2Control && (
                      <span class="column-item__k2">K2: {column.k2Control}</span>
                    )}
                  </div>
                </div>

                {/* Column Actions */}
                <div class="column-item__actions">
                  <button
                    class="column-item__action"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.toggleColumnExpanded(column.id);
                    }}
                    title="Configure"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 15.516c1.922 0 3.516-1.594 3.516-3.516S13.922 8.484 12 8.484 8.484 10.078 8.484 12s1.594 3.516 3.516 3.516zm7.453-2.532l2.109.844v2.344l-2.109.844c-.188.75-.469 1.453-.844 2.109l.844 2.109-1.641 1.641-2.109-.844c-.656.375-1.359.656-2.109.844l-.844 2.109h-2.344l-.844-2.109c-.75-.188-1.453-.469-2.109-.844l-2.109.844-1.641-1.641.844-2.109c-.375-.656-.656-1.359-.844-2.109L2.39 14.172v-2.344l2.109-.844c.188-.75.469-1.453.844-2.109l-.844-2.109 1.641-1.641 2.109.844c.656-.375 1.359-.656 2.109-.844L11.203 2.39h2.344l.844 2.109c.75.188 1.453.469 2.109.844l2.109-.844 1.641 1.641-.844 2.109c.375.656.656 1.359.844 2.109z"/>
                    </svg>
                  </button>
                  
                  <button
                    class="column-item__action"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.toggleColumnVisibility(column);
                    }}
                    title={column.hidden ? "Show" : "Hide"}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      {column.hidden ? (
                        <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      ) : (
                        <path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      )}
                    </svg>
                  </button>
                  
                  <button
                    class="column-item__action column-item__action--delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.handleColumnRemove(column.id);
                    }}
                    title="Delete"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </div>

                {/* Expanded Configuration */}
                {expandedColumn === column.id && (
                  <div class="column-item__config">
                    {this.renderColumnConfiguration(column)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add Column Dialog */}
        {showAddDialog && (
          <div class="column-builder__dialog-overlay" onClick={() => this.setState({ showAddDialog: false })}>
            <div class="column-builder__dialog" onClick={(e) => e.stopPropagation()}>
              <h3 class="column-builder__dialog-title">Add New Column</h3>
              
              <div class="column-builder__dialog-content">
                <div class="column-builder__field">
                  <label>Column Type</label>
                  <div class="column-builder__type-grid">
                    {Object.entries(COLUMN_TYPES).map(([key, type]) => (
                      <button
                        key={key}
                        class={`column-builder__type-btn ${newColumnType === key ? 'column-builder__type-btn--selected' : ''}`}
                        onClick={() => this.setState({ newColumnType: key as keyof typeof COLUMN_TYPES })}
                      >
                        <span class="column-builder__type-icon">{type.icon}</span>
                        <span class="column-builder__type-label">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div class="column-builder__field">
                  <label for="column-name">Column Name</label>
                  <input 
                    id="column-name"
                    type="text" 
                    class="column-builder__input"
                    placeholder="Enter column name..."
                  />
                </div>
                
                <div class="column-builder__field">
                  <label for="column-header">Header Text</label>
                  <input 
                    id="column-header"
                    type="text" 
                    class="column-builder__input"
                    placeholder="Enter header text..."
                  />
                </div>
                
                <div class="column-builder__field">
                  <label for="column-k2">K2 Control Binding</label>
                  <select id="column-k2" class="column-builder__select">
                    <option value="">None</option>
                    <option value="TextBox1">Text Box 1</option>
                    <option value="TextBox2">Text Box 2</option>
                    <option value="DropDown1">Drop Down 1</option>
                  </select>
                </div>
              </div>
              
              <div class="column-builder__dialog-actions">
                <button 
                  class="column-builder__dialog-btn column-builder__dialog-btn--cancel"
                  onClick={() => this.setState({ showAddDialog: false })}
                >
                  Cancel
                </button>
                <button 
                  class="column-builder__dialog-btn column-builder__dialog-btn--primary"
                  onClick={() => this.handleAddColumn()}
                >
                  Add Column
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /**
   * Render column configuration panel
   */
  private renderColumnConfiguration(column: ColumnConfiguration) {
    return (
      <div class="column-config">
        <div class="column-config__section">
          <h4 class="column-config__section-title">Basic Settings</h4>
          
          <div class="column-config__field">
            <label>Field Name</label>
            <input 
              type="text" 
              class="column-config__input"
              value={column.name}
              onInput={(e) => this.updateColumn(column.id, 'name', (e.target as HTMLInputElement).value)}
            />
          </div>
          
          <div class="column-config__field">
            <label>Header Text</label>
            <input 
              type="text" 
              class="column-config__input"
              value={column.header}
              onInput={(e) => this.updateColumn(column.id, 'header', (e.target as HTMLInputElement).value)}
            />
          </div>
          
          <div class="column-config__field">
            <label>Width</label>
            <input 
              type="number" 
              class="column-config__input"
              value={column.width}
              onInput={(e) => this.updateColumn(column.id, 'width', parseInt((e.target as HTMLInputElement).value))}
            />
          </div>
        </div>

        <div class="column-config__section">
          <h4 class="column-config__section-title">Display Options</h4>
          
          <div class="column-config__checkboxes">
            <label class="column-config__checkbox">
              <input 
                type="checkbox" 
                checked={column.hidden}
                onChange={(e) => this.updateColumn(column.id, 'hidden', (e.target as HTMLInputElement).checked)}
              />
              <span>Hidden</span>
            </label>
            
            <label class="column-config__checkbox">
              <input 
                type="checkbox" 
                checked={column.sortable}
                onChange={(e) => this.updateColumn(column.id, 'sortable', (e.target as HTMLInputElement).checked)}
              />
              <span>Sortable</span>
            </label>
            
            <label class="column-config__checkbox">
              <input 
                type="checkbox" 
                checked={column.resizable}
                onChange={(e) => this.updateColumn(column.id, 'resizable', (e.target as HTMLInputElement).checked)}
              />
              <span>Resizable</span>
            </label>
            
            <label class="column-config__checkbox">
              <input 
                type="checkbox" 
                checked={column.rowSpan}
                onChange={(e) => this.updateColumn(column.id, 'rowSpan', (e.target as HTMLInputElement).checked)}
              />
              <span>Row Span</span>
            </label>
          </div>
        </div>

        <div class="column-config__section">
          <h4 class="column-config__section-title">Editor Configuration</h4>
          
          <div class="column-config__field">
            <label>Editor Type</label>
            <select 
              class="column-config__select"
              value={typeof column.editor === 'string' ? column.editor : column.editor?.type}
              onChange={(e) => this.updateColumn(column.id, 'editor', (e.target as HTMLSelectElement).value)}
            >
              <option value="">None (Read-only)</option>
              <option value="text">Text Input</option>
              <option value="number">Number Input</option>
              <option value="select">Dropdown Select</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio Buttons</option>
              <option value="datePicker">Date Picker</option>
            </select>
          </div>
        </div>

        <div class="column-config__section">
          <h4 class="column-config__section-title">Formatter</h4>
          
          <div class="column-config__field">
            <label>Format Expression</label>
            <textarea 
              class="column-config__textarea"
              placeholder="e.g., props.value.toUpperCase()"
              value={column.formatter}
              onInput={(e) => this.updateColumn(column.id, 'formatter', (e.target as HTMLTextAreaElement).value)}
            />
            <small class="column-config__help">
              Use JavaScript expressions. Available: props.value, props.row, props.column
            </small>
          </div>
        </div>

        <div class="column-config__section">
          <h4 class="column-config__section-title">Filter Configuration</h4>
          
          <div class="column-config__field">
            <label>Filter Type</label>
            <select 
              class="column-config__select"
              value={typeof column.filter === 'string' ? column.filter : column.filter?.type}
              onChange={(e) => this.updateColumn(column.id, 'filter', (e.target as HTMLSelectElement).value)}
            >
              <option value="">No Filter</option>
              <option value="text">Text Filter</option>
              <option value="number">Number Filter</option>
              <option value="date">Date Filter</option>
              <option value="select">Select Filter</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Get column type icon
   */
  private getColumnTypeIcon(column: ColumnConfiguration): string {
    // Determine type based on editor or renderer
    if (column.renderer?.type?.includes('Button')) return COLUMN_TYPES.button.icon;
    if (column.editor === 'datePicker' || column.filter?.type === 'date') return COLUMN_TYPES.date.icon;
    if (column.editor === 'number' || column.filter?.type === 'number') return COLUMN_TYPES.number.icon;
    if (column.editor === 'checkbox') return COLUMN_TYPES.checkbox.icon;
    if (column.editor === 'select' || column.editor?.type === 'select') return COLUMN_TYPES.select.icon;
    if (column.renderer?.type) return COLUMN_TYPES.custom.icon;
    return COLUMN_TYPES.text.icon;
  }

  /**
   * Update column property
   */
  private updateColumn(columnId: string, property: string, value: any): void {
    const column = this.props.columns.find(c => c.id === columnId);
    if (column) {
      const updatedColumn = {
        ...column,
        [property]: value
      };
      this.props.onColumnUpdate(updatedColumn);
    }
  }

  /**
   * Toggle column expanded state
   */
  private toggleColumnExpanded(columnId: string): void {
    this.setState({
      expandedColumn: this.state.expandedColumn === columnId ? null : columnId
    });
  }

  /**
   * Toggle column visibility
   */
  private toggleColumnVisibility(column: ColumnConfiguration): void {
    this.updateColumn(column.id, 'hidden', !column.hidden);
  }

  /**
   * Handle column removal
   */
  private handleColumnRemove(columnId: string): void {
    if (confirm('Are you sure you want to delete this column?')) {
      this.props.onColumnRemove(columnId);
    }
  }

  /**
   * Handle adding a new column
   */
  private handleAddColumn(): void {
    // Get values from dialog inputs
    const nameInput = document.getElementById('column-name') as HTMLInputElement;
    const headerInput = document.getElementById('column-header') as HTMLInputElement;
    const k2Input = document.getElementById('column-k2') as HTMLSelectElement;
    
    if (!nameInput || !nameInput.value.trim()) {
      alert('Please enter a column name');
      return;
    }
    
    const name = nameInput.value.trim();
    const header = headerInput?.value.trim() || name;
    const k2Control = k2Input?.value;
    
    // Create new column
    const newColumn: ColumnConfiguration = {
      id: `column-${Date.now()}`,
      name: name,
      header: header,
      k2Control: k2Control || undefined,
      order: this.props.columns?.length || 0,
      sortable: true,
      resizable: true,
      editor: COLUMN_TYPES[this.state.newColumnType]?.defaultEditor || 'text',
      isNew: true
    };
    
    // Pass the new column to parent
    if (this.props.onColumnUpdate) {
      this.props.onColumnUpdate(newColumn);
    }
    
    // Also trigger add callback
    if (this.props.onColumnAdd) {
      this.props.onColumnAdd();
    }
    
    // Clear inputs
    nameInput.value = '';
    if (headerInput) headerInput.value = '';
    if (k2Input) k2Input.value = '';
    
    // Close dialog
    this.setState({ showAddDialog: false });
  }

  /**
   * Auto-detect columns from data
   */
  private autoDetectColumns(): void {
    console.log('Auto-detecting columns from data...');
    // This would analyze the data structure and suggest columns
    alert('Auto-detection will analyze your data and suggest appropriate columns.');
  }

  // Drag and Drop Handlers

  private handleDragStart(e: DragEvent, column: ColumnConfiguration): void {
    this.draggedElement = e.target as HTMLElement;
    this.setState({ draggedColumn: column.id });
    
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', ''); // Firefox requires this
    }
  }

  private handleDragOver(e: DragEvent, column: ColumnConfiguration): void {
    e.preventDefault();
    
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    
    this.setState({ dragOverColumn: column.id });
  }

  private handleDragEnd(): void {
    this.setState({
      draggedColumn: null,
      dragOverColumn: null
    });
    this.draggedElement = null;
  }

  private handleDrop(e: DragEvent, targetIndex: number): void {
    e.preventDefault();
    
    const { draggedColumn } = this.state;
    if (!draggedColumn) return;
    
    const sourceIndex = this.props.columns.findIndex(c => c.id === draggedColumn);
    
    if (sourceIndex !== targetIndex) {
      this.props.onColumnReorder(sourceIndex, targetIndex);
    }
    
    this.setState({
      draggedColumn: null,
      dragOverColumn: null
    });
  }
}