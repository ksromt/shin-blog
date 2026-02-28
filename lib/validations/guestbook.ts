import { z } from 'zod';

export const createGuestbookSchema = z.object({
  message: z.string()
    .min(1, 'Message is required')
    .max(1000, 'Message must be 1,000 characters or less'),
});

export type CreateGuestbookInput = z.infer<typeof createGuestbookSchema>;
