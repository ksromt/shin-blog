import { postRepository } from '@/lib/repositories'
import siteMetadata from '@/data/siteMetadata'
import { routing } from '@/i18n/routing'

export default async function sitemap() {
  const posts = await postRepository.findPublished()
  const locales = routing.locales

  // Generate blog post routes using slugs (deduplicated across locales)
  const slugsSeen = new Set<string>()
  const uniqueSlugs: { slug: string; updatedAt: Date | null; createdAt: Date }[] = []
  for (const post of posts) {
    if (post.slug && !slugsSeen.has(post.slug)) {
      slugsSeen.add(post.slug)
      uniqueSlugs.push({ slug: post.slug, updatedAt: post.updatedAt, createdAt: post.createdAt })
    }
  }

  const blogRoutes = uniqueSlugs.flatMap(({ slug, updatedAt, createdAt }) =>
    locales.map((locale) => ({
      url: `${siteMetadata.siteUrl}/${locale}/blog/${slug}`,
      lastModified: new Date(updatedAt ?? createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  // Generate locale-aware static routes
  const staticPages = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/blog', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/projects', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/snippets', changeFrequency: 'weekly' as const, priority: 0.5 },
    { path: '/ask', changeFrequency: 'monthly' as const, priority: 0.6 },
  ]

  const staticRoutes = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${siteMetadata.siteUrl}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  )

  return [...staticRoutes, ...blogRoutes]
}
