# Trigger: push to github

**Say:** `push to github` (NOT deploy)

## Default target

Push **`user/<github-handle>/workspace`** (full full product) unless the user **explicitly** names another branch (e.g. a feature line). See `docs/handbook/06-user-branches-and-deploy-governance.md`.

## AI instructions

1. Confirm branch name and commit message with user.
2. Run leak scan (script includes it):

```bash
bash scripts/ops/git-push.sh \
  --project projects/{{APP_SLUG}} \
  -m "feat(scope): description"
```

3. State clearly: **GitHub updated; no staging/production deploy occurred.**
