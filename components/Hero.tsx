import { OpenChatButton } from "./OpenChatButton";

export function Hero() {
  return (
    <header
      id="top"
      className="border-b border-border bg-bg px-6 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-muted">
          <span className="status-dot" aria-hidden />
          <span>Open to AI engineer and agent platform roles</span>
        </div>
        <p className="mt-5 text-sm font-medium text-accent">Hi, I&apos;m</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Pranav Babu
        </h1>
        <p className="mt-4 text-lg text-text-muted sm:text-xl">
          AI Engineer building production AI tools, agentic systems, and RAG
          pipelines. Currently at Hykon India Limited.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/resume.pdf" download className="btn-primary">
            <DownloadIcon />
            Download Resume
          </a>
          <OpenChatButton
            className="btn-secondary"
            label={
              <>
                <ChatIcon />
                Chat with my AI
              </>
            }
          />
        </div>
      </div>
    </header>
  );
}

function DownloadIcon() {
  return (
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ChatIcon() {
  return (
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
