# Maintenance Guide

A practical, file-accurate guide to maintaining your portfolio site. Every section is grounded in the actual file structure of the project.

> **Workflow constraint**: All changes are file changes. After editing, run:
> ```bash
> git add .
> git commit -m "describe what you changed"
> git push
> ```
> Vercel auto-deploys on push. For tasks that affect what the AI knows (resume, project, blog), you also need to re-run the ingest script (see [Re-ingest workflow](#7-the-universal-re-ingest-workflow)).

---

## Table of Contents

1. [How to add/update the resume](#1-how-to-addupdate-the-resume)
2. [How to change the AI's initial question and preset chips](#2-how-to-change-the-ais-initial-question-and-preset-chips)
3. [How to add a new project](#3-how-to-add-a-new-project)
4. [How to add a new blog post](#4-how-to-add-a-new-blog-post)
5. [How to add a new skill](#5-how-to-add-a-new-skill)
6. [How to change colors, fonts, and design](#6-how-to-change-colors-fonts-and-design)
7. [The universal re-ingest workflow](#7-the-universal-re-ingest-workflow)
8. [Quick reference table](#8-quick-reference-table)

---

## 1. How to add/update the resume

The site has **two resume surfaces** that are decoupled on purpose. Update both.

### A. The downloadable PDF (the "Download Resume" button)

1. Drop your new file at: `public/resume.pdf` (overwrite the existing one — same path, same name).
2. Commit + push — Vercel picks it up on the next deploy.

### B. The resume the AI knows about (for the chat widget)

1. Open `content/resume.md`.
2. Edit the markdown — it has frontmatter at the top (`title`, `slug`, `summary`) and the body below.
3. **Re-ingest** so the AI picks it up:
   ```bash
   npm run ingest:project resume
   ```
4. Commit + push.

> The two surfaces are independent — you can update the PDF without re-ingesting, or update the markdown without redeploying. **If the AI is going to know about it, you must re-ingest.**

### C. (Optional) Add a "second resume" or alternate version

Currently there's only one resume slot. If you want a second version (e.g. for a specific role), you'd need to:
- Add a `content/resume-{variant}.md` file
- Extend `scripts/ingest.ts` `listSources()` to include it (add a second resume entry)
- Add a second download button in `components/Hero.tsx` (or wherever)

That's a non-trivial change — flag it as a feature request.

---

## 2. How to change the AI's initial question and preset chips

There are two related things — the **preset chips** the user sees when they open the chat, and the **system prompt** the AI operates under.

### A. The preset chips (what the user clicks)

Open `components/ChatWidget/ChatWidget.tsx`, find the `PRESET_QUESTIONS` array near the top (line ~11):

```tsx
const PRESET_QUESTIONS = [
  "Who is Pranav?",
  "What's Pranav's background?",
  "What kind of engineer is Pranav?",
  "What has Pranav built recently?",
  "What are Pranav's strongest projects?",
];
```

Edit any string. Add more (5–7 is the sweet spot — they wrap in the empty state). Keep them answerable from the RAG corpus (projects + resume), otherwise the AI will give the scope-redirect message.

### B. The "first message" the AI shows the user (the welcome card)

In the same file, find the empty-state JSX in the chat panel:

```tsx
<div ...>
  <div ... className="...">About Pranav</div>
  Hi! I'm an AI trained on Pranav's project docs and
  resume. Ask me anything about his work, skills, or background.
</div>
```

Change that paragraph to whatever you want the AI to say to a first-time visitor.

### C. The AI's behavior (system prompt)

Open `lib/prompt.ts`. The `SYSTEM_RULES` constant at the top is the actual instruction sent to the model:

```ts
const SYSTEM_RULES = `You are the AI assistant on Pranav Babu's portfolio site. Pranav is an AI engineer.
Your job: answer the user's question using the context below, in a friendly, approachable tone.
...`;
```

Change the tone, the scope rules, the fallback message — whatever you want. The fallback phrase is hardcoded in **two places** that must stay in sync:
- `lib/prompt.ts` (in `SYSTEM_RULES`)
- `app/api/ask/route.ts` (in `SCOPE_REDIRECT`)

If you change the fallback text, change both, or the out-of-scope response will look wrong.

### D. The model the AI uses (and fallback chain)

Open `lib/gemini.ts`. The `MODEL_CHAIN` array at the top defines the fallback:

```ts
const MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
] as const;
```

Reorder, add, or remove models. The first one is the default; subsequent ones are used only on 429/503 rate-limit responses.

### E. What the AI actually knows

If the AI keeps giving wrong answers or the scope-redirect, the issue is probably the **RAG corpus**, not the prompt. See the [re-ingest workflow](#7-the-universal-re-ingest-workflow) and the blog caveat in [section 4](#4-how-to-add-a-new-blog-post).

---

## 3. How to add a new project

Each project is **two files**: a metadata file (frontmatter) and a body file (rendered in the expanded card + ingested for the AI).

### Files to create

**File 1**: `content/projects/{slug}.md` — metadata + short description

```markdown
---
title: "My New Project"
slug: my-new-project
oneLiner: "One-sentence description shown on the card and used by the AI."
hykon: false                       # true if built at Hykon India Limited
order: 6                            # lower = earlier in the list
tech: ["Python", "FastAPI", "React"]
links:
  github: "https://github.com/you/repo"   # leave "" if no link
  live: "https://example.com"             # leave "" if no link
---

# (Optional) intro content

The body of this frontmatter file is **not** rendered in the card or used
for RAG. Only the README below is.
```

**File 2**: `content/projects/{slug}/README.md` — the body

```markdown
# My New Project

One-paragraph summary of what it does.

## What it does
- Bullet point
- Another bullet point

## Why it matters
- Why this matters

## Highlights
- Cool thing
- Another cool thing
```

> **Important**: the README body is what shows in the expanded card AND what gets embedded into the RAG agent. Use `##` headers — the chunker splits on them, so each header becomes its own searchable chunk.

### Steps

1. Create both files.
2. (Optional) Edit `components/Skills.tsx` if you want a new skill category orb color (the orbs are hardcoded in the `categoryAccents` map).
3. Re-ingest so the AI knows about it:
   ```bash
   npm run ingest:project my-new-project
   ```
   Use the slug, not the title. If the project slug has hyphens, use the slug as-is.
4. Commit + push:
   ```bash
   git add content/projects/my-new-project
   git commit -m "Add my-new-project"
   git push
   ```

### The `order` field

Controls the order cards appear on the homepage (lower = first). Existing values are 1–5, so your new project would be 6+.

---

## 4. How to add a new blog post

### File to create

`content/blog/{slug}.md` — frontmatter + body

```markdown
---
title: "My Blog Post Title"
date: 2026-07-15                       # YYYY-MM-DD; used to sort and display
slug: my-blog-post
summary: "One-sentence summary shown on the card."
---

The body uses standard Markdown. Supports `## headings`, **bold**, *italics*,
- lists, [links](https://example.com), inline `code`, and code blocks.
```

> **Frontmatter is required**. Without it, the post won't render and may break the Blog section.

### Steps

1. Create the file.
2. Commit + push:
   ```bash
   git add content/blog/my-blog-post.md
   git commit -m "New blog post: my-blog-post"
   git push
   ```

### ⚠️ Important caveat: blog posts are NOT in the RAG agent's knowledge base

The current `scripts/ingest.ts` reads only from `content/projects/*/README.md` and `content/resume.md`. Blog posts under `content/blog/` are **not** included in the AI's knowledge.

**If you want the AI to know about a blog post**, you have two options:

**Option A (simple)**: Copy the blog content into `content/resume.md` under a new `## Blog` section, then re-ingest resume. Crude but works.

**Option B (proper)**: Edit `scripts/ingest.ts` to add blog support. In the `listSources()` function, add a blog loop:

```ts
// Blog posts
const blogEntries = await fs.readdir(BLOG_DIR);
for (const entry of blogEntries) {
  if (!entry.endsWith(".md")) continue;
  const slug = entry.replace(/\.md$/, "");
  if (projectFilter && projectFilter !== slug) continue;
  const postPath = path.join(BLOG_DIR, entry);
  sources.push({
    project: slug,
    source: `blog/${entry}`,
    filePath: postPath,
  });
}
```

You'd also need to add `const BLOG_DIR = path.join(CONTENT_DIR, "blog");` at the top, and update the chunker prefix in `main()` to use something like `Source: a blog post by Pranav Babu called "{title}".`

After updating the script, run `npm run ingest` to re-ingest everything including blog posts.

---

## 5. How to add a new skill

Open `content/skills.json`. The file is a JSON array of category objects:

```json
[
  {
    "category": "Languages",
    "skills": ["Python", "JavaScript", "TypeScript", "Deluge"]
  },
  {
    "category": "AI / Agents",
    "skills": ["LangGraph", "LLM agents", "RAG pipelines", "Embeddings"]
  }
]
```

### To add a new skill to an existing category

Add the string to the `skills` array:

```json
{
  "category": "AI / Agents",
  "skills": ["LangGraph", "LLM agents", "RAG pipelines", "Embeddings", "Vector databases"]
}
```

### To add a new category

Add a new object to the array. The category will get its own card on the Skills section with a gradient icon orb.

```json
{
  "category": "Cloud",
  "skills": ["AWS", "GCP", "Vercel", "Supabase"]
}
```

> **Note**: the `categoryAccents` map in `components/Skills.tsx` has predefined gradient colors for: `Languages`, `AI / Agents`, `Backend`, `Frontend`, `Tools & Platforms`. If you create a new category name, it'll get a fallback purple gradient. To get a unique color, add an entry to that map.

### Steps

1. Edit `content/skills.json`.
2. Commit + push:
   ```bash
   git add content/skills.json
   git commit -m "Add Cloud to skills"
   git push
   ```

Skills are **not** part of the RAG agent's knowledge — they're just for the UI. No re-ingest needed.

---

## 6. How to change colors, fonts, and design

All design tokens live in `app/globals.css` in two blocks: `:root` (light mode) and `.dark` (dark mode). All components reference these variables, so changing them updates the whole site.

### Color tokens

| Token | Light | Dark |
|---|---|---|
| `--color-canvas` | `#f4f1fa` | `#1a1625` |
| `--color-foreground` | `#332f3a` | `#f0ecf5` |
| `--color-muted` | `#635f69` | `#a8a3b3` |
| `--color-accent` | `#7c3aed` | `#a78bfa` |
| `--color-accent-alt` | `#db2777` | `#f472b6` |
| `--color-border` | `rgba(124, 58, 237, 0.12)` | `rgba(167, 139, 250, 0.18)` |
| `--color-card` | `rgba(255, 255, 255, 0.65)` | `rgba(45, 35, 60, 0.55)` |

Edit any of these in both blocks. The toggle in the Nav (sun/moon icon) switches between the two.

### Gradient tokens

`--gradient-primary`, `--gradient-accent`, `--gradient-text`, `--gradient-thinking` live in `:root` only and are the same in both modes — they're brand colors, not surface colors.

### Font

Edit `app/layout.tsx` (look for `import { Nunito, DM_Sans } from "next/font/google"`) and update `--font-heading` / `--font-body` in `globals.css`.

> **Tailwind v4 caveat**: this project uses Tailwind v4 with CSS-based theming (`@theme inline`), NOT a `tailwind.config.ts` file. Don't add config the old way — it won't take effect.

---

## 7. The universal re-ingest workflow

Whenever you change content that the AI should know about (resume, project README, blog post after the script update), you need to re-ingest.

```bash
# Ingest everything (resume + all projects)
npm run ingest

# Ingest just one project
npm run ingest:project <slug>
```

The script:
1. Reads the files from `content/`
2. Chunks them by `##` headers
3. Embeds each chunk with Gemini `gemini-embedding-001` (768-dim)
4. Stores in Supabase `documents` table

The script **replaces** existing rows for each project (not appends), so it's safe to re-run.

> **Requires** `.env.local` with `DATABASE_URL`, `GEMINI_API_KEY` set. If you get connection errors, check the env file (see `DEPLOY.md` for the connection string format with the `%3A` for the `:` in the password).

### What does and doesn't need re-ingest

| Content | Re-ingest needed? |
|---|---|
| `content/resume.md` | **Yes** |
| `content/projects/*/README.md` | **Yes** |
| `content/blog/*.md` | No (not auto-ingested — see [section 4 caveat](#4-how-to-add-a-new-blog-post)) |
| `content/skills.json` | No (not in RAG corpus) |
| `public/resume.pdf` | No (not in RAG corpus) |
| Hero / About / Projects / Blog / Contact / Footer copy | No (not in RAG corpus) |

---

## 8. Quick reference table

| You want to... | File(s) to edit | Re-ingest? | Re-deploy? |
|---|---|---|---|
| **Update resume PDF** | `public/resume.pdf` | No | Yes (push) |
| **Update resume text (for AI)** | `content/resume.md` | **Yes** | Yes (push) |
| **Add a project** | `content/projects/{slug}.md` + `content/projects/{slug}/README.md` | **Yes** | Yes (push) |
| **Add a blog post** | `content/blog/{slug}.md` | No (not auto-ingested) | Yes (push) |
| **Make AI know about a blog post** | Edit `scripts/ingest.ts` + `content/blog/{slug}.md` | **Yes** | Yes (push) |
| **Add a skill** | `content/skills.json` | No | Yes (push) |
| **Change preset chat questions** | `components/ChatWidget/ChatWidget.tsx` (`PRESET_QUESTIONS`) | No | Yes (push) |
| **Change AI welcome card text** | `components/ChatWidget/ChatWidget.tsx` (empty state JSX) | No | Yes (push) |
| **Change AI behavior / fallback message** | `lib/prompt.ts` + `app/api/ask/route.ts` (`SCOPE_REDIRECT`) | No | Yes (push) |
| **Change AI model chain** | `lib/gemini.ts` (`MODEL_CHAIN`) | No | Yes (push) |
| **Change colors** | `app/globals.css` (`:root` + `.dark` blocks) | No | Yes (push) |
| **Change fonts** | `app/layout.tsx` (next/font imports) + `app/globals.css` (`--font-heading`, `--font-body`) | No | Yes (push) |
| **Change contact info** | `components/Contact.tsx` (top of file has email/linkedin/github) | No | Yes (push) |
| **Change hero copy** | `components/Hero.tsx` (plain JSX) | No | Yes (push) |
| **Change About copy** | `components/About.tsx` (plain JSX) | No | Yes (push) |
| **Reorder sections** | `app/page.tsx` (JSX order) | No | Yes (push) |
| **Change page title / SEO** | `app/layout.tsx` (`metadata` object) | No | Yes (push) |
| **Change favicon** | `app/icon.tsx` | No | Yes (push) |
| **Change OG image** | `app/opengraph-image.tsx` | No | Yes (push) |

**Every change → `git add . && git commit -m "..." && git push` → Vercel auto-deploys.**

If your change should affect what the AI knows about you, also run `npm run ingest` (or `npm run ingest:project <slug>`) after pushing.
