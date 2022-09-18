import { Framework } from "./framework";
import { IFramework } from "../interfaces/IFramework";
import { Control } from "./control";
export declare function attachToControlEvents(as: Framework): void;
export declare function attachHandler(control: Control, event: string, when: string, handler: Function): void;
export declare function executeControl(control: Control, method: string, as: IFramework, optionalValue?: any, optionalPropertyName?: any): any;
