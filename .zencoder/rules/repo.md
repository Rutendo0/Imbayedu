# Imbayedu Repository Overview

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript / React 19
- **DB/ORM**: PostgreSQL + Drizzle ORM
- **Runtime DB client**: postgres (serverless-friendly)
- **State**: @tanstack/react-query, Zustand
- **UI**: TailwindCSS + Radix UI

## Local Environment
- **Env file**: `.env`
  - `DATABASE_URL=postgres://postgres:rutendo@localhost:5432/imbayedu`
- Start app:
  - `npm run dev`

## Database
- **Schema files**:
  - `shared/schema.ts`: users, artists, categories, collections, artworks, cart_items, testimonials
  - `shared/orders.ts`: orders, order_items
- **Drizzle config**: `drizzle.config.ts`
  - schema glob: `./shared/*.ts`
- **Commands**:
  - `npm run db:push` → create/update tables from schema
  - `npm run db:setup` → connects and loads schema (logging only; still use db:push for DDL)

## Storage Layer
- File: `lib/storage.ts`
- Auto-selects Postgres when `DATABASE_URL` (or POSTGRES_URL/POSTGRES_URL_NON_POOLING) is set and `DISABLE_DB !== "true"`.
- Exposes CRUD for users, artists, categories, collections, artworks, cart items, testimonials, and orders.

## Key API Routes (App Router)
- Admin
  - `app/api/admin/dashboard/route.ts` → aggregates orders, revenue, top artworks
  - `app/api/admin/orders/route.ts` → list & create orders
  - `app/api/admin/*` → manage artists, artworks, categories, collections, seed, cleanup, etc.
- Public
  - `app/api/artists` `app/api/artworks` etc.

## Admin Auth
- `lib/auth.ts` with `requireAdmin()` check used by admin routes.

## Frontend Pages (examples)
- `app/page.tsx` (home), `app/artists`, `app/artworks`, `app/cart`, `app/checkout`, etc.

## Common Issues & Fixes
- **Error 42P01: relation "orders" does not exist**
  - Cause: Missing tables. Fix: `npm run db:push`
- **Database does not exist**
  - Create DB with psql: `CREATE DATABASE imbayedu;` then `npm run db:push`
- **Env not loaded**
  - Ensure `.env` exists and Next.js dev is restarted after changes

## Project Scripts
- **dev**: `next dev`
- **build/start**: `next build` / `next start`
- **lint**: `next lint`
- **check**: `tsc --noEmit`
- **db:push**: `drizzle-kit push`
- **db:setup**: `node setup-database.js`

## Notes
- When adding new tables, place definitions in `shared/*.ts`, then run `npm run db:push`.
- `orders` and `order_items` are required by dashboard and admin/orders endpoints.