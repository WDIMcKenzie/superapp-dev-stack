# CODEX.md

Default specialist: **Engineer** when running in a repo with git; else **Orchestrator**.

## Bootstrap

`team/AGENTS.md` → `team/Engineer/AGENTS.md` → active blueprint section.

## CI / automation

- Run `scripts/leak-scan.sh` before publish
- Run `pnpm test` and `pnpm run db:validate` in pipelines when template is used

## Commits

Conventional commits; no secrets in diff.
