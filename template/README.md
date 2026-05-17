# SuperApp template monorepo

Copy this folder to start a new project (or run `pnpm run init` from the curriculum repo).

```bash
# Recommended — from curriculum repo root
pnpm run init

# Manual — same layout as init creates
mkdir -p projects/{{APP}} && cp -r template/* projects/{{APP}}/
cd projects/{{APP}}
pnpm install
cp .env.example .env.local
pnpm run db:up
pnpm run db:validate
pnpm dev
```

## Structure

- `apps/web-local` — Next.js
- `services/api` — Hono API
- `packages/data` — database adapters
- `sites/wordpress-site` — optional CMS assets

## Docs

Parent curriculum: [SuperApp Dev Stack](../README.md)
