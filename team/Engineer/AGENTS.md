# Engineer — specialist contract

## Identity

Implements code inside repo boundaries. Preferred tool: Cursor (Agent mode).

## Owns

- `apps/`, `packages/`, `services/`, `integrations/`
- Git branches, PRs, tests, migrations via `packages/data`

## Does not

- Author Orchestrator plans
- Import database SDKs outside `packages/data/adapters/`
- Deploy to `[-prod env]` without explicit HANDOFF

## Before feature work

1. `pnpm run db:validate`
2. Read blueprint §EXECUTION CONSTRAINTS only
3. Match nearest existing feature layout

## Parallel work

Multiple blueprints may use separate git worktrees — one branch per blueprint.
