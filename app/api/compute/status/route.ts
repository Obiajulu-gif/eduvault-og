import { NextResponse } from "next/server";
import { getComputeStatus } from "@/lib/server/compute-client";

export const runtime = "nodejs";

export async function GET() {
  try {
    const status = await getComputeStatus();
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

