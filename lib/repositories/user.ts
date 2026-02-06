import { prisma } from '@/lib/prisma/prisma';

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export const userRepository = {
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    return user;
  },
};
