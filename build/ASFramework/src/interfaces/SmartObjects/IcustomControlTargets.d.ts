import { ICustomControlSmartObject } from "./ICustomControl";
import { ISmartObjectItem } from "./ISmartObjectItem";
export interface ICustomControlTargetSmartObject {
    Control_Name: string;
    View_Name: string;
    Custom_Control_System_Name: string;
    Settings: string;
    SettingsObject: any;
    Control_Type: string;
    Enabled: string;
    CustomControlObject: ICustomControlSmartObject;
    createFromData(data: ISmartObjectItem): void;
}
export interface ICustomControlTargetSettingsSmartObject {
    Value: string;
    Name: string;
    IsAnotherControl: boolean;
    OtherControlProperty: "value" | "smartobject";
    createFromData(data: any): void;
}
