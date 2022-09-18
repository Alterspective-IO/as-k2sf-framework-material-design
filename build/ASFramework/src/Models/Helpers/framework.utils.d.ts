import * as JP from "jsonpath-plus";
export { JP };
export declare enum searchObjects {
    View = "controller",
    Control = "control"
}
export declare function isDefined(value: any): boolean;
export declare function addScript(src: string, callback: ((this: GlobalEventHandlers, ev: Event) => any) | null, doc: Document): void;
export declare function isDefinedNotEmpty(value: any): boolean;
export declare function isDefinedNotEmptyGuid(value: any): boolean;
export declare function isDefinedNotGuid(value: any): boolean;
export declare function camelCase(name: string): string;
export declare function onlyUnique(value: any, index: any, self: any): boolean;
export declare function validateArray<T>(obj: T | T[] | undefined): T[];
export declare function xmlToXMLDocument(XML: string): XMLDocument | undefined;
export declare function toJSON(object: any): string;
export declare function jsonPathComplexObject(path: string, object: any): any;
export declare function jsonPath(path: string, json: string): any;
