"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";

type Props = {
  project: Project;
  bodyHtml: string;
};

export function ProjectCard({ project, bodyHtml }: Props) {
  const [open, setOpen] = useState(false);
  const hasBody = bodyHtml.length > 0;

  return (
    <article className="rounded-lg border border-border bg-surface transition-colors hover:border-accent/40">
      <button
        type="button"
        onClick={() => hasBody && setOpen((v) => !v)}
        className="flex w-full flex-col gap-3 px-6 py-5 text-left disabled:cursor-default"
        disabled={!hasBody}
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold tracking-tight">
              {project.title}
            </h3>
            {project.hykon && (
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-accent">
                Built at Hykon India Limited
              </p>
            )}
          </div>
          {hasBody && (
            <span
              className={`mt-1 text-text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              aria-hidden
            >
              ▾
            </span>
          )}
        </div>
        <p className="text-text-muted">{project.oneLiner}</p>
        {project.tech.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-bg px-2.5 py-0.5 text-xs text-text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {(project.links.github || project.links.live) && (
          <div
            className="flex gap-3 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                GitHub →
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Live →
              </a>
            )}
          </div>
        )}
      </button>

      {hasBody && (
        <div className={`collapsible-content ${open ? "open" : ""}`}>
          <div>
            <div className="border-t border-border px-6 py-5">
              <div
                className="prose-content text-text"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
