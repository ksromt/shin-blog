'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

export default function GuestbookForm() {
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || !session?.user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit message');
      }

      // 成功提交
      setMessage('');
      // 可以加入刷新留言列表的逻辑
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm my-8">
      <h2 className="text-2xl font-bold mb-4">留言簿</h2>
      
      {session ? (
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 items-center mb-4">
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt={session.user.name || '用户头像'} 
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="font-medium">{session.user?.name}</span>
          </div>
          
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="在这里留下你的想法..."
            className="w-full mb-4"
            rows={3}
            required
          />
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '提交中...' : '留言'}
          </Button>
        </form>
      ) : (
        <div className="text-center py-6">
          <p className="mb-4">登录后可以在此留言</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => signIn('github')}>
              使用 GitHub 登录
            </Button>
            <Button variant="outline" onClick={() => signIn('google')}>
              使用 Google 登录
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 