# WordPress and shared hosting

## Split stack

| Layer | Where it runs |
|-------|----------------|
| WordPress + Woo | Shared host MySQL (GoDaddy, Bluehost, Hostinger) |
| Modern app + API | Cloud compute + Tier S/A database |

Do not expect Node.js + Postgres on basic shared plans.

## Workflow

1. `[local-tree]` Edit `sites/wordpress-site/`
2. `[local-tree]` `cp sites/wordpress-site/.env.example sites/wordpress-site/.env`
3. `[local-tree]` Run push script (see `playbooks/hosting/godaddy/README.md`)
4. Browser verify `{{STAGING_URL}}`
5. `[github]` PR `site/{{APP}}-*` — staging/prod push is deploy-operator only, see [handbook §06](../handbook/06-user-branches-and-deploy-governance.md)

## Plugins

Install via WP admin zip — not mixed into theme SFTP tree unless documented.
