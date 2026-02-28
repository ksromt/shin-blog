# Development Log: 2026-02-10

## Comprehensive Improvement — Phases 1-4

### Summary

Implemented a 4-phase improvement plan covering performance, content pages, RAG integration, and code quality. All 8 main pages now render correctly (verified via Playwright screenshots). All 11 API endpoints return correct status codes. TypeScript compiles with zero errors (`npx tsc --noEmit`).

---

## Phase 1: Performance & Foundation

### SEO
- Added Open Graph and Twitter Card meta tags to `app/layout.tsx`
- Created `app/sitemap.ts` — dynamic sitemap from published posts + static routes
- Created `app/robots.ts` — disallows `/api/` and `/arcadiaedenAdmin/`
- Added JSON-LD structured data to blog post pages
- Added `metadataBase` to layout for proper OG URL resolution

### RSS Feed
- Created `app/feed.xml/route.ts` — RSS 2.0 feed from published posts
- Added auto-discovery `<link rel="alternate" type="application/rss+xml">` in layout

### Blog Search
- Split `app/blog/page.tsx` into server component (data fetch) + `components/BlogList.tsx` (client search)
- Client-side filtering by title, content, and tags with debounced input

### Font Optimization
- Added Inter font via `next/font/google` with CSS variable `--font-inter`
- Configured Tailwind `fontFamily.sans` to use the CSS variable

### Blog Post Enhancements
- Reading time estimation (words / 200 wpm)
- Table of contents generated from markdown headings (h2, h3)
- Share buttons (copy link, Twitter) via `app/blog/[id]/BlogPostClient.tsx`
- Related posts section at bottom (tag-based matching, up to 3 posts)

---

## Phase 2: Content Pages & UI

### About Page (`app/about/page.tsx`)
Full rewrite with profile image, bio text, social links from siteMetadata, skills grid (Frontend, Backend, Tools, Languages, Database), and education timeline.

### Projects Page (`app/projects/page.tsx`)
Full rewrite featuring 2 projects: Rust Doc Assistant and shinBlog. Each has description, tech badges, and Source/Try it links.

### Snippets Page (`app/snippets/page.tsx`)
Full rewrite with 6 code snippets: Rust (ownership), TypeScript (generics), Python (decorators), React (custom hook), Docker (multi-stage), SQL (window functions). Syntax highlighting via MarkdownRenderer.

### 404 Page (`app/not-found.tsx`)
Improved with large "404" text, description, and Go Home + Read the Blog buttons.

### Mobile Fixes
- `HomeLayout`: `max-w-[75%]` → `w-full xl:max-w-[75%]`

---

## Phase 3: RAG Integration

### FastAPI Backend
- Created `RAG/src/rust_doc_assistant/api.py` with three endpoints:
  - `POST /api/query` — SSE streaming response
  - `POST /api/query/sync` — full response (non-streaming)
  - `GET /api/health` — health check
- Updated `RAG/pyproject.toml` with FastAPI and Uvicorn dependencies
- Created `RAG/Dockerfile.api` for containerized deployment

### Blog Integration
- Created `app/rust-docs/page.tsx` — chat page wrapper
- Created `components/RustDocsChat.tsx` — full chat UI with:
  - Streaming response display
  - Example questions
  - Language toggle (EN/JA/ZH)
  - Clear conversation
- Created `app/api/rust-docs/route.ts` — Next.js API proxy to FastAPI backend
- Added "Rust Docs" to navigation (`headerNavLinks.ts`, `nav.ts`, `drop-menu.tsx`)

### Docker Deployment
- Created `Dockerfile` for Next.js blog (multi-stage build)
- Created `docker-compose.yml` with 3 services: blog, rag-api, postgres

---

## Phase 4: Quality & Polish

### Error Handling
- Created `app/error.tsx` — root error boundary with retry button
- Created `app/blog/error.tsx` — blog-specific error boundary

### Loading States
- Updated `app/blog/loading.tsx` with skeleton loader

### Dependency Cleanup
- Moved `playwright`, `prisma`, `@types/pg` to devDependencies
- Removed unused `@emotion/is-prop-valid`

### Config Updates
- Updated `.env.example` with `RAG_API_URL` and `OPENAI_API_KEY`
- Enabled Next.js image optimization (removed `unoptimized: true`)

---

## Verification Results

### Pages Tested (Playwright Screenshots)
| Page | URL | Status |
|------|-----|--------|
| Home | `/` | OK |
| Blog | `/blog` | OK |
| About | `/about` | OK |
| Projects | `/projects` | OK |
| Snippets | `/snippets` | OK |
| Guestbook | `/guestbook` | OK |
| Rust Docs | `/rust-docs` | OK |
| 404 | `/nonexistent` | OK |

### API Endpoints Tested
All 11 endpoints returned expected status codes (200 for GET, 404 for non-existent resources).

### TypeScript
`npx tsc --noEmit` — zero errors.

---

## Files Changed (30 files)

### New Files (15)
- `CLAUDE.md`
- `Dockerfile`
- `docker-compose.yml`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/error.tsx`
- `app/feed.xml/route.ts`
- `app/rust-docs/page.tsx`
- `app/api/rust-docs/route.ts`
- `app/blog/[id]/BlogPostClient.tsx`
- `app/blog/error.tsx`
- `components/BlogList.tsx`
- `components/RustDocsChat.tsx`
- `RAG/src/rust_doc_assistant/api.py`
- `RAG/Dockerfile.api`

### Modified Files (15)
- `next.config.mjs`
- `tailwind.config.ts`
- `package.json`
- `.env.example`
- `app/layout.tsx`
- `app/blog/page.tsx`
- `app/blog/[id]/page.tsx`
- `app/blog/loading.tsx`
- `app/about/page.tsx`
- `app/projects/page.tsx`
- `app/snippets/page.tsx`
- `app/not-found.tsx`
- `components/HomeLayout.tsx`
- `components/MarkdownRenderer.tsx`
- `components/drop-menu.tsx`
- `data/headerNavLinks.ts`
- `data/nav.ts`
- `RAG/pyproject.toml`

### Documentation Files (Updated)
- `Docs/Changelog.md`
- `Docs/TechDebt.md`
- `Docs/DevLog/2026-02-10_comprehensive-improvement.md` (this file)
- `README.md`

---

## Known Issues

- `npm run build` still fails on WSL2 due to EACCES glob scanning issue (pre-existing, environmental)
- `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` remain as TODOs
- `react-day-picker` peer dep conflict — must use `npm install --legacy-peer-deps`

## Next Steps

- Personalize `data/siteMetadata.ts` with real URLs and info
- Audit and remove unused Radix UI packages
- Fix ESLint/TypeScript build errors to remove ignore flags
- Add comprehensive test coverage
- Deploy via Docker Compose to production server
