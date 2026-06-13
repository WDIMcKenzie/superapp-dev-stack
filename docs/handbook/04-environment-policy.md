# Environment policy

Generic pattern for modern + CMS split stacks.

Branch and deploy governance: [06-user-branches-and-deploy-governance.md](./06-user-branches-and-deploy-governance.md).

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

Deploy scripts are **release train**, not daily loop. Only the **deploy operator** (see §06) runs staging/prod after PR merge to `develop` and explicit approval.

- **Default:** two targets (staging + production) in one cloud project until budget allows more staging slots.
- **Never** auto-deploy from a contributor’s `user/*/workspace` branch without review.
- Staging: `bash scripts/ops/deploy-staging.sh --confirm` (human gate).
- Production: stricter gate + staging sign-off first.

## Database

- Local profile for dev: `DATABASE_ENV=local`
- Staging/prod URLs in secret manager only
- `pnpm run db:validate` before feature work
