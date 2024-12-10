import { CardType } from "@alterspective-io/as-framework-material-design/dist/types/Models/CardTypes";
export interface IASK2CardSettings {
    customStyle: string | Array<string> | null | undefined;
    elevation: number;
    type: CardType;
}
