# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-02-10

### Added

**SEO & Discoverability**
- Open Graph and Twitter Card meta tags on all pages
- Dynamic sitemap (`app/sitemap.ts`) generated from published blog posts
- `robots.ts` for crawler configuration (disallows `/api/` and `/arcadiaedenAdmin/`)
- JSON-LD structured data on blog post pages
- RSS feed at `/feed.xml` with auto-discovery `<link>` in layout

**Blog Enhancements**
- Client-side blog search — filter posts by title, content, and tags (`components/BlogList.tsx`)
- Reading time estimation on blog post pages
- Table of contents generated from markdown headings
- Share buttons (copy link, Twitter) via `BlogPostClient.tsx`
- Related posts section (tag-based matching) at bottom of each post
- Skeleton loading state for blog listing page

**New Pages**
- **About page**: Profile image, bio, skills grid (5 categories), education timeline, social links
- **Projects page**: Featured projects (Rust Doc Assistant, shinBlog) with tech badges and links
- **Snippets page**: 6 code snippets (Rust, TypeScript, Python, React, Docker, SQL) with syntax highlighting
- **Rust Docs page**: AI-powered Rust documentation chat (integrated RAG assistant)
- Improved 404 page with styled layout and navigation links

**RAG Integration (Rust Doc Assistant)**
- FastAPI REST API wrapper (`RAG/src/rust_doc_assistant/api.py`) around existing LangChain chain
- Streaming responses via Server-Sent Events (SSE)
- Next.js API proxy at `/api/rust-docs` for cross-service communication
- Chat UI component with example questions and language toggle (EN/JA/ZH)
- Added to main navigation and mobile drop-down menu

**Infrastructure**
- `Dockerfile` for Next.js blog (multi-stage build)
- `docker-compose.yml` for combined deployment (blog + RAG API + PostgreSQL)
- `RAG/Dockerfile.api` for Python FastAPI container
- `CLAUDE.md` with project instructions and WSL ↔ non-WSL sync protocol

**Error Handling**
- Root error boundary (`app/error.tsx`) with retry button
- Blog-specific error boundary (`app/blog/error.tsx`) with retry + go home

### Changed
- Font optimization: Inter via `next/font/google` with CSS variable approach
- Enabled Next.js image optimization (removed `images: { unoptimized: true }`)
- Blog page split into server component (data fetch) + client component (search/filter)
- `HomeLayout` responsive: `max-w-[75%]` → `w-full xl:max-w-[75%]` for mobile
- `MarkdownRenderer`: removed deprecated `inline` prop from code component (react-markdown v10)
- Moved `playwright`, `prisma`, `@types/pg` to devDependencies
- Removed unused `@emotion/is-prop-valid` dependency
- Updated `.env.example` with `RAG_API_URL` and `OPENAI_API_KEY`
- Updated `RAG/pyproject.toml` with FastAPI and Uvicorn dependencies

### Fixed
- Blog search now actually works (was previously a static, non-functional input)
- Mobile layout no longer overly constrained on small screens

## [0.2.0] - 2026-02-07

### Added
- Repository pattern (`lib/repositories/`) for centralized data access
- Post, Guestbook, and User repositories with shared types
- Repository index for easy imports

### Changed
- Refactored all API routes to use repository pattern
- Refactored all page components to use repository pattern
- Moved admin email from hardcoded value to `ADMIN_EMAIL` environment variable

### Removed
- Deprecated `src/backend/api` layer
- Unused mock guestbook components (`guestbook-form.tsx`, `guestbook-entries.tsx`)

## [Unreleased - pre-0.2.0]

### Added
- Project documentation structure
- Contributing guidelines
- Development environment setup guide
- Changelog
- Feature Map visualizing system dependencies and relationships

### Changed
- Updated footer component to use siteMetadata
- Enhanced navigation component with improved typewriter effect
- Updated siteMetadata with personalized information

### Fixed
- Corrected author name in footer mobile view
- Fixed navigation component accessibility issues

## [0.1.0] - 2025-04-01

### Added
- Initial project setup
- Basic Next.js 15 application structure
- Tailwind CSS integration
- Basic blog layout components
- Header and footer components
- Dark/light mode toggle
- Command palette for navigation
