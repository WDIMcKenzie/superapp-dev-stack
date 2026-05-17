# SuperApp template monorepo

Copy this folder to start a new project.

```bash
cp -r template/ ~/projects/{{APP}}
cd ~/projects/{{APP}}
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
