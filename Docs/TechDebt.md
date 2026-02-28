# Technical Debt Tracking

This document tracks technical debt and areas for improvement in the Shin NextJS Blog project. Each item includes a priority level, description, potential solutions, and current status.

## Priority Levels

- **Critical**: Must be addressed as soon as possible
- **High**: Should be addressed in the next sprint
- **Medium**: Should be addressed within the next few sprints
- **Low**: Can be addressed when time permits

## Current Technical Debt

### 1. Component Optimization [Medium]

**Description**:
Some components are not optimized for performance, particularly the typewriter effect in the navigation component.

**Potential Solutions**:
- Memoize components to prevent unnecessary re-renders
- Use React.lazy for code splitting
- Optimize the typewriter effect or consider alternatives

**Status**: Pending

### 2. Accessibility Improvements [High]

**Description**:
The application needs a comprehensive accessibility audit to ensure it meets WCAG 2.1 standards.

**Potential Solutions**:
- Add proper ARIA attributes to all interactive elements
- Improve keyboard navigation
- Ensure proper color contrast ratios
- Add skip navigation links

**Status**: Partially addressed — Added some ARIA attributes to navigation

### 3. Testing Coverage [High]

**Description**:
The project lacks comprehensive test coverage for components and functionality.

**Potential Solutions**:
- Add unit tests for critical components
- Implement integration tests for key user flows
- Add end-to-end tests for critical paths (Playwright is available as a devDependency)

**Status**: Not started

### 4. Documentation [Medium]

**Description**:
While project-level documentation exists (Changelog, DevLog, TechDebt, CLAUDE.md), component-level documentation is missing.

**Potential Solutions**:
- Add JSDoc comments to key components
- Create a component library with Storybook
- Improve inline code comments for complex logic

**Status**: In progress — Project docs established, CLAUDE.md created

### 5. State Management [Low]

**Description**:
The current state management approach might not scale well as the application grows.

**Potential Solutions**:
- Evaluate the need for a more sophisticated state management solution
- Consider implementing React Context for global state
- Look into Zustand or Jotai for lightweight state management

**Status**: Not started

### 6. ESLint & TypeScript Build Errors [Medium]

**Description**:
`eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` are set to `true` in `next.config.mjs` to work around pre-existing errors. This masks real issues.

**Potential Solutions**:
- Audit and fix all ESLint warnings/errors
- Fix all TypeScript strict mode issues
- Remove the ignore flags once clean

**Status**: Flagged as TODO in `next.config.mjs`

### 7. WSL2 Build Compatibility [Medium]

**Description**:
`npm run build` fails on WSL2 with `EACCES: permission denied, scandir` when glob scanning Windows `.exe` paths. This is an environmental issue, not a code bug. Dev server (`npm run dev`) works fine.

**Potential Solutions**:
- Build inside a Docker container instead of directly on WSL2
- Use the standalone output mode with Docker for production builds
- Run build on native Linux or in CI/CD pipeline

**Status**: Known issue — workaround is to build in Docker or CI

### 8. Unused Radix UI Packages [Low]

**Description**:
Many Radix UI packages are installed (via shadcn/ui) but may not all be actively used. This bloats `node_modules` and potentially the bundle.

**Potential Solutions**:
- Audit which Radix UI components are actually imported
- Remove unused packages
- Use `@next/bundle-analyzer` to verify bundle impact

**Status**: Not started

### 9. siteMetadata Placeholder Values [Low]

**Description**:
`data/siteMetadata.ts` still contains some placeholder/template values (e.g., social URLs, descriptions) that should be updated with real information.

**Potential Solutions**:
- Update all fields with real author info and URLs
- Validate that OG/Twitter meta tags use correct values

**Status**: Partially addressed — structure is correct, some values need personalization

### 10. RAG Service Error Handling [Low]

**Description**:
The Rust Docs chat page proxies to a FastAPI backend. If the backend is down, the user gets a generic error. Could provide better UX.

**Potential Solutions**:
- Add a health check indicator on the chat page
- Show a clear "service unavailable" message with instructions
- Add retry logic with exponential backoff

**Status**: Basic error handling exists, could be improved

## Resolved Technical Debt

### ~~Mobile Responsiveness~~ [Resolved 2026-02-10]
Previously `HomeLayout` used `max-w-[75%]` which was too constrained on mobile. Changed to `w-full xl:max-w-[75%]`. Blog and other pages verified at mobile widths.

### ~~SEO Optimization~~ [Resolved 2026-02-10]
Implemented comprehensive SEO: Open Graph, Twitter Cards, JSON-LD structured data, dynamic sitemap, robots.txt, RSS feed, and proper meta tags on all pages.

### ~~Blog Search Non-functional~~ [Resolved 2026-02-10]
Search input was purely decorative. Implemented client-side filtering by title, content, and tags via `BlogList.tsx`.

### ~~Empty Pages (About, Projects, Snippets)~~ [Resolved 2026-02-10]
All three pages were placeholders showing "Coming soon" or empty data. Now fully implemented with real content.

## Process for Adding and Resolving Items

1. **Adding New Items**:
   - Add a descriptive title with priority level
   - Provide a detailed description of the issue
   - Suggest potential solutions
   - Set the initial status

2. **Updating Status**:
   - Regularly review and update the status of each item
   - Move resolved items to the "Resolved" section
   - Add the date of resolution

3. **Prioritization**:
   - Review priorities during sprint planning
   - Adjust priorities as needed based on project requirements
