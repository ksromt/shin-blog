# Deployment Guide

## Docker Deployment (Recommended)

### Prerequisites

- Docker and Docker Compose installed on your Linux server
- PostgreSQL (included in docker-compose, or use an external instance)

### Quick Start

1. Clone the repo and set up environment:

```bash
git clone <your-repo-url> shinBlog
cd shinBlog
cp .env.example .env
# Edit .env with your production values
```

2. Build and start:

```bash
docker compose up -d --build
```

3. Initialize the database:

```bash
docker compose exec blog npx prisma db push
```

4. Verify:

```bash
curl http://localhost:3000/api/health
# Should return: {"status":"ok","timestamp":"...","version":"1.0.0"}
```

### Environment Variables for Production

Set these in your `.env` file:

```env
# Database
DB_PASSWORD=<strong-random-password>

# NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
ADMIN_EMAIL=your@email.com

# RAG (optional)
OPENAI_API_KEY=sk-...
RAG_API_URL=http://rag-api:8001

# Koclaw (optional)
KOCLAW_GATEWAY_URL=http://127.0.0.1:18789
NEXT_PUBLIC_KOCLAW_WS_URL=wss://your-domain.com/ws
NEXT_PUBLIC_KOCLAW_ASSETS_URL=https://your-domain.com/koclaw-assets
```

### Docker Architecture

```
docker-compose.yml defines:
  postgres (port 5432)  -- PostgreSQL 16
  blog (port 3000)      -- Next.js standalone server
  rag-api (port 8001)   -- RAG FastAPI service (optional)
```

The blog container uses Next.js `output: 'standalone'` for minimal image size. It copies:
- `.next/standalone/` — server bundle
- `.next/static/` — static assets
- `public/` — public files
- `messages/` — i18n translation files
- `prisma/` + `lib/generated/` — Prisma schema and query engine

## Nginx Reverse Proxy

Example nginx config for serving behind a reverse proxy with HTTPS:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Next.js app
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets (long cache)
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Koclaw WebSocket (optional)
    location /ws {
        proxy_pass http://127.0.0.1:18791;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Koclaw static assets (optional)
    location /koclaw-assets/ {
        proxy_pass http://127.0.0.1:18792/;
        expires 7d;
    }
}
```

## Manual Deployment (No Docker)

### 1. Build

```bash
npm install --legacy-peer-deps
npx prisma generate
npm run build
```

### 2. Start

```bash
NODE_ENV=production node .next/standalone/server.js
```

> Copy `.next/static` to `.next/standalone/.next/static` and `public` to `.next/standalone/public` before starting.

### 3. Process Manager (PM2)

```bash
npm install -g pm2

# Start
pm2 start .next/standalone/server.js --name shinblog

# Auto-restart on crash
pm2 save
pm2 startup
```

## SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Certbot will automatically configure nginx and set up auto-renewal.

## Monitoring

### Health Check

```bash
curl https://your-domain.com/api/health
```

### Docker Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f blog
docker compose logs -f postgres
```

### Database Backup

```bash
docker compose exec postgres pg_dump -U postgres shin_blog > backup_$(date +%Y%m%d).sql
```

### Restore

```bash
docker compose exec -T postgres psql -U postgres shin_blog < backup_20260228.sql
```
