import { IContainer } from "../IContainer";
import { ISmartObjectItem } from "./ISmartObjectItem";
export interface ISmartObject {
    exists: boolean;
    name?: string;
    join?: any;
    items?: Array<ISmartObjectItem>;
    parent?: IContainer;
}
