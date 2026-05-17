# GoDaddy hosting playbook (detailed)

Optimized for **managed WordPress** + **split stack** modern apps.

## When to choose

- Marketing / WooCommerce site on managed WordPress
- Staging subdomain on GoDaddy (host-provided staging URL or custom subdomain)

## What runs where

| Component | Host |
|-----------|------|
| WordPress, themes, plugins | GoDaddy staging → prod |
| Next.js app + API | Cloud (Vercel, Cloud Run, etc.) |
| App database | Supabase or Atlas (Tier S/A) |

Do not run Node Postgres on basic shared hosting.

## Account setup

1. GoDaddy account with 2FA
2. Managed WordPress plan with **staging**
3. SFTP/SSH credentials from hosting panel
4. Optional: add SSH public key in cPanel

## Local folder layout

```
sites/wordpress-site/
├── themes/{{APP}}-child/
└── plugins/   # only if versioned in git
```

## Daily workflow

1. **[local-tree]** Edit files under `sites/wordpress-site/`
2. **[local-tree]** `cp sites/wordpress-site/.env.example sites/wordpress-site/.env`
3. **[local-tree]** Fill `STAGING_SFTP_*` (gitignored)
4. **[local-tree]** Run push script (from `scripts/hosting/push-staging.sh.template`)
5. **Browser** Open `{{STAGING_URL}}` — verify pages, checkout, forms
6. **[local-repo]** Branch `site/{{APP}}-<feature>`
7. **[github]** PR with label `layer:wp-site`

## SFTP push pattern

```bash
# Example — adapt to your credential helper
rsync -avz --exclude '.env' \
  sites/wordpress-site/themes/ \
  "$STAGING_USER@$STAGING_HOST:$STAGING_REMOTE_PATH/"
```

Use `lftp` or GoDaddy File Manager if rsync unavailable.

## WP-CLI (optional)

If SSH works on staging:

```bash
wp @staging plugin list
wp @staging cache flush
```

Define `@staging` in `wp-cli.yml` pointing at SSH host — never commit passwords in yml.

## Plugins not via SFTP

Install zip uploads through WP admin:

- Custom bridge plugins
- Premium plugins from vendor zips

Keep them out of the theme sync tree unless your runbook says otherwise.

## Pairing with local SaaS app

When testing Woo ↔ API bridge:

1. **[local-tree]** `pnpm dev` for web + API `[-local env]`
2. **[local-tree]** Env block for Woo URL + bridge secret only (from Orchestrator HANDOFF)
3. **[-staging env]** WordPress staging must have matching plugin + secret

Do not point full local app DB at production.

## Production promotion (gated)

1. Staging sign-off checklist complete
2. Orchestrator HANDOFF authorizes prod
3. Promote WP (host panel or host-specific tool)
4. Deploy app `[-prod env]` separately
5. Smoke test `{{PROD_URL}}`

## Decision tree (hosting support patterns)

```
Need Node API on same host as WP?
├─ No → split stack (recommended)
└─ Yes → upgrade to VPS plan or move API to cloud

Need Postgres?
├─ Use Supabase/RDS off-host
└─ Never on basic shared plan

Daily content edits only?
└─ Staging SFTP loop is enough
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| SFTP connection refused | Verify IP allowlist, port 22 vs 21 |
| White screen | Enable `WP_DEBUG_LOG` on staging only |
| Plugin update broke staging | Restore from host backup; fix in git first |
| Slow push | Exclude `node_modules`, uploads folder if not versioned |
| SSL mixed content | Fix `siteurl`/`home` on staging |

## Agent workflow

- **Engineer:** file edits + push script + PR
- **Orchestrator:** scope HANDOFF, prod gate
- **Quality:** visual check on staging URL before merge

## Related

- [wordpress-mysql.md](../../databases/wordpress-mysql.md)
- [database-host-pairing.md](../../../docs/hosting/database-host-pairing.md)
- [shared-hosting-comparison.md](../shared-hosting-comparison.md)
