# db-supabase sample

Use template with Supabase profile:

```bash
cd ../../template
cp .env.example .env.local
# Set DATABASE_PROVIDER=supabase and Supabase local URL
pnpm run db:up
pnpm run db:validate
```

See [playbooks/databases/supabase.md](../../playbooks/databases/supabase.md).

## Agent check

`db:validate` must exit 0 before marking task complete.
