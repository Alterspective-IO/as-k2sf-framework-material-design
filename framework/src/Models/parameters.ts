import { IRuntimeParameter } from "../interfaces/AGIControllerDefinition";
import { IContainer } from "../interfaces/IContainer";
import { IParameter, IParametersArray } from "../interfaces/Iparameters";

export class ParametersArray extends Array<Parameter> implements IParametersArray
{
   constructor(parameters: IRuntimeParameter.Parameters, parent: IContainer)
   {
        super();
        for (let [key, value] of Object.entries(parameters)) {
            console.log(`Adding parameter ${key} + ':' + ${value}`);        
            this.push(new Parameter(value as IRuntimeParameter.Parameter,parent))            
          }
   }
}

export class Parameter implements IParameter {

    private _parameter: IRuntimeParameter.Parameter
    parent : IContainer
    constructor(parameter: IRuntimeParameter.Parameter, parent: IContainer) {
        this._parameter = parameter
        this.parent=parent
    }

    get id(): string {
        return this._parameter.ID        
    }

    get name(): string {
        return this._parameter.Name
    }

    get type(): string {
        return this._parameter.Type
    }

    get value(): string 
    {
        return this._parameter.Value
    }
}

