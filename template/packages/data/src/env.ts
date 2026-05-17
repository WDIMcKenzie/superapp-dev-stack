import { z } from 'zod';

const databaseProviderSchema = z.enum([
  'supabase',
  'postgres',
  'mongodb',
  'mysql',
  'neon',
  'planetscale',
  'custom',
]);

export const dataEnvSchema = z.object({
  DATABASE_PROVIDER: databaseProviderSchema,
  DATABASE_URL: z.string().min(1),
  DATABASE_URL_DIRECT: z.string().optional(),
  DATABASE_ENV: z.enum(['local', 'staging', 'prod']),
  DATABASE_MIGRATE_MODE: z.enum(['prisma', 'supabase-cli', 'manual']),
});

export type DataEnv = z.infer<typeof dataEnvSchema>;

export function loadDataEnv(
  source: NodeJS.ProcessEnv = process.env,
): DataEnv {
  const parsed = dataEnvSchema.safeParse({
    DATABASE_PROVIDER: source.DATABASE_PROVIDER,
    DATABASE_URL: source.DATABASE_URL,
    DATABASE_URL_DIRECT: source.DATABASE_URL_DIRECT,
    DATABASE_ENV: source.DATABASE_ENV,
    DATABASE_MIGRATE_MODE: source.DATABASE_MIGRATE_MODE,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid database env: ${parsed.error.flatten().fieldErrors}`,
    );
  }

  return parsed.data;
}
