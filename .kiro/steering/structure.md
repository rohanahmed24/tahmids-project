# Project Structure & Architecture

## Directory Organization

### Core Application (`/app`)
- **App Router structure** - Next.js 13+ file-based routing
- **Route groups** - Organized by feature (admin, auth, content)
- **Layout hierarchy** - Root layout with providers, nested layouts for sections
- **Page components** - Server components by default, client components when needed

### Server Actions (`/actions`)
- **Feature-based organization** - Separate files per domain (auth, posts, users, etc.)
- **"use server" directive** - All action files are server-side
- **Form handling** - FormData processing with validation
- **Database operations** - Direct database queries with error handling

### Components (`/components`)
- **Flat structure** - Most components in root components folder
- **UI subfolder** - Reusable UI primitives and animations
- **Providers subfolder** - Context providers (Auth, Theme)
- **Feature components** - Domain-specific components (ArticleCard, Navbar, etc.)

### Library Code (`/lib`)
- **Database utilities** - Connection pooling and query helpers
- **Business logic** - Data fetching, user management, post operations
- **Shared utilities** - Common functions, type definitions

### Content (`/content`)
- **MDX files** - Markdown content with frontmatter
- **Static content** - Posts organized by type/category

## Architecture Patterns

### Data Flow
1. **Server Components** - Fetch data directly in components
2. **Server Actions** - Handle form submissions and mutations
3. **Database Layer** - MySQL with connection pooling
4. **Client State** - Minimal client state, mostly for UI interactions

### Authentication Flow
- **NextAuth.js integration** - Centralized auth configuration
- **Multiple providers** - OAuth (Google, GitHub) + credentials
- **Session management** - Server-side session handling
- **Role-based access** - Admin/user role distinction

### Styling Conventions
- **Tailwind classes** - Utility-first approach
- **Semantic color system** - Theme-aware color tokens (text-main, bg-base, etc.)
- **Component variants** - Conditional styling based on props/state
- **Responsive design** - Mobile-first breakpoints

## File Naming Conventions
- **Pages** - `page.tsx` for route pages
- **Layouts** - `layout.tsx` for nested layouts
- **Components** - PascalCase (e.g., `ArticleCard.tsx`)
- **Actions** - kebab-case (e.g., `admin-auth.ts`)
- **Utilities** - camelCase (e.g., `auth-service.ts`)

## Import Patterns
- **Absolute imports** - Use `@/` alias for project root
- **Barrel exports** - Index files for clean imports where beneficial
- **Type imports** - Separate type imports when needed