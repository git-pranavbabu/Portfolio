export function Footer() {
  return (
    <footer className="bg-bg px-6 py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-2 text-sm text-text-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Pranav Babu</p>
        <p>
          Built with Next.js · Hosted on Vercel · Content licensed under{" "}
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            CC0-1.0
          </a>
        </p>
      </div>
    </footer>
  );
}
