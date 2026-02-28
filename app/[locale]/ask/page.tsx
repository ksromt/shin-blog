import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from 'next-intl/server'
import KokoronChat from "@/components/ask/KokoronChat"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const tPage = await getTranslations({ locale, namespace: 'Kokoron' })
  const tMeta = await getTranslations({ locale, namespace: 'Metadata' })
  return {
    title: tPage('title'),
    description: tMeta('askAIDescription'),
  }
}

export default async function AskKokoronPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Kokoron')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>
      <KokoronChat />
    </div>
  )
}
