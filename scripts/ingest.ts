import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pool } from "pg";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");
const RESUME_PATH = path.join(CONTENT_DIR, "resume.md");
const EMBEDDING_MODEL = "text-embedding-004";
const TARGET_WORDS_PER_CHUNK = 400;
const MAX_CHARS_PER_CHUNK = TARGET_WORDS_PER_CHUNK * 6; // soft cap

type SourceFile = {
  project: string;
  source: string;
  filePath: string;
};

function parseArgs() {
  const args = process.argv.slice(2);
  let project: string | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--project" && args[i + 1]) {
      project = args[i + 1];
      i++;
    }
  }
  return { project };
}

async function listSources(projectFilter: string | null): Promise<SourceFile[]> {
  const sources: SourceFile[] = [];

  // Projects
  const projectEntries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
  for (const entry of projectEntries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const slug = entry.name.replace(/\.md$/, "");
    if (projectFilter && projectFilter !== slug) continue;
    const readmePath = path.join(PROJECTS_DIR, slug, "README.md");
    try {
      await fs.access(readmePath);
    } catch {
      console.warn(`[skip] ${slug}: no README.md at ${readmePath}`);
      continue;
    }
    sources.push({
      project: slug,
      source: `projects/${slug}/README.md`,
      filePath: readmePath,
    });
  }

  // Resume
  if (!projectFilter || projectFilter === "resume") {
    try {
      await fs.access(RESUME_PATH);
      sources.push({
        project: "resume",
        source: "resume.md",
        filePath: RESUME_PATH,
      });
    } catch {
      console.warn(`[skip] resume: no resume.md`);
    }
  }

  return sources;
}

function chunkMarkdown(md: string): string[] {
  const { content } = matter(md);
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const chunks: string[] = [];
  let current = "";
  let currentWords = 0;

  for (const p of paragraphs) {
    const words = p.split(/\s+/).length;

    if (currentWords + words > TARGET_WORDS_PER_CHUNK * 1.4 && current.length > 0) {
      chunks.push(current.trim());
      current = p;
      currentWords = words;
      continue;
    }

    if (p.length > MAX_CHARS_PER_CHUNK) {
      // long paragraph — split by sentences
      const sentences = p.split(/(?<=[.!?])\s+/);
      for (const s of sentences) {
        if (current.length + s.length > MAX_CHARS_PER_CHUNK && current.length > 0) {
          chunks.push(current.trim());
          current = s;
        } else {
          current = current ? `${current} ${s}` : s;
        }
      }
      currentWords = current.split(/\s+/).length;
      continue;
    }

    current = current ? `${current}\n\n${p}` : p;
    currentWords += words;
  }

  if (current.trim().length > 0) {
    chunks.push(current.trim());
  }

  return chunks;
}

async function embed(genai: GoogleGenerativeAI, text: string): Promise<number[]> {
  const model = genai.getGenerativeModel({ model: EMBEDDING_MODEL });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function clearProject(pool: Pool, project: string) {
  await pool.query("delete from documents where project = $1", [project]);
}

async function insertChunk(
  pool: Pool,
  row: { content: string; embedding: number[]; source: string; project: string },
) {
  const embeddingLiteral = `[${row.embedding.join(",")}]`;
  await pool.query(
    `insert into documents (content, embedding, source, project)
     values ($1, $2::vector, $3, $4)`,
    [row.content, embeddingLiteral, row.source, row.project],
  );
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!dbUrl) throw new Error("DATABASE_URL is required");
  if (!apiKey) throw new Error("GEMINI_API_KEY is required");

  const { project: projectFilter } = parseArgs();
  const sources = await listSources(projectFilter);
  if (sources.length === 0) {
    console.log("No sources to ingest.");
    return;
  }

  const pool = new Pool({ connectionString: dbUrl, max: 4 });
  const genai = new GoogleGenerativeAI(apiKey);

  let totalChunks = 0;
  for (const src of sources) {
    console.log(`\n→ ${src.source} (project: ${src.project})`);
    const md = await fs.readFile(src.filePath, "utf-8");
    const chunks = chunkMarkdown(md);
    console.log(`  ${chunks.length} chunk(s)`);

    if (projectFilter) {
      await clearProject(pool, src.project);
      console.log(`  cleared existing rows for project="${src.project}"`);
    }

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      process.stdout.write(`  [${i + 1}/${chunks.length}] embedding… `);
      const embedding = await embed(genai, chunk);
      await insertChunk(pool, {
        content: chunk,
        embedding,
        source: src.source,
        project: src.project,
      });
      process.stdout.write("ok\n");
      totalChunks++;
      // small sleep to be polite to the Gemini free tier
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  await pool.end();
  console.log(`\nDone. Inserted ${totalChunks} chunk(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
