export declare class AsProgress extends HTMLElement {
    constructor();
    progressContainer: HTMLDivElement;
    progress: HTMLProgressElement;
    root: ShadowRoot;
    _value: number;
    _max: number;
    private _color;
    get color(): string;
    set color(v: string);
    private _backgroundColor;
    get backgroundColor(): string;
    set backgroundColor(v: string);
    get value(): number;
    set value(v: number);
    get max(): number;
    set max(v: number);
    connectedCallback(): void;
}
export declare class CustomProcessBarRenderer {
    el: AsProgress;
    con: HTMLDivElement;
    constructor(props: any);
    getValue(): number;
    getElement(): HTMLDivElement;
    render(props: any): void;
}
