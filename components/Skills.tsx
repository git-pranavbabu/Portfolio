import { getSkills } from "@/lib/content";

const categoryAccents: Record<string, { from: string; to: string; ring: string }> = {
  Languages: { from: "#a78bfa", to: "#7c3aed", ring: "rgba(124, 58, 237, 0.18)" },
  "AI / Agents": { from: "#f472b6", to: "#db2777", ring: "rgba(219, 39, 119, 0.18)" },
  Backend: { from: "#38bdf8", to: "#0ea5e9", ring: "rgba(14, 165, 233, 0.18)" },
  Frontend: { from: "#34d399", to: "#10b981", ring: "rgba(16, 185, 129, 0.18)" },
  "Tools & Platforms": { from: "#fbbf24", to: "#f59e0b", ring: "rgba(245, 158, 11, 0.18)" },
};

const fallback = { from: "#a78bfa", to: "#7c3aed", ring: "rgba(124, 58, 237, 0.18)" };

export async function Skills() {
  const categories = await getSkills();

  return (
    <section id="skills" className="section">
      <div className="section-inner">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Skills
        </h2>
        <p
          className="text-lg mb-8 max-w-2xl"
          style={{ color: "var(--color-muted)" }}
        >
          What I reach for, grouped roughly by what they help me do.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const accent = categoryAccents[cat.category] ?? fallback;
            return (
              <div key={cat.category} className="clay-card p-7 sm:p-8">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)`,
                      boxShadow: `8px 8px 16px ${accent.ring}, -4px -4px 10px rgba(255, 255, 255, 0.5), inset 2px 2px 4px rgba(255, 255, 255, 0.4)`,
                    }}
                  >
                    <CategoryIcon name={cat.category} />
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-extrabold tracking-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {cat.category}
                  </h3>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {cat.skills.map((s) => (
                    <span
                      key={s}
                      className="clay-pill"
                      style={{ fontSize: "0.75rem", padding: "0.35rem 0.85rem" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CategoryIcon({ name }: { name: string }) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "white",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "Languages") {
    return (
      <svg {...common}>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="13" y1="4" x2="11" y2="20" />
      </svg>
    );
  }
  if (name === "AI / Agents") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17.5-5.5l-4.2 4.2m-4.6 4.6l-4.2 4.2m12.6 0l-4.2-4.2m-4.6-4.6l-4.2-4.2" />
      </svg>
    );
  }
  if (name === "Backend") {
    return (
      <svg {...common}>
        <rect x="2" y="3" width="20" height="6" rx="2" />
        <rect x="2" y="15" width="20" height="6" rx="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    );
  }
  if (name === "Frontend") {
    return (
      <svg {...common}>
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
