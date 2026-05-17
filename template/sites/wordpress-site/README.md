# WordPress site (versioned assets)

Edit themes/plugins here; push to `[-staging env]` on your host.

## Setup

```bash
cp .env.example .env
# Fill {{STAGING_SFTP_*}} — never commit .env
```

## Push

See `playbooks/hosting/godaddy/README.md` or your host playbook.

## Split stack

WordPress MySQL stays on the host. Your SaaS app uses `@superapp/data` on Supabase/RDS/etc.
