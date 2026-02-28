import { NextResponse } from 'next/server';
import { postRepository } from '@/lib/repositories';
import { withAdmin } from '@/lib/api/middleware';

export const PATCH = withAdmin(async () => {
  const count = await postRepository.publishAll();
  return NextResponse.json({
    message: 'Successfully published all posts',
    updatedCount: count,
  });
});
