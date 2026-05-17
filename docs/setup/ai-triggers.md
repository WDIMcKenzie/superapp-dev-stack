# AI triggers and ops scripts

SuperApp is designed so **you or your AI say a short phrase** and a **script** does the work — with clear rules about what never runs automatically.

## Safety model

| Action | Allowed without extra gate? |
|--------|---------------------------|
| Create local project folder | Yes |
| Install deps, start Docker DB, `pnpm dev` | Yes |
| Push to GitHub | Yes (after leak scan) |
| Hosting playbook checklist | Yes (read-only) |
| **Staging deploy** | **No** — needs `deploy staging` + `--confirm` |
| **Production deploy** | **No** — needs `deploy production` + `--confirm` |

GitHub is **not** a live deploy. Staging/production only run when you explicitly ask.

## Trigger index

See [prompts/triggers/INDEX.md](../../prompts/triggers/INDEX.md).

After `pnpm run init`, your project also has copies under `.superapp/ai/triggers/` with `{{APP_SLUG}}` filled in.

## Running from curriculum vs project

**Curriculum repo** (this clone):

```bash
node scripts/ops/new-app.mjs --name my-app
bash scripts/ops/stack-check.sh --project projects/my-app
```

**Inside a project** (after init):

```bash
cd projects/my-app
pnpm run ops:check
pnpm run ops:run
bash scripts/ops/git-push.sh -m "feat: example"
```

## Typical flows

### New app → GitHub (no cloud)

1. User: **create new app**
2. AI runs `new-app.mjs`
3. User: **bootstrap github**
4. AI runs `github-bootstrap.sh --confirm` with org/repo

### Later: staging (explicit)

1. User: **setup hosting for gcp**
2. AI runs `hosting-setup.sh --host gcp`
3. User: **deploy staging** (explicit)
4. AI runs `deploy-staging.sh --confirm` and walks playbook gates

## Adding triggers

1. Add script under `scripts/ops/`
2. Add row to `prompts/triggers/INDEX.md`
3. Add `prompts/triggers/your-trigger.md` with phrase + command
4. List file in `scripts/init/ide-setup.mjs` copy list
