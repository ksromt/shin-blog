import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  content: z.string()
    .min(1, 'Content is required')
    .max(100_000, 'Content must be 100,000 characters or less'),
  tags: z.array(
    z.string().max(50, 'Tag must be 50 characters or less')
  ).max(10, 'Maximum 10 tags allowed').optional(),
  published: z.boolean().optional().default(false),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  title: z.string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be 200 characters or less')
    .optional(),
  content: z.string()
    .min(1, 'Content cannot be empty')
    .max(100_000, 'Content must be 100,000 characters or less')
    .optional(),
  tags: z.array(
    z.string().max(50, 'Tag must be 50 characters or less')
  ).max(10, 'Maximum 10 tags allowed').optional(),
  published: z.boolean().optional(),
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;
