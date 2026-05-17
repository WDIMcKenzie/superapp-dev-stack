# Trigger: push to github

**Say:** `push to github` (NOT deploy)

## AI instructions

1. Confirm commit message with user.
2. Run leak scan (script includes it):

```bash
bash scripts/ops/git-push.sh \
  --project projects/{{APP_SLUG}} \
  -m "feat(scope): description"
```

3. State clearly: **GitHub updated; no staging/production deploy occurred.**
