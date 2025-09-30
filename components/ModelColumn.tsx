//Component to display model output, status, and metrics
"use client";

import ReactMarkdown from "react-markdown";

// Define metrics type
interface Metrics {
  latency_ms: number;
  tokens_output: number;
  cost: number;
}

// Define props type
interface Props {
  providerId: string;
  text: string;
  status: "pending" | "complete" | "error";
  metrics?: Metrics;
  errorMessage?: string;
}

export default function ModelColumn({ providerId, text, status, metrics,errorMessage }: Props) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
      <h3>{providerId}</h3>
      <p>
        Status: <strong>{status}</strong>
      </p>

            {status === "error" && errorMessage && (
        <p style={{ color: "red" }}>
          <strong>Error:</strong> {errorMessage}
        </p>
      )}

      <div
        style={{
          minHeight: "200px",
          background: "#f9f9f9",
          padding: "0.5rem",
          overflowY: "auto",
          whiteSpace: "pre-wrap",
        }}
      >
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>

      {metrics && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.9em", color: "#555" }}>
          <p>Latency: {metrics.latency_ms} ms</p>
          <p>Tokens: {metrics.tokens_output}</p>
          <p>Cost: ${metrics.cost}</p>
        </div>
      )}
    </div>
  );
}
