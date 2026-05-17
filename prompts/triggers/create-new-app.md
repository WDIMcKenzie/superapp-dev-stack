# Trigger: create new app

**Say:** `create new app` or `spin up a new SuperApp project`

## Goal

New folder under `projects/<slug>/` with full local stack. **No GitHub, no staging, no production.**

## AI instructions

1. Ask for: app name, database (`postgres` | `supabase` | `mongodb`), target host playbook id (for profile only).
2. From **curriculum repo root**, run:

```bash
node scripts/ops/new-app.mjs \
  --name "{{APP_NAME}}" \
  --db postgres \
  --host local-only
```

3. Report the JSON output `projectPath` and tell the user to open `AI-START-HERE.md`.
4. Offer **bootstrap github** as a separate step — do not run it unless asked.

## Optional interactive wizard

```bash
pnpm run init
```
