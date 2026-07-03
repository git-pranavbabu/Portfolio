import { getPool } from "./pg";
import { embedQuery } from "./embeddings";

export type RetrievedChunk = {
  content: string;
  source: string;
  project: string;
  distance: number;
};

export async function retrieveChunks(
  question: string,
  k = 5,
): Promise<RetrievedChunk[]> {
  const embedding = await embedQuery(question);
  const embeddingLiteral = `[${embedding.join(",")}]`;
  const pool = getPool();
  const { rows } = await pool.query(
    `select content, source, project, embedding <=> $1::vector as distance
     from documents
     order by embedding <=> $1::vector
     limit $2`,
    [embeddingLiteral, k],
  );
  return rows.map((r: { content: string; source: string; project: string; distance: number }) => ({
    content: r.content,
    source: r.source,
    project: r.project,
    distance: r.distance,
  }));
}
