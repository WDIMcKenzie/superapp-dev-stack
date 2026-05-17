# SuperApp Dev Stack

A **public curriculum and starter kit** for building modern full-stack applications
with AI agents — host-agnostic, database-agnostic, and optimized for Cursor, Claude,
Codex, ChatGPT, and Gemini.

## About

This repository is an **open, generic** distillation of team practices for
AI-assisted full-stack development. It is maintained by
[WDIMcKenzie](https://github.com/WDIMcKenzie) for the coding community.

**What is not included:** private product code, proprietary security runbooks,
internal host or cloud naming, customer data, or any commercial product-specific
configuration. Use the template and playbooks with your own `{{ORG}}` placeholders.

## What you get

- **Multi-agent orchestration** — Orchestrator + specialist team (`team/`)
- **Dual-agent workflow** — Architect (plans) + Engineer (implements)
- **Starter monorepo** — Next.js + API + swappable databases (`template/`)
- **Hosting playbooks** — AWS, GCP, Oracle, GoDaddy, Bluehost, Hostinger
- **Database playbooks** — Supabase, MongoDB, Cloud SQL, RDS, Oracle, local Postgres
- **AI setup tiers** — Ranked paths from one-session bootstrap to enterprise IAM

## Quick start

```bash
pnpm run init      # interactive wizard — tools, project folder, DB, AI setup
pnpm run doctor    # read-only check that tools are installed
```

1. Read [docs/00-start-here.md](docs/00-start-here.md)
2. Run **`pnpm run init`** — creates `projects/<your-app>/` with the [standard layout](docs/setup/project-layout.md)
3. Open `projects/<your-app>/AI-START-HERE.md` and paste [team/ADAPTER-PROMPT.md](team/ADAPTER-PROMPT.md) into your AI
4. From the project folder: `pnpm run db:validate` then `pnpm dev`

## What gets installed

| Tool | Required | Purpose |
|------|----------|---------|
| Git | Yes | Version control |
| Node.js 20+ | Yes | Runtime (Volta recommended) |
| pnpm | Yes | Monorepo packages |
| Docker Desktop | For local DB | Postgres / Mongo containers |
| GitHub CLI (`gh`) | Optional | PRs and repos from terminal |
| Supabase CLI | If you pick Supabase | Local Supabase stack |

The wizard opens official download pages when something is missing — nothing is hard-coded to your machine path.

## AI triggers (scripts, not guesswork)

Tell your AI a **trigger phrase**; it runs the matching script from [prompts/triggers/INDEX.md](prompts/triggers/INDEX.md):

| Say | Does | Live deploy? |
|-----|------|----------------|
| **create new app** | `node scripts/ops/new-app.mjs` | No |
| **bootstrap github** | `github-bootstrap.sh --confirm` | No |
| **check the stack** | `stack-check.sh` | No |
| **run the stack** | `stack-run.sh` | Local only |
| **push to github** | `git-push.sh` | No |
| **setup hosting** | `hosting-setup.sh --host gcp` | No |
| **deploy staging** | `deploy-staging.sh --confirm` | Only with `--confirm` |
| **deploy production** | `deploy-prod.sh --confirm` | Only with `--confirm` |

Full guide: [docs/setup/ai-triggers.md](docs/setup/ai-triggers.md)

## Repository map

| Path | Purpose |
|------|---------|
| [docs/](docs/) | Handbook, curriculum, database contract, agent guides |
| [team/](team/) | Orchestrator + specialists, STATE/HANDOFF, SOPs |
| [template/](template/) | Production-style monorepo starter |
| [samples/](samples/) | Small focused examples |
| [playbooks/](playbooks/) | Host and database setup guides |
| [scripts/](scripts/) | Init wizard, doctor, leak scan |
| [projects/](projects/) | Your generated apps (gitignored) |
| [prompts/starter/](prompts/starter/) | Copy-paste AI starter prompts |
| [prompts/triggers/](prompts/triggers/) | **Say a phrase → run a script** (create app, GitHub, deploy gates) |
| [scripts/ops/](scripts/ops/) | Ops scripts wired to triggers |

## Security

Run before every public push:

```bash
chmod +x scripts/leak-scan.sh
./scripts/leak-scan.sh
```

See [docs/security/publication-checklist.md](docs/security/publication-checklist.md).

## License

MIT — see [LICENSE](LICENSE).

## Credits

- Curriculum and tooling patterns by the SuperApp Dev Stack maintainers (MIT).
- Team coordination pattern adapted from
  [myPKA / ICOR](https://github.com/TomSolid/myPKA) (Paperless Movement).
- [We'll Do It Solutions](https://welldoit.solutions) — Backend For Frontend Success.
