import Link from "next/link"
import { getTranslations } from 'next-intl/server'
import { Github, Linkedin, Mail, Rss } from 'lucide-react'
import siteMetadata from "@/data/siteMetadata"
import { navigation } from "@/data/navigation"

export default async function Footer() {
  const t = await getTranslations('Footer')
  const tNav = await getTranslations('Navigation')
  const currentYear = new Date().getFullYear()
  const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" })

  const socials = [
    { href: siteMetadata.github, label: 'GitHub', Icon: Github },
    { href: siteMetadata.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { href: `mailto:${siteMetadata.email}`, label: 'Email', Icon: Mail },
    { href: '/feed.xml', label: 'RSS', Icon: Rss },
  ]

  return (
    <footer className="mt-16 border-t border-border py-10">
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-5 text-muted-foreground">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="transition-colors hover:text-primary"
              {...(href.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {tNav(item.titleKey)}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-muted-foreground">
          {t('copyright', { author: siteMetadata.author, year: currentYear })}
          {' • '}
          {t('haveAGood', { day: currentDay })}
        </p>
      </div>
    </footer>
  )
}
