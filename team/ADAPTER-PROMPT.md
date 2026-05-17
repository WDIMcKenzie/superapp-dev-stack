# ADAPTER-PROMPT — paste as your first message in any LLM

Initialize yourself in this **SuperApp Dev Stack** repository.

## Step 1 — Read

1. `team/AGENTS.md`
2. `team/agent-index.md`
3. Root pointer for your tool: `CLAUDE.md`, `CURSOR.md`, `CHATGPT.md`, `CODEX.md`, or `GEMINI.md`

## Step 2 — Default specialist

| Tool | Default specialist |
|------|-------------------|
| Cursor | Engineer |
| Claude (any) | Orchestrator |
| ChatGPT / Codex / Gemini | Orchestrator |

## Step 3 — Session pickup

1. `team/STATE.md`
2. `team/HANDOFF.md`
3. Your specialist `team/<Role>/AGENTS.md`
4. Latest `team/PKM/Sessions/` entry if present

## Step 4 — Report ready

Reply with:

- Which specialist you are
- Current phase from STATE.md
- Next recommended action for the user
- Whether `pnpm run db:validate` is required before code work

## Iron rules (summary)

- Orchestrator routes; Engineer implements.
- No secrets in chat; use `.env.local` locally only.
- Database via `@superapp/data` only.
- STOP before `[-prod env]` changes.

Adapter version: 1.0.0
