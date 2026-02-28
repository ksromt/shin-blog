'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';

export default function GuestbookForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations('Guestbook');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || !session?.user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit message');
      }

      setMessage('');
      router.refresh();
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="border rounded-lg p-6 my-8">
      {session ? (
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 items-center mb-4">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User avatar'}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span className="font-medium">{session.user?.name}</span>
          </div>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('placeholder')}
            className="w-full mb-4"
            rows={3}
            required
            maxLength={1000}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        </form>
      ) : (
        <div className="text-center py-6">
          <p className="mb-4 text-muted-foreground">{t('signIn')}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => signIn('github')}>
              Sign in with GitHub
            </Button>
            <Button variant="outline" onClick={() => signIn('google')}>
              Sign in with Google
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
