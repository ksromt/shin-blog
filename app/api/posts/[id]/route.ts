import { NextRequest, NextResponse } from 'next/server';
import { postRepository } from '@/lib/repositories';
import { getServerSession } from 'next-auth/next';
import { options } from '../../auth/[...nextauth]/options';
import { isAdmin } from '@/lib/auth-config';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const post = await postRepository.findById(id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized: Only admin can update posts' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { title, content, published, tags } = body;

    const existingPost = await postRepository.findWithTags(id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updatedPost = await postRepository.update(id, { title, content, published, tags }, existingPost.tags);
    return NextResponse.json({ post: updatedPost }, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized: Only admin can delete posts' },
        { status: 403 }
      );
    }

    const { id } = params;

    const exists = await postRepository.exists(id);
    if (!exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await postRepository.delete(id);
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
