import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/prisma';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options';
import { isAdmin } from '@/lib/auth-config';

export async function PATCH(req: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update all unpublished posts to published
    const result = await prisma.post.updateMany({
      where: {
        published: false
      },
      data: {
        published: true
      }
    });

    return NextResponse.json({
      message: 'Successfully published all posts',
      updatedCount: result.count
    });

  } catch (error) {
    console.error('Error publishing all posts:', error);
    return NextResponse.json(
      { error: 'Failed to publish posts' },
      { status: 500 }
    );
  }
} 