import { AS_MaterialDesign_TagNames, ProcessedTargets } from "../../Common/commonSettings";
import { MaterialDesignButton, MaterialDesignIcons } from "@alterspective-io/as-framework-material-design";
import { AsMaterialdesignCard } from "@alterspective-io/as-framework-material-design/dist/components/as-materialdesign-card";
import { IControl, IFramework, IViewInstance } from "../../../framework/src";
import { IPassPack } from "../../DataTables/Extension/interfaces";
declare global {
    var SourceCode: any;
}
export interface convertedListControls {
    info: IPassPack | undefined;
}
export type CardSections = "media" | "title" | "content" | "buttons";
export interface convertedCards {
    id: string;
    table: IControl;
    asCard: ASK2Card;
}
export interface AsK2CardButton {
    control: IControl;
    button: MaterialDesignButton;
}
export interface ASK2Card {
}
export declare class simpliedMaterialCardExtension {
    tagName: AS_MaterialDesign_TagNames;
    card?: AsMaterialdesignCard;
    as: IFramework;
    dependantViewName: string;
    currentUserFQN: any;
    currentUserDisplayName: any;
    convertedCards: convertedCards[];
    convertedTargets: convertedListControls[];
    materialTables: IControl[];
    shadowChat: any;
    INDEX: number;
    targets: ProcessedTargets | undefined;
    constructor(as: IFramework);
    applyTargets(): void;
    isControlAlreadyConverted(ctr: IControl): boolean;
    tagSettingsChangedEvent(processedTargets: ProcessedTargets, extensionSettings: any, specificAffectedControl?: IControl | IViewInstance, specificChangedSettings?: any): void;
    addDependantTopLevelStyles(): void;
    convertTableToCard(tbl: IControl, settings?: any): ASK2Card;
    validateControlVisability(tblControl: IControl, card: AsMaterialdesignCard): void;
    private mapAgainstK2Button;
    private getK2PropValueAsBoolean;
    private findAndImplementSettings;
    regexExtractor(text: string): {
        foundValue: string | undefined;
        textExcludingValue: string;
    };
    iconTextDeriver(text: string): MaterialDesignIcons;
    createNewCard(element: HTMLElement, control: IControl): AsMaterialdesignCard;
    private getMaterialTableControls;
    getControlsInControl(parentControl: IControl): IControl[];
    bindControlUpdates(control: IControl, obj: object): void;
}
