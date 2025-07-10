import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/src/backend/api/posts';
import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]/options';
import { isAdmin } from '@/lib/auth-config';

export async function GET() {
  const { posts, error } = await getAllPosts();
  
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  
  return NextResponse.json({ posts }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(options);
    
    if (!session || !session.user || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized: Only admin can create posts' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, authorId, tags, published } = body;

    const { post, error } = await createPost({ title, content, authorId, tags, published });
    
    if (error) {
      return NextResponse.json({ error }, { status: error === 'Missing required fields' ? 400 : 500 });
    }
    
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 