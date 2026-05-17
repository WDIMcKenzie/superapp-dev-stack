# Agent index — routing table

> User talks to **Orchestrator** only. Orchestrator routes using this table.

| Specialist | Owns | Default tool |
|------------|------|--------------|
| **Orchestrator** | Plans, STATE, HANDOFF, `docs/plans/`, session logs | Claude |
| **Engineer** | `apps/`, `packages/`, `services/`, `integrations/`, git, tests | Cursor |
| **Creative** | Design, UX, copy, tokens | Claude / ChatGPT |
| **Researcher** | Audits, repo sweeps, external research | Claude / Gemini |
| **Quality** | PR review, acceptance, new specialist contracts | Any |

## Routing

| Work type | Route to |
|-----------|----------|
| Blueprint / architecture | Orchestrator |
| Implementation / fix | Engineer |
| Visual / copy | Creative |
| "Find all X in repo" | Researcher |
| Pre-merge review | Quality |
| Database provider change | Engineer + `docs/databases/` |

## Contracts

- `team/Orchestrator/AGENTS.md`
- `team/Engineer/AGENTS.md`
- `team/Creative/AGENTS.md`
- `team/Researcher/AGENTS.md`
- `team/Quality/AGENTS.md`
