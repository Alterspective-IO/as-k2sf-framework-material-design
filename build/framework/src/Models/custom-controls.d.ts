import { IControl } from "../interfaces/IControl";
import { IFramework } from "../interfaces/IFramework";
import { CustomControlTargetSmartObject } from "../Models/SmartObject/customControlTargets";
import { ICustomControlTargetImplemented } from "../interfaces/ICustomControlTargetImplemented";
import { ICustomControls } from "../interfaces/Icustom-controls";
export declare class CustomControls implements ICustomControls {
    as: IFramework;
    dependantViewName: string;
    processCustomControlsPromise: Promise<void>;
    customControlTargets: IControl;
    customControlTargetsArray: ICustomControlTargetImplemented[];
    constructor(as: IFramework);
    processCustomContols(): Promise<void>;
    private convertAndProcessCustomControlTarget;
    processCustomControl(customControlTarget: CustomControlTargetSmartObject): Promise<void>;
    private setCustomControlProperty;
}
