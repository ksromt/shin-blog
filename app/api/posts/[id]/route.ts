import { prisma } from '@/lib/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getPostById } from '@/src/backend/api/posts';

interface Params {
  params: {
    id: string;
  };
}

interface TagType {
  id: string;
  name: string;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = params;
  const { post, error } = await getPostById(id);
  
  if (error) {
    return NextResponse.json(
      { error },
      { status: error === 'Post not found' ? 404 : 500 }
    );
  }
  
  return NextResponse.json({ post }, { status: 200 });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, content, published, tags } = body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(published !== undefined && { published }),
        ...(tags && {
          tags: {
            disconnect: existingPost.tags.map((tag: TagType) => ({ id: tag.id })),
            connectOrCreate: tags.map((tagName: string) => ({
              where: { name: tagName },
              create: { name: tagName },
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

    return NextResponse.json({ post: updatedPost }, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Delete post (comments will be cascaded due to prisma schema)
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 