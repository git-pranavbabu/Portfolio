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
    <nav className="sticky top-0 z-30 w-full border-b border-border bg-bg/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-3">
        <a
          href="#top"
          className="inline-flex items-center gap-1.5 font-semibold tracking-tight"
        >
          <SparkleIcon size={14} />
          <span>PB</span>
        </a>
        <ul className="flex items-center gap-5 text-sm">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  );
}
