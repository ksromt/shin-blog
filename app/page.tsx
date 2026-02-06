import { postRepository } from '@/lib/repositories';
import BlogPostCard from '@/components/BlogPostCard';
import HomeLayout from '@/components/HomeLayout';

export default async function HomePage() {
  const posts = await postRepository.findPublished(6);

  return (
    <div className="container mx-auto px-4">
      <HomeLayout />

      <div className="py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Posts</h2>

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
            <h3 className="text-xl font-semibold mb-4">No posts yet</h3>
            <p className="text-gray-600">
              Blog posts will appear here once they are published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
