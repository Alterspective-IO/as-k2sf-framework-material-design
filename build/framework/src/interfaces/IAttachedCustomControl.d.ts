import { ICustomControlTargetSmartObject } from "./SmartObjects/IcustomControlTargets";
export interface IAttachedCustomControl {
    elementId: string;
    element: HTMLElement;
    customControlTarget?: ICustomControlTargetSmartObject;
    additionalInfo?: any | undefined;
}
