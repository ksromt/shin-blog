import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/src/backend/api/posts';

export async function GET() {
  const { posts, error } = await getAllPosts();
  
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  
  return NextResponse.json({ posts }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, authorId, tags } = body;

    const { post, error } = await createPost({ title, content, authorId, tags });
    
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