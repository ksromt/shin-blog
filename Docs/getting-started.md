# Getting Started

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm

## Setup

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required due to a peer dependency conflict between `react-day-picker` and React 19.

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/shin_blog` |
| `NEXTAUTH_URL` | Base URL for NextAuth | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | Generate with `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Email address for admin access | `your@email.com` |

Optional variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `RAG_API_URL` | RAG FastAPI service URL | `http://localhost:8001` |
| `OPENAI_API_KEY` | OpenAI API key (for RAG) | — |
| `KOCLAW_GATEWAY_URL` | Koclaw Gateway REST API | — |
| `NEXT_PUBLIC_KOCLAW_WS_URL` | Koclaw WebSocket URL | — |
| `NEXT_PUBLIC_KOCLAW_ASSETS_URL` | Koclaw static assets URL | — |

### 3. Database Setup

```bash
npx prisma db push
npx prisma generate
```

### 4. Start Dev Server

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/en` (default locale).

## i18n Workflow

### Translation Files

Translations live in `messages/`:
- `messages/en.json` — English
- `messages/ja.json` — Japanese
- `messages/zh.json` — Chinese

### Adding a New Translation Key

1. Add the key to all three JSON files under the appropriate section
2. In server components: `const t = await getTranslations('SectionName')`
3. In client components: `const t = useTranslations('SectionName')`
4. Use: `t('keyName')` or `t('keyName', { param: value })`

### Testing Locales

Visit these URLs to test each locale:
- English: `http://localhost:3000/en`
- Japanese: `http://localhost:3000/ja`
- Chinese: `http://localhost:3000/zh`

Use the globe icon in the navigation bar to switch locales.

## Common Tasks

### Add a New Page

1. Create `app/[locale]/your-page/page.tsx`
2. Add the route to `data/navigation.ts`
3. Add translation keys to all three `messages/*.json` files
4. For server pages, call `setRequestLocale(locale)` at the top
5. Use `Link` from `@/i18n/navigation` for internal links

### Add an API Route

1. Create `app/api/your-route/route.ts` (API routes stay outside `[locale]`)
2. Use middleware from `lib/api/middleware.ts`:
   - `withErrorHandling` for basic error handling
   - `withAuth` for authenticated routes
   - `withAdmin` for admin-only routes
   - `withValidation(zodSchema)` for input validation
3. Create a Zod schema in `lib/validations/` if needed

### Useful Commands

```bash
# TypeScript check
npx tsc --noEmit

# Start RAG service (separate terminal)
cd D:\personal_development\RAG
uvicorn src.rust_doc_assistant.api:app --port 8001

# Prisma Studio (database GUI)
npx prisma studio
```
