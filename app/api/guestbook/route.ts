import { NextResponse } from 'next/server';
import { guestbookRepository, userRepository } from '@/lib/repositories';
import { withErrorHandling, withAuth } from '@/lib/api/middleware';
import { ApiError } from '@/lib/api/errors';
import { createGuestbookSchema } from '@/lib/validations/guestbook';
import { rateLimit } from '@/lib/api/rate-limit';
import { revalidatePath } from 'next/cache';

export const GET = withErrorHandling(async () => {
  const entries = await guestbookRepository.findAll();
  return NextResponse.json({ entries });
});

export const POST = withAuth(async (request, session) => {
  if (!rateLimit(`guestbook:${session.user.email}`, 3, 60_000)) {
    throw ApiError.tooManyRequests();
  }

  const body = await request.json();
  const data = createGuestbookSchema.parse(body);

  const user = await userRepository.findByEmail(session.user.email!);
  if (!user) throw ApiError.notFound('User');

  const entry = await guestbookRepository.create({
    message: data.message,
    authorId: user.id,
  });

  revalidatePath('/guestbook');
  return NextResponse.json({ entry }, { status: 201 });
});
