import { IControl, IFramework } from "@alterspective-io/as-k2sf-framework";
import { AS_MaterialDesign_TagNames } from "../../Common/commonSettings";
import { AsExpansionPanel } from "@alterspective-io/as-framework-material-design/dist/components/as-expansion-panel";
declare global {
    var SourceCode: any;
}
export interface convertedTables {
    control: IControl;
    expander: AsExpansionPanel;
}
export declare class alterspectiveExpanderExtension {
    keyword: AS_MaterialDesign_TagNames;
    expander?: AsExpansionPanel;
    as: IFramework;
    currentUserFQN: any;
    currentUserDisplayName: any;
    convertedTables: convertedTables[];
    repeaterControls: IControl[];
    INDEX: number;
    constructor(as: IFramework);
    addDependantTopLevelStyles(): void;
    convertTableToExpander(k2Control: IControl): AsExpansionPanel;
    private render;
    createNewExpander(element: HTMLElement): AsExpansionPanel;
    private getDataTableTargets;
}
