# Trigger: deploy production

**Say:** `deploy production` or `go live` — highest gate

## Gate

Require explicit user approval for **production**. Staging should be verified first.

```bash
bash scripts/ops/deploy-prod.sh \
  --project projects/{{APP_SLUG}} \
  --host gcp \
  --confirm
```

AI: list rollback plan from playbook before any prod command. Never batch through gates.
