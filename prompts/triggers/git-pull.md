# Trigger: pull latest

**Say:** `pull latest` or `sync from github`

```bash
bash scripts/ops/git-pull.sh --project projects/{{APP_SLUG}}
```

Optional branch: `--branch develop`

Report commits pulled or "already up to date".
