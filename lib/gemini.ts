import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
] as const;

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

function isRateLimit(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { status?: number; statusText?: string; message?: string };
  if (e.status === 429 || e.status === 503) return true;
  if (typeof e.message === "string") {
    if (/429|503|quota|rate.?limit|resource.exhausted/i.test(e.message)) return true;
  }
  return false;
}

export async function* streamAnswer(prompt: string): AsyncGenerator<string, void, void> {
  const genai = getClient();
  let lastError: unknown = null;

  for (const modelId of MODEL_CHAIN) {
    try {
      const model = genai.getGenerativeModel({ model: modelId });
      const result = await model.generateContentStream(prompt);
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) yield text;
      }
      return;
    } catch (err) {
      lastError = err;
      if (!isRateLimit(err)) throw err;
    }
  }

  throw lastError ?? new Error("All models in the fallback chain failed");
}
