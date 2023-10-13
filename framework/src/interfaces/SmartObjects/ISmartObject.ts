import { JavaScriptType } from "../../Models/Helpers/TypeConverter";
import { IContainer } from "../IContainer";
import { IControl } from "../IControl";
import { ISmartObjectItem } from "./ISmartObjectItem";



export interface IFieldInfo
{
   propertyName: string
    k2Type: string
     javascriptType:JavaScriptType
     fieldControls: IControl[]
}

export interface ISmartObject {
  fieldInfo: Array<IFieldInfo>;
  exists: boolean;
  name?: string;
  join?: any;
  items?: Array<ISmartObjectItem>;
  parent?: IContainer;
}
