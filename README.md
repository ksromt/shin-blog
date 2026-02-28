# shinBlog

[English](#english) | [日本語](#japanese) | [中文](#chinese)

---

<a id="english"></a>

## EN

Personal blog built with Next.js 15, React 19, TypeScript, Tailwind CSS, and PostgreSQL.

Trilingual (English / Japanese / Chinese) with auto-detection based on location.

### Features

- **Blog** — Markdown posts with syntax highlighting, table of contents, reading time, related posts
- **Kokoron** — AI blog assistant powered by RAG (retrieval-augmented generation)
- **Knowledge Base** — Organized notes on LLM/RAG, fine-tuning, prompt engineering, and more
- **Guestbook** — Authenticated visitor messages
- **i18n** — Three languages with IP-based locale detection and manual switcher
- **Dark / Light Mode** — System preference detection + toggle
- **Command Palette** — Quick navigation via Ctrl+K
- **Admin Panel** — Post CRUD at `/arcadiaedenAdmin`
- **SEO** — Open Graph, Twitter Cards, sitemap, RSS feed, robots.txt

### Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Prisma ORM, PostgreSQL |
| Auth | NextAuth.js v4 |
| i18n | next-intl (path-based routing) |
| AI/RAG | FastAPI, LangChain, ChromaDB, OpenAI API |
| Deploy | Docker, Docker Compose |

### Getting Started

```bash
# Install
npm install --legacy-peer-deps

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Database
npx prisma db push
npx prisma generate

# Run
npm run dev
```

### Docker

```bash
docker-compose up -d
```

### License

MIT

---

<a id="japanese"></a>

## JA

Next.js 15、React 19、TypeScript、Tailwind CSS、PostgreSQLで構築した個人ブログ。

3言語対応（英語 / 日本語 / 中国語）、IPアドレスによる自動言語検出機能あり。

### 機能

- **ブログ** — Markdown記事、シンタックスハイライト、目次、読了時間、関連記事
- **Kokoron** — RAG（検索拡張生成）を活用したAIブログアシスタント
- **ナレッジベース** — LLM/RAG、ファインチューニング、プロンプトエンジニアリングなどのノート
- **ゲストブック** — 認証済み訪問者のメッセージ
- **i18n** — IP検出＋手動切替による3言語サポート
- **ダーク / ライトモード** — システム設定検出 + トグル
- **コマンドパレット** — Ctrl+Kでクイックナビゲーション
- **管理画面** — `/arcadiaedenAdmin`で記事のCRUD
- **SEO** — Open Graph、Twitter Cards、サイトマップ、RSSフィード、robots.txt

### 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| バックエンド | Next.js API Routes, Prisma ORM, PostgreSQL |
| 認証 | NextAuth.js v4 |
| i18n | next-intl (パスベースルーティング) |
| AI/RAG | FastAPI, LangChain, ChromaDB, OpenAI API |
| デプロイ | Docker, Docker Compose |

### セットアップ

```bash
# インストール
npm install --legacy-peer-deps

# 環境設定
cp .env.example .env.local
# .env.localを編集

# データベース
npx prisma db push
npx prisma generate

# 起動
npm run dev
```

### ライセンス

MIT

---

<a id="chinese"></a>

## ZH

使用 Next.js 15、React 19、TypeScript、Tailwind CSS 和 PostgreSQL 构建的个人博客。

三语支持（英语 / 日语 / 中文），基于IP地址自动检测语言。

### 功能

- **博客** — Markdown文章，语法高亮，目录，阅读时间，相关文章
- **Kokoron** — 基于RAG（检索增强生成）的AI博客助手
- **知识库** — LLM/RAG、模型微调、提示工程等学习笔记
- **留言簿** — 登录后可留言
- **国际化** — 基于IP检测 + 手动切换的三语支持
- **暗色 / 亮色模式** — 系统偏好检测 + 手动切换
- **命令面板** — Ctrl+K 快速导航
- **管理后台** — 在 `/arcadiaedenAdmin` 管理文章
- **SEO** — Open Graph、Twitter Cards、站点地图、RSS、robots.txt

### 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| 后端 | Next.js API Routes, Prisma ORM, PostgreSQL |
| 认证 | NextAuth.js v4 |
| 国际化 | next-intl（路径路由） |
| AI/RAG | FastAPI, LangChain, ChromaDB, OpenAI API |
| 部署 | Docker, Docker Compose |

### 快速开始

```bash
# 安装依赖
npm install --legacy-peer-deps

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local

# 数据库初始化
npx prisma db push
npx prisma generate

# 启动开发服务器
npm run dev
```

### 许可证

MIT
