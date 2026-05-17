# Data contract

All SuperApp projects use this env contract. Validate with Zod in `packages/data/src/env.ts`.

## Variables

| Variable | Required | Values / notes |
|----------|----------|----------------|
| `DATABASE_PROVIDER` | Yes | `supabase` \| `postgres` \| `mongodb` \| `mysql` \| `neon` \| `planetscale` \| `custom` |
| `DATABASE_URL` | Yes | Provider connection string |
| `DATABASE_URL_DIRECT` | No | Direct session URL (Prisma migrate, serverless pooler bypass) |
| `DATABASE_ENV` | Yes | `local` \| `staging` \| `prod` |
| `DATABASE_MIGRATE_MODE` | Yes | `prisma` \| `supabase-cli` \| `manual` |

## Example `.env.local` (Supabase local)

```bash
DATABASE_PROVIDER=supabase
DATABASE_ENV=local
DATABASE_MIGRATE_MODE=prisma
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
DATABASE_URL_DIRECT=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

## Example (MongoDB Atlas)

```bash
DATABASE_PROVIDER=mongodb
DATABASE_ENV=local
DATABASE_MIGRATE_MODE=manual
DATABASE_URL=mongodb://127.0.0.1:27017/{{APP}}
```

## Rules

1. Apps import `@superapp/data` only.
2. Adapters live in `packages/data/src/adapters/`.
3. Never commit `.env.local`.
4. Run `pnpm run db:validate` before feature work.
5. Health endpoint returns provider + latency — never the URL.

## Migrations

- **Prisma (default):** `pnpm --filter @superapp/data exec prisma migrate dev`
- **Supabase CLI:** when `DATABASE_MIGRATE_MODE=supabase-cli`
- **MongoDB:** collection contracts in `packages/data/contracts/`
