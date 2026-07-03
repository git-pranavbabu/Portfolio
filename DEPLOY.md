# Deploy & Verification — User Action Items

The site code is complete, committed, and pushed to `github.com/git-pranavbabu/Portfolio`. The following user-action items are required to make the site live at `https://www.0121210.xyz`.

---

## 1. Supabase setup (5 min)

1. Go to https://supabase.com/dashboard and create a new project (free tier is fine).
2. Once the project is ready, open the **SQL Editor** and run the contents of `supabase/schema.sql` from this repo. This creates the `pgvector` extension, the `documents` table, and the index.
3. From **Project Settings → Database**, copy:
   - **Connection string** (Direct / port 5432) → for the local ingest script
   - **Connection string** (Transaction mode / port 6543) → for the Vercel serverless function (handles more concurrent connections)
   - **Project URL** (`https://xxxxx.supabase.co`) → `SUPABASE_URL`
   - **Service role key** (under API keys, NOT the anon key) → `SUPABASE_SERVICE_ROLE_KEY`

Keep these four values safe — you'll use them in step 2 and step 3.

---

## 2. Fill in `.env.local` and run ingest (10 min)

Open `C:\Users\mepra\gitRepo\portfolio_website\.env.local` in your editor and fill in:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GEMINI_API_KEY=AIza...
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

Then from the portfolio folder, run:

```bash
npm run ingest
```

This will:
- Read all 5 project READMEs + `content/resume.md`
- Chunk each into ~400-word pieces
- Embed each chunk with Gemini `text-embedding-004`
- Insert into Supabase `documents` table

Expected output: ~30–60 chunks inserted. It takes a few minutes (Gemini free tier rate limits). The script also has a 200ms delay between embedding calls to be polite.

Verify in the Supabase dashboard: open **Table Editor → documents**, you should see rows with `content`, `embedding` (shown as `[0.012, -0.034, ...]`), `source`, and `project` populated.

If you ever update a project's README or your resume, just re-run the same command — it will clear+reinsert all projects. Or for a single project:

```bash
npm run ingest:project bpan
```

---

## 3. Vercel setup (5 min)

1. Go to https://vercel.com/new and sign in with the GitHub account that owns `git-pranavbabu/Portfolio`.
2. Click **Import** next to the `Portfolio` repo.
3. Vercel will auto-detect it's a Next.js project. Leave all settings default.
4. **Before clicking Deploy**, expand the **Environment Variables** section and add:
   - `SUPABASE_URL` → your project URL
   - `SUPABASE_SERVICE_ROLE_KEY` → your service role key
   - `GEMINI_API_KEY` → your Gemini key
   - `DATABASE_URL` → the **transaction mode** connection string (port 6543) for serverless
5. Click **Deploy**. First build takes ~1–2 min.

Once the build is green, Vercel gives you a `*.vercel.app` URL. Test it before continuing.

---

## 4. Connect `www.0121210.xyz` (5 min + DNS propagation)

1. In Vercel: open your project → **Settings** → **Domains**.
2. Type `www.0121210.xyz` and click **Add**.
3. Vercel will display the exact DNS records you need (typically an `A` record for the root and a `CNAME` for `www`).
4. In Namecheap: go to **Domain List** → click **Manage** next to your domain → **Advanced DNS**.
5. Add the records Vercel gave you. Use the values Vercel shows — do not copy from elsewhere.
6. Wait for DNS propagation (usually under 30 min, can take up to 24h).
7. Vercel will automatically issue a Let's Encrypt SSL cert once DNS resolves.

You can check propagation from any terminal:
```bash
nslookup www.0121210.xyz
# or
Resolve-DnsName www.0121210.xyz
```

---

## 5. Replace the placeholder resume PDF

The current `public/resume.pdf` is a placeholder. Drop your real `Pranav_Babu-Resume.pdf` in there, then commit + push:

```bash
# in C:\Users\mepra\gitRepo\portfolio_website
# (replace the placeholder file with your real one)
git add public/resume.pdf
git commit -m "Add real resume PDF"
git push
```

Vercel auto-deploys on every push. Update `content/resume.md` with your real resume text and re-run `npm run ingest` so the RAG agent has the up-to-date content.

---

## 6. Production smoke test

Once the domain resolves, run through this checklist:

- [ ] `https://www.0121210.xyz/` loads
- [ ] All sections visible: Hero, About, Projects, Skills, Blog, Contact, Footer
- [ ] Each project card expands/collapses when clicked
- [ ] Blog post card expands/collapses
- [ ] "Download Resume" button downloads `Pranav_Babu-Resume.pdf`
- [ ] Floating chat button (bottom-right) opens the chat panel
- [ ] Each preset question chip sends a question and shows a streaming answer
- [ ] An out-of-scope question (e.g. "What's the weather?") returns the scope-redirect message
- [ ] LinkedIn and GitHub links open correctly
- [ ] Page title in the browser tab is "Pranav Babu — AI Engineer"
- [ ] Open-graph image shows when sharing on LinkedIn / Twitter (use their share debuggers)

---

## 7. Optional post-launch improvements (deferred from v1)

These were intentionally left out — add later when you want:

- **Rate limiting** (Upstash Redis or Vercel KV)
- **Multi-turn conversation memory** (session handling)
- **Dark mode toggle**
- **Per-project detail pages** (currently collapsed inline)
- **Analytics** (privacy-friendly: Plausible or Vercel Web Analytics)
- **More projects** (copycrawl4ai, Happy-Tails, etc. — drop a new `content/projects/{slug}.md` + `content/projects/{slug}/README.md` and re-run ingest)
- **More blog posts** (drop a new `.md` in `content/blog/` and push)

---

## Out-of-scope answers (FAQs)

**Q: Will I need to re-ingest if I edit a single project?**
A: Run `npm run ingest:project {slug}` for just that project. Or `npm run ingest` for all (it clears all projects, then re-inserts).

**Q: What happens if Gemini's free tier is rate-limited during ingest?**
A: The script has a 200ms delay between embedding calls. If you still hit limits, just re-run the script — it will skip already-inserted chunks if you re-include the `clearProject` call (which it does by default when a `--project` filter is set, and the next call can be a full re-ingest).

**Q: What if the Vercel free tier isn't enough?**
A: At portfolio-level traffic (low hundreds of visits per month), free tier is more than enough. Gemini's free tier handles the chat easily. If you ever hit limits, the swap path is documented in the original plan.

**Q: Will the chat work without me running anything?**
A: Yes — the Vercel function calls Supabase (which you populated in step 2) and Gemini on every chat request. The ingest only needs to be re-run when you update content.
