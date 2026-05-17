# ai-tooling-demo sample

Demonstrates agent configuration for a new feature.

## Files to copy into your project

- `.cursor/rules/example-feature.mdc` (below)
- `docs/plans/example-blueprint.md` from template

## Example Cursor rule

Create `.cursor/rules/example-feature.mdc`:

```markdown
---
description: Example feature constraints
alwaysApply: false
---

# Example feature

- Read docs/plans/example-blueprint.md before editing
- Run pnpm run db:validate before API changes
```

## Blueprint

Copy [docs/agents/templates/blueprint-template.md](../../docs/agents/templates/blueprint-template.md) to `docs/plans/example-blueprint.md` and fill §DATA CONTRACT.

## Session init

Paste `team/ADAPTER-PROMPT.md` in Cursor, then assign Engineer to implement one §section.
