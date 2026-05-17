# Project layout

Every app uses the **same folder set** so humans and AI agents always know where code lives.

## Workspace

| Choice | Meaning |
|--------|---------|
| `projects/` in curriculum repo | Default for learning — `superapp-dev-stack/projects/<slug>/` |
| Sibling `superapp-projects/` | Apps outside the clone, still one folder per app |
| Custom workspace | Any path you pick — each app is `<workspace>/<slug>/` |

Nothing in the wizard assumes a specific home directory or username.

## Inside each project

```
<app-slug>/
├── apps/web-local/          # Next.js UI
├── services/api/            # HTTP API
├── packages/core/           # Shared types and logic
├── packages/data/           # Database adapters
├── packages/ui/             # Shared UI
├── sites/wordpress-site/    # Optional WP track
├── team/                    # Agent STATE, HANDOFF, SOPs
├── scripts/                 # db:up, validate, switch-provider
├── .superapp/               # Init profile + copied AI prompts
├── .env.local               # Local secrets (gitignored)
└── AI-START-HERE.md         # First message for your AI tools
```

## Commands (always from project root)

```bash
pnpm install
pnpm run db:up
pnpm run db:validate
pnpm dev
```
