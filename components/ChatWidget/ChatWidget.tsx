"use client";

import { useEffect, useRef, useState } from "react";

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
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming, open]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open chat"
        className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform hover:scale-105 hover:bg-accent-hover"
      >
        <span className="absolute inset-0 rounded-full bg-accent opacity-30 transition-transform group-hover:scale-110" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative"
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
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
            PB
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">
              Ask me anything
            </p>
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="status-dot" aria-hidden />
              <span>Online · about Pranav</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close chat"
          className="flex h-7 w-7 items-center justify-center rounded text-text-muted transition-colors hover:bg-bg hover:text-text"
        >
          ✕
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-bg p-3 text-sm text-text-muted">
              Hi! I&apos;m an AI trained on Pranav&apos;s project docs and
              resume. Ask me anything about his work, skills, or background.
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                Try one of these
              </p>
              <div className="flex flex-col gap-2">
                {PRESET_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => submit(q)}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-left text-xs transition-all hover:border-accent hover:bg-accent/5 hover:text-accent"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`mb-3 flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                  PB
                </div>
              )}
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-accent text-white"
                    : "bg-bg text-text"
                }`}
              >
                {m.content}
                {streaming &&
                  m.role === "assistant" &&
                  i === messages.length - 1 && (
                    <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-text align-middle" />
                  )}
              </div>
            </div>
          ))
        )}
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
          className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-accent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:transform-none disabled:hover:shadow-none"
          aria-label="Send"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
