'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export default function BlogPostClient({ postUrl }: { postUrl: string }) {
  const t = useTranslations('Blog')
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    await navigator.clipboard.writeText(postUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm text-muted-foreground">{t('share')}</span>
      <Button variant="ghost" size="sm" onClick={copyLink} className="h-8 px-2">
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
        <span className="ml-1 text-xs">{copied ? t('copied') : t('copyLink')}</span>
      </Button>
    </div>
  )
}
