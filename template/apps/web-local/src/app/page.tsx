import { APP_NAME } from '@superapp/core';
import { StatusBadge } from '@superapp/ui';
import { HealthPanel } from '@/components/HealthPanel';

export default function HomePage() {
  return (
    <main>
      <h1>{APP_NAME} Dev Stack</h1>
      <p>Template web app — port {process.env.WEB_PORT ?? '4000'}</p>
      <HealthPanel />
      <p>
        API URL: {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}
      </p>
    </main>
  );
}
