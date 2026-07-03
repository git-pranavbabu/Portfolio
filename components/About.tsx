export function About() {
  return (
    <section id="about" className="section">
      <div className="section-inner">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          About
        </h2>
        <p
          className="text-lg mb-8 max-w-2xl"
          style={{ color: "var(--color-muted)" }}
        >
          A quick read on who I am and what I work on.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="clay-card p-7 sm:p-9">
            <h3
              className="text-xl sm:text-2xl font-extrabold mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What I do
            </h3>
            <div
              className="space-y-3 text-base leading-relaxed"
              style={{ color: "var(--color-muted)" }}
            >
              <p>
                I&apos;m an AI Automation Engineer (Intern) at{" "}
                <span
                  className="font-bold"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Hykon India Limited
                </span>{" "}
                — a battery manufacturer — where I build production-grade AI
                tools that solve real operational problems. I have a
                pre-placement offer to return as AI Platform Lead.
              </p>
              <p>
                Most of my work is on the applied side: agent orchestration
                with LangGraph, RAG pipelines, browser extensions, in-app
                automations, and the kind of internal tooling that gets used
                because it lives where the team already works.
              </p>
            </div>
          </div>

          <div className="clay-card p-7 sm:p-9">
            <h3
              className="text-xl sm:text-2xl font-extrabold mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What I&apos;m exploring
            </h3>
            <div
              className="space-y-3 text-base leading-relaxed"
              style={{ color: "var(--color-muted)" }}
            >
              <p>
                Outside of Hykon, I build{" "}
                <span
                  className="font-bold"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Evocode
                </span>{" "}
                — an adaptive learning ecosystem that uses LangGraph to
                orchestrate LLM agents for personalized syllabi and
                mastery-based assessments.
              </p>
              <p>
                It&apos;s where I push on agent design when the work is harder
                than the demo makes it look. I&apos;m currently focused on
                building production AI tooling, agentic RAG, and
                multi-orchestrator LLM systems.
              </p>
            </div>
            <p
              className="mt-5 text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--color-muted)" }}
            >
              <em>
                Note: Hykon projects are marked{" "}
                <span style={{ color: "var(--color-accent)" }}>
                  &quot;Built at Hykon India Limited&quot;
                </span>{" "}
                on their cards.
              </em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
