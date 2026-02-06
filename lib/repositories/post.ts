import { prisma } from '@/lib/prisma/prisma';
import type { Post, PostWithComments, CreatePostInput, UpdatePostInput, Tag } from './types';

const authorSelect = {
  name: true,
  image: true,
};

const baseInclude = {
  author: { select: authorSelect },
  tags: true,
};

export const postRepository = {
  /**
   * Find all published posts, optionally limited
   */
  async findPublished(limit?: number): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: baseInclude,
      orderBy: { createdAt: 'desc' },
      ...(limit && { take: limit }),
    });
    return posts;
  },

  /**
   * Find all posts (for admin)
   */
  async findAll(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      include: baseInclude,
      orderBy: { createdAt: 'desc' },
    });
    return posts;
  },

  /**
   * Find a single post by ID with comments
   */
  async findById(id: string): Promise<PostWithComments | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        ...baseInclude,
        comments: {
          include: {
            author: { select: authorSelect },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return post;
  },

  /**
   * Check if a post exists
   */
  async exists(id: string): Promise<boolean> {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });
    return post !== null;
  },

  /**
   * Create a new post
   */
  async create(data: CreatePostInput): Promise<Post> {
    const { title, content, authorId, tags, published = false } = data;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        author: { connect: { id: authorId } },
        ...(tags && {
          tags: {
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        }),
      },
      include: baseInclude,
    });
    return post;
  },

  /**
   * Update an existing post
   */
  async update(id: string, data: UpdatePostInput, existingTags?: Tag[]): Promise<Post> {
    const { title, content, published, tags } = data;

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(published !== undefined && { published }),
        ...(tags && {
          tags: {
            disconnect: existingTags?.map((tag) => ({ id: tag.id })) || [],
            connectOrCreate: tags.map((tagName) => ({
              where: { name: tagName },
              create: { name: tagName },
            })),
          },
        }),
      },
      include: baseInclude,
    });
    return post;
  },

  /**
   * Delete a post
   */
  async delete(id: string): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
  },

  /**
   * Publish all unpublished posts
   */
  async publishAll(): Promise<number> {
    const result = await prisma.post.updateMany({
      where: { published: false },
      data: { published: true },
    });
    return result.count;
  },

  /**
   * Get post with its current tags (for update operation)
   */
  async findWithTags(id: string): Promise<{ id: string; tags: Tag[] } | null> {
    return prisma.post.findUnique({
      where: { id },
      select: { id: true, tags: true },
    });
  },
};
