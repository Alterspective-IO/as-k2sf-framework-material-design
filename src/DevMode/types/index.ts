/**
 * DevMode Configuration Builder - Type Definitions
 * Comprehensive type system for the visual configuration builder
 */

import { OptColumnExtended, IASK2DataTableSettings } from "../../DataTables/Extension/interfaces";
import { IControl, IViewInstance } from "../../../framework/src";

/**
 * DevMode activation and state management types
 */
export interface DevModeState {
  enabled: boolean;
  panelOpen: boolean;
  selectedControl: SelectedControl | null;
  configurationHistory: ConfigurationHistoryEntry[];
  currentHistoryIndex: number;
  aiAssistantEnabled: boolean;
  previewMode: 'live' | 'manual';
  viewMode: 'visual' | 'json' | 'split';
}

export interface SelectedControl {
  id: string;
  name: string;
  type: 'DataTable' | 'Card' | 'Expander' | 'HTMLRepeater';
  element: HTMLElement;
  k2Control: IControl | IViewInstance;
  configuration: IASK2DataTableSettings | any;
  originalConfiguration: IASK2DataTableSettings | any;
}

export interface ConfigurationHistoryEntry {
  timestamp: number;
  configuration: any;
  description: string;
  source: 'user' | 'ai' | 'template';
}

/**
 * Visual Builder Component Types
 */
export interface ColumnBuilderState {
  columns: ColumnConfiguration[];
  selectedColumn: string | null;
  draggedColumn: string | null;
  dropTarget: string | null;
}

export interface ColumnConfiguration extends OptColumnExtended {
  id: string;
  order: number;
  isNew?: boolean;
  validation?: ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'critical';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

/**
 * Theme Builder Types
 */
export interface ThemeConfiguration {
  preset: 'light' | 'dark' | 'high-contrast' | 'custom';
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  effects: ThemeEffects;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  warning: string;
  info: string;
  success: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    small: string;
    medium: string;
    large: string;
  };
  fontWeight: {
    light: number;
    regular: number;
    medium: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ThemeSpacing {
  unit: number;
  padding: {
    small: string;
    medium: string;
    large: string;
  };
  margin: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface ThemeEffects {
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  shadow: {
    small: string;
    medium: string;
    large: string;
  };
  transition: {
    fast: string;
    normal: string;
    slow: string;
  };
}

/**
 * AI Assistant Types
 */
export interface AIAssistantConfig {
  apiKey: string;
  model: 'gpt-4' | 'gpt-3.5-turbo';
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}

export interface AIRequest {
  query: string;
  context: AIContext;
  history: AIConversationEntry[];
}

export interface AIContext {
  currentConfiguration: any;
  availableControls: string[];
  dataStructure?: any;
  userPreferences?: UserPreferences;
}

export interface AIConversationEntry {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  applied?: boolean;
}

export interface AIResponse {
  suggestion: string;
  configuration?: Partial<IASK2DataTableSettings>;
  explanation?: string;
  confidence: number;
  alternatives?: AISuggestion[];
}

export interface AISuggestion {
  title: string;
  description: string;
  configuration: Partial<IASK2DataTableSettings>;
  rationale?: string;
}

/**
 * Template System Types
 */
export interface ConfigurationTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  configuration: IASK2DataTableSettings;
  preview?: string;
  author?: string;
  version: string;
  compatibility: string[];
  customizable: TemplateCustomization[];
}

export type TemplateCategory = 
  | 'basic'
  | 'advanced'
  | 'reporting'
  | 'dashboard'
  | 'form'
  | 'approval'
  | 'custom';

export interface TemplateCustomization {
  field: string;
  label: string;
  type: 'text' | 'number' | 'color' | 'select' | 'boolean';
  options?: any[];
  default: any;
  required: boolean;
}

/**
 * User Preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  autoSaveInterval: number;
  showTooltips: boolean;
  animationsEnabled: boolean;
  defaultViewMode: 'visual' | 'json' | 'split';
  aiSuggestions: boolean;
  keyboardShortcuts: boolean;
  accessibility: AccessibilitySettings;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderAnnouncements: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
}

/**
 * Event System Types
 */
export interface DevModeEvent {
  type: DevModeEventType;
  payload: any;
  timestamp: number;
  source: string;
}

export type DevModeEventType = 
  | 'CONFIGURATION_CHANGED'
  | 'COLUMN_ADDED'
  | 'COLUMN_REMOVED'
  | 'COLUMN_REORDERED'
  | 'THEME_CHANGED'
  | 'TEMPLATE_APPLIED'
  | 'AI_SUGGESTION_APPLIED'
  | 'CONFIGURATION_EXPORTED'
  | 'CONFIGURATION_IMPORTED'
  | 'VALIDATION_ERROR'
  | 'PREVIEW_UPDATED';

/**
 * Export/Import Types
 */
export interface ExportConfiguration {
  version: string;
  timestamp: number;
  metadata: ExportMetadata;
  configuration: IASK2DataTableSettings;
  theme?: ThemeConfiguration;
  customCode?: CustomCodeSnippets;
}

export interface ExportMetadata {
  name: string;
  description?: string;
  author?: string;
  tags?: string[];
  dependencies?: string[];
  k2Version?: string;
  frameworkVersion?: string;
}

export interface CustomCodeSnippets {
  formatters: Record<string, string>;
  validators: Record<string, string>;
  renderers: Record<string, string>;
  eventHandlers: Record<string, string>;
}

/**
 * Component Communication Types
 */
export interface DevModeMessage {
  action: DevModeAction;
  data?: any;
  callback?: (response: any) => void;
}

export type DevModeAction = 
  | 'SELECT_CONTROL'
  | 'UPDATE_CONFIGURATION'
  | 'APPLY_TEMPLATE'
  | 'TOGGLE_PANEL'
  | 'SWITCH_VIEW_MODE'
  | 'UNDO'
  | 'REDO'
  | 'SAVE'
  | 'EXPORT'
  | 'IMPORT'
  | 'REQUEST_AI_HELP';

/**
 * Panel Component Props
 */
export interface ConfigurationPanelProps {
  state: DevModeState;
  onStateChange: (state: Partial<DevModeState>) => void;
  onConfigurationChange: (config: any) => void;
  onClose: () => void;
}

export interface ColumnBuilderProps {
  columns: ColumnConfiguration[];
  selectedColumn: string | null;
  onColumnSelect: (columnId: string | null) => void;
  onColumnUpdate: (column: ColumnConfiguration) => void;
  onColumnAdd: () => void;
  onColumnRemove: (columnId: string) => void;
  onColumnReorder: (fromIndex: number, toIndex: number) => void;
}

export interface ThemeBuilderProps {
  theme: ThemeConfiguration;
  onThemeChange: (theme: Partial<ThemeConfiguration>) => void;
  onPresetSelect: (preset: ThemeConfiguration['preset']) => void;
  onReset: () => void;
}

export interface AIAssistantProps {
  config: AIAssistantConfig;
  context: AIContext;
  onSuggestionApply: (configuration: any) => void;
  onConfigUpdate: (config: Partial<AIAssistantConfig>) => void;
}

/**
 * Utility Types
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RecursiveRequired<T> = {
  [P in keyof T]-?: T[P] extends object | undefined ? RecursiveRequired<NonNullable<T[P]>> : T[P];
};

export interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;