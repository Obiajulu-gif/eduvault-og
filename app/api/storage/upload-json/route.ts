import { NextResponse } from "next/server";
import { uploadJsonToStorage } from "@/lib/server/storage-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = body?.data ?? body;

    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "JSON body is required" }, { status: 400 });
    }

    const fileName = body?.fileName ?? `metadata-${Date.now()}.json`;
    const uploaded = await uploadJsonToStorage(data, fileName);

    return NextResponse.json(uploaded);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "JSON upload failed" },
      { status: 500 },
    );
  }
}
