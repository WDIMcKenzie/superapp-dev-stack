# AI setup tiers

Pick tier intentionally. Agents succeed fastest on Tier S.

| Tier | Providers | Agent-friendly because |
|------|-----------|------------------------|
| **S** | Supabase, Neon, PlanetScale | MCP, CLI `start`, single URL, Studio UI, strong docs |
| **A** | MongoDB Atlas, local Mongo Docker | MongoDB MCP, simple connection string |
| **B** | GCP Cloud SQL, AWS RDS/Aurora | Console + IAM; needs human for credentials |
| **C** | Oracle Autonomous DB, VPS Postgres | Wallets, NSGs, manual networking |

## Default for this curriculum

**Local Postgres via Docker Compose** (`DATABASE_PROVIDER=postgres` in `.env.example`) via
`pnpm run db:up` — no external account, works offline. Switch to **Tier S — Supabase local**
by uncommenting the Supabase block in `.env.local` when you want hosted parity (Studio UI, MCP).

## When to move up tiers

- Compliance requires VPC-only DB → Tier B
- Document-heavy flexible schema → Tier A
- Oracle enterprise mandate → Tier C with full playbook

## Per-tier playbooks

- S/A/B/C: `playbooks/databases/*.md`
- Agent MCP list: [ai-agent-database-setup.md](ai-agent-database-setup.md)
