import { AS_MaterialDesign_TagNames } from "../../Common/commonSettings";
import { IControl, IFramework } from "@alterspective-io/as-k2sf-framework/";
import { MaterialDesignButton, MaterialDesignIcons } from "@alterspective-io/as-framework-material-design";
import { AsMaterialdesignCard } from "@alterspective-io/as-framework-material-design/dist/components/as-materialdesign-card";
declare global {
    var SourceCode: any;
}
export declare type CardSections = "media" | "title" | "content" | "buttons";
export interface convertedCards {
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
    keyword: AS_MaterialDesign_TagNames;
    card?: AsMaterialdesignCard;
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
    convertTableToCard(tbl: IControl): ASK2Card;
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
