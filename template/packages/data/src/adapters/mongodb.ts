import { MongoClient } from 'mongodb';
import type { DataClient, DbHealthResult } from '../contract.js';
import type { DataEnv } from '../env.js';

export function createMongoClient(env: DataEnv): DataClient {
  const client = new MongoClient(env.DATABASE_URL);

  return {
    provider: 'mongodb',

    async healthCheck(): Promise<DbHealthResult> {
      const start = Date.now();
      try {
        await client.connect();
        await client.db().command({ ping: 1 });
        return {
          ok: true,
          provider: 'mongodb',
          latencyMs: Date.now() - start,
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        return {
          ok: false,
          provider: 'mongodb',
          latencyMs: Date.now() - start,
          message,
        };
      }
    },

    async disconnect(): Promise<void> {
      await client.close();
    },
  };
}
