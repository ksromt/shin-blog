'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Children, isValidElement, useRef, useState } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Extract plain text from React children to generate heading IDs.
 * Uses the same slug algorithm as extractHeadings() in lib/utils/headings.ts.
 */
function getHeadingId(children: React.ReactNode): string {
  const text = extractText(children);
  const id = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return id || 'heading';
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!isValidElement(node)) {
    if (Array.isArray(node)) return node.map(extractText).join('');
    return '';
  }
  const props = node.props as { children?: React.ReactNode };
  return Children.toArray(props.children).map(extractText).join('');
}

/** Hover-revealed anchor link so readers can grab a section URL. */
function HeadingAnchor({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label="Link to section"
      className="ml-2 text-primary no-underline opacity-0 transition-opacity group-hover:opacity-100"
    >
      #
    </a>
  );
}

/**
 * Fenced code block with language label and copy button.
 * The surface stays warm-dark in both themes (bg-codebg token);
 * internal chrome uses fixed white-alpha since the surface is always dark.
 */
function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const child = Children.toArray(children)[0];
  const lang = isValidElement(child)
    ? /language-(\w+)/.exec((child.props as { className?: string }).className || '')?.[1]
    : undefined;

  const copy = async () => {
    await navigator.clipboard.writeText(preRef.current?.innerText ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-border bg-codebg">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-1.5">
        <span className="font-mono text-xs text-white/50">{lang ?? 'text'}</span>
        <button
          onClick={copy}
          className="text-xs text-white/50 transition-colors hover:text-white"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre ref={preRef} className="m-0 overflow-x-auto p-4 text-sm leading-relaxed">
        {children}
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose mx-auto max-w-[70ch] ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Body h1 is demoted to h2 scale: the page header owns the single
          // canonical <h1> (post title), so an in-body `#` is a section heading.
          h1: ({ children }) => {
            const id = getHeadingId(children);
            return (
              <h2 id={id} className="group scroll-mt-8 text-2xl font-semibold mb-4 mt-8 first:mt-0 border-b border-border pb-1">
                {children}
                <HeadingAnchor id={id} />
              </h2>
            );
          },
          h2: ({ children }) => {
            const id = getHeadingId(children);
            return (
              <h2 id={id} className="group scroll-mt-8 text-2xl font-semibold mb-4 mt-8 first:mt-0 border-b border-border pb-1">
                {children}
                <HeadingAnchor id={id} />
              </h2>
            );
          },
          h3: ({ children }) => {
            const id = getHeadingId(children);
            return (
              <h3 id={id} className="group scroll-mt-8 text-xl font-semibold mb-3 mt-6 first:mt-0">
                {children}
                <HeadingAnchor id={id} />
              </h3>
            );
          },
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          code: ({ className: codeClassName, children, ...props }) => {
            // Fenced blocks keep their hljs classes; CodeBlock owns the container.
            if (/language-/.test(codeClassName || '')) {
              return (
                <code className={codeClassName} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2">
              {children}
            </td>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-6 my-4 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-6 my-4 space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed [&>p]:my-0">
              {children}
            </li>
          ),
          a: ({ href, children }) => {
            const external = /^https?:\/\//.test(href ?? '');
            return (
              <a
                href={href}
                className="text-primary hover:underline"
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg max-w-full h-auto my-6 border border-border"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
