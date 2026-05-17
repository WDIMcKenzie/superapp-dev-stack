# WordPress MySQL (CMS only)

**Not** your application database.

## Scope

- Host-provided MySQL on GoDaddy, Bluehost, Hostinger
- Accessed by WordPress only

## Your SaaS app

Use Supabase, RDS, or Atlas via `@superapp/data` on cloud compute.

## Workflow

1. WP changes → SFTP to staging
2. App changes → `pnpm dev` locally + cloud deploy
3. Bridge integrations via REST + secrets in both systems

Never point Prisma `DATABASE_URL` at production WP MySQL unless explicitly architected.
