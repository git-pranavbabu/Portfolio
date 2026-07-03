export function About() {
  return (
    <section
      id="about"
      className="border-b border-border bg-surface px-6 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          About
        </h2>
        <div className="mt-6 space-y-4 text-text-muted leading-relaxed">
          <p>
            I&apos;m an AI Automation Engineer (Intern) at{" "}
            <span className="text-text font-medium">Hykon India Limited</span>{" "}
            — a battery manufacturer — where I build production-grade AI tools
            that solve real operational problems. I have a pre-placement offer
            to return as AI Platform Lead.
          </p>
          <p>
            Most of my work is on the applied side: agent orchestration with
            LangGraph, RAG pipelines, browser extensions, in-app automations,
            and the kind of internal tooling that gets used because it lives
            where the team already works.
          </p>
          <p>
            Outside of Hykon, I build Evocode — an adaptive learning ecosystem
            that uses LangGraph to orchestrate LLM agents for personalized
            syllabi and mastery-based assessments. It&apos;s where I push on
            agent design when the work is harder than the demo makes it look.
          </p>
          <p className="text-sm text-text-muted">
            <em>
              Note: projects marked &quot;Built at Hykon India Limited&quot;
              were built as part of my internship work.
            </em>
          </p>
        </div>
      </div>
    </section>
  );
}
