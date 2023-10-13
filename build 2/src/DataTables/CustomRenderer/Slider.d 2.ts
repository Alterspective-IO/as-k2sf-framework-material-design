import { Slider } from "@alterspective-io/as-framework-material-design/dist/components";
export declare class CustomSliderRenderer {
    el: Slider;
    con: HTMLDivElement;
    constructor(props: any);
    getValue(): number;
    getElement(): HTMLDivElement;
    render(props: any): void;
}
