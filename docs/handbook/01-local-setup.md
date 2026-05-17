# Local setup

## Tools

| Tool | Purpose |
|------|---------|
| Volta | Pin Node and pnpm versions |
| pnpm | Monorepo package manager |
| Git | Version control |
| Docker Desktop | Optional local Postgres |
| Supabase CLI | Recommended local Postgres + Auth (Tier S) |

## Install

```bash
# Volta (macOS/Linux)
curl https://get.volta.sh | bash
volta install node@20
volta install pnpm@9

# Verify
node -v
pnpm -v
```

## Project bootstrap

```bash
cp -r template/ ~/projects/{{APP}}
cd ~/projects/{{APP}}
pnpm install
cp .env.example .env.local
pnpm run db:up
pnpm run db:validate
pnpm dev
```

## Ports (template defaults)

| Service | Port |
|---------|------|
| Web | 4000 |
| API | 8080 |

## Checklist

- [ ] `pnpm run db:validate` passes
- [ ] Web and API health endpoints return OK
- [ ] `.env.local` is gitignored
- [ ] `team/STATE.md` updated with project name
