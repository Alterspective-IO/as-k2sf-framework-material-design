import { IContainer } from "./IContainer";
export interface IParametersArray {
}
export interface IParameter {
    parent: IContainer;
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly value: string;
}
