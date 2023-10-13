import { IExtensionConfigurationSmartObject, IExtensionSmartObject } from "../../interfaces/SmartObjects/Iextentions";
import { SmartObjectBase } from "./smartObject";
export declare class ExtensionConfigurationSmartObject extends SmartObjectBase<ExtensionConfigurationSmartObject> implements IExtensionConfigurationSmartObject {
    Enabled: string;
    Extension: string;
    ViewOrForm: string;
    Type: string;
    Joins: ExtensionSmartObject[];
}
export declare class ExtensionSmartObject extends SmartObjectBase<ExtensionSmartObject> implements IExtensionSmartObject {
    Name: string;
    Description: string;
    Type: string;
    Code: string;
    Enabled: string;
    Module_Url: string;
    initialiseCommand: string;
    JoinedSmartObjectName: string;
}
