# App + API stack playbook

The cloud half of the split stack (the other half is WordPress on a host — see `../hosting/bluehost/README.md`). This is the canonical stack for our apps, including any `{{ORG}}` platform built on it.

## When to choose

Anything dynamic: accounts, dashboards, APIs, video apps, anything that can't run on shared WordPress. WordPress stays for marketing/e-commerce; the app + API live here.

## The stack

- Web app: Next.js (App Router) + Tailwind. Deploy on Cloudflare Pages.
- Data + auth: Supabase (Postgres, Auth, Row-Level Security). Secrets in Supabase Vault — never in the client.
- API / serverless: Cloudflare Workers (or Next.js route handlers) for OAuth, webhooks, and AI calls.
- Object storage: Cloudflare R2 (media masters, recordings, exports).
- Video (when needed): Cloudflare Stream (live + VOD, low-latency HLS). See `../streaming/README.md`.
- AI features: separate Worker/service that calls provider APIs — isolated in its own service so your proprietary logic stays out of any open-source or desktop client.

## Repo layout (keep it simple)

```
apps/web/        Next.js site + app
services/api/    Workers: oauth, webhooks, ai
packages/db/     schema.sql + migrations (Supabase)
infra/           env notes, deploy steps
```

## Workflow

Edit → preview deploy (Cloudflare Pages/Workers) → verify → PR. Mirrors the WordPress workflow, just cloud-native. Env via `.env.local`; production secrets in Cloudflare + Supabase, never committed.

## Why this stack

Solo-friendly and cheap to start: managed services do the heavy lifting (Supabase = backend, Cloudflare = edge + video + storage), one language (TypeScript) front-to-back, scales without re-platforming.
