# Local Postgres playbook

Tier **S** (local only).

## Docker Compose

```bash
DATABASE_PROVIDER=postgres
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/superapp
pnpm run db:up
```

Uses `docker-compose.optional.yml` in template root.

## Migrations

```bash
cd packages/data
pnpm prisma:generate
pnpm prisma:migrate
```

## When to use vs Supabase local

- Minimal deps, no Auth/Storage needed
- CI pipelines that only need Postgres
