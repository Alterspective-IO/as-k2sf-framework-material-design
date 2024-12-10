import { JsonToHtmlConverter } from "./JsonToHTMLConverter";

describe('JsonToHtmlConverter', () => {
  describe('convert', () => {
    it('should convert null to "<em>null</em>"', () => {
      const input = null;
      const result = JsonToHtmlConverter.convert(input);
      expect(result).toBe('<em>null</em>');
    });

    it('should convert a string to its HTML-escaped form', () => {
      const input = 'Hello, <script>alert("World");</script>';
      const result = JsonToHtmlConverter.convert(input);
      expect(result).toBe('Hello, &lt;script&gt;alert(&quot;World&quot;);&lt;/script&gt;');
    });

    it('should convert an array to an HTML list', () => {
      const input = [1, 2, 3];
      const result = JsonToHtmlConverter.convert(input);
      expect(result).toBe('<ul><li>1</li><li>2</li><li>3</li></ul>');
    });

    it('should convert an object to an HTML list of properties', () => {
      const input = { name: 'John', age: 30 };
      const result = JsonToHtmlConverter.convert(input);
      expect(result).toBe('<ul><li>name: John</li><li>age: 30</li></ul>');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS");</script>';
      const result = JsonToHtmlConverter.escapeHtml(input);
      expect(result).toBe('&lt;script&gt;alert(&quot;XSS&quot;);&lt;/script&gt;');
    });
  });
});
