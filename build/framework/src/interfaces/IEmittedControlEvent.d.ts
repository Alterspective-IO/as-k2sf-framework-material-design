import { IControl } from "./IControl";
export interface IEmittedControlEvent {
    control: IControl;
    eventName: string;
    controlEvent: string;
    controlEventState: string | null;
    type: string;
    functionToExecute: Function;
    enabled: boolean;
    additional?: any;
    id?: string;
    deleted: boolean;
    remove(): void;
}
