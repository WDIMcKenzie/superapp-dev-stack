# Trigger: switch database

**Say:** `switch database to supabase` (or mongodb, postgres)

From project root:

```bash
pnpm run db:switch
# follow prompts, or edit .env.local per packages/data README
pnpm run db:up
pnpm run db:validate
```

AI: read `packages/data/README.md` and `playbooks/databases/` for the target provider.
