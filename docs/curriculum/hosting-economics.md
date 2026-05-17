# Hosting economics

Decision factors when choosing host + database:

| Factor | Question |
|--------|----------|
| Cost | Monthly fixed vs usage-based |
| Control | SSH, containers, managed only |
| Compliance | Data residency, HIPAA, PCI |
| Team skill | Familiarity with AWS vs GCP vs shared panel |
| AI ergonomics | MCP/CLI available? (see database tiers) |
| Traffic | Serverless vs always-on VM |

## Heuristics

- **Learners / MVPs:** Supabase + Vercel or Cloud Run (Tier S)
- **Enterprise IAM:** GCP/AWS managed SQL (Tier B)
- **Marketing site only:** shared WordPress host
- **Full product:** never host Postgres on $5 shared hosting

See [../hosting/database-host-pairing.md](../hosting/database-host-pairing.md).
