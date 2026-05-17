# AI agent database setup

## Engineer preflight

```bash
pnpm run db:validate
```

Exit code 0 required before schema or API data changes.

## MCP servers (enable in Cursor / IDE)

| Provider | MCP | Use for |
|----------|-----|---------|
| Supabase | Supabase plugin | Schema, RLS, logs |
| MongoDB | MongoDB MCP | Collections, indexes |
| Prisma | Prisma docs / CLI | Migrations, schema |

Do not paste production credentials into MCP or chat.

## Blueprint §DATA CONTRACT

Include:

- Entities and relations
- `DATABASE_PROVIDER` value
- Env vars list
- Adapter files to touch
- Migration command
- Rollback note

Template: `docs/agents/templates/blueprint-template.md`

## STOP gates

- User pasted prod `DATABASE_URL` in chat → rotate secret, use local profile
- `db:validate` fails → fix env before implementing features
- Agent proposes second ORM → reject; use `@superapp/data`

## Health check

`GET /api/health/db` → `{ "provider": "postgres", "ok": true, "latencyMs": 12 }`

No connection string in response.
