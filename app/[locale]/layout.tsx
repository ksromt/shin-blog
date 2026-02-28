import type React from "react"
import { notFound } from "next/navigation"
import { setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import Navigation from "@/components/layout/Navigation"
import SectionContainer from "@/components/layout/SectionContainer"
import Footer from "@/components/layout/Footer"
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
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
          <div className="flex h-screen flex-col justify-between">
            <Navigation />
            <main className="mb-auto">{children}</main>
            <Footer />
          </div>
        </SectionContainer>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
