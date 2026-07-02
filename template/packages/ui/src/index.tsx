import type { ReactNode } from 'react';

export interface StatusBadgeProps {
  ok: boolean;
  children?: ReactNode;
}

export function StatusBadge({ ok, children }: StatusBadgeProps) {
  const color = ok ? '#16a34a' : '#dc2626';
  return (
    <span style={{ color, fontWeight: 600 }}>
      {children ?? (ok ? 'OK' : 'Error')}
    </span>
  );
}
