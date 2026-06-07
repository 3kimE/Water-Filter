# Filtre Maroc

Water-filter store + field-service app (cash on delivery), for the Moroccan market.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · Prisma 6 · Supabase (Postgres + Storage) · custom FR / AR / EN i18n (with Arabic RTL).

## Areas

| Path | Who | What |
|------|-----|------|
| `/` `(storefront)` | Customers | Shop, product pages, cart, checkout (COD) |
| `/admin` | Owner (admin) | Dashboard, products, orders, clients/suivi, users, settings, messages |
| `/confirmation` | Confirmateur | Confirms phone/web orders, schedules installs, dispatches a technician |
| `/technicien` | Technicien | Their assigned installs/maintenance, navigate, complete with a photo |

Auth is a bcrypt + JWT cookie (jose), role-based via `src/middleware.ts` (`admin` / `confirmateur` / `plombier`). Settings (phone, WhatsApp, delivery fee, etc.) live in the DB and are edited in `/admin/settings`.

## Requirements

- Node.js 20+
- A Supabase project: Postgres + a **public** Storage bucket named `products`
- A Resend account for transactional emails (optional — the app works without it, emails just don't send)

## Environment

Copy `.env.example` to `.env` and fill in every value. `APP_URL` must be your real domain in production (email links use it).

## Local development

```bash
npm install
npx prisma generate
npx prisma db push          # sync the schema to your database
npm run dev                 # http://localhost:3000
```

Create the first admin login:

```bash
npx tsx scripts/create-admin.ts you@example.com YourStrongPassword
```

## Production deploy (Node host / Hostinger VPS)

The app needs a running Node process (it does server-side rendering, server actions, and DB access) — it is **not** static files.

```bash
npm ci
npx prisma generate
npx prisma db push          # or `prisma migrate deploy` if you use migrations
npm run build
npm start                   # serves on PORT (default 3000)
```

Recommended on a VPS:

- Keep it alive with **PM2**: `pm2 start "npm start" --name filtre-maroc`
- Put **Nginx** in front as a reverse proxy with HTTPS (free Let's Encrypt SSL)
- Set all env vars from `.env.example` on the server, and make sure `AUTH_SECRET` is long and `APP_URL` points to your domain
- Create the first admin with the `create-admin` script above

The database (Supabase) and image storage are external, so they work from any host.
