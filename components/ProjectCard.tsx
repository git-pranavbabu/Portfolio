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
            className="flex flex-wrap gap-3 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent transition-opacity hover:opacity-70"
              >
                GitHub
                <ExternalIcon />
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent transition-opacity hover:opacity-70"
              >
                Live
                <ExternalIcon />
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

function ExternalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
