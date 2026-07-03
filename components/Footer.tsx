export function Footer() {
  return (
    <footer className="px-6 pt-8 pb-12">
      <div className="section-inner flex flex-col items-start justify-between gap-3 text-sm sm:flex-row sm:items-center">
        <p style={{ color: "var(--color-muted)" }}>
          © {new Date().getFullYear()} Pranav Babu
        </p>
        <p
          className="flex flex-wrap items-center gap-x-2 gap-y-1"
          style={{ color: "var(--color-muted)" }}
        >
          <span>Built with</span>
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold transition-colors"
            style={{ color: "var(--color-foreground)" }}
          >
            Next.js
          </a>
          <span>·</span>
          <span>Hosted on</span>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold transition-colors"
            style={{ color: "var(--color-foreground)" }}
          >
            Vercel
          </a>
          <span>·</span>
          <span>Licensed under</span>
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold transition-colors"
            style={{ color: "var(--color-foreground)" }}
          >
            CC0-1.0
          </a>
        </p>
      </div>
    </footer>
  );
}
