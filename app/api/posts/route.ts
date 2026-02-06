import { NextRequest, NextResponse } from 'next/server';
import { postRepository } from '@/lib/repositories';
import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]/options';
import { isAdmin } from '@/lib/auth-config';

export async function GET() {
  try {
    const posts = await postRepository.findPublished();
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized: Only admin can create posts' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, authorId, tags, published } = body;

    if (!title || !content || !authorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const post = await postRepository.create({ title, content, authorId, tags, published });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
