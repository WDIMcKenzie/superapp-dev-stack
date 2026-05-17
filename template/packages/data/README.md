# @superapp/data

Provider-agnostic data layer. Apps must import this package only.

## Switch provider

1. Edit `.env.local` (`DATABASE_PROVIDER`, `DATABASE_URL`)
2. `pnpm run db:up`
3. `pnpm run db:validate`

Or run `pnpm run db:switch` from template root.

## Adapters

| File | Provider |
|------|----------|
| `postgres-local.ts` | postgres, supabase, neon |
| `mongodb.ts` | mongodb |
| `gcp-cloud-sql.ts` | Cloud SQL (Postgres URL) |
| `aws-rds.ts` | RDS (Postgres URL) |
| `oracle-autonomous.ts` | stub — see playbook |

## Migrations

```bash
cd packages/data
pnpm prisma:generate
pnpm prisma:migrate
```
