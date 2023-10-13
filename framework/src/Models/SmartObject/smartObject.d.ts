export declare class SerialisedSmartObjectBaseArrayFactory {
    static createFromSerialisedDataArray<T extends SmartObjectBase<T>>(TCreator: {
        new (): T;
    }, serialisedDataArray: string): T[];
}
export declare class SmartObjectBase<T extends SmartObjectBase<T>> {
    createFromData(data: any): void;
    createFromSerialisedData(serialisedData: string): void;
    static getArrayFromSerialisedArrayData<T extends SmartObjectBase<T>>(TCreator: {
        new (): T;
    }, serialisedArrayData: string): T[];
}
