# Technology Stack

## Framework & Runtime
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety throughout
- **Node.js** - Runtime environment

## Database & Authentication
- **MySQL** - Primary database with mysql2 driver
- **NextAuth.js v5** - Authentication with multiple providers (Google, GitHub, Credentials)
- **bcryptjs** - Password hashing

## Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **next-themes** - Theme management (dark/light mode)

## Content & Media
- **MDX** - Markdown with React components
- **next-mdx-remote** - Remote MDX processing
- **gray-matter** - Frontmatter parsing
- **Lottie React** - Animation support

## Testing
- **Vitest** - Test runner
- **Testing Library** - React component testing
- **jsdom** - DOM environment for tests

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npx vitest           # Run tests
npx vitest --run     # Run tests once (no watch)
```

### Database Operations
```bash
npx tsx check-db.ts           # Check database connection
npx tsx setup-full.ts         # Full database setup
npx tsx update_db.ts          # Update database schema
```

## Environment Variables Required
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database connection
- `AUTH_SECRET` - NextAuth secret
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `GITHUB_ID`, `GITHUB_SECRET` - GitHub OAuth