
/**
 * Converts JSON to HTML.
 * Used to display JSON in the UI in a readable format.
 * Used by the executeEmbeddedCode function in src/WebBased/Common/evaluteRule.ts to display the result of the embedded code.
 */
export class JsonToHtmlConverter {
    public static convert(json: any): string {
        if (json == null) return ("<em>null</em>");
        if (typeof json !== "object") return this.escapeHtml(json.toString());

        if (Array.isArray(json)) {
            return this.arrayToHtml(json);
        } else {
            return this.objectToHtml(json);
        }
    }

    private static arrayToHtml(arr: any[]): string {
        const itemsHtml = arr.map(item => `<li>${this.convert(item)}</li>`).join("");
        return `<ul>${itemsHtml}</ul>`;
    }

    private static objectToHtml(obj: any): string {
        const propertiesHtml = Object.keys(obj)
            .map(key => `<li>${this.escapeHtml(key)}: ${this.convert(obj[key])}</li>`)
            .join("");
        return `<ul>${propertiesHtml}</ul>`;
    }
    
    static escapeHtml(unsafe: string): string {
        return unsafe.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Usage example:
const json = {
    code: "ERROR_CODE",
    message: "Something went wrong",
    details: {
        info: "Detailed information about the error",
        timestamp: new Date().toISOString(),
        items: [1, 2, 3]
    }
};

export function test() {
    const html = JsonToHtmlConverter.convert(json);
    console.log(html);


    
}   
