import { prisma } from '@/lib/prisma/prisma';

// 获取所有文章
export async function getAllPosts() {
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
    });

    return { posts, error: null };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], error: 'Failed to fetch posts' };
  }
}

// 获取单个文章
export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        tags: true,
      },
    });

    if (!post) {
      return { post: null, error: 'Post not found' };
    }

    return { post, error: null };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { post: null, error: 'Failed to fetch post' };
  }
}

// 创建文章
export async function createPost(data: {
  title: string;
  content: string;
  authorId: string;
  tags?: string[];
}) {
  try {
    const { title, content, authorId, tags } = data;

    if (!title || !content || !authorId) {
      return { post: null, error: 'Missing required fields' };
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: { id: authorId },
        },
        ...(tags && {
          tags: {
            connectOrCreate: tags.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        }),
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        tags: true,
      },
    });

    return { post, error: null };
  } catch (error) {
    console.error('Error creating post:', error);
    return { post: null, error: 'Failed to create post' };
  }
} 