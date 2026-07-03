# Pranav Babu — Portfolio

Personal portfolio site with an embedded RAG-based AI agent trained on my project docs. Live at **www.0121210.xyz**.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Vercel** for hosting and serverless functions
- **Supabase (pgvector)** for the vector store
- **Gemini API** for embeddings (`gemini-embedding-001`, 768-dim) and answer generation with a fallback chain (`gemini-2.5-flash` → `gemini-3.5-flash` → `gemini-3.1-flash-lite`, streaming)

## Local development

```bash
npm install
cp .env.example .env.local
# fill in: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY, DATABASE_URL
npm run dev
```

Visit http://localhost:3000.

## Ingest content into Supabase (one-time + on demand)

1. Create a Supabase project, then run `supabase/schema.sql` in the SQL editor.
2. Add the Postgres connection string to `.env.local` as `DATABASE_URL`.
3. Run the ingest script:

```bash
npm run ingest              # all projects + resume
npm run ingest:project bpan # single project
```

The script chunks each project README + `content/resume.md` (~400 words), embeds with Gemini, and stores in the `documents` table.

## Project structure

```
app/
  page.tsx                 # single-page scroll (Hero → About → Projects → Skills → Blog → Contact → Footer)
  layout.tsx               # root layout, Inter font, metadata
  icon.tsx                 # PB favicon
  opengraph-image.tsx      # OG image generator
  api/ask/route.ts         # RAG endpoint (streaming)
components/
  Hero, About, Projects, ProjectCard, Skills, Blog, BlogPostCard, Contact, Footer, Nav
  OpenChatButton
  ChatWidget/ChatWidget.tsx
content/
  projects/{slug}.md       # project metadata
  projects/{slug}/README.md # project body (also ingested)
  blog/*.md                # blog posts
  skills.json              # skills by category
  resume.md                # resume (ingested)
lib/
  content.ts               # markdown loaders
  markdown.ts              # remark + gray-matter
  pg.ts                    # pg Pool singleton
  embeddings.ts            # Gemini embedQuery
  rag.ts                   # retrieveChunks
  prompt.ts                # system prompt
  gemini.ts                # streaming LLM
  types.ts
scripts/
  ingest.ts                # CLI: npm run ingest
supabase/
  schema.sql               # pgvector table + index
public/
  resume.pdf               # downloadable resume (replace with real PDF)
```

## License

Content licensed under [CC0-1.0](./LICENSE). Code is provided as-is.
