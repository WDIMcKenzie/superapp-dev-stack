# Publication checklist

Use before the first public push and before large doc imports.

## Never commit

- Real hostnames, SFTP URLs, cloud project IDs, customer names
- `.env` files with credentials
- Internal org program plans, DR runbooks, live STATE/HANDOFF content
- Coursework, resumes, or graded assignments from personal education folders

## Placeholders

Use consistently:

- `{{ORG}}`, `{{PROJECT}}`, `{{APP}}`
- `{{STAGING_URL}}`, `{{PROD_URL}}`
- `{{GCP_PROJECT}}`, `{{AWS_ACCOUNT}}`, `{{OCI_TENANCY}}`

## Automated scan

```bash
./scripts/leak-scan.sh
```

## Manual review

- [ ] README and playbooks contain no real URLs except `example.com` style
- [ ] Screenshots redacted or synthetic
- [ ] Git history does not contain secrets (use `git log -p` spot check)
- [ ] Agent prompts do not reference proprietary product names

## Agent sessions

If credentials were pasted into an AI tool, rotate them before publishing.
