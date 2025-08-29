import { IControl } from "./IControl";
import { IDictionary } from "./IDictionary";
import { IFramework } from "./IFramework";
import { ISmartObject } from "./SmartObjects/ISmartObject";




export type ExtensionEvent =
{
  name : string
  module: unknown
  type: "code" | "module"
}

export enum ExtensionEventTypeOption {
    registered = "registered"   
}

export interface IExtensionConstructor {
  new (...params: any[]): any;
}

export interface IExtension
{
  name:                  string 
  description:           string 
  type:                  string 
  code:                  string 
  enabled:               string 
  moduleUrl:            string 
  initializeCommand:     string 
}

export interface IRegisteredExtension extends IExtension
{
  usageCount: number
  initializeCommandResult: any
}

export interface IRegisteredExtensionModule 
{
  as:IFramework
  [key: string]: any
}


export interface IExtensions {
    _as: IFramework;
    registeredExtensions: IDictionary<IRegisteredExtension>;
    registerSmartObjectExtensions(so: ISmartObject): any;
    registerExtension(extension: IExtension): any;
    registerModule(moduleName:string,module:IExtensionConstructor): Promise<any>
    registeredExtensionModules : IDictionary<any>;
}

// export interface IExtensions {
//   registeredExtensions: IDictionary<IExtensionSmartObjectImplemented>;
// }
