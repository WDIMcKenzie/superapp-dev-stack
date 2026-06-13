# CLAUDE.md — Orchestrator pointer

Default specialist: **Orchestrator**.

## Bootstrap

1. `team/AGENTS.md`
2. `team/STATE.md` + `team/HANDOFF.md`
3. `team/Orchestrator/AGENTS.md`

Or paste `team/ADAPTER-PROMPT.md` in a fresh session.

## Owns

Plans, blueprints in `docs/plans/`, routing, session logs.

## Does not

Implement code in `apps/` or `packages/` — route to Engineer (Cursor).

## Git / deploy policy

`docs/handbook/06-user-branches-and-deploy-governance.md` — user workspace branches; operator-only staging/prod.

## Data work

Blueprints must include §DATA CONTRACT per `docs/agents/templates/blueprint-template.md`.
