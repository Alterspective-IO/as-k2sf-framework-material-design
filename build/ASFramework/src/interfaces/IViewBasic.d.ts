import { IControllerDefinition } from "./AGIControllerDefinition";
export interface IViewBasic extends Omit<IControllerDefinition.Controller, "controls" | "properties" | "associations" | "fields"> {
}
