# Customizing Your Portfolio — A Maintenance Guide

A map of every file in this repo, what it controls, and step-by-step recipes for the things you'll want to change.

The site is a Next.js 16 single-page portfolio. Almost everything you touch lives under `app/`, `components/`, or `content/`. Code changes are auto-deployed by Vercel the moment you push to `main`.

---

## 1. Quick reference — file map

```
app/
  layout.tsx              Root layout: font, metadata, ChatWidget mount, <body> classes
  page.tsx                Page composition — lists the sections in order
  globals.css             All design tokens (colors, fonts, animations, button classes)
  icon.tsx                Favicon (PB mark on accent blue)
  opengraph-image.tsx     OG image for social sharing

components/
  Nav.tsx                 Top sticky nav with active-section highlight (scroll-spy)
  Hero.tsx                Name, role, status badge, CTAs
  About.tsx               Bio + employer disclosure
  Projects.tsx            Server component — reads projects and renders ProjectCards
  ProjectCard.tsx         Collapsible card with title, one-liner, tech, links, body
  Skills.tsx              Skills by category (from skills.json)
  Blog.tsx                Server component — reads blog posts and renders BlogPostCards
  BlogPostCard.tsx        Collapsible blog post card
  Contact.tsx             Email, LinkedIn, GitHub (with SVG icons)
  Footer.tsx              Copyright + license + framework credits
  Reveal.tsx              Scroll-triggered fade-in wrapper (use as <Reveal>...</Reveal>)
  OpenChatButton.tsx      Reusable button that opens the chat widget
  ChatWidget/
    ChatWidget.tsx        Floating chat (button, panel, streaming, presets)

content/
  projects/
    {slug}.md             Project frontmatter (title, oneLiner, hykon, order, tech, links)
    {slug}/
      README.md           Project body (rendered in expanded card AND ingested by RAG)
  blog/
    {slug}.md             Blog post (frontmatter + body, rendered + ingested)
  skills.json             Skills by category
  resume.md               Resume content (ingested by RAG, not displayed directly)

public/
  resume.pdf              Downloadable PDF

lib/                      (you'll rarely touch this)
  content.ts              Reads content/*.md, parses frontmatter
  markdown.ts             remark + gray-matter (renders markdown to HTML)
  pg.ts                   Postgres pool (used by the RAG API)
  embeddings.ts           Gemini embedQuery
  rag.ts                  retrieveChunks — pgvector similarity search
  prompt.ts               System prompt for the AI agent
  gemini.ts               Streaming LLM (with fallback chain)
  types.ts                Project / BlogPost interfaces

scripts/
  ingest.ts               `npm run ingest` — re-embed content and push to Supabase

supabase/
  schema.sql              pgvector table + index (run once in Supabase SQL editor)
```

---

## 2. How to add a new blog post

This is the most common task. From the project root:

1. Create a new file `content/blog/my-post-slug.md`
2. Use this template:

```markdown
---
title: "My new post"
date: 2026-07-15
slug: my-post-slug
summary: "One-sentence summary used on the post card."
---

The body uses standard Markdown. `## headings` are supported, as are
**bold**, *italics*, lists, [links](https://example.com), and inline `code`.
```

3. Save the file. The post appears in the **Blog** section automatically.

> The frontmatter is **not** optional — the page reads `title`, `date`,
> `slug`, and `summary` from it. Without frontmatter, the post will break
> the page.

### How to also push it to the RAG corpus

If the post contains info you want the AI to know about, re-ingest:

```bash
npm run ingest:project my-post-slug
```

(Note: blog posts aren't currently included in the ingest loop. To include
them, edit `scripts/ingest.ts` — search for `// Blog` to add a new
section. Then run `npm run ingest`.)

---

## 3. How to add a new project

A project is two files: a frontmatter file and a README body.

1. Create `content/projects/my-project.md`:

```markdown
---
title: "My Project Name"
slug: my-project
oneLiner: "One-line description shown on the card and used for RAG."
hykon: false                       # true if built at Hykon India Limited
order: 6                            # lower = earlier in the list
tech: ["Python", "FastAPI", "React"]
links:
  github: ""                        # leave empty if no link
  live: ""
---

# (Optional) intro content

The body of this file is NOT used in the rendered card or the RAG.
The README below is. This file is only for metadata.
```

2. Create the body: `content/projects/my-project/README.md`. This is the content that shows when the card is expanded, AND what gets embedded into the RAG corpus. Use Markdown with `##` sections for best results (the chunker splits on `##`).

3. Save both files. The project card appears in the **Projects** section automatically (sorted by `order`).

4. Re-ingest so the AI knows about it:

```bash
npm run ingest:project my-project
```

---

## 4. How to update the resume (for both display + RAG)

The site has **two resume surfaces**:

| File | What it does |
|---|---|
| `public/resume.pdf` | The PDF that visitors download from the "Download Resume" button |
| `content/resume.md` | The text content that the RAG agent reads when answering questions |

To update both:

1. **PDF**: Drop the new `Pranav_Babu-Resume.pdf` into `public/`, overwriting the existing file. Commit + push. The next Vercel deploy will use it.
2. **RAG text**: Edit `content/resume.md` with the same content. Then re-ingest:

```bash
npm run ingest:project resume
```

The two surfaces are decoupled on purpose — you can update the PDF without re-ingesting, or update the RAG text without re-deploying the PDF.

---

## 5. How to change the Skills section

Edit `content/skills.json`:

```json
[
  {
    "category": "Languages",
    "skills": ["Python", "JavaScript", "TypeScript"]
  },
  {
    "category": "AI / Agents",
    "skills": ["LangGraph", "LLM agents", "RAG pipelines"]
  }
]
```

- `category` is the heading shown on the card.
- `skills` is the list of tags under that heading.
- The order in the array is the order they appear.
- Re-ingest if you want the AI to know about new skills:

```bash
npm run ingest:project resume
```

(Skills aren't ingested as their own project right now — they live in
the resume's `## Tech` section, which is what gets embedded.)

---

## 6. How to change colors, fonts, and the design

All design tokens live in **`app/globals.css`** at the top, in two blocks: `:root` (light mode) and `.dark` (dark mode). All components reference these variables, so changing them updates the whole site.

```css
:root {
  --color-bg: #fafafa;             /* page background */
  --color-text: #111111;           /* body text */
  --color-text-muted: #6b7280;     /* secondary text */
  --color-accent: #2563eb;         /* primary accent (links, buttons) */
  --color-accent-hover: #1d4ed8;   /* accent on hover */
  --color-border: #e5e7eb;         /* subtle borders */
  --color-surface: #ffffff;        /* card / panel background */
  --color-surface-2: #f3f4f6;      /* secondary surface (code blocks, etc.) */
  --color-prose-code: #f3f4f6;     /* inline code background */
  --color-shadow: rgba(15, 23, 42, 0.04);
  --color-shadow-hover: rgba(79, 70, 229, 0.28);
  --color-blob-opacity: 0.4;
  --color-nav-bg: rgba(250, 250, 250, 0.85);
}

.dark {
  --color-bg: #0a0a0a;
  --color-text: #fafafa;
  --color-text-muted: #a1a1aa;
  --color-accent: #60a5fa;
  --color-accent-hover: #93c5fd;
  --color-border: #262626;
  --color-surface: #171717;
  --color-surface-2: #1f1f1f;
  --color-prose-code: #262626;
  --color-shadow: rgba(0, 0, 0, 0.4);
  --color-shadow-hover: rgba(96, 165, 250, 0.32);
  --color-blob-opacity: 0.28;
  --color-nav-bg: rgba(10, 10, 10, 0.85);
}
```

To recolor the site, edit the values in **both** blocks (or just the ones you want to change). The toggle in the Nav (sun/moon icon) switches between the two — see section "How dark mode works" below.

The gradient colors (`--gradient-accent`, `--gradient-accent-soft`, `--gradient-text`, `--gradient-thinking`) live in `:root` only and are the same in both modes — they're brand colors, not surface colors.

To switch the font, edit `app/layout.tsx` (look for `import { Inter } from "next/font/google"`) and update `--font-sans` in `globals.css`.

> **Tailwind v4 caveat**: this project uses Tailwind v4 with CSS-based
> theming (`@theme inline`), NOT a `tailwind.config.ts` file. Don't
> add config the old way — it won't take effect.

## 6a. How dark mode works

- **Default**: follows the user's OS preference (`prefers-color-scheme`). If your OS is set to dark, the site loads in dark. If light, it loads in light.
- **Toggle**: there's a sun/moon icon button in the top-right of the Nav. Click it to switch. Your choice is saved in `localStorage` under the key `"theme"`.
- **If you haven't toggled**: the site follows your OS preference. If you change your OS theme, the site updates too.
- **If you have toggled**: the site stays in your chosen mode regardless of OS.
- **No flash**: a small inline script in `app/layout.tsx` (search for `noFlashScript`) runs before React hydrates and applies the correct class to `<html>`, so dark-mode users never see a light-mode flash.

To force a specific mode by default (e.g. always dark for this site), edit `app/globals.css` and remove the `prefers-color-scheme` fallback in the no-flash script, or change `getInitialTheme` in `components/ThemeProvider.tsx`.

To remove dark mode entirely:
1. Delete the `.dark { ... }` block in `app/globals.css`
2. Remove the `<ThemeToggle />` line from `components/Nav.tsx`
3. Remove the no-flash script from `app/layout.tsx`
4. Remove the `<ThemeProvider>` wrapper from `app/layout.tsx`

---

## 7. How to change contact info / social links

Edit `components/Contact.tsx`. The top of the file has the URLs:

```ts
const email = "me.pranavbabu@gmail.com";
const linkedin = "https://www.linkedin.com/in/pranav-babu-in/";
const github = "https://github.com/git-pranavbabu";
```

Change them, save, push. The contact cards update on the next deploy.

To add a new contact channel (e.g. Twitter/X):

1. Add a constant at the top
2. Copy one of the existing `<li>` blocks
3. Add a new SVG icon function at the bottom
4. Save and push

---

## 8. How to change the About / Hero / Footer copy

These are simple edits to the relevant component file:

- **Hero name + one-liner**: `components/Hero.tsx`
- **About bio + employer disclosure**: `components/About.tsx`
- **Footer credits / license**: `components/Footer.tsx`

Edit the JSX text, save, push. No rebuild needed — Vercel does it.

---

## 9. How to change the AI chat behavior

The system prompt (what the AI is told to do) lives in **`lib/prompt.ts`**. The fallback chain for the LLM model lives in **`lib/gemini.ts`**. The preset question chips are in **`components/ChatWidget/ChatWidget.tsx`** (search for `PRESET_QUESTIONS`).

To change a preset question, just edit the array. The widget picks it up on the next deploy.

To change the scope-redirect message, edit `lib/prompt.ts` AND `app/api/ask/route.ts` (both contain the same text — keep them in sync).

---

## 10. How to change the order of sections on the page

Edit `app/page.tsx`. The section order is just the order of the JSX:

```tsx
<Hero />
<Reveal><About /></Reveal>
<Reveal><Projects /></Reveal>
<Reveal><Skills /></Reveal>
<Reveal><Blog /></Reveal>
<Reveal><Contact /></Reveal>
```

Reorder, add, or remove sections here. `Reveal` adds the scroll-triggered
fade-in animation — feel free to drop it if you want a section to appear
without animation.

---

## 11. Deployment workflow (after any change)

```bash
git add .
git commit -m "describe what you changed"
git push
```

Vercel sees the push, builds, and deploys automatically. Takes ~1–2 min.
Watch the deploy in the Vercel dashboard → Deployments tab.

If you change **content only** (blog post, project, skills, resume text) and want the AI to know about it, you also need to re-ingest:

```bash
npm run ingest                          # all projects + resume
npm run ingest:project <slug>           # one project only
```

Re-ingesting does **not** trigger a Vercel deploy — it only updates the
Supabase `documents` table. The chat picks up the new content on the next
chat request (no rebuild needed).

---

## 12. Local development

```bash
npm install        # first time only
npm run dev        # http://localhost:3000
```

For the chat to work locally, you need the same 4 env vars in `.env.local` that you set in Vercel (see `DEPLOY.md` step 2). Without them, the home page works but the chat will return an error.

To run a full re-ingest locally:

```bash
npm run ingest
```

---

## 13. Common pitfalls

- **Forgot frontmatter on a blog post?** The post won't render and may break the Blog section. Every `.md` file in `content/blog/` and `content/projects/` MUST start with the `---` frontmatter block.
- **Edited a project but the AI doesn't know?** Run `npm run ingest:project {slug}`. The chat reads from Supabase, not from the live code.
- **Changed `globals.css` but it didn't take effect?** Hard-refresh (Cmd/Ctrl+Shift+R). Tailwind v4 generates utility classes at build time, so a stale build cache can hide changes.
- **404 on `/resume.pdf`?** Make sure the file exists at `public/resume.pdf` and the name is exactly `resume.pdf` (lowercase). Vercel deploys `public/` as static assets.
- **Build fails on Vercel?** Check the Deployments tab for the build log. Most common cause: missing env vars or a TypeScript error that doesn't appear locally because of a different Node version. Vercel uses Node 22 by default.

---

## 14. Where the AI's knowledge comes from

The RAG agent's answers are based **only** on the content in `content/projects/*/README.md` and `content/resume.md`. If you want the AI to know about something, it has to be in one of those files, AND it has to be in the Supabase `documents` table (which is what `npm run ingest` writes to).

To check what's currently in the RAG corpus, log into Supabase → SQL Editor → run:

```sql
select project, source, length(content) as chars
from documents
order by project, source;
```

---

## 15. Quick recipes

### Add a new project AND make the AI know about it

```bash
# 1. Create the two files (frontmatter + README body)
# 2. Re-ingest just that project
npm run ingest:project my-project
# 3. Commit and push
git add . && git commit -m "Add my-project" && git push
```

### Update the resume

```bash
# 1. Replace public/resume.pdf
# 2. Edit content/resume.md to match
# 3. Re-ingest
npm run ingest:project resume
# 4. Commit and push
git add . && git commit -m "Update resume" && git push
```

### Add a new blog post (no AI ingestion)

```bash
# 1. Create content/blog/my-post.md with frontmatter
# 2. Commit and push
git add . && git commit -m "New post: my-post" && git push
```

### Change a color

```bash
# 1. Edit app/globals.css @theme inline block
# 2. Commit and push
git add . && git commit -m "Tweak accent color" && git push
```

### Edit a preset chat question

```bash
# 1. Edit components/ChatWidget/ChatWidget.tsx (PRESET_QUESTIONS array)
# 2. Commit and push
git add . && git commit -m "Update chat presets" && git push
```

---

That's everything. Most edits take under a minute. If you get stuck, check the file map in section 1 — almost everything has exactly one home.
