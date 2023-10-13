import { ICustomControlSmartObject, ICustomControlSettingSmartObject } from "../../interfaces/SmartObjects/IcustomControl";
import { ISmartObjectItem } from "../../interfaces/SmartObjects/ISmartObjectItem";
import { SmartObjectBase } from "./smartObject";
export declare class CustomControlSmartObject extends SmartObjectBase<CustomControlSmartObject> implements ICustomControlSmartObject {
    createFromData(data: ISmartObjectItem): void;
    createFromSerialisedData(serialisedData: string): void;
    System_Name: string;
    Name: string;
    Description: string;
    Settings: string;
    SettingsAsObject: CustomControlSettingSmartObject[];
    Namespace: string;
    Icon: string;
    Sample_Screenshot: string;
    Instructions: string;
    Help_URL: string;
    Target_Control_Types: string;
    Enabled: boolean;
    Javascript_Content: string;
    Javascript_URL: string;
    CSS_Content: string;
    CSS_URL: string;
    Extension: string;
    Default_Set_Value_Property: string;
    Default_Get_Value_Property: string;
    Default_Value_Changed_Event: string;
}
export declare class CustomControlSettingSmartObject extends SmartObjectBase<CustomControlSettingSmartObject> implements ICustomControlSettingSmartObject {
    Name: string;
    Description: string;
    IsRequired: boolean;
    Type: "text" | "number" | "boolean" | "json" | "html" | "date" | "datetime";
    DefaultValue: string;
}
