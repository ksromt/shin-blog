import { NextResponse } from 'next/server';
import { postRepository, userRepository } from '@/lib/repositories';
import { withErrorHandling, withAdmin } from '@/lib/api/middleware';
import { ApiError } from '@/lib/api/errors';
import { createPostSchema } from '@/lib/validations/post';
import { rateLimit } from '@/lib/api/rate-limit';

export const GET = withErrorHandling(async () => {
  const posts = await postRepository.findPublished();
  return NextResponse.json({ posts });
});

export const POST = withAdmin(async (request, session) => {
  if (!rateLimit(`posts:${session.user.email}`, 5, 60_000)) {
    throw ApiError.tooManyRequests();
  }

  const body = await request.json();
  const data = createPostSchema.parse(body);

  // Derive authorId from session - never trust client
  const user = await userRepository.findByEmail(session.user.email!);
  if (!user) throw ApiError.notFound('User');

  const post = await postRepository.create({
    ...data,
    authorId: user.id,
  });

  return NextResponse.json({ post }, { status: 201 });
});
