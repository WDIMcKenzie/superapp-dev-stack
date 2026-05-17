# Environment policy

Generic pattern for modern + CMS split stacks.

## SaaS application (Next.js + API)

| Activity | Environment |
|----------|-------------|
| Daily feature dev | `[-local env]` only |
| Integration tests | `[-local env]` with optional staging API URLs if HANDOFF requires |
| Release verification | `[-staging env]` — gated |
| Customer traffic | `[-prod env]` — explicit human approval |

**Forbidden for daily work:** pointing `DATABASE_URL` at production.

## WordPress / PHP site

| Activity | Environment |
|----------|-------------|
| Edit source | `[local-tree]` under `sites/` |
| Runtime verify | `[-staging env]` on host (SFTP push) |
| Production | `[-prod env]` after staging sign-off |

**Forbidden:** committing SFTP passwords; editing production without HANDOFF.

## Cloud deploy

Deploy scripts are **release train**, not daily loop. Engineer runs only when Orchestrator HANDOFF says so.

## Database

- Local profile for dev: `DATABASE_ENV=local`
- Staging/prod URLs in secret manager only
- `pnpm run db:validate` before feature work
