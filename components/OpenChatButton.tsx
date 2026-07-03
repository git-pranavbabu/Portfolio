"use client";

import { useState } from "react";

type Props = {
  label?: string;
  className?: string;
};

export function OpenChatButton({ label = "Chat with my AI", className }: Props) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="#chat"
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-chat"));
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent"
      }
    >
      {label}
    </a>
  );
}
