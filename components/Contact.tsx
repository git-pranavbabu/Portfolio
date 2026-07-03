const orbs = {
  email: { from: "#a78bfa", to: "#7c3aed", icon: "mail" },
  linkedin: { from: "#38bdf8", to: "#0ea5e9", icon: "linkedin" },
  github: { from: "#f472b6", to: "#db2777", icon: "github" },
} as const;

export function Contact() {
  const email = "me.pranavbabu@gmail.com";
  const linkedin = "https://www.linkedin.com/in/pranav-babu-in/";
  const github = "https://github.com/git-pranavbabu";

  return (
    <section id="contact" className="section">
      <div className="section-inner">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Contact
        </h2>
        <p
          className="text-lg mb-8 max-w-2xl"
          style={{ color: "var(--color-muted)" }}
        >
          The fastest ways to reach me. I&apos;m open to conversations about AI
          engineering and agent platform work.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ContactCard
            href={`mailto:${email}`}
            label="Email"
            value={email}
            orb={orbs.email}
          />
          <ContactCard
            href={linkedin}
            label="LinkedIn"
            value="linkedin.com/in/pranav-babu-in"
            orb={orbs.linkedin}
            external
          />
          <ContactCard
            href={github}
            label="GitHub"
            value="github.com/git-pranavbabu"
            orb={orbs.github}
            external
          />
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  href,
  label,
  value,
  orb,
  external,
}: {
  href: string;
  label: string;
  value: string;
  orb: { from: string; to: string; icon: "mail" | "linkedin" | "github" };
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="clay-card clay-card-interactive flex items-center gap-4 p-6 sm:p-7"
    >
      <div
        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${orb.from} 0%, ${orb.to} 100%)`,
          boxShadow: `10px 10px 20px rgba(0, 0, 0, 0.1), -4px -4px 12px rgba(255, 255, 255, 0.5), inset 2px 2px 4px rgba(255, 255, 255, 0.4)`,
        }}
      >
        {orb.icon === "mail" && <MailIcon />}
        {orb.icon === "linkedin" && <LinkedInIcon />}
        {orb.icon === "github" && <GitHubIcon />}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: "var(--color-muted)" }}
        >
          {label}
        </p>
        <p
          className="mt-0.5 truncate text-sm font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {value}
        </p>
      </div>
      {external && <ExternalIcon />}
    </a>
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-1.93c-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.05.78 2.12v3.14c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--color-muted)" }}
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
