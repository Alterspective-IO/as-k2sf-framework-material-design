export interface IExtensionConfigurationSmartObject {
    Enabled: string;
    Extension: string;
    ViewOrForm: string;
    Type: string;
    Joins: any;
}
export interface IExtensionSmartObject {
    Name: string;
    Description: string;
    Type: string;
    Code: string;
    Design: string;
    Enabled: string;
    Module_Url: string;
    initialiseCommand: string;
    JoinedSmartObjectName: string;
}
export interface IExtensionSmartObjectImplemented extends IExtensionSmartObject {
    initialiseCommandResult: any;
    usageCount: number;
}
