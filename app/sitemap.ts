import { postRepository } from '@/lib/repositories'
import siteMetadata from '@/data/siteMetadata'
import { routing } from '@/i18n/routing'

export default async function sitemap() {
  const posts = await postRepository.findPublished()
  const locales = routing.locales

  // Generate locale-aware blog post routes
  const blogRoutes = posts.flatMap((post) =>
    locales.map((locale) => ({
      url: `${siteMetadata.siteUrl}/${locale}/blog/${post.id}`,
      lastModified: new Date(post.updatedAt ?? post.createdAt),
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
    { path: '/rust-docs', changeFrequency: 'monthly' as const, priority: 0.6 },
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
