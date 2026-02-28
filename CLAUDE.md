# CLAUDE.md — shinBlog Project Instructions

## Project Overview

Personal blog built with Next.js 15 + React 19 + Tailwind CSS 3 + Prisma/PostgreSQL.
Supports **3 languages** (EN/JA/ZH) via path-based i18n with `next-intl`.
Includes **Kokoron** — an AI blog assistant powered by RAG (FastAPI sidecar service).
Koclaw AI chat widget integration interfaces are prepared for future connection.

## Architecture

- **Framework**: Next.js 15 App Router, React 19, TypeScript
- **Styling**: Tailwind CSS 3, shadcn/ui, Radix UI, Lucide Icons
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth v4 (admin panel at `/arcadiaedenAdmin`)
- **Data Access**: Repository pattern — `lib/repositories/` (post, guestbook, user)
- **i18n**: `next-intl` with path-based routing (`/en/blog`, `/ja/blog`, `/zh/blog`)
- **Locale Detection**: IP-based geo detection (Vercel/Cloudflare headers) + Accept-Language fallback, persisted via `NEXT_LOCALE` cookie
- **API Middleware**: HOF pattern — `withAuth`, `withAdmin`, `withErrorHandling`, `withValidation` in `lib/api/middleware.ts`
- **RAG Service**: FastAPI wrapper at `D:\personal_development\RAG`, proxied via `/api/ask`
- **Koclaw**: Chat widget placeholder at `components/koclaw/`, proxied via `/api/koclaw`

## Key Paths

| Category | Path |
|----------|------|
| Config | `next.config.mjs`, `tailwind.config.ts`, `data/siteMetadata.ts` |
| i18n | `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts`, `middleware.ts` |
| Translations | `messages/en.json`, `messages/ja.json`, `messages/zh.json` |
| Navigation | `data/navigation.ts` (single source of truth) |
| Knowledge data | `data/knowledge.ts` (i18n keys, tags, links) |
| Projects data | `data/projects.ts` (i18n keys, technologies, links) |
| Locale layout | `app/[locale]/layout.tsx` (Navigation, Footer, i18n providers) |
| Root layout | `app/layout.tsx` (minimal: Providers + html/body shell) |
| Blog (server) | `app/[locale]/blog/page.tsx` |
| Blog (client search) | `components/blog/BlogList.tsx` |
| Blog post detail | `app/[locale]/blog/[id]/page.tsx`, `app/[locale]/blog/[id]/BlogPostClient.tsx` |
| Blog sub-components | `components/blog/TableOfContents.tsx`, `components/blog/RelatedPosts.tsx` |
| Home | `components/home/HeroSection.tsx`, `components/home/FeaturedLinks.tsx`, `components/home/ContactCard.tsx` |
| RAG chat (Kokoron) | `app/[locale]/ask/page.tsx`, `components/ask/KokoronChat.tsx`, `app/api/ask/route.ts` |
| Koclaw | `components/koclaw/KoclawWidget.tsx`, `app/api/koclaw/route.ts` |
| Layout components | `components/layout/Navigation.tsx`, `components/layout/Footer.tsx`, `components/layout/MobileMenu.tsx`, `components/layout/CommandPalette.tsx`, `components/layout/LocaleSwitcher.tsx`, `components/layout/SectionContainer.tsx` |
| Providers | `components/providers/Providers.tsx`, `components/providers/ThemeProvider.tsx` |
| API middleware | `lib/api/errors.ts`, `lib/api/middleware.ts`, `lib/api/rate-limit.ts` |
| Validations | `lib/validations/post.ts`, `lib/validations/guestbook.ts` |
| Utilities | `lib/utils/index.ts` (cn), `lib/utils/reading-time.ts`, `lib/utils/xml.ts`, `lib/utils/headings.ts` |
| Env validation | `lib/env.ts` |
| Repositories | `lib/repositories/post.ts`, `lib/repositories/guestbook.ts`, `lib/repositories/user.ts` |
| Types | `lib/repositories/types.ts` |
| Docker | `Dockerfile`, `docker-compose.yml` |

## Conventions

- **i18n**: All public pages live under `app/[locale]/`. Server pages call `setRequestLocale(locale)`. Server components use `getTranslations()`, client components use `useTranslations()`.
- **Rich text in translations**: Use `t.rich('key', { tagName: (chunks) => <Component>{chunks}</Component> })` for embedding links/formatting inside translated strings (e.g., `Home.kokoronIntro`).
- **Links**: Inside `[locale]` pages, use `Link` from `@/i18n/navigation` for locale-aware routing. Layout components (Navigation, Footer) use standard `next/link`.
- **Navigation data**: Single source at `data/navigation.ts` — Navigation, MobileMenu, and CommandPalette all import from here.
- **Knowledge Base data**: `data/knowledge.ts` stores structural data (IDs, i18n keys, tags, links). Display text lives in `messages/*.json` under the `Snippets` namespace.
- **Projects data**: `data/projects.ts` stores structural data (IDs, i18n keys, technologies, links). Display text lives in `messages/*.json` under the `Projects` namespace.
- **Design tokens**: Use Tailwind theme tokens (`text-foreground`, `text-muted-foreground`, `bg-card`, `bg-muted`, `border-border`, `text-primary`) — never hardcoded colors like `text-gray-600`.
- **API routes**: Stay at top level (`app/api/`), not under `[locale]`. Use HOF middleware from `lib/api/middleware.ts`.
- Pages use `export const metadata` for SEO (Open Graph, Twitter Cards)
- Client components use `'use client'` directive
- Dates serialized as ISO strings when passing from server to client components
- `MarkdownRenderer` code component has no `inline` prop (react-markdown v10)
- Tailwind content glob: avoid `src/` and root `*` patterns (WSL2 scanning issues)
- Install dependencies with `npm install --legacy-peer-deps` (react-day-picker peer dep conflict with React 19)

## Known Issues

- **Build fails on WSL2**: `EACCES: permission denied, scandir` on Windows `.exe` paths — pre-existing WSL2/glob scanning issue, not code-related. `npm run dev` works fine.
- `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` kept as TODOs in `next.config.mjs` due to pre-existing errors
- `react-day-picker` peer dep conflict with React 19 — use `--legacy-peer-deps`

## Development Commands

```bash
# Install (MUST use --legacy-peer-deps)
npm install --legacy-peer-deps

# Dev server
npm run dev

# TypeScript check
npx tsc --noEmit

# Database
npx prisma db push
npx prisma generate

# RAG service (separate terminal)
cd D:\personal_development\RAG
uvicorn src.rust_doc_assistant.api:app --port 8001
```

## Environment Variables

See `.env.example` for all required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_URL` — NextAuth base URL
- `NEXTAUTH_SECRET` — NextAuth secret key
- `ADMIN_EMAIL` — Admin user email
- `RAG_API_URL` — RAG FastAPI service URL (default: `http://localhost:8001`)
- `OPENAI_API_KEY` — OpenAI API key (for RAG service)
- `KOCLAW_GATEWAY_URL` — Koclaw Gateway REST API (optional, e.g. `http://127.0.0.1:18789`)
- `NEXT_PUBLIC_KOCLAW_WS_URL` — Koclaw WebSocket URL (optional, e.g. `ws://127.0.0.1:18791`)
- `NEXT_PUBLIC_KOCLAW_ASSETS_URL` — Koclaw static assets URL (optional, e.g. `http://127.0.0.1:18792`)

---

## Koclaw AI Chat Integration

Koclaw is a separate Rust+Python AI assistant project. shinBlog integrates with it via a REST/SSE proxy.

### Current State: Placeholder Interfaces

- **API proxy**: `app/api/koclaw/route.ts` — forwards to `KOCLAW_GATEWAY_URL/api/v1/chat/public`, rate-limited (10/min/IP), returns 503 when not configured
- **Widget**: `components/koclaw/KoclawWidget.tsx` — floating chat button + panel, mirrors `@koclaw/web-widget` API design, works standalone via `/api/koclaw`

### Future: Official Widget Swap

When `@koclaw/web-widget` is published, replace the placeholder widget:
```tsx
// Before (placeholder)
import KoclawWidget from '@/components/koclaw/KoclawWidget'

// After (official)
import { KokoronWidget } from '@koclaw/web-widget'
```

### Connection Endpoints

| Service | Default URL | Protocol |
|---------|-------------|----------|
| Gateway HTTP | `http://127.0.0.1:18789` | REST + SSE |
| WebSocket | `ws://127.0.0.1:18791` | WebSocket |
| Static Assets | `http://127.0.0.1:18792` | HTTP |

### Permission Levels

The blog widget uses `Public` permission level:
- Chat responses only (no tool execution)
- No access to private data
- Rate limited (10 messages/min per IP)
- Max message length: 4096 characters

### Reference Docs

Full Koclaw documentation at `D:\personal_development\Koclaw\docs\`:
- `integration/shinblog-integration.md` — shinBlog-specific integration guide
- `api/gateway-api.md` — Full Gateway API (WebSocket protocol, SSE streaming, auth, error codes)
- `api/web-sdk-api.md` — Web Widget component API, theming, TypeScript types
- `architecture/overview.md` — System architecture diagram

---

## WSL ↔ Non-WSL Sync Protocol

> This project is developed in a **dual-environment** setup:
> - **WSL2 (Linux)**: Claude Code runs here, edits files, runs dev server
> - **Non-WSL (Windows/native)**: Git operations (commit, push, pull) happen here
>
> Files are shared via the Windows filesystem (`/mnt/d/...` in WSL = `D:\...` in Windows).

### Session Start Checklist

At the **start of every Claude Code session**, perform these checks:

1. **Confirm git status is clean** (or understand what's pending):
   ```bash
   git status
   git log --oneline -5
   ```

2. **Check for unsynced changes**: If the non-WSL side has committed/pushed changes since last session, verify they're visible:
   ```bash
   git log --oneline -5
   ```

3. **Confirm environment is ready**:
   ```bash
   # Verify node_modules exist
   ls node_modules/.package-lock.json
   # Verify Prisma client is generated
   ls lib/generated/prisma/index.js
   ```

4. **Report sync status to user** before starting work:
   - Last commit hash and message
   - Any uncommitted changes detected
   - Any issues found

### Before Handoff to Non-WSL Side

When Claude Code finishes work and the user will commit from non-WSL:

1. **List all changed files** clearly (new, modified, deleted)
2. **Do NOT run git add/commit** — the user handles this from non-WSL
3. **Verify TypeScript compiles**: `npx tsc --noEmit`
4. **Verify dev server works**: `npm run dev` (quick smoke test)
5. **Update documentation** if significant changes were made

### Conflict Prevention

- Claude Code: **read-only git** (status, log, diff only) — no commits, no pushes
- Non-WSL side: **all git write operations** (add, commit, push, pull, branch)
- If Claude Code needs to inspect git history, use read-only commands only
- Both sides share the same working directory — no need to sync files manually
