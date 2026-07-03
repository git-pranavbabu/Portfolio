import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { renderMarkdown } from "./markdown";
import type { BlogPost, Project } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");
const SKILLS_PATH = path.join(CONTENT_DIR, "skills.json");

export async function getProjects(): Promise<Project[]> {
  const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
  const projectFiles = entries.filter(
    (e) => e.isFile() && e.name.endsWith(".md"),
  );

  const projects = await Promise.all(
    projectFiles.map(async (entry) => {
      const slug = entry.name.replace(/\.md$/, "");
      const raw = await fs.readFile(path.join(PROJECTS_DIR, entry.name), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        oneLiner: String(data.oneLiner ?? ""),
        hykon: Boolean(data.hykon),
        order: Number(data.order ?? 999),
        tech: Array.isArray(data.tech) ? data.tech.map(String) : [],
        links: {
          github: data.links?.github ? String(data.links.github) : "",
          live: data.links?.live ? String(data.links.live) : "",
        },
      } satisfies Project;
    }),
  );

  return projects.sort((a, b) => a.order - b.order);
}

export async function getProjectBodyHtml(slug: string): Promise<string> {
  const readmePath = path.join(PROJECTS_DIR, slug, "README.md");
  try {
    const raw = await fs.readFile(readmePath, "utf-8");
    return await renderMarkdown(raw);
  } catch {
    return "";
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }
  const blogFiles = entries.filter((n) => n.endsWith(".md"));

  const posts = await Promise.all(
    blogFiles.map(async (file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        date: String(data.date ?? ""),
        summary: String(data.summary ?? ""),
      } satisfies BlogPost;
    }),
  );

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getBlogPostBodyHtml(slug: string): Promise<string> {
  const postPath = path.join(BLOG_DIR, `${slug}.md`);
  try {
    const raw = await fs.readFile(postPath, "utf-8");
    return await renderMarkdown(raw);
  } catch {
    return "";
  }
}

export type SkillCategory = {
  category: string;
  skills: string[];
};

export async function getSkills(): Promise<SkillCategory[]> {
  try {
    const raw = await fs.readFile(SKILLS_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.map((cat: { category?: string; skills?: unknown[] }) => ({
      category: String(cat.category ?? ""),
      skills: Array.isArray(cat.skills) ? cat.skills.map(String) : [],
    }));
  } catch {
    return [];
  }
}
