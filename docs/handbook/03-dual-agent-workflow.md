# Dual-agent workflow

## Roles

| Role | Tool examples | Responsibility |
|------|---------------|----------------|
| **Architect / Orchestrator** | Claude, ChatGPT (planning) | Blueprints, routing, STOP gates |
| **Engineer** | Cursor Agent | Code, tests, migrations |

## Five-specialist team

Orchestrator routes to Engineer, Creative, Researcher, Quality. See `team/agent-index.md`.

## Session flow

1. User → Orchestrator
2. Orchestrator writes brief or HANDOFF
3. Engineer implements with `db:validate` + tests
4. Quality reviews PR
5. Orchestrator updates STATE and session log

## When Engineer must STOP

- No blueprint for non-trivial work
- Blueprint conflicts with repo
- `[-staging env]` or `[-prod env]` deploy requested by a non-operator (push `user/<handle>/workspace` + PR instead)
- `[-prod env]` deploy without operator and explicit approval
- `db:validate` fails

Git/deploy policy: [06-user-branches-and-deploy-governance.md](./06-user-branches-and-deploy-governance.md).

## Blueprint location

`docs/plans/` in your app repo, or `docs/agents/templates/blueprint-template.md` to start.
