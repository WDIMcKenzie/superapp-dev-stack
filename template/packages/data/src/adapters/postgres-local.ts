import { PrismaClient } from '@prisma/client';
import type { DataClient, DbHealthResult } from '../contract.js';
import type { DataEnv } from '../env.js';

export function createPostgresClient(env: DataEnv): DataClient {
  const url = env.DATABASE_URL_DIRECT ?? env.DATABASE_URL;
  const prisma = new PrismaClient({ datasources: { db: { url } } });

  return {
    provider: env.DATABASE_PROVIDER,

    async healthCheck(): Promise<DbHealthResult> {
      const start = Date.now();
      try {
        await prisma.$queryRaw`SELECT 1`;
        return {
          ok: true,
          provider: env.DATABASE_PROVIDER,
          latencyMs: Date.now() - start,
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        return {
          ok: false,
          provider: env.DATABASE_PROVIDER,
          latencyMs: Date.now() - start,
          message,
        };
      }
    },

    async disconnect(): Promise<void> {
      await prisma.$disconnect();
    },
  };
}
