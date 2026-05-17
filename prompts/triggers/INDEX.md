# AI prompt triggers

Say the **trigger phrase** to your AI (Cursor, Claude, etc.) after pasting `team/ADAPTER-PROMPT.md`.
The AI should run the **script** from the curriculum repo or your project folder — not improvise deploy commands.

| Trigger phrase | Script | Deploys live? |
|----------------|--------|---------------|
| **create new app** | `node scripts/ops/new-app.mjs` | No |
| **bootstrap github** | `bash scripts/ops/github-bootstrap.sh --confirm` | No (GitHub only) |
| **check the stack** | `bash scripts/ops/stack-check.sh` | No |
| **run the stack** | `bash scripts/ops/stack-run.sh` | No (local only) |
| **pull latest** | `bash scripts/ops/git-pull.sh` | No |
| **push to github** | `bash scripts/ops/git-push.sh -m "..."` | No |
| **setup hosting** | `bash scripts/ops/hosting-setup.sh --host <id>` | No |
| **deploy staging** | `bash scripts/ops/deploy-staging.sh --confirm` | Only after `--confirm` |
| **deploy production** | `bash scripts/ops/deploy-prod.sh --confirm` | Only after `--confirm` |
| **leak scan** | `bash scripts/leak-scan.sh` | No |
| **run tests** | `pnpm test` (in project) | No |
| **switch database** | `pnpm run db:switch` (in project) | No |

Detailed prompts: one file per trigger in this folder.

## Rules for every AI

1. **Never** deploy to staging or production without the user saying deploy explicitly and passing `--confirm`.
2. **GitHub push** is allowed when asked; that is not a live deploy.
3. Use **project-relative** paths: `projects/<app-slug>/`, not home directory paths.
4. Run **leak-scan** before any public GitHub push.
5. Prefer scripts over hand-written `gcloud` / `aws` / SFTP unless the playbook step requires it.
