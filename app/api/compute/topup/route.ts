import { NextResponse } from "next/server";
import { getBrokerInstance } from "@/lib/server/compute-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amount = Number(body?.amount ?? 0);
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "amount (OG) must be provided and > 0" }, { status: 400 });
    }

    const broker = await getBrokerInstance();
    if (!broker) {
      return NextResponse.json({ error: "Compute broker not initialized" }, { status: 500 });
    }

    await broker.ledger.depositFund(amount);
    const ledger = await broker.ledger.getLedger();
    return NextResponse.json({ ok: true, ledger });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

