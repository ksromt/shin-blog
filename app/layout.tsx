import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import SectionContainer from "@/components/section-container"
import Footer from "@/components/footer"
import siteMetadata from "@/data/siteMetadata"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SectionContainer>
            <div className="flex h-screen flex-col justify-between">
              <Navigation />
              <main className="mb-auto">{children}</main>
              <Footer />
            </div>
          </SectionContainer>
        </ThemeProvider>
      </body>
    </html>
  )
}
