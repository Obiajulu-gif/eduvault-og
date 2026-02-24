import { NextResponse } from "next/server";
import { indexMarketplaceData } from "@/lib/server/indexer";
import { MOCK_PROMPTS } from "@/lib/mock-data";
import { readMockPrompts } from "@/lib/server/mock-prompt-store";

export const runtime = "nodejs";

export async function GET(_: Request, context: { params: { promptId: string } }) {
  try {
    const promptId = Number(context.params.promptId);
    if (Number.isNaN(promptId)) {
      return NextResponse.json({ error: "Invalid promptId" }, { status: 400 });
    }

    const indexed = await indexMarketplaceData();
    const localMockPrompts = await readMockPrompts();
    const basePrompts = indexed.prompts.length > 0 ? indexed.prompts : MOCK_PROMPTS;
    const localIds = new Set(localMockPrompts.map((entry) => entry.promptId));
    const catalog = [
      ...localMockPrompts,
      ...basePrompts.filter((entry) => !localIds.has(entry.promptId)),
    ];
    const prompt = catalog.find((entry) => entry.promptId === promptId);

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json({ prompt });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch prompt" },
      { status: 500 },
    );
  }
}
