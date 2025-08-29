/**
 * Type definitions for @alterspective-io/as-framework-material-design
 * 
 * This is a temporary type definition file until the actual 
 * @alterspective-io/as-framework-material-design package is open sourced.
 * 
 * Based on imports found in the codebase, this package provides
 * Material Design components and TUI Grid wrapper components.
 */

declare module "@alterspective-io/as-framework-material-design" {
  // Re-export TUI Grid types
  export * from 'tui-grid';
  
  export interface Icon {
    name: string;
    size?: string;
  }
  
  export interface MaterialDesignButton {
    label?: string;
    icon?: string;
    onClick?: () => void;
  }
  
  export interface MaterialDesignIcons {
    [key: string]: string;
  }

  export interface OptFilter {
    type?: string;
    showApplyBtn?: boolean;
    showClearBtn?: boolean;
  }

  export type AlignType = 'left' | 'center' | 'right';
  export type VAlignType = 'top' | 'middle' | 'bottom';
  export type SortingType = 'asc' | 'desc';

  export interface ColumnOptions {
    name: string;
    header?: string;
    width?: number;
    align?: AlignType;
    valign?: VAlignType;
    sortable?: boolean;
    sortingType?: SortingType;
    filter?: OptFilter;
  }

  export { Grid } from 'tui-grid';
}

declare module "@alterspective-io/as-framework-material-design/dist/components/as-materialdesign-card" {
  export class AsMaterialdesignCard extends HTMLElement {
    passPack?: any;
    settings?: any;
  }
}

declare module "@alterspective-io/as-framework-material-design/dist/components/as-expansion-panel" {
  export class AsExpansionPanel extends HTMLElement {
    expanded?: boolean;
  }
}

declare module "@alterspective-io/as-framework-material-design/dist/components/as-materialdesign-datatable" {
  import { Grid } from 'tui-grid';
  
  export class AsMaterialdesignDatatable extends HTMLElement {
    passPack?: {
      grid?: Grid;
      settings?: any;
      processedSettings?: any;
      extension?: any;
    };
  }
}

declare module "@alterspective-io/as-framework-material-design/dist/components/as-html-repeater" {
  export class AsHtmlRepeater extends HTMLElement {
    template?: string;
    items?: any[];
  }
}

declare module "@alterspective-io/as-framework-material-design/dist/components" {
  export class Slider extends HTMLElement {
    value?: number;
    min?: number;
    max?: number;
  }
}

declare module "@alterspective-io/as-framework-material-design/dist/types" {
  import { Grid, GridOptions, ColumnInfo } from 'tui-grid';
  
  export interface Button extends HTMLElement {
    label?: string;
    icon?: string;
    outlined?: boolean;
  }

  export interface CellRendererProps {
    grid: Grid;
    rowKey: number;
    columnInfo: ColumnInfo;
    value: any;
  }

  export interface CellRendererOptions {
    [key: string]: any;
  }

  export interface Formatter {
    [key: string]: any;
  }

  export interface Row {
    [key: string]: any;
  }

  export interface SliderBase {
    min?: number;
    max?: number;
    value?: number;
  }

  export interface OptColumn extends ColumnInfo {
    // Extended column options
  }

  export interface OptGrid extends GridOptions {
    // Extended grid options
  }

  export interface OptHeader {
    height?: number;
    complexColumns?: any[];
  }

  export interface OptPreset {
    [key: string]: any;
  }

  export interface OptColumnHeaderInfo {
    [key: string]: any;
  }

  export class Slider extends HTMLElement {
    value?: number;
    min?: number;
    max?: number;
  }
}