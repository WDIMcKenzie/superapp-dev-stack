# Data and analytics (optional)

Use product metrics to inform architecture — not as a substitute for user research.

## Useful metrics

- Activation rate (first value action)
- Retention (D7, D30)
- API error rate and p95 latency
- Migration success rate

## Stack hooks

- Log structured events from API middleware
- Store aggregates in Postgres or warehouse (BigQuery, Redshift) via ETL
- Keep PII out of analytics pipelines unless compliant

## Agent note

When building dashboards, specify §DATA CONTRACT for any new tables or views.
