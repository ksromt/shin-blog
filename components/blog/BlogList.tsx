'use client'

import { useState, useMemo } from 'react'
import { SearchIcon } from "lucide-react"
import { Link } from '@/i18n/navigation'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns'
import { useTranslations } from 'next-intl'
import { stripMarkdown } from '@/lib/utils'

interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
  createdAt: string | Date
  tags: { id: string; name: string }[]
  author: { name: string | null; image?: string | null }
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations('Blog')
  const [query, setQuery] = useState('')

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts
    const q = query.toLowerCase()
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.name.toLowerCase().includes(q))
    )
  }, [posts, query])

  return (
    <>
      <div className="relative mb-8">
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          className="pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="border-t border-border" />

      <div className="space-y-12 mt-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article key={post.id} className="group space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                <span className="mx-2">&bull;</span>
                <span>by {post.author.name}</span>
              </div>

              <Link href={`/blog/${post.slug || post.id}`} className="block">
                <h2 className="text-2xl font-semibold transition-colors group-hover:text-primary">{post.title}</h2>
              </Link>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="rounded-full bg-background hover:bg-muted">
                    {tag.name}
                  </Badge>
                ))}
              </div>

              <p className="text-muted-foreground">
                {(() => {
                  const plain = stripMarkdown(post.content);
                  return plain.length > 200 ? `${plain.substring(0, 200)}...` : plain;
                })()}
              </p>
            </article>
          ))
        ) : query ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">{t('noResults')}</h3>
            <p className="text-muted-foreground">
              {t('noResultsFor', { query })}
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">{t('noPosts')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('noPostsDescription')}
            </p>
            <Link
              href="/arcadiaedenAdmin"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
            >
              {t('createFirst')}
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
