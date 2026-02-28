'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface KoclawWidgetProps {
  /** API endpoint URL. Defaults to /api/koclaw */
  gatewayUrl?: string
  /** Widget theme. Matches the site's theme by default */
  theme?: 'light' | 'dark' | 'auto'
  /** Position on screen */
  position?: 'bottom-right' | 'bottom-left'
  /** Chat language */
  language?: 'en' | 'ja' | 'zh'
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Koclaw AI Chat Widget — placeholder component.
 *
 * This component mirrors the @koclaw/web-widget API design.
 * It works standalone via the /api/koclaw proxy route.
 * When @koclaw/web-widget is published, this can be replaced
 * with the official package for WebSocket support.
 */
export default function KoclawWidget({
  gatewayUrl = '/api/koclaw',
  position = 'bottom-right',
  language = 'en',
}: KoclawWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch(gatewayUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, language }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Service unavailable' }))
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: err.message || 'Something went wrong.' },
        ])
        return
      }

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response || data.message || 'No response.' },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Unable to connect to Koclaw. Please try again later.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const positionClasses = position === 'bottom-left' ? 'left-4' : 'right-4'

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'fixed bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105',
            positionClasses
          )}
          aria-label="Open Koclaw Chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-4 z-50 flex w-80 flex-col rounded-xl border bg-card shadow-2xl sm:w-96',
            positionClasses
          )}
          style={{ height: '28rem' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Koclaw AI</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center pt-8">
                Ask me anything!
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                  msg.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-muted rounded-lg px-3 py-2 text-sm max-w-[85%] animate-pulse">
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t px-3 py-2">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isLoading}
                maxLength={2000}
              />
              <Button
                type="submit"
                size="icon"
                className="h-9 w-9 rounded-lg"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
