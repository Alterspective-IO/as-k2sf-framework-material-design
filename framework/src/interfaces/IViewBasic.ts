import { IControllerDefinition } from "./AGIControllerDefinition";


//Re-define auto generated Interfaces
export interface IViewBasic extends Omit<IControllerDefinition.Controller, "controls" | "properties" | "associations" | "fields"> { }
