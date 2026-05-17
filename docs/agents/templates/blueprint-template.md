# Blueprint: {{TITLE}}

ID: BP-{{NNN}}
Owner: Orchestrator
Engineer: Cursor

## §GOAL

One paragraph outcome.

## §SCOPE

In scope / out of scope.

## §DATA CONTRACT

- **Provider:** `DATABASE_PROVIDER` value
- **Entities:** list tables/collections
- **Env vars:** names only (no values)
- **Adapters:** paths under `packages/data/src/adapters/`
- **Migrate:** exact command
- **Rollback:** how to revert migration

## §FILE TREE

```
paths/to/create/or/edit
```

## §EXECUTION CONSTRAINTS

- Must use `@superapp/data`
- Must pass `db:validate` and tests
- Forbidden patterns

## §VERIFICATION

- [ ] `pnpm run db:validate`
- [ ] `pnpm test`
- [ ] Manual check: ...

## §STOP GATES

- Prod deploy requires user approval
- ...
