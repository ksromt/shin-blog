import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { Badge } from '@/components/ui/badge'

interface RelatedPost {
  id: string
  slug: string
  title: string
  tags: { id: string; name: string }[]
}

interface RelatedPostsProps {
  posts: RelatedPost[]
}

export default async function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  const t = await getTranslations('Blog')

  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-xl font-semibold mb-4">{t('relatedPosts')}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug || post.id}`}
            className="block p-4 border rounded-lg transition-colors hover:bg-muted/50 hover:border-primary/40"
          >
            <h3 className="font-medium mb-1 line-clamp-2">{post.title}</h3>
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs rounded-full">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
