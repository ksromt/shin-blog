"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import CommandPalette from "@/components/layout/CommandPalette"
import { navigation } from "@/data/navigation"
import MobileMenu from "@/components/layout/MobileMenu"
import Typewriter from "typewriter-effect"
import siteMetadata from "@/data/siteMetadata"
import { useTranslations } from 'next-intl'
import LocaleSwitcher from "@/components/layout/LocaleSwitcher"

/**
 * Clean up the pathname for display in the header.
 * Strips the locale prefix and truncates deep paths (e.g. blog post CUIDs).
 */
function getDisplayPath(pathname: string): string {
  // Strip locale prefix (/en, /ja, /zh)
  const withoutLocale = pathname.replace(/^\/(en|ja|zh)/, '') || '/'
  // For deep paths like /blog/[cuid], show only the section
  const segments = withoutLocale.split('/').filter(Boolean)
  if (segments.length > 1) {
    return `/${segments[0]}`
  }
  return withoutLocale
}

export default function Navigation() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const t = useTranslations('Navigation')

  const displayPath = getDisplayPath(pathname)
  const isHome = displayPath === '/'

  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between text-xl font-semibold">
            {`~${displayPath}`}{" "}
            {isHome && (
              <Typewriter
                options={{
                  strings: ["Welcome to my blog", "Check out my projects", "Read my latest posts"],
                  autoStart: true,
                  loop: true,
                  delay: 75,
                  deleteSpeed: 50
                }}
              />
            )}
          </div>
        </Link>
      </div>
      <div className="flex items-center text-base leading-5">
        <nav className="hidden sm:block mr-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded py-1 px-2 text-foreground hover:bg-muted sm:py-2 sm:px-3 ${
                displayPath === item.href || (item.href !== '/' && displayPath.startsWith(item.href))
                  ? "font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={displayPath === item.href ? "page" : undefined}
            >
              {t(item.titleKey)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <CommandPalette />
          <LocaleSwitcher />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
