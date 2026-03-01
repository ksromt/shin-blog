'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLocale, useTranslations } from 'next-intl'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function KokoronChat() {
  const locale = useLocale()
  const t = useTranslations('Kokoron')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const exampleQuestions = [t('exQ1'), t('exQ2'), t('exQ3'), t('exQ4')]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (question: string) => {
    if (!question.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: question }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const assistantMessage: Message = { role: 'assistant', content: '' }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, language: locale }),
      })

      if (response.status === 429) {
        throw new Error('RATE_LIMITED')
      }
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No response body')

      let accumulated = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            try {
              accumulated += JSON.parse(data)
            } catch {
              accumulated += data
            }
            setMessages((prev) => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: 'assistant', content: accumulated }
              return updated
            })
          }
        }
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error && error.message === 'RATE_LIMITED'
          ? t('rateLimited')
          : t('errorMessage')
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: errorMsg,
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const clearConversation = () => {
    setMessages([])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      {/* Header controls */}
      <div className="flex items-center justify-end mb-4">
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearConversation}>
            <Trash2 className="h-4 w-4 mr-1" />
            {t('clear')}
          </Button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 border rounded-lg p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="relative h-16 w-16 mb-4">
              <Image
                src="/kokoron/kokoron1.png"
                alt="Kokoron"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('emptyTitle')}</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              {t('emptyDesc')}
            </p>
            <div className="grid gap-2 sm:grid-cols-2 w-full max-w-lg">
              {exampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-left text-sm p-3 border rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
            >
              {message.role === 'assistant' && (
                <div className="relative h-8 w-8 flex-shrink-0 mt-1">
                  <Image
                    src="/kokoron/kokoron1.png"
                    alt="Kokoron"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="text-sm chat-markdown">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="ml-1">{children}</li>,
                        a: ({ href, children }) => (
                          <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                            {children}
                          </a>
                        ),
                        code: ({ children }) => (
                          <code className="bg-background/50 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
                {message.role === 'assistant' && !message.content && isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
