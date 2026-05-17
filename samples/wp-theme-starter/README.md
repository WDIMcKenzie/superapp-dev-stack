# wp-theme-starter sample

Copy `template/sites/wordpress-site/themes/` structure:

```
themes/{{APP}}-child/
  style.css
  functions.php
```

Push via playbook:

```bash
# Fill .env from .env.example first
bash scripts/hosting/push-staging.sh   # from your project copy
```

See [playbooks/hosting/godaddy/README.md](../../playbooks/hosting/godaddy/README.md).
