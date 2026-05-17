# Location tags and vocabulary

Use on every multi-step operational instruction.

## Tags

| Tag | Use for |
|-----|---------|
| `[local-tree]` | Edit files in repo on disk |
| `[local-repo]` | git commit, branch, merge locally |
| `[github]` | PR, merge on GitHub, Actions |
| `[-local env]` | docker, pnpm dev, local DB |
| `[-staging env]` | staging host or cloud |
| `[-prod env]` | production — gate required |

## Ambiguous words

| Word | Clarify |
|------|---------|
| merge | git merge vs PR merge |
| push | git push vs image push |
| staging | git staged files vs staging environment |
| branch | git branch vs database branch |

## Product naming (your project)

Use `{{APP}}-<env>` for folders and services, e.g. `myapp-local`, `myapp-api-staging`.

Avoid bare service names without env suffix in cloud consoles.
