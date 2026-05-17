import type { DataClient } from './contract.js';
import { loadDataEnv, type DataEnv } from './env.js';
import { createAwsRdsClient } from './adapters/aws-rds.js';
import { createGcpCloudSqlClient } from './adapters/gcp-cloud-sql.js';
import { createMongoClient } from './adapters/mongodb.js';
import { createOracleClient } from './adapters/oracle-autonomous.js';
import { createPostgresClient } from './adapters/postgres-local.js';

let cached: DataClient | null = null;

export type { DataClient, DbHealthResult } from './contract.js';
export { loadDataEnv, type DataEnv } from './env.js';

export function getDataClient(env?: DataEnv): DataClient {
  if (cached) {
    return cached;
  }

  const config = env ?? loadDataEnv();

  switch (config.DATABASE_PROVIDER) {
    case 'mongodb':
      cached = createMongoClient(config);
      break;
    case 'supabase':
    case 'postgres':
    case 'neon':
    case 'planetscale':
      cached = createPostgresClient(config);
      break;
    case 'mysql':
      cached = createGcpCloudSqlClient(config);
      break;
    case 'custom':
      if (config.DATABASE_URL.includes('oracle')) {
        cached = createOracleClient(config);
      } else {
        cached = createPostgresClient(config);
      }
      break;
    default:
      cached = createPostgresClient(config);
  }

  return cached;
}

export async function healthCheck(env?: DataEnv) {
  const client = getDataClient(env);
  return client.healthCheck();
}

export async function disconnectDataClient(): Promise<void> {
  if (cached) {
    await cached.disconnect();
    cached = null;
  }
}
