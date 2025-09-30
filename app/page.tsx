// Main page component for the AI Model Playground application.
"use client";

import { useState } from "react";
import PromptForm from "../components/PromptForm";
import ModelColumn from "../components/ModelColumn";
import useSessionStream from "../hooks/useSessionStream";

// Metrics type for model outputs
interface Metrics {
  latency_ms: number;
  tokens_output: number;
  cost: number;
}

// Column type for each AI model
type Column = {
  text: string;
  status: "pending" | "complete" | "error";
  metrics?: Metrics;
  errorMessage?: string;
};

// Event types for streaming responses
type Event =
  | {
      type: "chunk";
      providerId: string;
      chunk: string;
    }
  | {
      type: "status";
      providerId: string;
      status: "pending" | "complete" | "error";
    }
  | {
      type: "complete";
      providerId: string;
      metrics: Metrics;
    }
  | {
      type: "error";
      providerId: string;
      message?: string
    };

export default function HomePage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [columns, setColumns] = useState<Record<string, Column>>({});

  useSessionStream(sessionId, (event: Event) => {
    const { type, providerId } = event;

    setColumns((prev) => {
      const col = prev[providerId] ?? {
        text: "",
        status: "pending",
        metrics: undefined,
        errorMessage: undefined,
      };

      if (type === "chunk") col.text += event.chunk;
      if (type === "status") col.status = event.status;
      if (type === "complete") {
        col.status = "complete";
        col.metrics = event.metrics;
      }
      if (type === "error") {
        col.status = "error";
        col.errorMessage = event.message ?? "An error occurred.";
      } 

      return { ...prev, [providerId]: { ...col } };
    });
  });

  return (
    <main style={{ padding: "2rem" }}>
      <h1>AI Model Playground</h1>

      <PromptForm onSessionCreated={(id) => setSessionId(id)} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {Object.entries(columns).map(([id, col]) => (
          <ModelColumn
            key={id}
            providerId={id}
            text={col.text}
            status={col.status}
            metrics={col.metrics}
            errorMessage={col.errorMessage}
          />
        ))}
      </div>
    </main>
  );
}
