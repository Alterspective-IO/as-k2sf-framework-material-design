export type LinkedHiddenHash = {
    counter: string;
};
export type ISmartObjectItem = {
    [propName: string]: string;
} & {
    Joins: Array<ISmartObjectItem>;
} & {
    _linkedHiddenHash: LinkedHiddenHash;
};
