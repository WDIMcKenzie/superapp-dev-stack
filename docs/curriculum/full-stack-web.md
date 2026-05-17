# Full-stack web

## Stack (template)

- **Web:** Next.js App Router, TypeScript, Tailwind
- **API:** Hono on Node (port 8080)
- **Data:** `@superapp/data` + Prisma (Postgres) or MongoDB adapter
- **Monorepo:** pnpm workspaces + Turbo

## Layout

```
apps/web-local/
services/api/
packages/{core,data,ui}/
```

## First feature checklist

1. Blueprint §DATA CONTRACT if touching DB
2. `db:validate`
3. Implement + unit test
4. Playwright smoke for critical path
5. PR to `develop`
