import { setRequestLocale, getTranslations } from 'next-intl/server'
import { postRepository } from '@/lib/repositories'
import BlogList from '@/components/blog/BlogList'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog',
  description: 'All blog posts',
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Blog')
  const posts = await postRepository.findPublished(undefined, locale)

  // Serialize dates for client component
  const serializedPosts = posts.map((post) => ({
    ...post,
    createdAt: new Date(post.createdAt).toISOString(),
  }))

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>
      <BlogList posts={serializedPosts} />
    </div>
  )
}
