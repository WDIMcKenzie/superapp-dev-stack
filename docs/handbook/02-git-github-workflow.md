# Git and GitHub workflow

## Branch model

```
feature/<scope>-<desc>  →  develop  →  main
```

- **feature/** — daily work
- **develop** — integration / staging deploys
- **main** — production-ready line

## Daily commands

```bash
git checkout -b feature/{{APP}}-my-feature
# ... work ...
git add .
git commit -m "feat(scope): description"
git push -u origin HEAD
```

Open PR on `[github]` targeting `develop`.

## Conventional commits

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `ci`.

## PR checklist

- [ ] `pnpm test` passes
- [ ] `pnpm run db:validate` if data layer touched
- [ ] No secrets in diff
- [ ] Location tags in PR description for deploy steps

## GitHub setup

1. Create org or personal account with 2FA.
2. Create empty repo `{{ORG}}/{{APP}}`.
3. `[local-repo]` `git remote add origin git@github.com:{{ORG}}/{{APP}}.git`

## Site-only branches (WordPress)

Use prefix `site/{{APP}}-*` and label `layer:wp-site` on PRs.
