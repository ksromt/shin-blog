import type { Metadata } from "next"
import { Link } from '@/i18n/navigation'
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock } from "lucide-react"
import { notFound } from "next/navigation"
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { postRepository } from '@/lib/repositories'
import MarkdownRenderer from '@/components/shared/MarkdownRenderer'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedPosts from '@/components/blog/RelatedPosts'
import ReadingProgress from '@/components/blog/ReadingProgress'
import siteMetadata from '@/data/siteMetadata'
import BlogPostClient from './BlogPostClient'
import { estimateReadingTime } from '@/lib/utils/reading-time'
import { extractHeadings } from '@/lib/utils/headings'

export const dynamic = 'force-dynamic'

/**
 * Resolve a post by slug+locale first, then fall back to CUID lookup.
 * This enables human-readable URLs (/blog/hello-world) while keeping
 * backward compatibility with old CUID-based URLs.
 */
async function resolvePost(idOrSlug: string, locale: string) {
  // Try slug+locale first (new format)
  const bySlug = await postRepository.findBySlugAndLocale(idOrSlug, locale);
  if (bySlug) return bySlug;
  // Fall back to CUID (backward compat)
  return postRepository.findById(idOrSlug);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const post = await resolvePost(id, locale);

  if (!post) {
    return { title: "Post Not Found" }
  }

  const description = post.content.substring(0, 160).replace(/<[^>]*>/g, "").replace(/[#*`]/g, "")
  const url = `${siteMetadata.siteUrl}/${locale}/blog/${post.slug || post.id}`

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url,
      type: 'article',
      publishedTime: new Date(post.createdAt).toISOString(),
      authors: [post.author.name ?? siteMetadata.author],
      tags: post.tags.map((t) => t.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    },
  }
}

export default async function BlogPost({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale)
  const t = await getTranslations('Blog')
  const post = await resolvePost(id, locale);

  if (!post) {
    notFound()
  }

  // The leading markdown H1 duplicates the title rendered by the page header —
  // strip it so it doesn't appear twice (and stays out of the TOC).
  const body = post.content.replace(/^\s*#\s[^\n]*\n+/, '')

  const readingTime = estimateReadingTime(body)
  const headings = extractHeadings(body)
  const postUrl = `${siteMetadata.siteUrl}/blog/${post.slug || post.id}`
  const publishedDate = new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
    new Date(post.createdAt)
  )

  // Find related posts by shared tags (same locale)
  const allPosts = await postRepository.findPublished(undefined, locale)
  const postTagNames = new Set(post.tags.map((t) => t.name))
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.tags.some((t) => postTagNames.has(t.name)))
    .slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt ?? post.createdAt).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name ?? siteMetadata.author,
    },
    description: post.content.substring(0, 160).replace(/[#*`]/g, ""),
    url: postUrl,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto">
        <ReadingProgress />
        <Link href="/blog" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToAll')}
        </Link>

        <div className="space-y-3 mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-[1.25]">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={new Date(post.createdAt).toISOString()}>
              {publishedDate}
            </time>
            <span>by {post.author.name}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {t('minRead', { minutes: readingTime })}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" className="rounded-full bg-background hover:bg-muted">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <BlogPostClient postUrl={postUrl} />

        <TableOfContents headings={headings} />

        <MarkdownRenderer content={body} />

        <RelatedPosts posts={relatedPosts} />
      </article>
    </>
  )
}
