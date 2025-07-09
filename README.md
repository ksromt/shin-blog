# Shin NextJS Blog

A modern personal blog built with Next.js 15, TypeScript, Tailwind CSS, and PostgreSQL.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI, Lucide Icons, shadcn/ui
- **Form Handling**: React Hook Form with Zod validation

## Features

- 📱 Responsive design for all devices
- 🌓 Dark/light mode toggle
- ⌨️ Command palette for quick navigation
- 📝 Markdown blog posts with syntax highlighting
- 📊 Guestbook with authenticated comments
- 🔍 SEO optimized with proper metadata
- 🚀 Fast performance with static generation
- 🔐 Authentication with NextAuth.js
- 💾 Database integration with Prisma

## Documentation

Comprehensive documentation is available in the `Docs` directory:

- [Project Structure](./ProjectStructure.md) - Directory structure and organization
- [Contributing Guidelines](./Docs/Contributing.md) - How to contribute to the project
- [Development Environment](./Docs/DevEnvConfig.md) - How to set up the development environment
- [Changelog](./Docs/Changelog.md) - History of changes to the project
- [Technical Debt](./Docs/TechDebt.md) - Current technical debt and improvements

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- PostgreSQL 14.0 or higher

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/shin-blogger/shin-nextjs-blog.git
   cd shin-nextjs-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database
   - Create a `.env.local` file in the root directory with the following content:
     ```
     DATABASE_URL="postgresql://postgres:password@localhost:5432/shin_blog"
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=your-secret-key-here
     ```
   - Update the DATABASE_URL with your PostgreSQL credentials

4. Initialize the database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
shin-nextjs-blog/
├── app/                  # Next.js App Router directory
├── components/           # Reusable UI components
├── data/                 # Static data and configuration
├── Docs/                 # Project documentation
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and helpers
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── styles/               # Global styles
```

For a more detailed view of the project structure, see [ProjectStructure.md](./ProjectStructure.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details. 