export interface Snippet {
  id: string;
  title: string;
  language: string;
  description: string;
  content: string;
}

export const snippets: Snippet[] = [
  {
    id: 'rust-ownership',
    title: 'Rust Ownership Basics',
    language: 'Rust',
    description: 'Common ownership patterns in Rust',
    content: `\`\`\`rust
fn main() {
    // Move semantics
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved to s2

    // Borrowing
    let s3 = String::from("world");
    let len = calculate_length(&s3);
    println!("{s3} has length {len}");
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
\`\`\``,
  },
  {
    id: 'ts-generics',
    title: 'TypeScript Generic Utility',
    language: 'TypeScript',
    description: 'Type-safe pick and omit helpers',
    content: `\`\`\`typescript
// Pick specific keys from an object at runtime
function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

// Usage
const user = { id: 1, name: "Shin", email: "shin@example.com", role: "admin" };
const public_info = pick(user, ["id", "name"]);
// type: { id: number; name: string }
\`\`\``,
  },
  {
    id: 'python-async',
    title: 'Python Async Patterns',
    language: 'Python',
    description: 'Concurrent HTTP requests with asyncio',
    content: `\`\`\`python
import asyncio
import httpx

async def fetch_url(client: httpx.AsyncClient, url: str) -> str:
    response = await client.get(url)
    return response.text

async def fetch_all(urls: list[str]) -> list[str]:
    async with httpx.AsyncClient() as client:
        tasks = [fetch_url(client, url) for url in urls]
        return await asyncio.gather(*tasks)

# Usage
urls = ["https://api.example.com/1", "https://api.example.com/2"]
results = asyncio.run(fetch_all(urls))
\`\`\``,
  },
  {
    id: 'react-custom-hook',
    title: 'React useDebounce Hook',
    language: 'TypeScript',
    description: 'Debounce values in React components',
    content: `\`\`\`typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage in a search component
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      // Fetch search results
    }
  }, [debouncedQuery]);
}
\`\`\``,
  },
  {
    id: 'docker-multistage',
    title: 'Docker Multi-Stage Build',
    language: 'Docker',
    description: 'Optimized Node.js Docker build',
    content: `\`\`\`dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\``,
  },
  {
    id: 'sql-window',
    title: 'SQL Window Functions',
    language: 'SQL',
    description: 'Common window function patterns',
    content: `\`\`\`sql
-- Rank posts by view count within each category
SELECT
  title,
  category,
  view_count,
  ROW_NUMBER() OVER (PARTITION BY category ORDER BY view_count DESC) AS rank,
  SUM(view_count) OVER (PARTITION BY category) AS category_total,
  view_count::float / SUM(view_count) OVER (PARTITION BY category) AS pct_of_category
FROM posts
WHERE published = true;
\`\`\``,
  },
];
