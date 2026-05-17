# SuperApp team — multi-agent operating layer

Drop any LLM into this repo, run `team/ADAPTER-PROMPT.md`, and get a five-specialist
team that continues across sessions.

**Pattern source:** [myPKA / ICOR](https://github.com/TomSolid/myPKA) — adapted for
Architect ↔ Engineer workflows and public curriculum use.

## Get going

1. Open the repo in Cursor, Claude, ChatGPT, Gemini, or Codex.
2. Paste `team/ADAPTER-PROMPT.md` as your first message.
3. Ask: "Where are we?" — Orchestrator reads STATE + HANDOFF.

## Specialists

| Role | Owns |
|------|------|
| Orchestrator | Plans, STATE, HANDOFF, routing |
| Engineer | Code, git, tests, migrations |
| Creative | Design, UX, copy |
| Researcher | Audits, research digests |
| Quality | PR review, acceptance, hires |

Routing: `team/agent-index.md`

## Files

```
team/
├── AGENTS.md           # Root contract
├── ADAPTER-PROMPT.md   # Paste into any LLM
├── STATE.md            # Current truth (template)
├── HANDOFF.md          # Latest handoff (template)
├── agent-index.md
├── Orchestrator/
├── Engineer/
├── Creative/
├── Researcher/
├── Quality/
└── Knowledge/          # SOPs, guidelines
```
