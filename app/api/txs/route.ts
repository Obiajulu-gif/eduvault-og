import { NextResponse } from "next/server";
import { indexMarketplaceData } from "@/lib/server/indexer";
import { MOCK_TXS } from "@/lib/mock-data";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address")?.toLowerCase();

    const indexed = await indexMarketplaceData();
    let transactions = indexed.txs.length > 0 ? indexed.txs : MOCK_TXS;

    if (address) {
      transactions = transactions.filter(
        (tx) =>
          tx.txHash.toLowerCase().includes(address.slice(2, 6)) ||
          tx.id.toLowerCase().includes(address.slice(2, 6)),
      );
    }

    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
