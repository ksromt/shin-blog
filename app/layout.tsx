import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import SectionContainer from "@/components/section-container"
import Footer from "@/components/footer"
import siteMetadata from "@/data/siteMetadata"
import { Providers } from './providers'

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  generator: 'next.js',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SectionContainer>
              <div className="flex h-screen flex-col justify-between">
                <Navigation />
                <main className="mb-auto">{children}</main>
                <Footer />
              </div>
            </SectionContainer>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
