// Describes the structure of events emitted during the processing of a request.
export interface Metrics {
  latency_ms: number;
  tokens_output: number;
  cost: number;
}

export type Event =
  | { type: "chunk"; providerId: string; chunk: string }
  | { type: "status"; providerId: string; status: "pending" | "complete" | "error" }
  | { type: "complete"; providerId: string; metrics: Metrics }
  | { type: "error"; providerId: string };
