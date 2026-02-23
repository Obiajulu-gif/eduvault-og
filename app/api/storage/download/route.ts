import { NextResponse } from "next/server";
import { downloadFromStorage } from "@/lib/server/storage-client";

export const runtime = "nodejs";

function detectType(ref: string) {
  if (ref.endsWith(".json")) return "application/json";
  if (ref.endsWith(".txt") || ref.endsWith(".prompt")) return "text/plain";
  if (ref.endsWith(".pdf")) return "application/pdf";
  return "application/octet-stream";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get("ref");

    if (!ref) {
      return NextResponse.json({ error: "Missing ref query parameter" }, { status: 400 });
    }

    const downloaded = await downloadFromStorage(ref);

    return new NextResponse(downloaded.data, {
      status: 200,
      headers: {
        "Content-Type": detectType(ref),
        "Content-Disposition": `attachment; filename="${ref.replace(/^0g:\/\//, "")}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Download failed" },
      { status: 500 },
    );
  }
}
