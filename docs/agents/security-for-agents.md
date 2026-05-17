# Security for agents

- Never commit or paste secrets into prompts.
- Use `{{STAGING_URL}}` placeholders in docs.
- Run `scripts/leak-scan.sh` before public push.
- Prod deploys: STOP and show exact command for human approval.
- Rotate credentials if exposed in chat logs.

See `docs/security/publication-checklist.md`.
