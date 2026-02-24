import { NextResponse } from "next/server";
import { getAddress, isAddress, parseEther } from "viem";
import { indexMarketplaceData } from "@/lib/server/indexer";
import { getClientEnv, isMockMode } from "@/lib/env";
import { serverPublicClient } from "@/lib/server/public-client";
import { EDUVAULT_MARKETPLACE_ABI } from "@/lib/contracts/eduvault-marketplace";
import { MOCK_PROMPTS } from "@/lib/mock-data";
import { appendMockPrompt, readMockPrompts } from "@/lib/server/mock-prompt-store";
import type { PromptListing, PromptMetadata } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seller = searchParams.get("seller")?.toLowerCase();
    const buyer = searchParams.get("buyer");

    const indexed = await indexMarketplaceData();
    const localMockPrompts = await readMockPrompts();
    const basePrompts = indexed.prompts.length > 0 ? indexed.prompts : MOCK_PROMPTS;
    const localIds = new Set(localMockPrompts.map((entry) => entry.promptId));
    let prompts = [
      ...localMockPrompts,
      ...basePrompts.filter((entry) => !localIds.has(entry.promptId)),
    ];

    if (seller) {
      prompts = prompts.filter((prompt) => prompt.seller.toLowerCase() === seller);
      if (prompts.length === 0 && isAddress(seller)) {
        const sellerAddress = getAddress(seller);
        prompts = MOCK_PROMPTS.slice(0, 3).map((entry, index) => ({
          ...entry,
          promptId: 90_000 + index,
          seller: sellerAddress,
          metadataURI: `0g://demo-seller-${index + 1}`,
          metadata: {
            ...entry.metadata!,
            creatorHandle: `@${sellerAddress.slice(2, 8)}`,
          },
        }));
      }
    }

    if (buyer) {
      const env = getClientEnv();
      if (env.NEXT_PUBLIC_MARKETPLACE_ADDRESS && indexed.prompts.length > 0) {
        const safeBuyer = getAddress(buyer);
        prompts = await Promise.all(
          prompts.map(async (prompt) => {
            try {
              const licensed = await serverPublicClient.readContract({
                address: env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
                abi: EDUVAULT_MARKETPLACE_ABI,
                functionName: "hasLicense",
                args: [BigInt(prompt.promptId), safeBuyer],
              });
              return { ...prompt, licensed };
            } catch {
              return { ...prompt, licensed: false };
            }
          }),
        );
      } else {
        prompts = prompts.slice(0, 4).map((prompt, index) => ({
          ...prompt,
          licensed: index < 2,
        }));
      }
    }

    const sorted = prompts
      .filter((entry) => entry.isActive)
      .sort((a, b) => b.promptId - a.promptId);

    return NextResponse.json({ prompts: sorted });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch prompts" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const env = getClientEnv();
    if (!isMockMode() && env.NEXT_PUBLIC_MARKETPLACE_ADDRESS) {
      return NextResponse.json(
        { error: "Mock publish endpoint is disabled in live mode." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const metadata = body?.metadata as PromptMetadata | undefined;
    const sellerInput = String(body?.seller ?? "").trim();
    const metadataURIInput = String(body?.metadataURI ?? "").trim();
    const priceWeiInput = String(body?.priceWei ?? "").trim();
    const priceEthInput = String(body?.priceEth ?? "").trim();

    if (!metadata || typeof metadata !== "object") {
      return NextResponse.json({ error: "metadata is required" }, { status: 400 });
    }

    const title = String(metadata.title ?? "").trim();
    const shortDescription = String(metadata.shortDescription ?? "").trim();
    const features = Array.isArray(metadata.features)
      ? metadata.features.map((entry) => String(entry).trim()).filter(Boolean)
      : [];
    const category = String(metadata.category ?? "").trim();

    if (!title || !shortDescription || features.length === 0) {
      return NextResponse.json(
        { error: "title, shortDescription, and at least one feature are required" },
        { status: 400 },
      );
    }

    if (!["Coding", "Writing", "Research", "All"].includes(category)) {
      return NextResponse.json({ error: "Invalid prompt category" }, { status: 400 });
    }

    let priceWei = "0";
    if (/^\d+$/.test(priceWeiInput) && BigInt(priceWeiInput) > 0n) {
      priceWei = priceWeiInput;
    } else {
      try {
        priceWei = parseEther(priceEthInput || "0").toString();
      } catch {
        return NextResponse.json({ error: "Invalid priceEth value" }, { status: 400 });
      }
    }

    if (BigInt(priceWei) <= 0n) {
      return NextResponse.json({ error: "Prompt price must be greater than zero" }, { status: 400 });
    }

    const seller = isAddress(sellerInput)
      ? getAddress(sellerInput)
      : "0x000000000000000000000000000000000000dEaD";

    const indexed = await indexMarketplaceData();
    const existingLocal = await readMockPrompts();
    const maxId = [...MOCK_PROMPTS, ...indexed.prompts, ...existingLocal].reduce(
      (max, prompt) => Math.max(max, prompt.promptId),
      0,
    );

    const prompt: PromptListing = {
      promptId: maxId + 1,
      seller,
      priceWei,
      metadataURI: metadataURIInput || `0g://mock-published-${Date.now()}`,
      isActive: true,
      metadata: {
        ...metadata,
        title,
        shortDescription,
        category: category as PromptMetadata["category"],
        features,
        version: metadata.version || "1.0.0",
      },
    };

    const saved = await appendMockPrompt(prompt);
    return NextResponse.json({ prompt: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create mock prompt" },
      { status: 500 },
    );
  }
}
