import { OpenChatButton } from "./OpenChatButton";
import { SparkleIcon } from "./SparkleIcon";

export function Hero() {
  return (
    <header
      id="top"
      className="section relative pt-12 sm:pt-16"
    >
      <div className="section-inner">
        <div className="clay-pill mb-6">
          <span className="status-dot" aria-hidden />
          <span>Open to AI engineer and agent platform roles</span>
        </div>

        <p
          className="mb-3 text-sm font-bold tracking-wide uppercase"
          style={{
            color: "var(--color-accent)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Hi, I&apos;m
        </p>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="clay-gradient-text">Pranav Babu</span>
        </h1>

        <p
          className="mt-6 text-lg sm:text-xl md:text-2xl font-medium leading-relaxed max-w-3xl"
          style={{ color: "var(--color-muted)" }}
        >
          AI Engineer building{" "}
          <span
            className="font-bold"
            style={{ color: "var(--color-foreground)" }}
          >
            agentic systems
          </span>
          ,{" "}
          <span
            className="font-bold"
            style={{ color: "var(--color-foreground)" }}
          >
            RAG pipelines
          </span>
          , and production AI tools.
        </p>

        <p
          className="mt-3 text-base sm:text-lg font-medium"
          style={{ color: "var(--color-muted)" }}
        >
          Currently an AI Automation Engineer (Intern) at{" "}
          <span
            className="font-bold"
            style={{ color: "var(--color-foreground)" }}
          >
            Hykon India Limited
          </span>{" "}
          — pre-placement offer as AI Platform Lead.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-5">
          <a href="/resume.pdf" download className="clay-btn clay-btn-primary">
            <DownloadIcon />
            Download Resume
          </a>
          <OpenChatButton
            className="clay-btn clay-btn-secondary"
            label={
              <>
                <SparkleIcon size={16} gradient={false} className="text-accent" />
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
