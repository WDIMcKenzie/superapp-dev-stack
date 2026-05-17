# Codex and CI agents

`CODEX.md` points Engineers at repo contracts.

## CI checklist

```yaml
# Suggested steps
- pnpm install
- pnpm run lint
- pnpm test
- pnpm run db:validate  # with CI test DATABASE_URL
- ./scripts/leak-scan.sh
```

Use GitHub Actions secrets for `DATABASE_URL` in staging deploy jobs — never in logs.
