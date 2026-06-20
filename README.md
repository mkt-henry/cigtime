# cigtime

Anonymous three-minute rooms built with Next.js and Supabase.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the Supabase values.
2. Apply `supabase/migrations/202606210001_realtime_analytics.sql` in the Supabase SQL editor.
3. Run `npm install` and `npm run dev`.

The service-role key is server-only. Browser writes go through Route Handlers; the anon key is used for Realtime message/reaction reads and Presence.

## Operations

- `GET /api/analytics?days=7` returns product DAU, defined as unique anonymous users who entered a room or performed an in-room action. Landing-only visitors are excluded.
- Vercel invokes `/api/cron/purge-messages` daily at 01:15 KST. Set `CRON_SECRET` in the production environment.
- Realtime publication and read-only RLS policies are installed by the migration.
- `/api/health` checks application-to-database connectivity and emits structured runtime logs.
- `/stats` shows 14-day product DAU; `/reactions` shows reactions received by the current browser.
