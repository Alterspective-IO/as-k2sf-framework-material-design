import { CustomControlTargetSmartObject } from "../Models/SmartObject/customControlTargets";
import { IControl } from "./IControl";
import { ICustomControlTargetImplemented } from "./ICustomControlTargetImplemented";
import { IFramework } from "./IFramework";
import { ICustomControlTargetSmartObject } from "./SmartObjects/IcustomControlTargets";

export interface ICustomControls {
    as: IFramework;
    dependantViewName: string;
    processCustomControlsPromise: any;
    customControlTargets: IControl;
    customControlTargetsArray: ICustomControlTargetImplemented[];
    processCustomContols(): any;
    processCustomControl(customControlTarget: CustomControlTargetSmartObject): any;
}
