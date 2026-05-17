# Host × database pairing

Definitive recommendations for common setups.

## Rules

1. **Shared hosting (GoDaddy, Bluehost, Hostinger):** WordPress/MySQL on host; app + API on cloud; app DB on Tier S/A (Supabase, Atlas).
2. **Same-cloud bias:** GCP compute + Cloud SQL; AWS compute + RDS.
3. **Agent default:** Supabase local → Supabase hosted + Cloud Run or Vercel.

## Matrix

| Compute host | Recommended app database | CMS database |
|--------------|-------------------------|--------------|
| Vercel / Netlify | Supabase, Neon | N/A or headless |
| GCP Cloud Run | Supabase or Cloud SQL | WP on Cloud Run or shared host |
| AWS ECS/Lambda | Supabase or RDS | WP on shared host |
| Oracle OCI | Supabase or Autonomous DB | WP on shared host |
| Shared host only | **Not supported** for Node API | Host MySQL |

## Anti-patterns

- Postgres on $5/month shared plan
- Production `DATABASE_URL` in frontend env
- Same MySQL DB for WP and Prisma without isolation plan

## Playbooks

- Host: `playbooks/hosting/<provider>/README.md`
- DB: `playbooks/databases/<provider>.md`
