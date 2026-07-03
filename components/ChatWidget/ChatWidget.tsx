"use client";

import { useEffect, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const PRESET_QUESTIONS = [
  "Who is Pranav?",
  "What's Pranav's background?",
  "What kind of engineer is Pranav?",
  "What has Pranav built recently?",
  "What are Pranav's strongest projects?",
];

const FALLBACK_ERROR =
  "Sorry — something went wrong reaching the AI. Please try again.";

async function streamAsk(
  question: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (message: string) => void,
) {
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!res.ok || !res.body) {
      onError(FALLBACK_ERROR);
      onDone();
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      if (text) onChunk(text);
    }
    onDone();
  } catch {
    onError(FALLBACK_ERROR);
    onDone();
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, []);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform hover:scale-105 hover:bg-accent-hover"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  const submit = (rawQuestion: string) => {
    const question = rawQuestion.trim();
    if (!question || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: question }]);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    setStreaming(true);

    void streamAsk(
      question,
      (chunk) => {
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last && last.role === "assistant") {
            copy[copy.length - 1] = {
              role: "assistant",
              content: last.content + chunk,
            };
          }
          return copy;
        });
      },
      () => setStreaming(false),
      (errMsg) => {
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last && last.role === "assistant" && last.content === "") {
            copy[copy.length - 1] = {
              role: "assistant",
              content: errMsg,
            };
          } else {
            copy.push({ role: "assistant", content: errMsg });
          }
          return copy;
        });
      },
    );
  };

  return (
    <div
      id="chat"
      className="fixed bottom-6 right-6 z-50 flex h-[600px] max-h-[80vh] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-border bg-bg px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Ask me anything</p>
          <p className="text-xs text-text-muted">
            About Pranav&apos;s work and background
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close chat"
          className="text-text-muted hover:text-text"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-text-muted">
              Try one of these to start:
            </p>
            <div className="flex flex-col gap-2">
              {PRESET_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => submit(q)}
                  className="rounded-full border border-border bg-bg px-3 py-1.5 text-left text-xs transition-colors hover:border-accent hover:text-accent"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-accent text-white"
                  : "bg-bg text-text"
              }`}
            >
              {m.content}
              {streaming && m.role === "assistant" && i === messages.length - 1 && (
                <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-text" />
              )}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="flex gap-2 border-t border-border bg-bg px-3 py-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          disabled={streaming}
          className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
