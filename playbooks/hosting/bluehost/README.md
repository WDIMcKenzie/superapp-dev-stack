# Bluehost hosting playbook

## When to choose

Managed WordPress similar to GoDaddy; often bundled with caching plugins.

## Split stack

- WordPress on Bluehost MySQL
- App + API on cloud + Supabase/RDS

## Workflow

Same as [GoDaddy](../godaddy/README.md): edit `sites/wordpress-site/` → SFTP staging → verify → PR.

## Cache

After theme deploy, flush endurance/page cache if installed (hosting panel or plugin).

## Staging

Use host-provided staging subdomain when available.
