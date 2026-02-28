import { NextRequest, NextResponse } from 'next/server';
import { postRepository } from '@/lib/repositories';
import { withErrorHandling, withAdmin, type RouteContext } from '@/lib/api/middleware';
import { ApiError } from '@/lib/api/errors';
import { updatePostSchema } from '@/lib/validations/post';

export const GET = withErrorHandling(async (_request: NextRequest, context?: RouteContext) => {
  const { id } = await context!.params;
  const post = await postRepository.findById(id);
  if (!post) throw ApiError.notFound('Post');
  return NextResponse.json({ post });
});

export const PATCH = withAdmin(async (request, _session, context?) => {
  const { id } = await context!.params;
  const body = await request.json();
  const data = updatePostSchema.parse(body);

  const existingPost = await postRepository.findWithTags(id);
  if (!existingPost) throw ApiError.notFound('Post');

  const updatedPost = await postRepository.update(id, data, existingPost.tags);
  return NextResponse.json({ post: updatedPost });
});

export const DELETE = withAdmin(async (_request, _session, context?) => {
  const { id } = await context!.params;

  const exists = await postRepository.exists(id);
  if (!exists) throw ApiError.notFound('Post');

  await postRepository.delete(id);
  return NextResponse.json({ message: 'Post deleted successfully' });
});
