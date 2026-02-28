'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  ja: 'JA',
  zh: 'ZH',
}

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLocale(nextLocale: Locale) {
    setIsOpen(false)
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-10 h-10"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('label')}
      >
        <Globe className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-border z-50">
          <div className="py-1">
            {routing.locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2 text-sm',
                  loc === locale
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <span>{t(loc)}</span>
                <span className="text-xs opacity-60">{localeLabels[loc]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
