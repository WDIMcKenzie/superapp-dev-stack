# Example webhook

Implement handlers in `services/api` routes:

- Verify signature header
- Idempotent processing (store event IDs)
- Return 2xx quickly; queue heavy work

See `docs/agents/templates/blueprint-template.md` for planning webhook features.
