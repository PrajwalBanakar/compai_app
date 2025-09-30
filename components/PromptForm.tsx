// Form component to input prompt and create a new session
"use client";

import { useState } from "react";

export default function PromptForm({
  onSessionCreated,
}: {
  onSessionCreated: (id: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      onSessionCreated(data.sessionId);
    } catch (err) {
      console.error("Error creating session:", err);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <button type="submit" disabled={loading || !prompt}>
        {loading ? "Starting..." : "Compare"}
      </button>
    </form>
  );
}
