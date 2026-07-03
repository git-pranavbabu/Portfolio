import { OpenChatButton } from "./OpenChatButton";

export function Hero() {
  return (
    <header
      id="top"
      className="border-b border-border bg-bg px-6 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium text-accent">Hi, I&apos;m</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Pranav Babu
        </h1>
        <p className="mt-4 text-lg text-text-muted sm:text-xl">
          AI Engineer building production AI tools, agentic systems, and RAG
          pipelines. Currently at Hykon India Limited.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Download Resume
          </a>
          <OpenChatButton />
        </div>
      </div>
    </header>
  );
}
