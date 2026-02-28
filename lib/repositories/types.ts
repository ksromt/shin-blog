// Shared types for repositories

export interface Author {
  name: string | null;
  image?: string | null;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: Author;
}

export interface Post {
  id: string;
  slug: string;
  locale: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: Author;
  tags: Tag[];
}

export interface PostWithComments extends Post {
  comments: Comment[];
}

export interface CreatePostInput {
  title: string;
  content: string;
  authorId: string;
  slug?: string;
  locale?: string;
  tags?: string[];
  published?: boolean;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  published?: boolean;
  tags?: string[];
}

export interface GuestbookEntry {
  id: string;
  message: string;
  createdAt: Date;
  author: Author;
}

export interface CreateGuestbookInput {
  message: string;
  authorId: string;
}
