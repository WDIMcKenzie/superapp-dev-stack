# Git and GitHub workflow

> **Canonical policy:** [06-user-branches-and-deploy-governance.md](./06-user-branches-and-deploy-governance.md)

## Branch model

Per developer (default):

```text
user/<github-handle>/workspace     ← full product snapshot (daily work + AI default push)
user/<github-handle>/feature/...  ← only when explicitly scoped
```

Shared lines:

```text
user/*/workspace  →  PR  →  develop  →  [operator] staging  →  [operator] main / prod
```

- **`user/<handle>/workspace`** — work on workspace locally, push for backup and review
- **`develop`** — team integration; staging deploys from here **after review**. Set this as the **repository default branch** so new PRs and new AI/IDE worktrees (Claude Code threads, Cursor, etc.) base off the team line automatically instead of `main`.
- **`main`** — production-ready line

Legacy root **`feature/*`** is discouraged for routine work. Use `user/<handle>/workspace` instead.

## Daily commands

```bash
# [local-repo] create or use your workspace branch
git checkout -b user/{{GITHUB_HANDLE}}/workspace   # first time only

# ... work on [-local env] ...

git add .
git commit -m "feat(scope): description"

# [local-repo → github] backup only — no cloud deploy
bash scripts/ops/git-push.sh --project projects/{{APP_SLUG}} -m "feat(scope): description"
# or: git push -u origin user/{{GITHUB_HANDLE}}/workspace
```

Open PR on `[github]` targeting **`develop`**.

### Explicit feature branch (optional)

Only when you said you want a narrow branch:

```bash
git checkout -b user/{{GITHUB_HANDLE}}/feature/my-experiment
git push -u origin HEAD
```

Tell your AI: “push **only** this feature branch, not my workspace branch.”

## Conventional commits

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `ci`.

## PR checklist

- [ ] `pnpm test` passes
- [ ] `pnpm run db:validate` if data layer touched
- [ ] No secrets in diff
- [ ] Location tags in PR description for deploy steps
- [ ] Target branch is `develop` (not direct to `main` for feature work)

## GitHub setup

1. Create org or personal account with 2FA.
2. Create empty repo `{{ORG}}/{{APP}}`.
3. `[local-repo]` `git remote add origin git@github.com:{{ORG}}/{{APP}}.git`
4. Set the **default branch to `develop`** so PRs and new AI/IDE worktrees base off the team line:
   `gh repo edit {{ORG}}/{{APP}} --default-branch develop` then `git remote set-head origin develop`. Keep `main` as the protected release line.
5. Set repo variable / profile **`deployOperatorEmail`** and **`deployOperatorGithub`** per §06.

## Site-only branches (WordPress)

Use `user/<handle>/workspace` for full site work, or `user/<handle>/feature/site-*` when explicitly scoped. Label `layer:wp-site` on PRs.

## Internal teams

Organizations running this stack internally use the same model in their own monorepo (`{{ORG}}/{{APP}}`) with their designated deploy operator. Keep the internal handbook aligned with this public curriculum (§06).
