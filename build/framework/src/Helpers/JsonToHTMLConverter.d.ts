/**
 * Converts JSON to HTML.
 * Used to display JSON in the UI in a readable format.
 * Used by the executeEmbeddedCode function in src/WebBased/Common/evaluteRule.ts to display the result of the embedded code.
 */
export declare class JsonToHtmlConverter {
    static convert(json: any): string;
    private static arrayToHtml;
    private static objectToHtml;
    static escapeHtml(unsafe: string): string;
}
export declare function test(): void;
