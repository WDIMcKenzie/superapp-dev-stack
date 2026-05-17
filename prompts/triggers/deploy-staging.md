# Trigger: deploy staging

**Say:** `deploy staging` — user must explicitly request staging

## Gate

**Do not run** unless the user has said they want **staging** traffic/deployment.

```bash
bash scripts/ops/deploy-staging.sh \
  --project projects/{{APP_SLUG}} \
  --host gcp \
  --confirm
```

Without `--confirm`, the script exits (by design).

AI: print playbook steps; execute provider CLI only when user approves each gate.
