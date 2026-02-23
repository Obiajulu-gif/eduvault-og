import { NextResponse } from "next/server";
import { inferSkillMapping } from "@/lib/server/compute-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = String(body?.input ?? "").trim();

    if (!input) {
      return NextResponse.json({ error: "input is required" }, { status: 400 });
    }

    const result = await inferSkillMapping(input);

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Inference failed" },
      { status: 500 },
    );
  }
}
