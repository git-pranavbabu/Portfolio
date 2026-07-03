import { retrieveChunks } from "@/lib/rag";
import { buildPrompt } from "@/lib/prompt";
import { streamAnswer } from "@/lib/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCOPE_REDIRECT =
  "I don't have that info — please contact Pranav directly at me.pranavbabu@gmail.com";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const question =
    body && typeof body === "object" && "question" in body
      ? String((body as { question: unknown }).question ?? "").trim()
      : "";

  if (!question) {
    return new Response("Missing 'question' field", { status: 400 });
  }

  if (question.length > 1000) {
    return new Response("Question too long (max 1000 chars)", { status: 400 });
  }

  let chunks;
  try {
    chunks = await retrieveChunks(question, 5);
  } catch (err) {
    console.error("retrieveChunks failed", err);
    return new Response("Retrieval failed", { status: 500 });
  }

  if (chunks.length === 0) {
    return new Response(SCOPE_REDIRECT, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const prompt = buildPrompt(chunks, question);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const text of streamAnswer(prompt)) {
          controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        console.error("streamAnswer failed", err);
        controller.enqueue(
          encoder.encode(
            "\n\n[error: failed to generate answer — please try again]",
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
