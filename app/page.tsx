import { prisma } from '@/lib/prisma/prisma';
import BlogPostCard from '@/components/BlogPostCard';
import HomeLayout from '@/components/HomeLayout';

interface Author {
  name: string;
  image?: string | null;
}

interface Tag {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: Author;
  tags: Tag[];
}

async function getPosts(): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6, // Limit to latest 6 posts
    });
    
    // 确保返回的posts符合Post接口类型
    return posts.map(post => ({
      ...post,
      author: {
        name: post.author.name || 'Unknown Author',
        image: post.author.image
      }
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function HomePage() {
  const posts = await getPosts();
  
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
                author={post.author}
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
