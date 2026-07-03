export function Footer() {
  return (
    <footer className="bg-bg px-6 py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-3 text-sm text-text-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Pranav Babu</p>
        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <span>Built with</span>
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text transition-colors hover:text-accent"
          >
            Next.js
          </a>
          <span>·</span>
          <span>Hosted on</span>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text transition-colors hover:text-accent"
          >
            Vercel
          </a>
          <span>·</span>
          <span>Content licensed under</span>
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text transition-colors hover:text-accent"
          >
            CC0-1.0
          </a>
        </p>
      </div>
    </footer>
  );
}
