import { ISmartObjectBase } from "./ISmartObjectBase";
export interface IK2SerialisedArray<T extends ISmartObjectBase<T>> {
    '$type': string;
    '$values': Array<T>;
}
