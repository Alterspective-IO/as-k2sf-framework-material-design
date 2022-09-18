import { IControl, IFramework } from "asFramework/src/index";
import { SuxMaterialdesignCard } from "alterspective-k2-smartfroms/dist/components/sux-materialdesign-card";
import { MaterialDesignIcons, MaterialDesignButton } from "alterspective-k2-smartfroms/dist/components";
import { AS_MaterialDesign_TagNames } from "../../Common/commonSettings";
declare global {
    var SourceCode: any;
}
export declare type CardSections = "media" | "title" | "content" | "buttons";
export interface convertedCards {
    table: IControl;
    suxCard: SUXK2Card;
}
export interface SuxK2CardButton {
    control: IControl;
    button: MaterialDesignButton;
}
export interface SUXK2Card {
}
export declare class simpliedMaterialCardExtension {
    keyword: AS_MaterialDesign_TagNames;
    card?: SuxMaterialdesignCard;
    as: IFramework;
    dependantViewName: string;
    currentUserFQN: any;
    currentUserDisplayName: any;
    convertedCards: convertedCards[];
    materialTables: IControl[];
    shadowChat: any;
    INDEX: number;
    constructor(as: IFramework);
    addDependantTopLevelStyles(): void;
    convertTableToCard(tbl: IControl): SUXK2Card;
    validateControlVisability(tblControl: IControl, card: SuxMaterialdesignCard): void;
    private mapAgainstK2Button;
    private getK2PropValueAsBoolean;
    private findAndImplementSettings;
    regexExtractor(text: string): {
        foundValue: string | undefined;
        textExcludingValue: string;
    };
    iconTextDeriver(text: string): MaterialDesignIcons;
    createNewCard(element: HTMLElement, control: IControl): SuxMaterialdesignCard;
    private getMaterialTableControls;
    getControlsInControl(parentControl: IControl): IControl[];
    bindControlUpdates(control: IControl, obj: object): void;
}
