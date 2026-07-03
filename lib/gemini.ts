import { GoogleGenerativeAI } from "@google/generative-ai";

const GENERATION_MODEL = "gemini-1.5-flash";

declare global {
  // eslint-disable-next-line no-var
  var __genaiGen: GoogleGenerativeAI | undefined;
}

function getClient(): GoogleGenerativeAI {
  if (globalThis.__genaiGen) return globalThis.__genaiGen;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  const client = new GoogleGenerativeAI(apiKey);
  globalThis.__genaiGen = client;
  return client;
}

export async function* streamAnswer(prompt: string): AsyncGenerator<string, void, void> {
  const genai = getClient();
  const model = genai.getGenerativeModel({ model: GENERATION_MODEL });
  const result = await model.generateContentStream(prompt);
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}
