import { NextRequest, NextResponse } from 'next/server';
import { guestbookRepository, userRepository } from '@/lib/repositories';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]/options';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const entries = await guestbookRepository.findAll();
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching guestbook entries:', error);
    return NextResponse.json({ error: 'Failed to fetch guestbook entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const user = await userRepository.findByEmail(session.user.email || '');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const entry = await guestbookRepository.create({ message, authorId: user.id });

    revalidatePath('/guestbook');
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('Error creating guestbook entry:', error);
    return NextResponse.json({ error: 'Failed to create guestbook entry' }, { status: 500 });
  }
}
