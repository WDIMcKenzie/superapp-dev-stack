'use client';

import { useEffect, useState } from 'react';
import { StatusBadge } from '@superapp/ui';

interface HealthState {
  api: boolean;
  db: boolean;
  provider?: string;
  latencyMs?: number;
}

export function HealthPanel() {
  const [health, setHealth] = useState<HealthState | null>(null);
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

  useEffect(() => {
    async function load() {
      try {
        const [apiRes, dbRes] = await Promise.all([
          fetch(`${base}/api/health`),
          fetch(`${base}/api/health/db`),
        ]);
        const dbJson = (await dbRes.json()) as {
          ok: boolean;
          provider?: string;
          latencyMs?: number;
        };
        setHealth({
          api: apiRes.ok,
          db: dbRes.ok && dbJson.ok,
          provider: dbJson.provider,
          latencyMs: dbJson.latencyMs,
        });
      } catch {
        setHealth({ api: false, db: false });
      }
    }
    void load();
  }, [base]);

  if (!health) {
    return <p>Checking health…</p>;
  }

  return (
    <ul>
      <li>
        API: <StatusBadge ok={health.api} />
      </li>
      <li>
        Database ({health.provider ?? 'unknown'}):{' '}
        <StatusBadge ok={health.db} />{' '}
        {health.latencyMs != null ? `${health.latencyMs}ms` : null}
      </li>
    </ul>
  );
}
