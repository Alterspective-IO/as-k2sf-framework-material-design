/**
 * This function gets a nested property of an object and returns it
 * If the property does not exist it returns undefined
 * @param obj The object to get the property from
 * @param propertyPath The path to the property example: "data[0].name" or "data.otherData.name"
 * @returns
 */
export declare function getNestedProperty(obj: any, propertyPath: string): any;
