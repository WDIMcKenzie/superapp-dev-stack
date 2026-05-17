# Trigger: run the stack

**Say:** `run the stack` or `start local dev`

## AI instructions

```bash
bash scripts/ops/stack-run.sh --project projects/{{APP_SLUG}}
```

Or from project root: `pnpm dev`

- Web: http://localhost:4000
- API: http://localhost:8080

Run in background only if the user's environment supports it; otherwise tell them to run in a terminal tab.
