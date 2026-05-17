# Start here

Three tracks. Finish each exit criterion before moving on.

## Track 1 — Foundations

1. **[local-tree]** Install [Volta](https://volta.sh), Node 20+, pnpm, Git, Docker (optional).
2. **[local-tree]** Clone or copy this repo; read [README.md](../README.md).
3. **[github]** Create account, enable 2FA, create `{{ORG}}/{{APP}}` repo.
4. **[local-repo]** Configure git user.name and user.email.
5. Initialize agents: paste [team/ADAPTER-PROMPT.md](../team/ADAPTER-PROMPT.md) into **Claude**
   (Orchestrator). Add ChatGPT, Gemini/NotebookLM, and [Cursor](https://cursor.com/referral?code=DMALHVRLXZPR)
   per [multi-tool orchestrator setup](agents/multi-tool-orchestrator-setup.md).

**Exit:** `git status` works; Orchestrator reports ready.

## Track 2 — Build

1. **[local-tree]** Copy `template/` to your project folder.
2. **[local-tree]** `pnpm install`
3. Choose database: [docs/databases/ai-setup-tiers.md](databases/ai-setup-tiers.md) (default: Supabase local).
4. **[local-tree]** `cp .env.example .env.local` — fill `DATABASE_*` vars.
5. **[local-tree]** `pnpm run db:up` → `pnpm run db:validate` → `pnpm dev`
6. Open web app (default port 4000) and API health (`/api/health`, `/api/health/db`).

**Exit:** Health checks pass; Engineer can implement a small feature with tests.

## Track 3 — Ship

1. Pick **host + database** from [hosting/database-host-pairing.md](hosting/database-host-pairing.md).
2. Follow `playbooks/hosting/<provider>/README.md` and `playbooks/databases/<provider>.md`.
3. **[github]** PR workflow: `feature/*` → `develop` → gated `main`.
4. **[-staging env]** Deploy and verify before **[-prod env]** (human gate).

**Exit:** Staging URL verified; secrets only in provider secret manager.

## Curriculum map

See [curriculum/README.md](curriculum/README.md).

## Daily loop

```
Orchestrator plan → Engineer implements → db:validate → tests → PR → Quality review
```

WordPress/CMS track: edit `sites/` → push staging → browser verify → PR.
