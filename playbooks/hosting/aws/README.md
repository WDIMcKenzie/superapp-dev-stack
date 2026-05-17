# AWS hosting playbook

## When to choose

- Amplify for frontend + API
- ECS/Fargate for long-running services
- RDS for managed Postgres

## Account setup

1. AWS account `{{AWS_ACCOUNT}}`
2. IAM user/role with least privilege
3. Secrets Manager for `DATABASE_URL`

## Workflow

1. Local dev `[-local env]`
2. Deploy staging via Amplify or ECS
3. Run smoke tests on staging URL
4. Promote to prod with change window

## Database

See [aws-databases.md](../../databases/aws-databases.md).

## Agent STOP gates

- No `AKIA` keys in repo
- Human approves security group / IAM changes

## Troubleshooting

- Lambda timeout: increase timeout or move to ECS
- CORS: configure API Gateway / CloudFront headers
