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
    <article className="rounded-lg border border-border bg-surface transition-colors hover:border-accent/40">
      <button
        type="button"
        onClick={() => hasBody && setOpen((v) => !v)}
        className="flex w-full flex-col gap-2 px-6 py-5 text-left disabled:cursor-default"
        disabled={!hasBody}
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold tracking-tight">
              {post.title}
            </h3>
            <p className="mt-1 text-xs text-text-muted">
              {formatDate(post.date)}
            </p>
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
        {post.summary && (
          <p className="text-text-muted">{post.summary}</p>
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
