import { streamPromptInference } from "@/lib/server/compute-client";
import { uploadJsonToStorage } from "@/lib/server/storage-client";

export const runtime = "nodejs";

function sseLine(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const promptTitle = String(body?.promptTitle ?? "Untitled Prompt");
  const template = String(body?.template ?? "");
  const inputs = body?.inputs ?? {};

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const write = async (payload: unknown) => writer.write(encoder.encode(sseLine(payload)));

  const fullPrompt = `Prompt Tool: ${promptTitle}\n\nTemplate:\n${template}\n\nInputs:\n${JSON.stringify(inputs, null, 2)}\n\nReturn detailed structured output.`;

  void (async () => {
    try {
      await write({ type: "log", message: "Starting compute job on 0G network..." });

      const result = await streamPromptInference(fullPrompt, {
        onLog: async (message) => {
          await write({ type: "log", message });
        },
        onChunk: async (chunk) => {
          await write({ type: "chunk", chunk });
        },
        onProgress: async (progress) => {
          await write({ type: "progress", progress });
        },
      });

      const artifact = {
        promptTitle,
        inputs,
        output: result.output,
        provider: result.provider,
        model: result.model,
        createdAt: new Date().toISOString(),
      };

      const uploaded = await uploadJsonToStorage(artifact, `run-${Date.now()}.json`);
      await write({ type: "done", outputRef: uploaded.uri, payload: artifact });
    } catch (error) {
      await write({ type: "error", message: error instanceof Error ? error.message : "Streaming job failed" });
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
