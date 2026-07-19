import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_JP, Noto_Sans_SC, Zen_Kaku_Gothic_New } from "next/font/google"
import { getLocale } from "next-intl/server"
import "./globals.css"
import { Providers } from '@/components/providers/Providers'
import siteMetadata from "@/data/siteMetadata"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// CJK fonts ship as unicode-range slices — browsers fetch only the needed
// glyph subsets, so preload:false is correct here.
const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-noto-sans-jp",
})

const notoSansSC = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-noto-sans-sc",
})

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["700", "900"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-zen-kaku",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  generator: 'Next.js',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    locale: siteMetadata.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansJP.variable} ${notoSansSC.variable} ${zenKaku.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
