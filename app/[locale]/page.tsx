import { setRequestLocale, getTranslations } from 'next-intl/server'
import { postRepository } from '@/lib/repositories';
import BlogPostCard from '@/components/blog/BlogPostCard';
import HomeLayout from '@/components/home/HeroSection';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Home')
  const posts = await postRepository.findPublished(6);

  return (
    <div className="container mx-auto px-4">
      <HomeLayout />

      <div className="py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('latestPosts')}</h2>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </div>
    </div>
  );
}
