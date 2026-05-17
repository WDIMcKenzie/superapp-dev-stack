import type { DataClient } from '../contract.js';
import type { DataEnv } from '../env.js';
import { createPostgresClient } from './postgres-local.js';

/**
 * GCP Cloud SQL uses Postgres wire protocol.
 * Set DATABASE_URL to the Cloud SQL Auth Proxy or private IP connection string.
 * See playbooks/databases/gcp-databases.md
 */
export function createGcpCloudSqlClient(env: DataEnv): DataClient {
  return createPostgresClient({ ...env, DATABASE_PROVIDER: 'postgres' });
}
