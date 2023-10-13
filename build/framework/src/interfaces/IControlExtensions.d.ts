import { INameValueAny } from "./INameValue";
export interface IControlExtensions {
    [name: string]: any;
    properties: Array<string>;
    addExtension(nameValue: INameValueAny): void;
}
