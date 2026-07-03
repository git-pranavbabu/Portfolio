# Session — Portfolio Website with RAG AI Agent

## ✅ FINAL SPEC — APPROVED 2026-07-03 — ready for planner hand-off

### Planner quick-read
- **One-page Next.js portfolio** (App Router, TS, Tailwind) for Pranav Babu — AI Engineer targeting AI/Agent Engineer roles, audience = recruiters, tone = friendly/approachable
- **5 collapsible project cards** on homepage (no detail pages), 4 Hykon-captioned + 1 personal (Evocode)
- **Floating AI chat widget** (bottom-right, site-wide) with 5 preset chips, single-turn, streaming SSE, scope-locked to projects+resume
- **RAG**: 5 project READMEs + `content/resume.md` → chunked → Gemini `text-embedding-004` (768-dim) → Supabase pgvector → Gemini LLM answer generation
- **Free tier only**: Vercel + Supabase + Gemini + Namecheap → `www.0121210.xyz`
- **Repo**: `github.com/git-pranavbabu/Portfolio` (empty, CC0-1.0 license)
- **No phone, no dark mode, no rate limit, no multi-turn, no analytics, no per-project pages** — all deferred
- **User comfortable** with Next.js, React, embeddings/RAG, Node + Python
- **No timeline pressure** — ship when ready, recruiter-presentable

### Full spec below — read in order: stack → page structure → projects → RAG → deploy

---

## Subject
- **Name**: Pranav Babu
- **Role**: AI Automation Engineer (Intern) @ Hykon India Limited; pre-placement offer as AI Platform Lead
- **Target roles**: AI Engineer / Agent Engineer
- **Primary audience**: Recruiters
- **Tone**: Friendly / approachable
- **First portfolio** — building from scratch

---

## Domain & Hosting
- **Domain**: `www.0121210.xyz` (Namecheap → Vercel)
- **Hosting**: Vercel (free tier)
- **Repo**: `github.com/git-pranavbabu/Portfolio` (currently empty)
- **License**: CC0-1.0 (kept as-is)

## Stack
- **Frontend**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **LLM**: Gemini API — `text-embedding-004` for embeddings, separate model for answer generation
- **Vector DB**: Supabase (pgvector)
- **RAG API**: Vercel Serverless Function
- **Contact channel**: `me.pranavbabu@gmail.com`

---

## Site Structure (single scroll-through page)
**Hero → About → Projects → Skills → Blog → Contact → Footer** + **floating AI chat widget** (bottom-right, site-wide).

## Design Tokens
- Light mode only
- Background: `#FAFAFA`
- Text: `#111`
- Accent: `#2563EB`
- Font: Inter (system fallback)
- No images / logos
- No dark mode
- Lightweight animations only: hover, smooth scroll, expand/collapse on cards, streaming indicator on chat

---

## Projects (v1 — 5 total, all with "Built at Hykon India Limited" caption EXCEPT evocode-ai)

1. **BPAN Automation Web App** *(Hykon)* — Production automation tool that generates and manages unique 21-digit battery identifiers with QR-linked technical data sheets — built and shipped to production in one week.
2. **Naukri AI Candidate Shortlisting Tool** *(Hykon)* — A two-agent Chrome extension that screens and ranks job candidates entirely client-side, cutting manual HR screening time by ~54 hrs/month.
3. **AI Candidate Scoring — Zoho Recruit** *(Hykon)* — An in-app Deluge function that auto-scores and summarizes candidates inside Zoho Recruit, speeding up recruiter review.
4. **Hykon Automation Hub** *(Hykon)* — A self-proposed internal platform that centralizes every AI tool built by the team into one searchable hub — recognized by leadership as a key company initiative, with an ERP-integrated Phase 2 underway.
5. **Evocode: AI-Powered Learning Ecosystem** *(Personal — no Hykon caption)* — Adaptive learning ecosystem using LangGraph to orchestrate LLM agents for generating personalized syllabi and mastery-based assessments. FastAPI + Google Firestore backend, React frontend.

**Default card order**: BPAN → Hykon Hub → Naukri → Zoho Recruit → Evocode (user can reorder via frontmatter `order` field).

**Data model**: `content/projects/{slug}.md` (frontmatter) + `content/projects/{slug}/README.md` (body, also used for RAG). Evocode-ai README = placeholder scaffolded from user's bullets; user replaces later.

---

## Blog
- `/content/blog/*.md` with frontmatter (title, date, slug, summary)
- **Seed post included at launch**: "Why I Like FastAPI" (drafted below)
- New post = drop `.md` in `/content/blog/` → push → Vercel redeploys → post appears inline
- Posts render as collapsible cards (consistent with project cards)

### Seed blog post draft — `content/blog/why-i-like-fastapi.md`
```markdown
---
title: "Why I Like FastAPI"
date: 2026-07-03
slug: why-i-like-fastapi
summary: "A short note on why FastAPI is my go-to for AI engineering work."
---

If you build anything with LLMs, you'll spend a lot of time wrapping them in an API.
I've tried Flask, Django REST, and a few others — but FastAPI is the one I keep coming back to.

It's simple. The decorator-based routing feels natural, the type hints double as
request validation, and the auto-generated docs at `/docs` mean I never have to write
a separate API spec. For an AI engineer who wants to ship agents and RAG pipelines
fast, that combination is hard to beat.

It also plays nicely with the rest of the AI stack. Async support, Pydantic models
for structured LLM outputs, easy streaming responses — everything I need for an
LLM-powered endpoint is one import away.

It's not the right tool for every job, but for the kind of AI apps I like to build,
it's the closest thing to a perfect match I've found.
```

---

## Skills Section
- **Source**: inferred from the 5 project descriptions; user-editable via `content/skills.json` (or `.ts`)
- **Drafted grouping** (placeholder, user can edit):
  - **Languages**: Python, JavaScript, TypeScript, Deluge
  - **AI / Agents**: LangGraph, LLM agents, RAG pipelines, Embeddings
  - **Backend**: FastAPI, Google Firestore, REST APIs
  - **Frontend**: React, Chrome Extension APIs
  - **Tools**: Git, GitHub

---

## AI Chat Widget
- **Placement**: Floating widget, bottom-right, site-wide
- **UI**: Plain "Ask me anything" input + 5 preset question chips above input
- **Behavior**: Single-turn, no memory; streams responses (SSE)
- **Scope**: Projects + resume only
- **Out-of-scope response**: "I don't have that info — please contact Pranav directly at me.pranavbabu@gmail.com"
- **Response shape**: `{ answer }` only — no sources
- **Rate limiting**: Skipped for v1
- **Tone**: Friendly/approachable

### Starter question chips (broad, about Pranav)
1. "Who is Pranav?"
2. "What's Pranav's background?"
3. "What kind of engineer is Pranav?"
4. "What has Pranav built recently?"
5. "What are Pranav's strongest projects?"

---

## RAG Pipeline (offline, run on demand)
1. **Sources ingested**: 5 project READMEs + `content/resume.md`
2. **Chunking**: ~400 words, paragraph-based
3. **Embedding**: Gemini `text-embedding-004` (768 dim)
4. **Storage**: Supabase `documents` table
5. **Script**: `scripts/ingest.ts` (TypeScript), re-runnable, scoped per project
6. **Resume handling**: `content/resume.md` maintained as canonical source; PDF at `/public/resume.pdf` is for the download button only (user drops the file in at deploy time)

## Supabase schema
```sql
create table documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  embedding vector(768) not null,
  source text not null,    -- e.g. "projects/bpan/README.md"
  project text not null,   -- e.g. "bpan", "resume"
  created_at timestamptz default now()
);
create index on documents using ivfflat (embedding vector_cosine_ops) with (lists = 10);
```

## API endpoint
- Route: `app/api/ask/route.ts`
- Method: POST
- Input: `{ question: string }`
- Output: streamed SSE chunks of `answer` text
- Runtime: Node.js (Vercel default)
- Env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`

## System prompt
```
You represent Pranav Babu, an AI engineer.
Using ONLY the following context, answer the user's question in a friendly, approachable tone.

If the question is not about Pranav's projects, background, or skills, respond EXACTLY with:
"I don't have that info — please contact Pranav directly at me.pranavbabu@gmail.com"

Context:
{chunks}

Question:
{question}
```

## Environment variables
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- Local: `.env.local` (gitignored) + `.env.example` (checked in)
- Prod: Vercel dashboard

---

## SEO & Favicon
- **Title**: `Pranav Babu — AI Engineer`
- **Meta description** (drafted): `Portfolio of Pranav Babu — AI Engineer building production AI tools, agentic systems, and RAG pipelines. Currently at Hykon India Limited.`
- **OG image**: auto-generated at `app/opengraph-image.tsx` (text + accent color, no photo)
- **Favicon**: simple `PB` text in white on `#2563EB` rounded square, in `/app/icon.tsx`

---

## Contact (public)
- ✉️ `me.pranavbabu@gmail.com`
- LinkedIn: `linkedin.com/in/pranav-babu-in`
- GitHub: `github.com/git-pranavbabu`
- **No phone number** (privacy)

---

## Deploy sequence
1. Scaffold project locally (Next.js + Tailwind + TS)
2. Drop resume PDF into `/public/resume.pdf`
3. Set `.env.local` with the three env vars
4. Run `npm run dev` and verify all sections
5. Run `npm run ingest` to populate Supabase
6. Test the AI widget end-to-end
7. Push to GitHub
8. Connect repo to Vercel (one-click)
9. Add env vars in Vercel dashboard
10. Add domain in Vercel → point Namecheap DNS to Vercel records
11. Wait for DNS propagation (verify `dig www.0121210.xyz`)
12. Verify on production domain

---

## Out of scope for v1 (deferred)
Rate limiting · multi-turn memory · dark mode · per-project pages · analytics · phone number · sources shown in chat · extra projects beyond the 5 (crawl4ai, Happy-Tails, etc. come later) · caching · input caps / report button.

---

## All decisions resolved — ready for planner hand-off
