import { NextResponse } from 'next/server';
import { postRepository } from '@/lib/repositories';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options';
import { isAdmin } from '@/lib/auth-config';

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const count = await postRepository.publishAll();

    return NextResponse.json({
      message: 'Successfully published all posts',
      updatedCount: count
    });
  } catch (error) {
    console.error('Error publishing all posts:', error);
    return NextResponse.json(
      { error: 'Failed to publish posts' },
      { status: 500 }
    );
  }
}
