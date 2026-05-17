# GCP databases playbook

Tier **B**.

## Options

| Product | Use case |
|---------|----------|
| Cloud SQL (Postgres) | Default relational on GCP |
| Firestore | Mobile/real-time document |
| Spanner | Global scale relational |

## Cloud SQL + Cloud Run

1. `[console]` Create Cloud SQL instance `{{APP}}-db-staging`
2. Enable Cloud SQL Auth Proxy locally for migrations
3. `DATABASE_URL` via secret `{{APP}}-database-url-staging`
4. Adapter: `gcp-cloud-sql.ts` (Postgres protocol)

## AI agent notes

- Human provides project ID and connection string
- Engineer runs exact `gcloud sql` commands from HANDOFF only
- Document proxy invocation in PR description

See `playbooks/hosting/gcp/README.md`.
