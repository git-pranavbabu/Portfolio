import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";

export async function renderMarkdown(md: string): Promise<string> {
  const file = matter(md);
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(file.content);
  return processed.toString();
}
