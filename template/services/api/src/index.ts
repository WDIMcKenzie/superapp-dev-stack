import { config } from 'dotenv';
import { resolve } from 'node:path';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { healthCheck } from '@superapp/data';

config({ path: resolve(process.cwd(), '../../.env.local') });
config({ path: resolve(process.cwd(), '../../.env') });

const app = new Hono();

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', service: 'api' });
});

app.get('/api/health/db', async (c) => {
  const result = await healthCheck();
  const status = result.ok ? 200 : 503;
  return c.json(
    {
      ok: result.ok,
      provider: result.provider,
      latencyMs: result.latencyMs,
      message: result.message,
    },
    status,
  );
});

const port = Number(process.env.API_PORT ?? 8080);

serve({ fetch: app.fetch, port }, () => {
  console.log(`API listening on http://localhost:${port}`);
});
