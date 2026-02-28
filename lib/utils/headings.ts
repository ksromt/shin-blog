export interface Heading {
  level: number;
  text: string;
  id: string;
}

/**
 * Extract headings (h1-h3) from markdown content.
 * Returns an array of { level, text, id } objects for table of contents.
 */
export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ level: match[1].length, text, id });
  }
  return headings;
}
