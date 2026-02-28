const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time in minutes based on word count.
 * Returns at least 1 minute.
 */
export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
