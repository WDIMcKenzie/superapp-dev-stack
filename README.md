# SuperApp Dev Stack

A **public curriculum and starter kit** for building modern full-stack applications
with AI agents — host-agnostic, database-agnostic, and optimized for Cursor, Claude,
Codex, ChatGPT, and Gemini.

## What you get

- **Multi-agent orchestration** — Orchestrator + specialist team (`team/`)
- **Dual-agent workflow** — Architect (plans) + Engineer (implements)
- **Starter monorepo** — Next.js + API + swappable databases (`template/`)
- **Hosting playbooks** — AWS, GCP, Oracle, GoDaddy, Bluehost, Hostinger
- **Database playbooks** — Supabase, MongoDB, Cloud SQL, RDS, Oracle, local Postgres
- **AI setup tiers** — Ranked paths from one-session bootstrap to enterprise IAM

## Quick start

1. Read [docs/00-start-here.md](docs/00-start-here.md)
2. Initialize agents: paste [team/ADAPTER-PROMPT.md](team/ADAPTER-PROMPT.md) into your LLM
3. Copy the template: `cp -r template/ ../my-app && cd ../my-app && pnpm install`
4. Start local DB: `pnpm run db:up` then `pnpm run db:validate`
5. Run the stack: `pnpm dev`

## Repository map

| Path | Purpose |
|------|---------|
| [docs/](docs/) | Handbook, curriculum, database contract, agent guides |
| [team/](team/) | Orchestrator + specialists, STATE/HANDOFF, SOPs |
| [template/](template/) | Production-style monorepo starter |
| [samples/](samples/) | Small focused examples |
| [playbooks/](playbooks/) | Host and database setup guides |
| [scripts/](scripts/) | Leak scan, DB helpers |

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

Team coordination pattern adapted from
[myPKA / ICOR](https://github.com/TomSolid/myPKA) (Paperless Movement).
