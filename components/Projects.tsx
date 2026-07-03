import { getProjectBodyHtml, getProjects } from "@/lib/content";
import { ProjectCard } from "./ProjectCard";

export async function Projects() {
  const projects = await getProjects();
  const projectsWithBody = await Promise.all(
    projects.map(async (p) => ({
      project: p,
      bodyHtml: await getProjectBodyHtml(p.slug),
    })),
  );

  return (
    <section id="projects" className="section">
      <div className="section-inner">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Projects
        </h2>
        <p
          className="text-lg mb-8 max-w-2xl"
          style={{ color: "var(--color-muted)" }}
        >
          A few of the things I&apos;ve built. Tap any card to read more.
        </p>
        <div className="grid gap-5">
          {projectsWithBody.map(({ project, bodyHtml }) => (
            <ProjectCard
              key={project.slug}
              project={project}
              bodyHtml={bodyHtml}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
