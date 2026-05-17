# Trigger: check the stack

**Say:** `check the stack` or `doctor` or `is everything working`

## AI instructions

```bash
# Curriculum tools
bash scripts/ops/stack-check.sh

# Include project
bash scripts/ops/stack-check.sh --project projects/{{APP_SLUG}}

# With tests
bash scripts/ops/stack-check.sh --project projects/{{APP_SLUG}} --test
```

Summarize: pass/fail per step, one fix list. Do not change code unless asked.
