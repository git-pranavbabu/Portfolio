import { getSkills } from "@/lib/content";

export async function Skills() {
  const categories = await getSkills();

  return (
    <section
      id="skills"
      className="border-b border-border bg-surface px-6 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Skills
        </h2>
        <p className="mt-2 text-text-muted">
          What I reach for, grouped roughly by what they help me do.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {categories.map((cat) => (
            <div
              key={cat.category}
              className="rounded-lg border border-border bg-bg p-5"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                {cat.category}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {cat.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
