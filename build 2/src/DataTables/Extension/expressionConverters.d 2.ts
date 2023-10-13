import { IPassPack } from "./interfaces";
/**
 * Convert functions found in settings.OptGrid.column[].formatter into executable functions
 * @param instance
 * @returns
 */
export declare function convertExpressions<T>(obj: any, passPack: IPassPack): T;
/**
 * Convert any found renderer to a renderer object
 * @param instance
 * @returns
 */
export declare function convertRenderers<T>(obj: any, passPack: IPassPack, previousObjectPath?: string): T;
