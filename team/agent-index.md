# Agent index — routing table

> User talks to **Orchestrator** only. Orchestrator routes using this table.

| Specialist | Owns | Default tool |
|------------|------|--------------|
| **Orchestrator** | Plans, STATE, HANDOFF, `docs/plans/`, session logs | Claude |
| **Architect** | Blueprints, §DATA CONTRACT, file trees | Claude |
| **Assistant** | Follow-ups, clarifications, session continuity | Claude |
| **Document designer** | Specs, handbook, runbooks, blueprint prose | Claude |
| **Engineer** | `apps/`, `packages/`, `services/`, `integrations/`, git, tests | Cursor |
| **Assistant 2** | Short coding checks, bug triage | ChatGPT |
| **Creative** | Graphics, UX, copy, tokens | Claude / ChatGPT / Gemini |
| **Researcher** | Web search, external digests, repo audits | Gemini / NotebookLM |
| **Quality** | PR review, acceptance, new specialist contracts | ChatGPT + Cursor |

Setup guide: [`docs/agents/multi-tool-orchestrator-setup.md`](../docs/agents/multi-tool-orchestrator-setup.md)

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
