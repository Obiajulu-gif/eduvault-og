import { NextResponse } from "next/server";
import { getAddress } from "viem";
import { indexMarketplaceData } from "@/lib/server/indexer";
import { getClientEnv } from "@/lib/env";
import { serverPublicClient } from "@/lib/server/public-client";
import { EDUVAULT_MARKETPLACE_ABI } from "@/lib/contracts/eduvault-marketplace";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seller = searchParams.get("seller")?.toLowerCase();
    const buyer = searchParams.get("buyer");

    const indexed = await indexMarketplaceData();
    let prompts = indexed.prompts;

    if (seller) {
      prompts = prompts.filter((prompt) => prompt.seller.toLowerCase() === seller);
    }

    if (buyer) {
      const env = getClientEnv();
      if (env.NEXT_PUBLIC_MARKETPLACE_ADDRESS) {
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
      }
    }

    return NextResponse.json({ prompts });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch prompts" },
      { status: 500 },
    );
  }
}
