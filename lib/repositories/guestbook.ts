import { prisma } from '@/lib/prisma/prisma';
import type { GuestbookEntry, CreateGuestbookInput } from './types';

const authorSelect = {
  name: true,
  image: true,
};

export const guestbookRepository = {
  /**
   * Find all guestbook entries
   */
  async findAll(): Promise<GuestbookEntry[]> {
    const entries = await prisma.guestbook.findMany({
      include: {
        author: { select: authorSelect },
      },
      orderBy: { createdAt: 'desc' },
    });
    return entries;
  },

  /**
   * Create a new guestbook entry
   */
  async create(data: CreateGuestbookInput): Promise<GuestbookEntry> {
    const entry = await prisma.guestbook.create({
      data: {
        message: data.message,
        author: { connect: { id: data.authorId } },
      },
      include: {
        author: { select: authorSelect },
      },
    });
    return entry;
  },
};
