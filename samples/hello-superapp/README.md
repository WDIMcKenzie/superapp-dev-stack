# hello-superapp sample

Minimal health-check flow. For full stack use `template/` directly.

## Run

```bash
cd ../../template
pnpm install
cp .env.example .env.local
pnpm run db:up
pnpm dev
```

Open http://localhost:4000

## Teaches

- Web + API health endpoints
- `pnpm test` in packages
