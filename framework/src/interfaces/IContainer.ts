import { IControllerDefinition } from "./AGIControllerDefinition";
import { ContainerType, ControlType } from "./enums";
import { IFramework } from "./IFramework";


export interface IContainer {  
  name: string;
  _as: IFramework;
  formId: string;
  containerType: ContainerType;
  containerSubType: ControlType  | IControllerDefinition.TypeView 
  parent?: IContainer;
  id?: string;
  getHTMLElement(): HTMLElement;
  configurationName: string
  rawData: any
}
