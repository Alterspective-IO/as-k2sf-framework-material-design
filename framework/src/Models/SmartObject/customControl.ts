
import { ICustomControlSmartObject, ICustomControlSettingSmartObject } from "../../interfaces/SmartObjects/ICustomControl";
import { ISmartObjectItem } from "../../interfaces/SmartObjects/ISmartObjectItem";
import { SerialisedSmartObjectBaseArrayFactory, SmartObjectBase } from "./smartObject"

export class CustomControlSmartObject  extends SmartObjectBase<CustomControlSmartObject> implements ICustomControlSmartObject  {  
    override createFromData(data: ISmartObjectItem) {
        super.createFromData(data)
        this.SettingsAsObject = SerialisedSmartObjectBaseArrayFactory.createFromSerialisedDataArray<CustomControlSettingSmartObject>(CustomControlSettingSmartObject,this.Settings)      
    }
    override createFromSerialisedData(serialisedData: string) {
        super.createFromSerialisedData(serialisedData);
        this.SettingsAsObject = SerialisedSmartObjectBaseArrayFactory.createFromSerialisedDataArray<CustomControlSettingSmartObject>(CustomControlSettingSmartObject,this.Settings)
    }
    //  static getArrayFromSerialisedArrayData(serialisedArrayData:string)
    // {
    //     return SmartObjectBase.getArrayFromSerialisedArrayData(CustomControl,serialisedArrayData)
    // }   

    System_Name: string = ""
    Name: string = ""
    Description: string = ""
    Settings: string = ""
    SettingsAsObject= new Array<CustomControlSettingSmartObject>()
    Namespace: string = ""
    Icon: string = ""
    Sample_Screenshot: string = ""
    Instructions: string = ""
    Help_URL: string = ""
    Target_Control_Types: string = ""
    Enabled: boolean = false
    Javascript_Content: string = ""
    Javascript_URL: string = ""
    CSS_Content: string = ""
    CSS_URL: string = ""
    Extension: string = ""
    Default_Set_Value_Property: string = ""
    Default_Get_Value_Property: string = ""
    Default_Value_Changed_Event: string = ""
}

export class CustomControlSettingSmartObject extends SmartObjectBase<CustomControlSettingSmartObject> implements ICustomControlSettingSmartObject  {
    Name: string = ""
    Description: string    =""
    IsRequired: boolean   =true
    Type:  "text"|    "number"|    "boolean"|    "json"|    "html"|    "date"|    "datetime" ="text"
    DefaultValue: string = ""
}



