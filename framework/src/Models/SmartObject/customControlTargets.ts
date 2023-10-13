import { ICustomControlTargetSmartObject } from "../../interfaces/SmartObjects/IcustomControlTargets";
import { ISmartObjectItem } from "../../interfaces/SmartObjects/ISmartObjectItem";
import { CustomControlSmartObject } from "./customControl";
import { SmartObjectBase } from "./smartObject";

export class CustomControlTargetSmartObject extends SmartObjectBase<CustomControlTargetSmartObject> implements ICustomControlTargetSmartObject {
    Control_Name: string = ""
    View_Name: string = ""
    Custom_Control_System_Name: string = ""
    Settings: string = ""
    SettingsObject = new Array<CustomControlTargetSettingsSmartObject>();
    Control_Type: string = ""
    Enabled: string = ""
    CustomControlObject = new CustomControlSmartObject()

    override createFromData(data: ISmartObjectItem): void {
        super.createFromData(data)
        this.SettingsObject = SmartObjectBase.getArrayFromSerialisedArrayData(CustomControlTargetSettingsSmartObject,this.Settings)
        this.CustomControlObject.createFromData(data.Joins[0])
    }

}

export class CustomControlTargetSettingsSmartObject extends SmartObjectBase<CustomControlTargetSettingsSmartObject> implements CustomControlTargetSettingsSmartObject {
    override createFromData(data: any): void {
        super.createFromData(data)
        console.log("CustomControlTargetSettings - createFromData ")
        //this.CustomControlSetting.createFromSerialisedData
    }
    Value: string = "My Title"
    Name: string =  "title"
    IsAnotherControl : boolean = false
    OtherControlProperty : "value" | "smartobject" = "value"
}
 