import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Strip markdown syntax from a string for plain-text previews.
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')   // code blocks
    .replace(/`([^`]+)`/g, '$1')       // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')   // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links -> text
    .replace(/#{1,6}\s+/g, '')         // headings
    .replace(/[*_~]{1,3}/g, '')        // bold/italic/strikethrough
    .replace(/>\s+/g, '')              // blockquotes
    .replace(/[-*+]\s+/g, '')          // list items
    .replace(/\d+\.\s+/g, '')          // numbered lists
    .replace(/\n{2,}/g, ' ')           // multiple newlines
    .replace(/\n/g, ' ')              // single newlines
    .trim()
}
