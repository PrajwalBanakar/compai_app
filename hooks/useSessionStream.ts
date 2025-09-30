/* eslint-disable @typescript-eslint/no-explicit-any */
// Custom hook to manage Server-Sent Events (SSE) for a session.
// It connects to the SSE endpoint, listens for events, and invokes a callback with the event data.
"use client";

import { useEffect } from "react";
import type { Event } from "../types";

export default function useSessionStream(
  sessionId: string | null,
  onEvent: (event: Event) => void
) {
  useEffect(() => {
    if (!sessionId) return;

    const url = `http://localhost:4000/sessions/${sessionId}/stream`;
    const es = new EventSource(url);

    // Generic message handler
    const handleMessage = (e: MessageEvent) => {
      const data: Event = JSON.parse(e.data);
      onEvent(data);
    };

    // Subscribe to SSE events
    es.addEventListener("chunk", handleMessage);
    es.addEventListener("status", handleMessage);
    es.addEventListener("complete", handleMessage);
    es.addEventListener("error", handleMessage);

    // Fallback for generic messages
    es.onmessage = handleMessage;

    es.onerror = (err) => {
      console.error("SSE error:", err);
      const anyErr = err as any;
       if (anyErr?.status === 429) { 
        onEvent({ 
          type: "error", providerId: "system", message: "You have exceeded your current quota.", } as Event); 
        } else 
          { onEvent({ type: "error", providerId: "system", message: "Connection error occurred.", } as Event); }
      es.close();
    };

    return () => es.close();
  }, [sessionId, onEvent]);
}
