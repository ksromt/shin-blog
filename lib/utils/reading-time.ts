const WORDS_PER_MINUTE = 200;
// Standard JA/ZH reading speed is 400-600 chars/min; 500 is a fair midpoint.
const CJK_CHARS_PER_MINUTE = 500;

// Hiragana, katakana, CJK ideographs (+ext A), compatibility ideographs, half-width kana
const CJK_REGEX = /[぀-ヿ㐀-䶿一-鿿豈-﫿ｦ-ﾟ]/g;

/**
 * Estimate reading time in minutes.
 * CJK text has no word spaces, so it is counted per character;
 * remaining (Latin) text is counted per whitespace-separated word.
 * Returns at least 1 minute.
 */
export function estimateReadingTime(content: string): number {
  const cjkChars = (content.match(CJK_REGEX) || []).length;
  const latinWords = content
    .replace(CJK_REGEX, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(latinWords / WORDS_PER_MINUTE + cjkChars / CJK_CHARS_PER_MINUTE));
}
