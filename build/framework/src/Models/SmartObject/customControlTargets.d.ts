import { ICustomControlTargetSmartObject } from "../../interfaces/SmartObjects/IcustomControlTargets";
import { ISmartObjectItem } from "../../interfaces/SmartObjects/ISmartObjectItem";
import { CustomControlSmartObject } from "./customControl";
import { SmartObjectBase } from "./smartObject";
export declare class CustomControlTargetSmartObject extends SmartObjectBase<CustomControlTargetSmartObject> implements ICustomControlTargetSmartObject {
    Control_Name: string;
    View_Name: string;
    Custom_Control_System_Name: string;
    Settings: string;
    SettingsObject: CustomControlTargetSettingsSmartObject[];
    Control_Type: string;
    Enabled: string;
    CustomControlObject: CustomControlSmartObject;
    createFromData(data: ISmartObjectItem): void;
}
export declare class CustomControlTargetSettingsSmartObject extends SmartObjectBase<CustomControlTargetSettingsSmartObject> implements CustomControlTargetSettingsSmartObject {
    createFromData(data: any): void;
    Value: string;
    Name: string;
    IsAnotherControl: boolean;
    OtherControlProperty: "value" | "smartobject";
}
