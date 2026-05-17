# AI-assisted development

## Architect vs Engineer

- **Orchestrator** decides *what* and *in what order*.
- **Engineer** writes *how* in code, within blueprint constraints.

## Prompt budget

Session start: 4 docs only (STATE, HANDOFF, role AGENTS, latest session). Pull blueprint sections by ID.

## Verification before "done"

- `pnpm test`
- `pnpm run db:validate`
- Health endpoints
- Leak scan before public push

## Tools

| Tool | Default role |
|------|--------------|
| Cursor | Engineer |
| Claude | Orchestrator |
| ChatGPT / Gemini | Orchestrator or Researcher |

Initialize with `team/ADAPTER-PROMPT.md`.
