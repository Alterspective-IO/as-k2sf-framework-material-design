


/**
 * This function gets a nested property of an object and returns it
 * If the property does not exist it returns undefined
 * @param obj The object to get the property from
 * @param propertyPath The path to the property example: "data[0].name" or "data.otherData.name"
 * @returns 
 */
export function getNestedProperty(obj: any, propertyPath: string): any {
    // l(inf(`getNestedProperty(${propertyPath})`),obj)

    const properties = propertyPath.split('.');
    let current = obj;

    for (const prop of properties) {
        // Check if the property has an array index, e.g., "data[0]"
        const matches = prop.match(/^([a-zA-Z0-9_]+)\[([0-9]+)\]$/);
        if (matches) {
            const arrayProp = matches[1];
            const index = parseInt(matches[2], 10);
            if (!Array.isArray(current[arrayProp]) || current[arrayProp][index] === undefined) {
                // l(err(`getNestedProperty(${propertyPath}): arrayProp or index is undefined`),obj)
                return undefined;
            }
            current = current[arrayProp][index]; 
        } else if (current[prop] === undefined || current[prop] === null) {
            // l(err(`getNestedProperty(${propertyPath}): prop is undefined`),obj)
            return undefined;
        } else {
            current = current[prop];
        }
    }
    return current;
}

