# Overview

Wisdomia is a digital magazine/blog platform built with Next.js 16 featuring articles, categories, newsletter subscriptions, and user authentication. The project uses the App Router architecture with server components, server actions, and Prisma ORM for database operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 16 with React 19 and TypeScript
- **Routing**: Next.js App Router (file-based routing)
- **Styling**: Tailwind CSS v4 with custom theming
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Carousel**: Embla Carousel
- **Markdown**: react-markdown with remark-gfm, rehype-raw

## Backend Architecture
- **Framework**: Next.js API Routes and Server Actions
- **Database ORM**: Prisma with PostgreSQL
- **Authentication**: NextAuth.js v5 (beta)
- **Schema Location**: `prisma/schema.prisma` contains all database table definitions

## Database Schema
The application uses PostgreSQL with the following main tables:
- `users`: User accounts with id, name, email, password, role
- `posts`: Articles with title, slug, content, author, category, views, featured flag
- `settings`: Key-value store for configuration (including newsletter subscribers)
- `navbar_links`: Navigation menu items
- `assets`: Static asset references
- `media`: Uploaded media files
- `accounts`, `sessions`: NextAuth.js authentication tables

## Key Design Decisions

1. **Server Components**: Homepage and article pages use React Server Components for SEO and performance
2. **Server Actions**: Form handling and mutations use Next.js Server Actions (`actions/` directory)
3. **Settings-based Newsletter**: Newsletter subscribers stored as JSON in Settings model to avoid additional migrations
4. **Dynamic Metadata**: SEO metadata via layout.tsx files for each route
5. **Responsive Design**: Mobile-first approach with responsive breakpoints

# Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── subscribe/         # Newsletter subscription page
│   ├── newsletters/       # Newsletters overview page
│   ├── popular/          # Popular articles page
│   ├── latest/           # Latest articles page
│   └── topics/           # Topics/categories page
├── actions/              # Server Actions
│   ├── newsletter.ts     # Newsletter subscription logic
│   ├── navbar.ts        # Navigation data fetching
│   └── posts.ts         # Article fetching
├── components/          # React components
│   ├── Subscription.tsx # Newsletter subscription form
│   └── Footer.tsx      # Site footer
├── lib/                 # Utility functions
│   ├── db.ts           # Prisma client
│   └── posts.ts        # Post-related queries
├── prisma/
│   └── schema.prisma   # Database schema (PostgreSQL)
└── public/             # Static assets
```

# External Dependencies

## Database
- **PostgreSQL**: Primary database via Replit's built-in Neon-backed PostgreSQL
- **Prisma**: ORM for database operations, use `npx prisma db push` to sync schema

## Key NPM Packages
- `next` / `react` / `react-dom`: Core framework
- `@prisma/client` / `prisma`: Database ORM
- `next-auth`: Authentication
- `framer-motion`: Animations
- `tailwindcss`: Styling
- `lucide-react`: Icons

## Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (auto-provided by Replit)
- `SESSION_SECRET`: Session encryption secret

# Development

- Run `npm run dev` to start the development server on port 5000
- Database changes: Edit `prisma/schema.prisma`, then run `npx prisma db push`
- Generate Prisma client: `npx prisma generate`

# Recent Changes (January 2026)

- Converted database from MySQL to PostgreSQL to work with Replit's built-in database
- Added newsletter subscription system using Settings model for storage
- Created subscribe, popular, latest, newsletters pages
- Added SEO metadata via layout.tsx files
- Added data-testid attributes for testing compliance
- Made footer copyright year dynamic
