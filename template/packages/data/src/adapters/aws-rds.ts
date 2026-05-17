import type { DataClient } from '../contract.js';
import type { DataEnv } from '../env.js';
import { createPostgresClient } from './postgres-local.js';

/**
 * AWS RDS (Postgres) — connection via Secrets Manager-injected DATABASE_URL.
 * See playbooks/databases/aws-databases.md
 */
export function createAwsRdsClient(env: DataEnv): DataClient {
  return createPostgresClient({ ...env, DATABASE_PROVIDER: 'postgres' });
}
