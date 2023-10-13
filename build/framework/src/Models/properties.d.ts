import { IControllerDefinition } from "../interfaces/AGIControllerDefinition";
import { IContainer } from "../interfaces/IContainer";
import { IControlProperties } from "../interfaces/IControlProperties";
import { IControlProperty } from "../interfaces/IControlProperty";
export declare class ControlProperties extends Array<IControlProperty> implements IControlProperties {
    constructor(properties: IControllerDefinition.PropertiesProperties | undefined | string, parent: IContainer);
}
export declare class Property implements IControlProperty {
    constructor(property: IControllerDefinition.PurpleProperty, parent: IContainer);
    name: string;
    value: string;
}
