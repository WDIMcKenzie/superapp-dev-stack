# Security Policy

## Supported versions

This repository is documentation and templates only. Apply security practices to
projects you generate from `template/` or `samples/`.

## Reporting a vulnerability

Do **not** open a public issue for sensitive reports.

1. Open a private security advisory on GitHub (**Security** → **Advisories** → **Report a vulnerability**), or contact the maintainers through the repository’s GitHub profile — do not post secrets in issues.
2. Include steps to reproduce and impact assessment.
3. Allow reasonable time for a fix before disclosure.

## Public repo rules

- Never commit `.env`, API keys, connection strings, or customer data.
- Run `scripts/leak-scan.sh` before every push to a public remote.
- Use provider secret managers in staging and production (`[-stage env]`,
  `[-prod env]`).
- Rotate credentials if they were ever pasted into an AI chat session.

## Agent-assisted development

When using Cursor, Claude, or other agents:

- Do not paste production `DATABASE_URL` or admin tokens into prompts.
- Use `pnpm run db:validate` on local profiles only.
- Surface exact cloud commands for human approval before prod changes.
