import { IFramework } from "./IFramework";
export interface IDeveloperMode {
    as: IFramework;
    devBarHTMLTemplate: string;
    debugMode: boolean;
    devMode: boolean;
    dragging: boolean;
    devModeWindowState: "open" | "closed";
    open(): void;
    initialize(): any;
    validateModes(): void;
    implementDevMode(): any;
    createDevModeSlider(): void;
}
