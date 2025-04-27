# Shin NextJS Blog

A modern blog application built with Next.js 14 (App Router), TypeScript, and PostgreSQL.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React 19, Tailwind CSS
- **Backend**: Node.js API Routes, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Various UI libraries including Radix UI

## Project Structure

```
project-root/
├── app/                # Next.js app router pages and API routes
│   ├── api/            # API endpoints
│   ├── blog/           # Blog pages
│   ├── about/          # About page
│   └── ...             # Other pages
├── components/         # React components
├── lib/                # Utility functions and shared code
│   ├── prisma/         # Database connection and utilities
│   └── ...             # Other utilities
├── public/             # Static assets
├── styles/             # Global styles
└── prisma/             # Prisma schema and migrations
```

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- PostgreSQL 14.0 or higher

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shin-nextjs-blog.git
   cd shin-nextjs-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database
   - Create a `.env` file in the root directory with the following content:
     ```
     DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shin_nextjs_blog"
     NODE_ENV="development"
     ```
   - Update the DATABASE_URL with your PostgreSQL credentials

4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Features

- Modern UI with responsive design
- Server-side rendering and static site generation
- API routes for blog posts CRUD operations
- PostgreSQL database with Prisma ORM
- TypeScript for type safety

## License

This project is licensed under the MIT License - see the LICENSE file for details. 