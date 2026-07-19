import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { postRepository } from '@/lib/repositories';
import BlogPostCard from '@/components/blog/BlogPostCard';
import HomeLayout from '@/components/home/HeroSection';

export const dynamic = 'force-dynamic'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Home')
  const posts = await postRepository.findPublished(6, locale);

  return (
    <div>
      <HomeLayout />

      <section className="mt-16 border-t border-border py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              {t('latestPostsEyebrow')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight">{t('latestPosts')}</h2>
          </div>
          <Link
            href="/blog"
            className="shrink-0 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {t('viewAll')} &rarr;
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogPostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                author={{
                  name: post.author.name || 'Unknown Author',
                  image: post.author.image,
                }}
                createdAt={post.createdAt}
                tags={post.tags}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">{t('noPostsYet')}</h3>
            <p className="text-muted-foreground">
              {t('noPostsDescription')}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
