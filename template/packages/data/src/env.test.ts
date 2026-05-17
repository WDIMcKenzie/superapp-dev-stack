import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadDataEnv } from './env.js';

test('loadDataEnv accepts valid postgres config', () => {
  const env = loadDataEnv({
    DATABASE_PROVIDER: 'postgres',
    DATABASE_URL: 'postgresql://localhost/test',
    DATABASE_ENV: 'local',
    DATABASE_MIGRATE_MODE: 'prisma',
  } as NodeJS.ProcessEnv);

  assert.equal(env.DATABASE_PROVIDER, 'postgres');
});

test('loadDataEnv rejects missing DATABASE_URL', () => {
  assert.throws(() =>
    loadDataEnv({
      DATABASE_PROVIDER: 'postgres',
      DATABASE_ENV: 'local',
      DATABASE_MIGRATE_MODE: 'prisma',
    } as NodeJS.ProcessEnv),
  );
});
