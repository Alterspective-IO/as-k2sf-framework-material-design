export declare type LinkedHiddenHash = {
    counter: string;
};
export declare type ISmartObjectItem = {
    [propName: string]: string;
} & {
    Joins: Array<ISmartObjectItem>;
} & {
    _linkedHiddenHash: LinkedHiddenHash;
};
