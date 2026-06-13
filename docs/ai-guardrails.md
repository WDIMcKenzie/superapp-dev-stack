# AI Guardrails (General/Public Stack)

This repo uses lightweight guard scripts so agents and operators do not push
from wrong locations or with unsafe remotes.

## Commands

- `pnpm guard:repo` — fast repo safety check
- `pnpm guard:agent-start` — startup checklist for each new thread/agent

## Safety checks

- confirms current directory is a git repo
- blocks credential-embedded GitHub remote URLs
- ensures owner is in allowed list (`WDIMcKenzie`, `welldoitsolutions`)
- prints branch/remote/dirty summary for human review
