# Trigger: run tests

**Say:** `run tests`

From project root `projects/{{APP_SLUG}}/`:

```bash
pnpm test
pnpm run db:validate   # if data layer touched
```

Report pass/fail counts; fix only if user asked.
