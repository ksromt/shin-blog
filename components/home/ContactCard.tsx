'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, Github, Mail, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import siteMetadata from '@/data/siteMetadata'

export default function ContactCard() {
  const t = useTranslations('Home')
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  const copyEmail = async () => {
    await navigator.clipboard.writeText(siteMetadata.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Contact card button — same gradient glow style as sibling cards */}
      <div className="group relative">
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-glow-c to-glow-a opacity-50 blur will-change-transform transition duration-500 group-hover:opacity-100 group-hover:duration-200 motion-safe:group-hover:animate-tilt"></div>
        <button onClick={() => setIsOpen(true)} className="w-full rounded-lg">
          <span className="relative flex items-center divide-x divide-border rounded-lg bg-card px-7 py-4 leading-none whitespace-nowrap">
            <span className="flex items-center space-x-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 -rotate-6 text-glow-c"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
              </svg>
              <span className="pr-6 text-foreground">{t('hireMe')}</span>
            </span>
            <span className="pl-6 text-primary transition duration-200 group-hover:text-foreground">
              {t('contactArrow')}&nbsp;&rarr;
            </span>
          </span>
        </button>
      </div>

      {/* Contact modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in-0 duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-card rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-border animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-foreground">{t('contactTitle')}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* GitHub */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 mb-3">
              <div className="flex items-center gap-3">
                <Github className="h-5 w-5 text-foreground" />
                <span className="text-sm font-medium text-foreground">{t('contactGithub')}</span>
              </div>
              <a
                href={siteMetadata.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm font-medium"
              >
                ksromt&nbsp;↗
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3 min-w-0">
                <Mail className="h-5 w-5 text-foreground shrink-0" />
                <span className="text-sm text-muted-foreground truncate select-all">
                  {siteMetadata.email}
                </span>
              </div>
              <button
                onClick={copyEmail}
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 shrink-0 ml-3 transition-colors"
              >
                {copied ? (
                  <span className="inline-flex items-center gap-1 animate-in zoom-in-50 duration-200">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-success">{t('emailCopied')}</span>
                  </span>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {t('copyEmail')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
