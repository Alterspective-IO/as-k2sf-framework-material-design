import { IControl, IFramework } from "@alterspective-io/as-k2sf-framework";
import { AsHtmlRepeater } from "@alterspective-io/as-framework-material-design/dist/components/as-html-repeater";
import { AS_MaterialDesign_TagNames } from "../../Common/commonSettings";
declare global {
    var SourceCode: any;
}
export interface convertedListControls {
    control: IControl;
    repeater: AsHtmlRepeater;
}
export interface ASK2HTMLRepeaterSettings {
    enabled?: boolean;
    htmlTemplateRowSource?: string;
    htmlTemplateContainerSource?: string;
    elevation?: number;
}
export declare class alterspectiveHtmlRepeaterExtension {
    keyword: AS_MaterialDesign_TagNames;
    HTMLRepeater?: AsHtmlRepeater;
    as: IFramework;
    dependantViewName: string;
    currentUserFQN: any;
    currentUserDisplayName: any;
    convertedCards: convertedListControls[];
    repeaterControls: IControl[];
    INDEX: number;
    constructor(as: IFramework);
    addDependantTopLevelStyles(): void;
    convertListToHTMLRepeater(listControl: IControl): AsHtmlRepeater;
    private render;
    private getK2PropValueAsBoolean;
    private findSettings;
    private dataBind;
    createNewHTMLRepeater(element: HTMLElement): AsHtmlRepeater;
    private getHTMLRepeaterTargets;
    getControlsInControl(parentControl: IControl): IControl[];
    bindControlUpdates(control: IControl, obj: object): void;
}
