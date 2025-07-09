# Development Environment Setup

This document provides instructions for setting up the development environment for the Shin NextJS Blog project.

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later) or yarn (v1.22 or later)
- Git

## Initial Setup

1. **Clone the repository**

```bash
git clone https://github.com/shin-blogger/shin-nextjs-blog.git
cd shin-nextjs-blog
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Setup environment variables**

Create a `.env.local` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/shin_blog"

# Authentication (if using NextAuth.js)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Add any other environment variables needed for your project
```

4. **Initialize the database**

```bash
npx prisma db push
# Seed the database if needed
npx prisma db seed
```

## Running the Development Server

```bash
npm run dev
# or
yarn dev
```

The development server will start at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code quality issues

## Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- PostCSS Language Support
- TypeScript and JavaScript Language Features

### Debugging

1. Create a `.vscode/launch.json` file with the following configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

2. Use the VS Code debugging features to debug your application.

## Code Formatting

This project uses ESLint and Prettier for code formatting. You can format your code using:

```bash
npm run lint
```

## Troubleshooting

### Common Issues

1. **Node.js version mismatch**
   - Ensure you're using Node.js v18 or later
   - Consider using nvm to manage Node.js versions

2. **Database connection issues**
   - Verify your database credentials in the `.env.local` file
   - Ensure your PostgreSQL service is running

3. **Build errors**
   - Clear the `.next` directory and rebuild
   ```bash
   rm -rf .next
   npm run build
   ```

If you encounter any other issues, please refer to the project's GitHub issues or create a new one. 