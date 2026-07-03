"use client";

import { useState } from "react";
import type { BlogPost } from "@/lib/types";

type Props = {
  post: BlogPost;
  bodyHtml: string;
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogPostCard({ post, bodyHtml }: Props) {
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
        className="flex w-full flex-col gap-3 text-left"
        disabled={!hasBody}
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p
              className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: "var(--color-accent)" }}
            >
              {formatDate(post.date)}
            </p>
            <h3
              className="text-xl sm:text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {post.title}
            </h3>
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
        {post.summary && (
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            {post.summary}
          </p>
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
