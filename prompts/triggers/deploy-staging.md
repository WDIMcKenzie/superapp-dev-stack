# Trigger: deploy staging

**Say:** `deploy staging` — user must explicitly request staging

## Gate

**Do not run** unless:

1. The user has said they want **staging** traffic/deployment, **and**
2. They are the **deploy operator** (`SUPERAPP_DEPLOY_OPERATOR_EMAIL` / profile `deployOperatorEmail`), **or** you are documenting steps for them to run.

Contributors push `user/<handle>/workspace` and open a PR — they do **not** deploy staging.

Policy: `docs/handbook/06-user-branches-and-deploy-governance.md`.

```bash
bash scripts/ops/deploy-staging.sh \
  --project projects/{{APP_SLUG}} \
  --host gcp \
  --confirm
```

Without `--confirm`, the script exits (by design).

AI: print playbook steps; execute provider CLI only when user approves each gate.
