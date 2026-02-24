import { NextResponse } from "next/server";
import { getBrokerInstance } from "@/lib/server/compute-client";
import { ethers } from "ethers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amount = Number(body?.amount ?? 1); // default 1 OG
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "amount (OG) must be provided and > 0" }, { status: 400 });
    }

    const broker = await getBrokerInstance();
    if (!broker) {
      return NextResponse.json({ error: "Compute broker not initialized" }, { status: 500 });
    }

    // Check existing ledger first
    const existing = await broker.ledger.getLedger();
    const rawBalance =
      typeof (existing as any).totalBalance === "bigint"
        ? (existing as any).totalBalance
        : typeof (existing as any).balance === "bigint"
        ? (existing as any).balance
        : 0n;

    if (rawBalance && rawBalance !== 0n) {
      return NextResponse.json({ ok: true, message: "Ledger already exists", ledger: existing });
    }

    // call addLedger with parsed ether units (neurons). Use any cast because SDK types differ across versions.
    const neurons = ethers.parseEther(String(amount));
    const ogNumber = Number(ethers.formatEther(neurons));
    try {
      // SDK variants expect OG as a number in many versions; pass numeric OG
      await (broker.ledger as any).addLedger(ogNumber);
    } catch (err: any) {
      return NextResponse.json({ error: "addLedger failed", detail: err?.message ?? String(err) }, { status: 500 });
    }

    const ledger = await broker.ledger.getLedger();
    return NextResponse.json({ ok: true, ledger });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

