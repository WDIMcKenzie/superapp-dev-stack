# Trigger: setup hosting

**Say:** `setup hosting for gcp` (or aws, oracle, godaddy, bluehost, hostinger)

## Goal

Read playbook checklist — **configure** cloud/host account, secrets, DNS prep. **No live deploy.**

```bash
bash scripts/ops/hosting-setup.sh \
  --host gcp \
  --project projects/{{APP_SLUG}} \
  --open
```

AI: turn playbook into a numbered checklist with location tags `[local-tree]`, `[github]`, `[-stage env]`. Wait for user confirmation before any `[-stage env]` or `[-prod env]` command.
