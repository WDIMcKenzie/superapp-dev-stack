# Supabase database playbook

Tier **S** — recommended for AI-assisted setup.

## When to choose

- Postgres + Auth + Storage + Realtime in one product
- Strong local CLI and Cursor MCP support

## Local setup

1. Install [Supabase CLI](https://supabase.com/docs/guides/cli)
2. `DATABASE_PROVIDER=supabase` in `.env.local`
3. `pnpm run db:up` (runs `supabase start`)
4. `pnpm run db:validate`

Default local URL pattern: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

## Hosted staging / prod

1. Create project at supabase.com
2. Store `DATABASE_URL` in secret manager — never in git
3. `pnpm prisma migrate deploy` with staging URL
4. Enable RLS policies before public launch

## AI hooks

- Enable Supabase MCP in Cursor
- Use Studio for schema inspection
- Blueprint §DATA CONTRACT required for schema changes

## Agent STOP gates

- Never paste service role key into chat
- Do not disable RLS without Orchestrator approval
