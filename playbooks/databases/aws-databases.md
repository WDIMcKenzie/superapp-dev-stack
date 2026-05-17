# AWS databases playbook

Tier **B**.

## Options

| Product | Use case |
|---------|----------|
| RDS Postgres/Aurora | Primary relational |
| DynamoDB | Key-value at scale |
| DocumentDB | Mongo-compatible managed |

## RDS + ECS/Lambda

1. Create RDS instance in private subnet
2. Store credentials in AWS Secrets Manager
3. Inject `DATABASE_URL` into task definition / Lambda env from secret
4. Use adapter `aws-rds.ts`

## DynamoDB

Not covered by default `@superapp/data` adapter — add custom adapter if required.

## Agent STOP gates

- No hardcoded `AKIA*` keys
- Human approves security group changes

See `playbooks/hosting/aws/README.md`.
