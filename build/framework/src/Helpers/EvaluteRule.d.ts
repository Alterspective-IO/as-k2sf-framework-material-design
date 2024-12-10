/**
 * this function will execute a function based on the expression and the dataContext.
 * It will return the result of the function.
 * It does not use eval, but creates a new function based on the expression and then executes it.
 * TODO: consider using `expr-eval` library instead of creating a new function each time as it is faster and safer
 * @param expression the expression to execute
 * @param dataContext The data context to use for the expression
 * @param dataContextName The name of the data context to use in the expression, default is "dataContext"
 * @returns
 */
export declare function executeFunc(expression: string | undefined | null, dataContext: any, dataContextName?: string): any;
/**
 * This function will evaluate a rule and return the result.
 * It uses the executeFunc function to execute the rule.
 * It will return false if the rule is undefined or null.
 * @param rule The rule to evaluate, example: "dataContext.title === 'Test'" or "dataContext.title === 'Test' && dataContext.parent.title === 'Test'"
 * @param dataContext The data context to use for the rule
 * @param dataContextName Optional name of the data context to use in the rule, default is "dataContext"
 * @returns
 */
export declare function evaluteRule(rule: string | undefined | null, dataContext: any, dataContextName?: string): boolean;
/**
 * This function will check if the property exists in the object.
 * If it does not exist, it will log an error and return undefined.
 * If it does exist, it will return the value of the property.
 * It is used to help with debugging rules.
 * @param obj
 * @param rule
 * @param dataContextName
 * @returns
 */
export declare function checkAndLogUndefined(obj: any, rule: string, dataContextName: string): any;
/**
 * This function will execute embedded code in a string by replacing ${} with the result of the code.
 * It uses the executeFunc function to execute the code.
 * Example: "title: ${title.toUpperCase()} Matter Search ${2 + 2}"
 * Resurn: "title: TITLE MATTER SEARCH 4"
 * @param input The input string to execute the embedded code in, example "title: ${title.toUpperCase()} Matter Search ${2 + 2}"
 * @param dataContext The data context to use for the embedded code
 * @param dataContextName The name of the data context to use in the embedded code, default is "dataContext"
 * @returns
 */
export declare function executeEmbeddedCode(input: string | undefined | null, dataContext: any, dataContextName?: string): string;
