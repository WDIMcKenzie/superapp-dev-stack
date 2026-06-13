# Trigger: deploy production

**Say:** `deploy production` or `go live` — highest gate

## Gate

Require explicit user approval for **production**. Staging should be verified first.

**Deploy operator only** — same as staging (`docs/handbook/06-user-branches-and-deploy-governance.md`). Non-operators stop after PR merge to `develop`.

```bash
bash scripts/ops/deploy-prod.sh \
  --project projects/{{APP_SLUG}} \
  --host gcp \
  --confirm
```

AI: list rollback plan from playbook before any prod command. Never batch through gates.
