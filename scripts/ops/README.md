# Ops scripts

Agent- and human-friendly commands. **GitHub push ≠ deploy.**

Governance: default push `user/<handle>/workspace`; staging/prod only for `SUPERAPP_DEPLOY_OPERATOR_EMAIL` — see [docs/handbook/06-user-branches-and-deploy-governance.md](../../docs/handbook/06-user-branches-and-deploy-governance.md).

| Script | Purpose |
|--------|---------|
| `new-app.mjs` | Create `projects/<slug>/` locally |
| `github-bootstrap.sh` | Create repo + push (`--confirm`) |
| `stack-check.sh` | Doctor + `db:validate` |
| `stack-run.sh` | `pnpm dev` |
| `git-pull.sh` | `git pull --rebase` |
| `git-push.sh` | Commit + push + leak scan |
| `hosting-setup.sh` | Print playbook checklist |
| `deploy-staging.sh` | Staging gate (`--confirm` required) |
| `deploy-prod.sh` | Production gate (`--confirm` required) |

From a project copy (after init), same paths under `scripts/ops/`.

Prompts: [prompts/triggers/INDEX.md](../../prompts/triggers/INDEX.md)
