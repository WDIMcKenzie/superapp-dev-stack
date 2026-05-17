# GCP hosting playbook

## When to choose

- Cloud Run for containerized APIs and web
- Native integration with Cloud SQL
- Pay-per-use scaling

## Account setup

1. Create GCP project `{{GCP_PROJECT}}`
2. Enable Cloud Run, Artifact Registry, Secret Manager APIs
3. Create service account per environment (`{{APP}}-staging-runner`, `{{APP}}-prod-runner`)

## Workflow

1. `[local-tree]` Build and test locally
2. `[github]` Merge to `develop` → deploy `[-staging env]`
3. Verify `{{STAGING_URL}}`
4. Gated promote to `[-prod env]`

## Database pairing

Prefer [Cloud SQL](../../databases/gcp-databases.md) or hosted Supabase.

## Secrets

Store in Secret Manager; mount as env on Cloud Run — no plaintext in YAML.

## Agent workflow

- Engineer prepares Dockerfile and deploy YAML
- Human runs `gcloud run deploy` for prod

## Troubleshooting

- 403: check IAM on service account
- DB connection: verify Cloud SQL connector / VPC
