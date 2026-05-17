# Oracle databases playbook

Tier **C** — full human setup required.

## Autonomous Database

1. `[console]` Create Autonomous DB `{{APP}}`
2. Download wallet zip — store outside git
3. Configure network access lists
4. Set `DATABASE_URL` per Oracle thin driver docs
5. Implement `oracle-autonomous.ts` adapter (replace stub)

## Agent rules

- Do not invent wallet paths or TNS names
- STOP until human confirms connectivity with SQL Developer or sqlplus

## MySQL HeatWave

Optional Oracle managed MySQL — treat as `mysql` provider with dedicated URL format.
