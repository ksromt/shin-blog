import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/prisma';

export async function GET() {
  try {
    // Get all posts (including unpublished ones)
    const allPosts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get published posts only
    const publishedPosts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      totalPosts: allPosts.length,
      publishedPosts: publishedPosts.length,
      unpublishedPosts: allPosts.length - publishedPosts.length,
      allPosts: allPosts.map(post => ({
        id: post.id,
        title: post.title,
        published: post.published,
        author: post.author.name,
        createdAt: post.createdAt,
        tags: post.tags.map(tag => tag.name),
      })),
      publishedPostsData: publishedPosts.map(post => ({
        id: post.id,
        title: post.title,
        published: post.published,
        author: post.author.name,
        createdAt: post.createdAt,
        tags: post.tags.map(tag => tag.name),
      })),
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts for debug:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 