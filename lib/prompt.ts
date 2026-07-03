import type { RetrievedChunk } from "./rag";

const SYSTEM_RULES = `You represent Pranav Babu, an AI engineer.
Using ONLY the following context, answer the user's question in a friendly, approachable tone.

If the question is not about Pranav's projects, background, or skills, respond EXACTLY with:
"I don't have that info — please contact Pranav directly at me.pranavbabu@gmail.com"`;

export function buildPrompt(chunks: RetrievedChunk[], question: string): string {
  const context = chunks
    .map((c, i) => `[${i + 1}] (source: ${c.source})\n${c.content}`)
    .join("\n\n---\n\n");

  return `${SYSTEM_RULES}

Context:
${context}

Question:
${question}`;
}
