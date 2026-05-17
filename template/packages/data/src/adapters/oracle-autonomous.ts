import type { DataClient, DbHealthResult } from '../contract.js';
import type { DataEnv } from '../env.js';

/**
 * Oracle Autonomous DB requires oracledb driver and wallet files.
 * Install optional dependency and implement per playbooks/databases/oracle-databases.md
 */
export function createOracleClient(env: DataEnv): DataClient {
  return {
    provider: 'custom',

    async healthCheck(): Promise<DbHealthResult> {
      return {
        ok: false,
        provider: 'oracle',
        latencyMs: 0,
        message:
          'Oracle adapter stub: install oracledb and configure wallet per playbook',
      };
    },

    async disconnect(): Promise<void> {
      void env;
    },
  };
}
