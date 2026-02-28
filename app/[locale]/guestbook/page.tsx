import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Image from "next/image"
import { guestbookRepository } from '@/lib/repositories';
import GuestbookForm from "@/components/guestbook/GuestbookForm"
import { formatDistanceToNow } from 'date-fns';

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Guestbook | ~/blog",
  description: "Sign my guestbook and leave a message",
}

export default async function GuestbookPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Guestbook')
  const entries = await guestbookRepository.findAll();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">{t('title')}</h1>

      <GuestbookForm />

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">{t('recentMessages')}</h2>

        {entries.length > 0 ? (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div key={entry.id} className="border border-border rounded-lg p-4">
                <div className="flex gap-2 items-center mb-2">
                  {entry.author.image ? (
                    <span className="w-6 h-6 rounded-full overflow-hidden relative">
                      <Image
                        src={entry.author.image}
                        alt={entry.author.name || 'User avatar'}
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs text-muted-foreground">
                      {entry.author.name?.[0] || '?'}
                    </div>
                  )}
                  <span className="font-medium">{entry.author.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                  </span>
                </div>

                <p className="text-foreground">{entry.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t('noMessages')}
          </div>
        )}
      </div>
    </div>
  )
}
