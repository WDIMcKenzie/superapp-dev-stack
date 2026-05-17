# Trigger: bootstrap github

**Say:** `bootstrap github` or `create github repo and push` (NOT deploy)

## Goal

`[github]` empty repo + `[local-repo]` initial push. **Does not** touch staging or production.

## AI instructions

1. Confirm: GitHub org/user, repo name, public vs private.
2. Require user to say **yes, push to github** (explicit).
3. From curriculum repo (or project with ops scripts):

```bash
bash scripts/ops/github-bootstrap.sh \
  --project projects/{{APP_SLUG}} \
  --org {{GITHUB_ORG}} \
  --repo {{REPO_NAME}} \
  --confirm
```

Add `--private` if needed.

4. Remind: live/staging deploy is a **different** trigger (`deploy staging`).
