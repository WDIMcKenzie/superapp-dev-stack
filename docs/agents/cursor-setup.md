# Cursor setup

1. Open repo root in Cursor.
2. Read `CURSOR.md` and `.cursorrules`.
3. Enable rules in `.cursor/rules/` (auto via alwaysApply).
4. Paste `team/ADAPTER-PROMPT.md` once per new chat.
5. Run `pnpm run db:validate` before Agent mode feature work.

## Modes

- **Plan** — architecture, read-only exploration
- **Agent** — implement blueprint sections

## MCP

Enable Supabase and/or MongoDB MCP when using those providers — see `docs/databases/ai-agent-database-setup.md`.
