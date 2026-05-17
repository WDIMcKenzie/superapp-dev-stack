import { config } from 'dotenv';
import { resolve } from 'node:path';
import {
  healthCheck,
  disconnectDataClient,
} from '../../packages/data/dist/index.js';

config({ path: resolve(process.cwd(), '.env.local') });

const result = await healthCheck();

await disconnectDataClient();

if (!result.ok) {
  console.error('db:validate FAILED');
  console.error(result);
  process.exit(1);
}

console.log(
  `db:validate OK provider=${result.provider} latencyMs=${result.latencyMs}`,
);
