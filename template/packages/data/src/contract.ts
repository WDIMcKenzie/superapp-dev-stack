export interface DbHealthResult {
  ok: boolean;
  provider: string;
  latencyMs: number;
  message?: string;
}

export interface DataClient {
  readonly provider: string;
  healthCheck(): Promise<DbHealthResult>;
  disconnect(): Promise<void>;
}
