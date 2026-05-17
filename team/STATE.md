# STATE.md — team truth (template)

> Cap 150 lines. Replace placeholders when you start a real project.

## Project

- **Name:** {{PROJECT}}
- **Repo:** {{ORG}}/{{APP}}
- **Phase:** Not started

## Active work

- None

## Environment policy

- App: `[-local env]` for daily dev
- CMS site (if any): remote staging only
- Cloud deploy: release-gated

## Database

- **Provider:** `supabase` (local) — see `docs/databases/00-data-contract.md`
- **Validate:** `pnpm run db:validate` must pass before feature work

## Open items

- [ ] Copy `template/` to your app repo
- [ ] Fill `team/STATE.md` with real project name
- [ ] Run first `pnpm run db:up`

## Last updated

- Template · not yet initialized
