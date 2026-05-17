# Hostinger hosting playbook

## When to choose

Budget managed WordPress with hPanel.

## Setup

1. hPanel → Websites → Staging
2. SFTP credentials from panel
3. `{{STAGING_URL}}` from staging tool

## Workflow

1. Local edits under `sites/wordpress-site/`
2. SFTP or File Manager upload
3. Browser verify staging
4. PR → gated prod

## App database

Use [Supabase](../../databases/supabase.md) or [MongoDB](../../databases/mongodb.md) off-host.

## Limitations

- No native Node Postgres on entry plans
- WP-CLI may be limited — prefer panel tools
