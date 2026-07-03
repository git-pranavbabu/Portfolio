export function Contact() {
  const email = "me.pranavbabu@gmail.com";
  const linkedin = "https://www.linkedin.com/in/pranav-babu-in/";
  const github = "https://github.com/git-pranavbabu";

  return (
    <section
      id="contact"
      className="border-b border-border bg-surface px-6 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Contact
        </h2>
        <p className="mt-2 text-text-muted">
          The fastest ways to reach me. I&apos;m open to conversations about AI
          engineering and agent platform work.
        </p>
        <ul className="mt-8 space-y-3 text-base">
          <li>
            <span className="text-text-muted">Email — </span>
            <a
              href={`mailto:${email}`}
              className="text-accent hover:underline"
            >
              {email}
            </a>
          </li>
          <li>
            <span className="text-text-muted">LinkedIn — </span>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              linkedin.com/in/pranav-babu-in
            </a>
          </li>
          <li>
            <span className="text-text-muted">GitHub — </span>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              github.com/git-pranavbabu
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
