export interface KnowledgeItem {
  keyword: string;
  frequency: number;
}

/** Common English stop words removed during extraction */
export const DEFAULT_STOP_WORDS = [
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "if",
  "in",
  "on",
  "with",
  "to",
  "of",
];

export class AlterspectiveKnowledgeExtractionAIProcessor {
  /**
   * Extracts keywords from a block of text and counts their frequency.
   * Stop words are ignored by default.
   */
  static extract(text: string, stopWords: string[] = DEFAULT_STOP_WORDS): KnowledgeItem[] {
    const words = (text || "")
      .toLowerCase()
      .match(/\b[a-z]+\b/g) || [];

    const freq: Record<string, number> = {};
    for (const w of words) {
      if (stopWords.includes(w)) continue;
      freq[w] = (freq[w] || 0) + 1;
    }
    return Object.entries(freq)
      .map(([keyword, frequency]) => ({ keyword, frequency }))
      .sort((a, b) => b.frequency - a.frequency);
  }
}

