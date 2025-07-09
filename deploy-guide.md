# 🚀 Shin NextJS Blog 部署指南

本文档提供了完整的部署指南，帮助你将 Shin NextJS Blog 部署到生产环境。

## 📋 部署前准备

### 1. 环境要求
- Node.js 18.0 或更高版本
- PostgreSQL 14.0 或更高版本
- Git

### 2. 必需的环境变量
创建 `.env.local` 文件并配置以下变量：

```bash
# 数据库连接
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth 配置
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth 提供商（如果使用）
GITHUB_ID="your-github-oauth-id"
GITHUB_SECRET="your-github-oauth-secret"
GOOGLE_ID="your-google-oauth-id"
GOOGLE_SECRET="your-google-oauth-secret"
```

## 🌐 方案一：Vercel 部署（推荐）

Vercel 是 Next.js 的官方部署平台，提供最佳的性能和开发体验。

### 步骤 1：准备数据库

#### 选项 A：Vercel Postgres
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目
3. 点击 "Storage" 标签页
4. 选择 "Create Database" → "Postgres"
5. 复制提供的 `DATABASE_URL`

#### 选项 B：Supabase（免费）
1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 在 Settings → Database 中获取连接字符串
4. 格式：`postgresql://postgres:[YOUR-PASSWORD]@[HOST]:[PORT]/postgres`

#### 选项 C：Neon（免费）
1. 访问 [neon.tech](https://neon.tech)
2. 创建新项目
3. 复制提供的连接字符串

### 步骤 2：部署到 Vercel

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin master
   ```

2. **在 Vercel 中导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 从 GitHub 导入你的仓库

3. **配置环境变量**
   在 Vercel 项目设置中添加：
   - `DATABASE_URL`: 你的数据库连接字符串
   - `NEXTAUTH_URL`: `https://your-project.vercel.app`
   - `NEXTAUTH_SECRET`: 生成随机密钥（`openssl rand -base64 32`）

4. **部署并初始化数据库**
   部署完成后，在 Vercel Functions 标签页或本地运行：
   ```bash
   npx prisma db push
   ```

### 步骤 3：配置自定义域名（可选）
1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名
3. 按照 DNS 配置说明操作

## 🖥️ 方案二：VPS 自托管部署

如果你需要更多控制权或想要自托管，可以使用 VPS。

### 步骤 1：服务器环境准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib

# 安装 Nginx
sudo apt install nginx

# 安装 PM2（进程管理器）
sudo npm install -g pm2

# 安装 Git
sudo apt install git
```

### 步骤 2：数据库设置

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 在 PostgreSQL 中执行
CREATE USER bloguser WITH PASSWORD 'your_secure_password';
CREATE DATABASE shin_blog OWNER bloguser;
GRANT ALL PRIVILEGES ON DATABASE shin_blog TO bloguser;
\q
```

### 步骤 3：应用部署

```bash
# 克隆项目
git clone https://github.com/yourusername/shin-nextjs-blog.git
cd shin-nextjs-blog

# 安装依赖
npm install

# 创建环境变量文件
cat > .env.local << EOF
DATABASE_URL="postgresql://bloguser:your_secure_password@localhost:5432/shin_blog"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
EOF

# 初始化数据库
npx prisma db push

# 构建应用
npm run build

# 使用 PM2 启动应用
pm2 start npm --name "shin-blog" -- start
pm2 save
pm2 startup
```

### 步骤 4：Nginx 配置

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/shin-blog
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用站点并重启 Nginx：

```bash
sudo ln -s /etc/nginx/sites-available/shin-blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 步骤 5：SSL 证书配置

使用 Let's Encrypt 免费 SSL：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 设置自动续期
sudo crontab -e
# 添加以下行：
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🐳 方案三：Docker 部署

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/shin_blog
      - NEXTAUTH_URL=https://yourdomain.com
      - NEXTAUTH_SECRET=your-secret-key
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: shin_blog
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

部署命令：

```bash
docker-compose up -d
```

## ⚡ 性能优化建议

### 1. 图片优化
- 使用 Next.js Image 组件
- 配置适当的图片格式和尺寸

### 2. 缓存策略
```bash
# 在 next.config.mjs 中配置
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=1, stale-while-revalidate=59',
          },
        ],
      },
    ]
  },
}
```

### 3. 数据库优化
- 添加适当的数据库索引
- 使用连接池
- 配置 Prisma 连接限制

## 🔧 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 DATABASE_URL 格式
   - 确认数据库服务器可访问
   - 验证用户权限

2. **NextAuth 错误**
   - 确认 NEXTAUTH_URL 正确
   - 生成新的 NEXTAUTH_SECRET
   - 检查 OAuth 应用配置

3. **构建失败**
   - 检查 TypeScript 错误
   - 更新依赖版本
   - 清除缓存：`rm -rf .next && npm run build`

### 监控和日志

```bash
# PM2 日志查看
pm2 logs shin-blog

# Nginx 日志
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# 系统资源监控
pm2 monit
```

## 🔒 安全建议

1. **环境变量安全**
   - 使用强随机密钥
   - 定期更换敏感信息
   - 不要在代码中硬编码密钥

2. **数据库安全**
   - 使用强密码
   - 限制数据库访问 IP
   - 定期备份数据

3. **服务器安全**
   - 配置防火墙
   - 定期系统更新
   - 使用 fail2ban 防护

## 📈 扩展建议

1. **CDN 配置**
   - 使用 Cloudflare 或其他 CDN
   - 配置静态资源缓存

2. **数据库扩展**
   - 读写分离
   - 使用 Redis 缓存
   - 数据库集群

3. **应用扩展**
   - 负载均衡
   - 微服务架构
   - 容器编排

---

## 📞 获取帮助

如果遇到问题，可以：
1. 查看项目 Issues
2. 阅读相关文档
3. 联系项目维护者

祝你部署顺利！🎉
