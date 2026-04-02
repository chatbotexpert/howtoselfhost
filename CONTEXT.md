# Project Context: howtoselfhost.com

This document tracks the current progress, architectural decisions, and next steps for the `howtoselfhost.com` project.

## Current Progress

- ✅ **Database Migration**: Migrated from Supabase (PostgreSQL) to local **SQLite** (`dev.db`) for easier local development.
- ✅ **Schema Refactoring**: Updated `prisma/schema.prisma` to handle SQLite limitations (e.g., converted `String[]` tags to a JSON-serialized `String`).
- ✅ **Admin Authentication**: Fixed admin login by escaping `$` characters in the `.env` file to prevent Next.js environment variable expansion issues.
- ✅ **Category Expansion**: Added several major self-hosting categories including Blockchain, CI/CD, VPN, Media, and Automation.
- ✅ **UI/UX Enhancements**:
  - Implemented an **auto-scrolling category marquee** on the homepage with hover-pause functionality.
  - Fixed **cover image dimensions** site-wide using `object-contain` to prevent unwanted cropping.
  - Refined **Light Mode comfort** by moving from stark white to a soft `slate-50` background with improved typography contrast.
  - Upgraded the **Theme Toggle** with a more premium, animated design and interactive glow effects.
  - Fixed **Blog Post Visibility**: Resolved issues where blog body text and headers were invisible or incorrectly styled in light mode.
  - Cleaned up **TypeScript Linting** issues related to the SQLite `tags` field serialization.

## Architectural Decisions

1. **SQLite for Local Dev**: Chosen for zero-config local setup. Tags are stored as JSON strings and parsed/stringified at the API layer to maintain compatibility with the frontend's expected array format.
2. **Next-Themes & Tailwind**: Using `next-themes` for theme management with a focus on "comfort-first" design, avoiding high-contrast eye strain in light mode.
3. **MDX Content**: Leveraging `next-mdx-remote` for blog content to allow rich, interactive technical guides with syntax highlighting.
4. **Environment Variables**: Admin credentials and sensitive keys are managed via `.env`. Special care is taken to escape hashes that contain `$`.

## Immediate Next Steps

1. **Category Management UI**: Replace hardcoded category lists with a dynamic CRUD interface in the Admin panel to allow users to add/edit categories without touching code.
2. **Search Optimization**: Enhance the blog search to include full-text search across MDX content rather than just titles and excerpts.
3. **SEO Polish**: Ensure all new categories have proper meta descriptions and unique URLs for better search engine indexing.
4. **Production Deployment**: Prepare the project for deployment (e.g., Vercel + Neon/Supabase) by creating a database switching utility or migration script.

## Useful Commands

- `npm run dev`: Start development server.
- `npx ts-node --project tsconfig.seed.json prisma/seed.ts`: Seed the local database.
- `npx prisma studio`: Open Prisma Studio to inspect data.
