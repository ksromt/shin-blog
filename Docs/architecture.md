# shinBlog Architecture

## System Overview

shinBlog is a personal blog built with Next.js 15 App Router. It supports three languages (EN/JA/ZH) via path-based i18n, uses a warm design aesthetic, and integrates with two external AI services.

```
Browser
  |
  +-- /en/blog, /ja/blog, /zh/blog     (i18n pages)
  +-- /api/posts, /api/guestbook        (API routes)
  +-- /api/koclaw                        (Koclaw AI proxy)
  +-- /api/rust-docs                     (RAG proxy)
  +-- /arcadiaedenAdmin                  (Admin panel, no i18n)
  |
Next.js 15 App Router
  |
  +-- Prisma ORM --> PostgreSQL
  +-- NextAuth v4 --> OAuth providers
  +-- next-intl   --> messages/en.json, ja.json, zh.json
  |
External Services
  +-- RAG FastAPI (port 8001) -- Rust documentation assistant
  +-- Koclaw Gateway (port 18789) -- AI chat assistant (optional)
```

## Directory Structure

```
shinBlog/
├── app/
│   ├── layout.tsx                 # Root layout (minimal: Providers + html/body)
│   ├── globals.css                # CSS variables (warm design tokens)
│   ├── [locale]/                  # All public pages (en, ja, zh)
│   │   ├── layout.tsx             # Locale layout (Navigation, Footer, i18n providers)
│   │   ├── page.tsx               # Home
│   │   ├── blog/                  # Blog list + post detail
│   │   ├── about/                 # About page
│   │   ├── projects/              # Projects showcase
│   │   ├── snippets/              # Code snippets
│   │   ├── guestbook/             # Guestbook
│   │   ├── rust-docs/             # RAG chat interface
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── api/                       # API routes (no locale prefix)
│   │   ├── posts/                 # CRUD for blog posts (admin-only write)
│   │   ├── guestbook/             # Guestbook entries
│   │   ├── koclaw/                # Koclaw AI proxy
│   │   ├── rust-docs/             # RAG proxy
│   │   ├── health/                # Health check endpoint
│   │   └── auth/[...nextauth]/    # NextAuth handlers
│   ├── arcadiaedenAdmin/          # Admin panel (no i18n)
│   ├── feed.xml/route.ts          # RSS feed
│   ├── sitemap.ts                 # Sitemap (locale-aware)
│   └── robots.ts
├── components/
│   ├── layout/                    # Navigation, Footer, MobileMenu, CommandPalette, LocaleSwitcher, SectionContainer
│   ├── blog/                      # BlogList, BlogPostCard, TableOfContents, RelatedPosts
│   ├── home/                      # HeroSection, FeaturedLinks
│   ├── guestbook/                 # GuestbookForm
│   ├── rust-docs/                 # RustDocsChat
│   ├── koclaw/                    # KoclawWidget (placeholder)
│   ├── shared/                    # MarkdownRenderer
│   ├── providers/                 # Providers, ThemeProvider
│   └── ui/                        # shadcn/ui components (button, card, badge, input, skeleton, textarea)
├── lib/
│   ├── api/                       # errors.ts, middleware.ts, rate-limit.ts
│   ├── validations/               # Zod schemas (post.ts, guestbook.ts)
│   ├── utils/                     # cn, reading-time, xml, headings
│   ├── repositories/              # post, guestbook, user (data access)
│   ├── env.ts                     # Zod environment validation
│   ├── prisma/prisma.ts           # Prisma client singleton
│   └── auth-config.ts             # NextAuth configuration
├── i18n/                          # next-intl configuration
│   ├── routing.ts                 # Locale definitions
│   ├── navigation.ts              # Locale-aware Link, useRouter, etc.
│   └── request.ts                 # Server-side message loading
├── messages/                      # Translation files
│   ├── en.json
│   ├── ja.json
│   └── zh.json
├── data/                          # Static data
│   ├── siteMetadata.ts
│   ├── navigation.ts              # Single source for nav items
│   ├── projects.ts
│   └── snippets.ts
├── middleware.ts                   # next-intl locale middleware
├── Dockerfile
└── docker-compose.yml
```

## Data Flow

### Page Request Flow

```
1. Browser requests /ja/blog
2. middleware.ts detects locale "ja" from URL
3. app/[locale]/layout.tsx loads messages/ja.json
4. NextIntlClientProvider makes translations available
5. app/[locale]/blog/page.tsx renders with Japanese strings
6. Server components use getTranslations(), client components use useTranslations()
```

### API Request Flow

```
1. Client sends POST /api/posts
2. Route handler applies middleware chain: withAdmin(withValidation(schema)(handler))
3. withAdmin checks NextAuth session + ADMIN_EMAIL
4. withValidation validates body against Zod schema
5. Handler calls postRepository methods
6. Repository uses Prisma to query PostgreSQL
7. Response returned with proper error codes
```

### i18n Architecture

- **Routing**: `i18n/routing.ts` defines locales `['en', 'ja', 'zh']` with default `'en'`
- **Middleware**: Root `middleware.ts` redirects `/blog` -> `/en/blog` and detects browser locale
- **Server**: `getTranslations('Section')` loads from `messages/{locale}.json`
- **Client**: `useTranslations('Section')` reads from `NextIntlClientProvider` context
- **Links**: `Link` from `@/i18n/navigation` automatically prepends the current locale

### Component Hierarchy

```
RootLayout (app/layout.tsx)
  └── Providers (auth session, query client)
      └── LocaleLayout (app/[locale]/layout.tsx)
          ├── NextIntlClientProvider
          ├── ThemeProvider
          └── SectionContainer
              ├── Navigation (client: theme toggle, locale switcher, command palette, mobile menu)
              ├── main > {page content}
              └── Footer (server)
```

## API Middleware Pattern

API routes use higher-order functions for composable middleware:

```typescript
// lib/api/middleware.ts
export function withAuth(handler: AuthHandler): Handler
export function withAdmin(handler: AuthHandler): Handler
export function withValidation<T>(schema: ZodSchema<T>): (handler) => Handler
export function withErrorHandling(handler: Handler): Handler

// Usage in route:
export const POST = withAdmin(
  withValidation(createPostSchema)(async (req, ctx, session) => {
    // handler has validated body and authenticated admin session
  })
)
```

## Design Token System

CSS variables in `globals.css` define the entire color palette:

- **Light theme**: Cream background, coral primary, warm borders
- **Dark theme**: Warm dark tones, lighter coral primary
- Components use Tailwind classes mapped to these variables: `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `text-primary`
- Never use hardcoded colors — always use theme tokens
