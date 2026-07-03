"use client";

import { useEffect, useState } from "react";
import { SparkleIcon } from "./SparkleIcon";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [active, setActive] = useState<string>("#top");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sectionIds = ["top", ...links.map((l) => l.href.slice(1))];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) {
          setActive(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );
    for (const s of sections) observer.observe(s);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-4 z-30 w-full" style={{ zIndex: 30 }}>
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-[28px] border px-4 py-2.5 sm:px-6 sm:py-3"
        style={{
          background: "var(--color-nav-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "var(--color-border)",
          boxShadow:
            "8px 8px 20px rgba(160, 150, 180, 0.18), -6px -6px 16px rgba(255, 255, 255, 0.85), inset 2px 2px 4px rgba(255, 255, 255, 0.6)",
        }}
      >
        <a
          href="#top"
          className="inline-flex items-center gap-2 font-black tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-2xl"
            style={{
              background: "var(--gradient-primary)",
              boxShadow:
                "4px 4px 10px rgba(139, 92, 246, 0.3), -2px -2px 6px rgba(255, 255, 255, 0.5), inset 1px 1px 2px rgba(255, 255, 255, 0.3)",
            }}
          >
            <SparkleIcon size={16} gradient={false} className="text-white" />
          </div>
          <span className="text-base">Pranav</span>
        </a>
        <ul className="hidden items-center gap-1 text-sm md:flex">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`nav-link-clay ${isActive ? "active" : ""}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>
        <ThemeToggle />
      </nav>
    </div>
  );
}
