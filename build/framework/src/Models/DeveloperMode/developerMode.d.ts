import { IDeveloperMode } from "../../interfaces/IdeveloperMode";
import { IFramework } from "../../interfaces/IFramework";
export declare class DeveloperMode implements IDeveloperMode {
    as: IFramework;
    devBarHTMLTemplate: string;
    debugMode: boolean;
    devMode: boolean;
    dragging: boolean;
    devModeWindowState: "open" | "closed";
    constructor(as: IFramework);
    initialize(): Promise<void>;
    /**
     * If we have ?asdebugmode=true then find all as table debug tables and make them visable
     */
    implementDebugMode(): void;
    validateModes(): void;
    implementDevMode(): Promise<void>;
    open(): void;
    createDevModeSlider(): void;
}
