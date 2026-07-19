import type React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import Navigation from "@/components/layout/Navigation"
import SectionContainer from "@/components/layout/SectionContainer"
import Footer from "@/components/layout/Footer"
import { routing } from '@/i18n/routing'
import siteMetadata from "@/data/siteMetadata"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    description: t('siteDescription'),
    openGraph: {
      title: siteMetadata.title,
      description: t('siteDescription'),
      url: `${siteMetadata.siteUrl}/${locale}`,
      siteName: siteMetadata.title,
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteMetadata.title,
      description: t('siteDescription'),
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SectionContainer>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SectionContainer>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
