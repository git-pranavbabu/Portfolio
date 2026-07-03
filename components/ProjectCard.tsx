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
    <article
      className={`clay-card ${hasBody ? "clay-card-interactive" : ""} p-7 sm:p-9`}
      onClick={() => hasBody && setOpen((v) => !v)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="flex w-full flex-col gap-4 text-left"
        disabled={!hasBody}
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3
              className="text-xl sm:text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {project.title}
            </h3>
            {project.hykon && (
              <p
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--color-accent)" }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--color-accent)" }}
                />
                Built at Hykon India Limited
              </p>
            )}
          </div>
          {hasBody && (
            <span
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl text-lg font-bold transition-transform"
              style={{
                background: "var(--color-card-solid)",
                color: "var(--color-accent)",
                boxShadow:
                  "4px 4px 10px rgba(160, 150, 180, 0.15), -2px -2px 6px rgba(255, 255, 255, 0.85), inset 1px 1px 2px rgba(255, 255, 255, 0.6)",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
              aria-hidden
            >
              ▾
            </span>
          )}
        </div>
        <p
          className="text-base leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          {project.oneLiner}
        </p>
        {project.tech.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="clay-pill"
                style={{ fontSize: "0.7rem", padding: "0.3rem 0.75rem" }}
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
                className="inline-flex items-center gap-1 font-bold"
                style={{ color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
              >
                GitHub <ExternalIcon />
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold"
                style={{ color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
              >
                Live <ExternalIcon />
              </a>
            )}
          </div>
        )}
      </button>

      {hasBody && (
        <div className={`collapsible-content ${open ? "open" : ""} mt-5`}>
          <div>
            <div
              className="rounded-[24px] border p-6 sm:p-8"
              style={{
                background: "var(--color-canvas-2)",
                borderColor: "var(--color-border)",
                boxShadow:
                  "inset 4px 4px 8px rgba(160, 150, 180, 0.12), inset -2px -2px 6px rgba(255, 255, 255, 0.6)",
              }}
            >
              <div
                className="prose-content"
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
      strokeWidth="2.5"
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
