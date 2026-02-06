# Code Quality Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve code quality by fixing security issues, eliminating code duplication, and establishing a clean Repository pattern for data access.

**Architecture:** Introduce a Repository layer (`lib/repositories/`) to centralize all database operations. Move hardcoded admin email to environment variables. Remove unused mock components.

**Tech Stack:** Next.js 15, Prisma, TypeScript

---

## Task 1: Fix Hardcoded Admin Email

**Files:**
- Modify: `lib/auth-config.ts`
- Modify: `.env.local` (create if not exists)
- Modify: `.env.example` (create if not exists)

**Step 1: Create/update .env.example**

Create `.env.example` with template:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/shin_blog"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Admin
ADMIN_EMAIL=your-admin-email@example.com
```

**Step 2: Update .env.local**

Add to `.env.local`:

```env
ADMIN_EMAIL=arkshelter64@gmail.com
```

**Step 3: Update auth-config.ts**

Replace hardcoded email with environment variable:

```typescript
// Authentication and Authorization Configuration

function getAdminEmail(): string {
  const email = process.env.ADMIN_EMAIL;
  if (!email) {
    throw new Error('ADMIN_EMAIL environment variable is not set');
  }
  return email;
}

export const AUTH_CONFIG = {
  // Admin route path - hidden from public navigation
  ADMIN_ROUTE: '/arcadiaedenAdmin',

  // Roles and permissions
  ROLES: {
    ADMIN: 'admin',
    USER: 'user',
  },

  // Admin permissions
  ADMIN_PERMISSIONS: [
    'create_post',
    'edit_post',
    'delete_post',
    'publish_post',
    'manage_users',
    'view_analytics',
  ],
} as const;

// Helper function to check if a user is admin
export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email === getAdminEmail();
}

// Helper function to check if user has specific permission
export function hasPermission(permission: string, email?: string | null): boolean {
  if (!isAdmin(email)) return false;
  return AUTH_CONFIG.ADMIN_PERMISSIONS.includes(permission as any);
}

export default AUTH_CONFIG;
```

**Step 4: Verify the change**

Run: `npm run dev`
Expected: App starts without errors

**Step 5: Commit**

```bash
git add lib/auth-config.ts .env.example
git commit -m "feat: move admin email to environment variable

- Remove hardcoded admin email from source code
- Add ADMIN_EMAIL to .env.example template
- Add runtime check for missing environment variable"
```

---

## Task 2: Create Post Repository

**Files:**
- Create: `lib/repositories/post.ts`
- Create: `lib/repositories/types.ts`

**Step 1: Create types file**

Create `lib/repositories/types.ts`:

```typescript
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
```

**Step 2: Create post repository**

Create `lib/repositories/post.ts`:

```typescript
import { prisma } from '@/lib/prisma/prisma';
import type { Post, PostWithComments, CreatePostInput, UpdatePostInput, Tag } from './types';

const authorSelect = {
  name: true,
  image: true,
};

const baseInclude = {
  author: { select: authorSelect },
  tags: true,
};

export const postRepository = {
  /**
   * Find all published posts, optionally limited
   */
  async findPublished(limit?: number): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: baseInclude,
      orderBy: { createdAt: 'desc' },
      ...(limit && { take: limit }),
    });
    return posts;
  },

  /**
   * Find all posts (for admin)
   */
  async findAll(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      include: baseInclude,
      orderBy: { createdAt: 'desc' },
    });
    return posts;
  },

  /**
   * Find a single post by ID with comments
   */
  async findById(id: string): Promise<PostWithComments | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        ...baseInclude,
        comments: {
          include: {
            author: { select: authorSelect },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return post;
  },

  /**
   * Check if a post exists
   */
  async exists(id: string): Promise<boolean> {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });
    return post !== null;
  },

  /**
   * Create a new post
   */
  async create(data: CreatePostInput): Promise<Post> {
    const { title, content, authorId, tags, published = false } = data;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        author: { connect: { id: authorId } },
        ...(tags && {
          tags: {
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        }),
      },
      include: baseInclude,
    });
    return post;
  },

  /**
   * Update an existing post
   */
  async update(id: string, data: UpdatePostInput, existingTags?: Tag[]): Promise<Post> {
    const { title, content, published, tags } = data;

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(published !== undefined && { published }),
        ...(tags && {
          tags: {
            disconnect: existingTags?.map((tag) => ({ id: tag.id })) || [],
            connectOrCreate: tags.map((tagName) => ({
              where: { name: tagName },
              create: { name: tagName },
            })),
          },
        }),
      },
      include: baseInclude,
    });
    return post;
  },

  /**
   * Delete a post
   */
  async delete(id: string): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
  },

  /**
   * Publish all unpublished posts
   */
  async publishAll(): Promise<number> {
    const result = await prisma.post.updateMany({
      where: { published: false },
      data: { published: true },
    });
    return result.count;
  },

  /**
   * Get post with its current tags (for update operation)
   */
  async findWithTags(id: string): Promise<{ id: string; tags: Tag[] } | null> {
    return prisma.post.findUnique({
      where: { id },
      select: { id: true, tags: true },
    });
  },
};
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add lib/repositories/types.ts lib/repositories/post.ts
git commit -m "feat: add post repository for centralized data access

- Create shared types for repositories
- Implement postRepository with all CRUD operations
- Support for tags, comments, and pagination"
```

---

## Task 3: Create Guestbook Repository

**Files:**
- Create: `lib/repositories/guestbook.ts`

**Step 1: Create guestbook repository**

Create `lib/repositories/guestbook.ts`:

```typescript
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
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add lib/repositories/guestbook.ts
git commit -m "feat: add guestbook repository"
```

---

## Task 4: Create User Repository

**Files:**
- Create: `lib/repositories/user.ts`
- Create: `lib/repositories/index.ts`

**Step 1: Create user repository**

Create `lib/repositories/user.ts`:

```typescript
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
```

**Step 2: Create index file for easy imports**

Create `lib/repositories/index.ts`:

```typescript
export { postRepository } from './post';
export { guestbookRepository } from './guestbook';
export { userRepository } from './user';
export * from './types';
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add lib/repositories/user.ts lib/repositories/index.ts
git commit -m "feat: add user repository and repository index"
```

---

## Task 5: Refactor API Routes to Use Repositories

**Files:**
- Modify: `app/api/posts/route.ts`
- Modify: `app/api/posts/[id]/route.ts`
- Modify: `app/api/posts/publish-all/route.ts`
- Modify: `app/api/guestbook/route.ts`
- Modify: `app/api/user/by-email/route.ts`

**Step 1: Update app/api/posts/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { postRepository } from '@/lib/repositories';
import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]/options';
import { isAdmin } from '@/lib/auth-config';

export async function GET() {
  try {
    const posts = await postRepository.findPublished();
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized: Only admin can create posts' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, authorId, tags, published } = body;

    if (!title || !content || !authorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const post = await postRepository.create({ title, content, authorId, tags, published });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
```

**Step 2: Update app/api/posts/[id]/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { postRepository } from '@/lib/repositories';
import { getServerSession } from 'next-auth/next';
import { options } from '../../auth/[...nextauth]/options';
import { isAdmin } from '@/lib/auth-config';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const post = await postRepository.findById(id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized: Only admin can update posts' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { title, content, published, tags } = body;

    const existingPost = await postRepository.findWithTags(id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updatedPost = await postRepository.update(id, { title, content, published, tags }, existingPost.tags);
    return NextResponse.json({ post: updatedPost }, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized: Only admin can delete posts' },
        { status: 403 }
      );
    }

    const { id } = params;

    const exists = await postRepository.exists(id);
    if (!exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await postRepository.delete(id);
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
```

**Step 3: Update app/api/posts/publish-all/route.ts**

First read the current file to understand its structure, then update:

```typescript
import { NextResponse } from 'next/server';
import { postRepository } from '@/lib/repositories';
import { getServerSession } from 'next-auth/next';
import { options } from '../../auth/[...nextauth]/options';
import { isAdmin } from '@/lib/auth-config';

export async function PATCH() {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized: Only admin can publish posts' },
        { status: 403 }
      );
    }

    const count = await postRepository.publishAll();
    return NextResponse.json({ message: `Published ${count} posts` }, { status: 200 });
  } catch (error) {
    console.error('Error publishing posts:', error);
    return NextResponse.json({ error: 'Failed to publish posts' }, { status: 500 });
  }
}
```

**Step 4: Update app/api/guestbook/route.ts**

```typescript
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
```

**Step 5: Update app/api/user/by-email/route.ts**

First check if file exists and its structure, then update to use userRepository.

**Step 6: Verify dev server runs**

Run: `npm run dev`
Expected: No errors

**Step 7: Commit**

```bash
git add app/api/posts/route.ts app/api/posts/[id]/route.ts app/api/posts/publish-all/route.ts app/api/guestbook/route.ts
git commit -m "refactor: update API routes to use repositories

- Replace direct Prisma calls with repository methods
- Consistent error handling across all routes
- Cleaner, more maintainable code"
```

---

## Task 6: Refactor Page Components to Use Repositories

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/[id]/page.tsx`
- Modify: `app/guestbook/page.tsx`

**Step 1: Update app/page.tsx**

```typescript
import { postRepository } from '@/lib/repositories';
import BlogPostCard from '@/components/BlogPostCard';
import HomeLayout from '@/components/HomeLayout';

export default async function HomePage() {
  const posts = await postRepository.findPublished(6);

  return (
    <div className="container mx-auto px-4">
      <HomeLayout />

      <div className="py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Posts</h2>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                author={{
                  name: post.author.name || 'Unknown Author',
                  image: post.author.image,
                }}
                createdAt={post.createdAt}
                tags={post.tags}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">No posts yet</h3>
            <p className="text-gray-600">
              Blog posts will appear here once they are published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Update app/blog/page.tsx**

```typescript
import { SearchIcon } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { postRepository } from '@/lib/repositories'
import { formatDistanceToNow } from 'date-fns'

export default async function BlogPage() {
  const posts = await postRepository.findPublished();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">All Posts</h1>

      <div className="relative mb-8">
        <Input type="text" placeholder="Search articles" className="pr-10" />
        <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="border-t border-border" />

      <div className="space-y-12 mt-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id} className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                <span className="mx-2">•</span>
                <span>by {post.author.name}</span>
              </div>

              <Link href={`/blog/${post.id}`} className="block">
                <h2 className="text-2xl font-semibold hover:underline">{post.title}</h2>
              </Link>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="rounded-full bg-background hover:bg-muted">
                    {tag.name}
                  </Badge>
                ))}
              </div>

              <p className="text-muted-foreground">
                {post.content.length > 200
                  ? `${post.content.substring(0, 200)}...`
                  : post.content
                }
              </p>
            </article>
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">尚未发布文章</h3>
            <p className="text-muted-foreground mb-4">
              博客文章将在发布后显示在这里。
            </p>
            <Link
              href="/arcadiaedenAdmin"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              创建第一篇文章
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 3: Update app/blog/[id]/page.tsx**

Read the current file first, then update to use `postRepository.findById()` and remove any mock data fallbacks.

**Step 4: Update app/guestbook/page.tsx**

Read the current file first, then update to use `guestbookRepository.findAll()`.

**Step 5: Verify dev server runs**

Run: `npm run dev`
Expected: No errors, pages load correctly

**Step 6: Commit**

```bash
git add app/page.tsx app/blog/page.tsx app/blog/[id]/page.tsx app/guestbook/page.tsx
git commit -m "refactor: update page components to use repositories

- Replace inline Prisma queries with repository calls
- Remove duplicate type definitions (use shared types)
- Consistent data fetching pattern across pages"
```

---

## Task 7: Delete Unused Mock Components

**Files:**
- Delete: `components/guestbook-form.tsx`
- Delete: `components/guestbook-entries.tsx`

**Step 1: Delete mock files**

```bash
rm components/guestbook-form.tsx
rm components/guestbook-entries.tsx
```

**Step 2: Verify no broken imports**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused mock guestbook components

- Delete guestbook-form.tsx (mock version)
- Delete guestbook-entries.tsx (hardcoded data)
- Real components already in use: GuestbookForm.tsx"
```

---

## Task 8: Clean Up Old Backend API Layer

**Files:**
- Delete: `src/backend/api/posts.ts`
- Modify: Any remaining imports

**Step 1: Search for remaining usages**

Run: `grep -r "src/backend/api/posts" --include="*.ts" --include="*.tsx"`

**Step 2: Delete old file**

```bash
rm src/backend/api/posts.ts
```

If `src/backend/api/` directory is now empty, remove it too:

```bash
rmdir src/backend/api
rmdir src/backend
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: remove deprecated src/backend/api layer

- All data access now goes through lib/repositories
- Cleaner project structure"
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] Home page loads and shows posts
- [ ] Blog listing page works
- [ ] Individual blog post page works
- [ ] Guestbook page works
- [ ] Admin page can create/edit/delete posts (requires login)
- [ ] No TypeScript errors: `npx tsc --noEmit`

---

## Summary

| Task | Description | Files Changed |
|------|-------------|---------------|
| 1 | Fix hardcoded admin email | 2 modified, 1 created |
| 2 | Create post repository | 2 created |
| 3 | Create guestbook repository | 1 created |
| 4 | Create user repository + index | 2 created |
| 5 | Refactor API routes | 4-5 modified |
| 6 | Refactor page components | 4 modified |
| 7 | Delete mock components | 2 deleted |
| 8 | Clean up old backend layer | 1 deleted |

**Total: ~8 commits, ~15 files affected**
