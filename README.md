# Imbayedu Art Collective (Next.js)

- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm start`

This repo was migrated to Next.js App Router. Client pages/components from `client/src` are reused in `app/*` routes. API endpoints are implemented under `app/api/*` and reuse the same storage layer from `server/storage`.

Env vars:
- `POSTGRES_URL` or `DATABASE_URL` (optional; falls back to in-memory)

Deploy on Vercel: just connect the repo; framework is auto-detected.