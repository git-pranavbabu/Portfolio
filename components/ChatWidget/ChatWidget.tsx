"use client";

import { useEffect, useRef, useState } from "react";
import { SparkleIcon } from "../SparkleIcon";

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
        className="group fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-[24px] text-white clay-breathe"
        style={{
          background: "var(--gradient-primary)",
          boxShadow:
            "12px 12px 28px rgba(139, 92, 246, 0.45), -8px -8px 20px rgba(255, 255, 255, 0.5), inset 3px 3px 6px rgba(255, 255, 255, 0.4), inset -3px -3px 6px rgba(0, 0, 0, 0.15)",
        }}
      >
        <SparkleIcon size={26} gradient={false} className="text-white" />
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
      className="fixed bottom-6 right-6 z-50 flex h-[600px] max-h-[82vh] w-[400px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[28px] border"
      style={{
        background: "var(--color-card-solid)",
        borderColor: "var(--color-border)",
        boxShadow:
          "20px 20px 40px rgba(160, 150, 180, 0.3), -12px -12px 30px rgba(255, 255, 255, 0.7), inset 4px 4px 8px rgba(255, 255, 255, 0.5)",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-nav-bg)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{
              background: "var(--gradient-primary)",
              boxShadow:
                "4px 4px 10px rgba(139, 92, 246, 0.3), -2px -2px 6px rgba(255, 255, 255, 0.5), inset 1px 1px 2px rgba(255, 255, 255, 0.3)",
            }}
          >
            <SparkleIcon size={18} gradient={false} className="text-white" />
          </div>
          <div>
            <p
              className="text-sm font-extrabold leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ask me anything
            </p>
            <p
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "var(--color-muted)" }}
            >
              <span className="status-dot" aria-hidden />
              <span>Online · about Pranav</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close chat"
          className="flex h-8 w-8 items-center justify-center rounded-2xl text-base font-bold transition-all"
          style={{
            color: "var(--color-muted)",
            background: "var(--color-canvas-2)",
            boxShadow:
              "inset 3px 3px 6px rgba(160, 150, 180, 0.18), inset -2px -2px 4px rgba(255, 255, 255, 0.5)",
          }}
        >
          ✕
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div
              className="rounded-[24px] p-4 text-sm"
              style={{
                background: "var(--gradient-accent-soft)",
                color: "var(--color-foreground)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-extrabold"
                style={{
                  color: "var(--color-accent)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                <SparkleIcon size={11} />
                <span>About Pranav</span>
              </div>
              Hi! I&apos;m an AI trained on Pranav&apos;s project docs and
              resume. Ask me anything about his work, skills, or background.
            </div>
            <div>
              <p
                className="mb-2 text-xs font-extrabold uppercase tracking-wider"
                style={{
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Try one of these
              </p>
              <div className="flex flex-col gap-2">
                {PRESET_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => submit(q)}
                    className="clay-pill w-full text-left"
                    style={{ fontSize: "0.78rem", padding: "0.5rem 0.9rem" }}
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
                <div
                  className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background: "var(--color-canvas-2)",
                    boxShadow:
                      "inset 2px 2px 4px rgba(160, 150, 180, 0.18), inset -1px -1px 3px rgba(255, 255, 255, 0.5)",
                  }}
                >
                  {streaming && i === messages.length - 1 ? (
                    <span className="thinking-blob" aria-hidden />
                  ) : (
                    <SparkleIcon size={12} gradient />
                  )}
                </div>
              )}
              <div
                className="max-w-[80%] whitespace-pre-wrap rounded-[20px] px-4 py-2.5 text-sm leading-relaxed"
                style={
                  m.role === "user"
                    ? {
                        background: "var(--gradient-accent)",
                        color: "white",
                        boxShadow:
                          "6px 6px 14px rgba(139, 92, 246, 0.25), -4px -4px 10px rgba(255, 255, 255, 0.4), inset 2px 2px 4px rgba(255, 255, 255, 0.3)",
                      }
                    : {
                        background: "var(--color-canvas-2)",
                        color: "var(--color-foreground)",
                        boxShadow:
                          "inset 3px 3px 6px rgba(160, 150, 180, 0.15), inset -2px -2px 5px rgba(255, 255, 255, 0.6)",
                      }
                }
              >
                {m.content}
                {streaming &&
                  m.role === "assistant" &&
                  i === messages.length - 1 && (
                    <span
                      className="ml-1 inline-block h-3 w-1.5 animate-pulse align-middle"
                      style={{ background: "var(--color-foreground)" }}
                    />
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
        className="flex gap-2 px-4 py-4"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          disabled={streaming}
          className="clay-input flex-1"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          aria-label="Send"
          className="clay-btn clay-btn-primary"
          style={{
            height: "56px",
            width: "56px",
            padding: 0,
            opacity: streaming || !input.trim() ? 0.5 : 1,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
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
