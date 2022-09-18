import { CellRendererProps } from "../../../../MaterialDesign/node_modules/tui-grid/types/renderer";
export declare class OverriddenDefaultRenderer {
    private el;
    private props;
    private renderer;
    constructor(props: CellRendererProps);
    private setStylesAndAttributes;
    private setAttrsOrStyles;
    getElement(): HTMLDivElement;
    isFunction(something: any): boolean;
    render(props: CellRendererProps): void;
}
