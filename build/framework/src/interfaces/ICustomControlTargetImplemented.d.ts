import { ICustomControlTargetSmartObject } from "./SmartObjects/IcustomControlTargets";
export interface ICustomControlTargetImplemented extends ICustomControlTargetSmartObject {
    implementedElement: HTMLElement;
}
