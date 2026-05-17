export const APP_NAME = 'SuperApp';

export function formatHealthLabel(ok: boolean): string {
  return ok ? 'healthy' : 'unhealthy';
}
