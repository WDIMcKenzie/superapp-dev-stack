# MongoDB playbook

Tier **A**.

## When to choose

- Flexible document schema
- Heavy nested JSON payloads

## Local

```bash
DATABASE_PROVIDER=mongodb
DATABASE_URL=mongodb://127.0.0.1:27017/{{APP}}
DATABASE_MIGRATE_MODE=manual
pnpm run db:up
pnpm run db:validate
```

## Atlas (staging/prod)

1. Create cluster at mongodb.com
2. IP allowlist or VPC peering
3. Connection string in secret manager
4. Define collection contracts in `packages/data/contracts/`

## AI hooks

- MongoDB MCP for index/collection review

## Migrations

Use explicit contract files — Prisma Mongo optional.
