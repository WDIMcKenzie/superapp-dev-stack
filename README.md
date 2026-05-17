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

## How to work with AI

You only need **one primary coding tool** in the repo — **[Cursor](https://cursor.com/referral?code=DMALHVRLXZPR)** as
the **Engineer**. You focus on **orchestration and architecture**; the specialist
team in [`team/`](team/) maps to the tools below.

| SuperApp role | Tool | Use for |
|---------------|------|---------|
| Orchestrator, Architect, Assistant, Document designer | **Claude** | Plans, blueprints, HANDOFF, specs, long docs |
| Engineer | **Cursor** | Implementation, tests, git |
| Assistant 2 | **ChatGPT** | Short coding checks, bugs, quick review |
| Researcher | **Gemini** / **NotebookLM** | Web search, research digests |
| Creative | **Claude, ChatGPT, or Gemini** | Graphics, UI, copy — any of the three |
| Quality | **ChatGPT** + Cursor | Pre-merge acceptance |

**Stages:** Intake (Claude) → Research (Gemini/NotebookLM) → Blueprint (Claude) →
Implement (Cursor) → Quick check (ChatGPT) → Design (optional) → Quality → Ship.

Full setup steps, how to add each tool, and the daily loop:
[`docs/agents/multi-tool-orchestrator-setup.md`](docs/agents/multi-tool-orchestrator-setup.md).

Start Orchestrator day one: paste [`team/ADAPTER-PROMPT.md`](team/ADAPTER-PROMPT.md) into Claude.

**Coming soon:** a We'll Do It track on **building your own models** (training,
fine-tuning, evaluation) — follow [welldoit.solutions](https://welldoit.solutions) for updates.

## Suggested cloud architecture

For production apps we typically deploy on **Google Cloud (GCP)**, **AWS**, or
**Oracle Cloud** — each has a playbook under [`playbooks/hosting/`](playbooks/hosting/).
Pair compute with the database matrix in
[`docs/hosting/database-host-pairing.md`](docs/hosting/database-host-pairing.md).

## Free consulting from We'll Do It Solutions

We offer **free tech support and consulting** on development, business systems,
hosting choices, and getting into our programs:

- **Phone:** [833-WDI-4YOU](tel:+18339344968) (833-934-4968)
- **Email:** [specialist@welldoit.solutions](mailto:specialist@welldoit.solutions)
- **Web:** [welldoit.solutions](https://welldoit.solutions) — book a session or explore programs

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

### People and teams

- **SuperApp Dev Stack** — curriculum, template, playbooks, and ops scripts by the
  [WDIMcKenzie](https://github.com/WDIMcKenzie) / We'll Do It Solutions development team (MIT).
- **Team coordination pattern** — adapted from
  [myPKA / ICOR](https://github.com/TomSolid/myPKA) (Paperless Movement / Tom Solid).

### Suggested AI tools

- **[Cursor](https://cursor.com/referral?code=DMALHVRLXZPR)** (Anysphere) — recommended IDE
  and implementation agent; you orchestrate and architect, Cursor helps execute in the repo.
- **Orchestrator stack** — Anthropic Claude (Orchestrator/Architect), OpenAI ChatGPT
  (Assistant 2 / quick checks), Google Gemini and NotebookLM (research), Cursor
  (Engineer) — see [`docs/agents/multi-tool-orchestrator-setup.md`](docs/agents/multi-tool-orchestrator-setup.md).

### Open-source projects (template and curriculum)

The starter monorepo and docs build on work from these communities (non-exhaustive):

| Layer | Projects |
|-------|----------|
| Web | [Next.js](https://nextjs.org/), [React](https://react.dev/) |
| API | [Hono](https://hono.dev/), [Node.js](https://nodejs.org/) |
| Data | [Prisma](https://www.prisma.io/), [Zod](https://zod.dev/), [MongoDB](https://www.mongodb.com/) driver |
| Tooling | [pnpm](https://pnpm.io/), [Turborepo](https://turbo.build/), [TypeScript](https://www.typescriptlang.org/) |
| Local DB (optional) | [Docker](https://www.docker.com/), [Supabase](https://supabase.com/) CLI, Postgres |
| Pinning (optional) | [Volta](https://volta.sh/) |

Database and host playbooks also reference official guidance from **Supabase**, **Neon**,
**PlanetScale**, **MongoDB Atlas**, **Google Cloud**, **Amazon Web Services**, and
**Oracle Cloud**, plus shared hosting providers where WordPress split stacks apply.

### We'll Do It Solutions

- [We'll Do It Solutions](https://welldoit.solutions) — Backend For Frontend Success.
