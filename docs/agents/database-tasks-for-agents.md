# Database tasks for agents

1. Read `docs/databases/00-data-contract.md`.
2. Run `pnpm run db:validate`.
3. Edit only `packages/data/` for connection logic.
4. Add migrations via Prisma when `DATABASE_MIGRATE_MODE=prisma`.
5. Update blueprint §DATA CONTRACT for any schema change.

Tier S workflows: prefer Supabase MCP + CLI.
Tier C: human must provide wallet and network rules — do not invent.
