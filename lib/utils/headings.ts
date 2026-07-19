export interface Heading {
  level: number;
  text: string;
  id: string;
}

/**
 * Extract headings (h2-h3) from markdown content.
 * h1 is excluded (it is the article title, rendered by the page header).
 * Fenced code blocks are stripped first so `# comment` lines inside code
 * samples don't become phantom TOC entries.
 * Returns an array of { level, text, id } objects for table of contents.
 */
export function extractHeadings(content: string): Heading[] {
  const source = content.replace(/```[\s\S]*?```/g, '');
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  const usedIds = new Set<string>();
  let match;
  while ((match = headingRegex.exec(source)) !== null) {
    const text = match[2].trim();
    let id = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')  // preserve Unicode letters & numbers
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')                 // collapse multiple hyphens
      .replace(/^-|-$/g, '');              // trim leading/trailing hyphens

    // Fallback for empty IDs (shouldn't happen now, but just in case)
    if (!id) {
      id = `heading-${headings.length}`;
    }

    // Ensure uniqueness by appending a suffix if needed
    let uniqueId = id;
    let counter = 1;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter++;
    }
    usedIds.add(uniqueId);

    headings.push({ level: match[1].length, text, id: uniqueId });
  }
  return headings;
}
