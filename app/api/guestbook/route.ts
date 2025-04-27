import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/prisma';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]/options';

// 获取所有留言
export async function GET() {
  try {
    const entries = await prisma.guestbook.findMany({
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
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching guestbook entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guestbook entries' },
      { status: 500 }
    );
  }
}

// 创建留言
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(options);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // 从session中获取用户ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email || "" },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const entry = await prisma.guestbook.create({
      data: {
        message,
        author: {
          connect: { id: user.id },
        },
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('Error creating guestbook entry:', error);
    return NextResponse.json(
      { error: 'Failed to create guestbook entry' },
      { status: 500 }
    );
  }
} 