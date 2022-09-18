export interface ISerialisedSmartObjectBaseArrayFactory {
}
export interface ISmartObjectBase<T extends ISmartObjectBase<T>> {
    createFromData(data: any): void;
    createFromSerialisedData(serialisedData: string): void;
}
