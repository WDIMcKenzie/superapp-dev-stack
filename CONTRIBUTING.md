# Contributing

Thank you for improving SuperApp Dev Stack.

## Before you open a PR

1. Run `scripts/leak-scan.sh` — must pass with no proprietary strings.
2. Use placeholders: `{{ORG}}`, `{{PROJECT}}`, `{{STAGING_URL}}`, etc.
3. Follow conventional commits: `type(scope): description`.
4. Keep docs actionable: numbered steps with location tags where relevant.

## Scope

- **In scope:** handbook improvements, playbooks, agent templates, template monorepo fixes.
- **Out of scope:** proprietary org configs, real hostnames, credentials, internal DR plans.

## Branch naming

- `docs/<topic>`
- `feat/<topic>`
- `fix/<topic>`

## Code in `template/`

- TypeScript strict; no `any` in public exports.
- Database access only via `@superapp/data`.
- Add tests for behavior changes.
