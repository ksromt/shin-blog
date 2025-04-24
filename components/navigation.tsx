"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import CommandPalette from "@/components/command-palette"
import { navigation } from "@/data/nav"
import headerNavLinks from "@/data/headerNavLinks"
import DropMenu from "@/components/drop-menu"
import Typewriter from "typewriter-effect"
import siteMetadata from "@/data/siteMetadata"

export default function Navigation() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()

  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between text-xl font-semibold">
            {`~${pathname}`}{" "}
            <Typewriter
              options={{
                strings: [ ],
                autoStart: true,
                loop: true,
              }}
            />
          </div>
        </Link>
      </div>
      <div className="flex items-center text-base leading-5">
        <div className="hidden sm:block mr-4">
          {headerNavLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className={`rounded py-1 px-2 text-foreground hover:bg-muted sm:py-2 sm:px-3 ${
                pathname === link.href ? "font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <CommandPalette navigation={navigation} />
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
          <DropMenu />
        </div>
      </div>
    </header>
  )
}
