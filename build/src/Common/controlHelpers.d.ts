import { IControl } from "asFramework/src/index";
export declare function getControlsInControl(parentControl: IControl): IControl[];
export declare function findElementId(element: Element): Element | null;
export declare function dataBind(obj: any, prop: string, control: IControl): void;
export declare function applySettings(newCard: object, settingsControl: IControl): void;
export declare function getJsonFromControlValue(control?: IControl): any | undefined;
export declare function getJsonFromString(str?: string, controlInfoReference?: IControl): any | undefined;
