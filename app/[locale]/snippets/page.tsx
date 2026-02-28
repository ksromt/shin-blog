import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { knowledgeCategories } from "@/data/knowledge"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const tPage = await getTranslations({ locale, namespace: 'Snippets' })
  const tMeta = await getTranslations({ locale, namespace: 'Metadata' })
  return {
    title: tPage('title'),
    description: tMeta('knowledgeDescription'),
  }
}

export default async function KnowledgeBasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Snippets')

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
      <p className="text-muted-foreground mb-10">
        {t('subtitle')}
      </p>

      <div className="space-y-10">
        {knowledgeCategories.map((category) => {
          const Icon = category.icon
          return (
            <section key={category.id}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t(category.nameKey)}</h2>
                  <p className="text-sm text-muted-foreground">{t(category.descKey)}</p>
                </div>
              </div>

              {/* Entries Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {category.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 border border-border rounded-lg hover:border-primary/30 transition-colors"
                  >
                    <h3 className="font-semibold mb-1">{t(entry.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t(entry.descKey)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="rounded-full text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entry.links?.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
