import { INameValue } from "./INameValue";
import { IStyleElement } from "./IStyleElement";
export interface IControlOfView {
    dataType: string | undefined;
    id: string | undefined;
    name: string | undefined;
    properties: INameValue[] | undefined;
    styles: IStyleElement[] | undefined;
    type: string | undefined;
}
