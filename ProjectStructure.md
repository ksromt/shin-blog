# Project Structure

This document outlines the structure of the Shin NextJS Blog project, providing guidance on the organization of directories and files, as well as guidelines for extending the project.

## Directory Structure

```
shin-nextjs-blog/
├── app/                  # Next.js App Router directory
│   ├── (auth)/           # Authentication-related routes
│   ├── api/              # API routes
│   ├── blog/             # Blog-related routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable UI components
│   ├── ui/               # UI primitives and basic components
│   ├── footer.tsx        # Site footer
│   └── navigation.tsx    # Site navigation
├── data/                 # Static data and configuration
│   ├── headerNavLinks.ts # Navigation links data
│   ├── nav.ts            # Command palette navigation data
│   └── siteMetadata.ts   # Site metadata
├── Docs/                 # Project documentation
│   ├── AskLog/           # AI interaction logs
│   ├── DevLog/           # Development progress logs
│   ├── Feature/          # Feature specifications
│   ├── Todo/             # Version plans
│   ├── Changelog.md      # Project change history
│   ├── Contributing.md   # Contribution guidelines
│   ├── DevEnvConfig.md   # Development environment setup
│   ├── FAQ.md            # Frequently asked questions
│   └── TechDebt.md       # Technical debt tracking
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and helpers
├── prisma/               # Database schema and migrations
│   ├── migrations/       # Prisma migrations
│   └── schema.prisma     # Prisma schema
├── public/               # Static assets
│   ├── images/           # Image assets
│   └── favicon.ico       # Site favicon
├── styles/               # Global styles
│   └── globals.css       # Global CSS
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore file
├── next.config.mjs       # Next.js configuration
├── package.json          # Project dependencies
├── README.md             # Project overview
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Component Organization

Components are organized based on their purpose and reusability:

1. **UI Components**: Basic UI elements in `components/ui/`
2. **Layout Components**: Page layout components like headers, footers
3. **Feature Components**: Components specific to certain features
4. **Page Components**: Components specific to pages in the `app/` directory

## Extension Guidelines

### Adding a New Page

1. Create a new directory in the `app/` directory (if needed)
2. Add a `page.tsx` file for the main page content
3. Add a `layout.tsx` file if a specific layout is needed
4. Update navigation in `data/headerNavLinks.ts` and `data/nav.ts`

### Adding a New Component

1. Determine if the component is a UI primitive, feature component, or page component
2. Create the component in the appropriate directory
3. Follow the project's coding standards and patterns
4. Add TypeScript types for props
5. Document the component's purpose and usage

### Adding a New API Route

1. Create a new directory or file in the `app/api/` directory
2. Implement the route handler in a `route.ts` file
3. Add appropriate validation and error handling
4. Document the API endpoint in the project documentation

## Scaling Considerations

### Small-scale Projects (1-3 developers)

- Use the current structure as is
- Keep components in a flat structure within the `components/` directory
- Use minimal state management (React Context is sufficient)

### Medium-scale Projects (4-10 developers)

- Further organize components by feature
- Consider using a more sophisticated state management solution
- Implement stricter code reviews and testing

### Large-scale Projects (10+ developers)

- Consider a monorepo approach with multiple packages
- Implement micro-frontends if appropriate
- Use strict module boundaries
- Establish comprehensive testing and documentation requirements

## Best Practices

- Follow the DRY (Don't Repeat Yourself) principle
- Keep components small and focused on a single responsibility
- Use TypeScript for type safety
- Write tests for critical components and functionality
- Document complex logic and components
- Adhere to the project's coding standards
- Use Next.js features like Server Components appropriately 