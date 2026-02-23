import { NextResponse } from "next/server";
import { streamPromptInference } from "@/lib/server/compute-client";

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
}

function sseLine(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

const LEARNING_PATH_SYSTEM_PROMPT = `You are an AI Learning Path Advisor. Your role is to help users create personalized learning paths and career guides based on their uploaded materials, skills, and goals.

When a user uploads materials or describes their background, you should:
1. Analyze their current skills and knowledge
2. Identify gaps and areas for improvement
3. Create a structured learning path with milestones
4. Provide career guidance relevant to their goals
5. Suggest specific resources or next steps

Format your responses clearly with:
- Learning phases/weeks
- Specific skills to develop
- Practical projects or exercises
- Career pathways to explore

Be encouraging and specific in your recommendations.`;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const messages = (body?.messages ?? []) as ChatMessage[];
  const uploadedContent = body?.uploadedContent as string | undefined;

  if (!messages.length) {
    return NextResponse.json({ error: "Messages are required" }, { status: 400 });
  }

  const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content ?? "";
  
  let contextPrompt = LEARNING_PATH_SYSTEM_PROMPT;
  
  if (uploadedContent) {
    contextPrompt += `\n\nUser has uploaded the following materials:\n${uploadedContent}`;
  }
  
  if (messages.length > 1) {
    const conversationHistory = messages
      .slice(0, -1)
      .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");
    contextPrompt += `\n\nConversation history:\n${conversationHistory}`;
  }

  const fullPrompt = `${contextPrompt}\n\nCurrent user message: ${lastUserMessage}\n\nProvide a helpful, structured response with learning path recommendations.`;

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const write = async (payload: unknown) => {
    try {
      await writer.write(encoder.encode(sseLine(payload)));
    } catch {
      // Stream closed
    }
  };

  void (async () => {
    try {
      await write({ type: "log", message: "Analyzing your request..." });

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

      await write({ type: "done", output: result.output });
    } catch (error) {
      await write({ type: "error", message: error instanceof Error ? error.message : "Chat failed" });
    } finally {
      try {
        await writer.close();
      } catch {
        // Already closed
      }
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
