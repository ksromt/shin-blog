import { getTranslations } from 'next-intl/server'
import type { Heading } from '@/lib/utils/headings'

interface TableOfContentsProps {
  headings: Heading[]
}

export default async function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length <= 2) return null

  const t = await getTranslations('Blog')

  return (
    <nav className="mb-8 p-4 border rounded-lg bg-muted/30">
      <h2 className="text-sm font-semibold mb-2 uppercase tracking-wide text-muted-foreground">
        {t('toc')}
      </h2>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}>
            <a
              href={`#${heading.id}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
