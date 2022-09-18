import { IEmittedControlEvent } from "./IEmittedControlEvent";
export interface IControlEvent {
    removeEvent(event: any): void;
    addEvent(func: Function, optionalAdditional?: any, optionalId?: string): IEmittedControlEvent;
}
