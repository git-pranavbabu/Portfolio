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
    <section
      id="projects"
      className="border-b border-border bg-bg px-6 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Projects
        </h2>
        <p className="mt-2 text-text-muted">
          A few of the things I&apos;ve built. Tap any card to read more.
        </p>
        <div className="mt-8 grid gap-4">
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
