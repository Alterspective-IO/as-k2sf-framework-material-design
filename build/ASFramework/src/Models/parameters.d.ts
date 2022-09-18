import { IRuntimeParameter } from "../interfaces/AGIControllerDefinition";
import { IContainer } from "../interfaces/IContainer";
import { IParameter, IParametersArray } from "../interfaces/Iparameters";
export declare class ParametersArray extends Array<Parameter> implements IParametersArray {
    constructor(parameters: IRuntimeParameter.Parameters, parent: IContainer);
}
export declare class Parameter implements IParameter {
    private _parameter;
    parent: IContainer;
    constructor(parameter: IRuntimeParameter.Parameter, parent: IContainer);
    get id(): string;
    get name(): string;
    get type(): string;
    get value(): string;
}
