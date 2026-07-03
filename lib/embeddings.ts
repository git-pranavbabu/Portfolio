import { GoogleGenerativeAI } from "@google/generative-ai";

const EMBEDDING_MODEL = "text-embedding-004";

declare global {
  // eslint-disable-next-line no-var
  var __genai: GoogleGenerativeAI | undefined;
}

function getClient(): GoogleGenerativeAI {
  if (globalThis.__genai) return globalThis.__genai;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  const client = new GoogleGenerativeAI(apiKey);
  globalThis.__genai = client;
  return client;
}

export async function embedQuery(text: string): Promise<number[]> {
  const genai = getClient();
  const model = genai.getGenerativeModel({ model: EMBEDDING_MODEL });
  const result = await model.embedContent(text);
  return result.embedding.values;
}
