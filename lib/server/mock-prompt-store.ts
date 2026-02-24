import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PromptListing } from "@/lib/types";

const DATA_ROOT = path.join(process.cwd(), ".eduvault");
const PROMPTS_PATH = path.join(DATA_ROOT, "mock-prompts.json");

async function ensureStore() {
  await mkdir(DATA_ROOT, { recursive: true });
}

export async function readMockPrompts(): Promise<PromptListing[]> {
  try {
    const raw = await readFile(PROMPTS_PATH, "utf8");
    const parsed = JSON.parse(raw) as PromptListing[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeMockPrompts(prompts: PromptListing[]) {
  await ensureStore();
  await writeFile(PROMPTS_PATH, JSON.stringify(prompts, null, 2), "utf8");
}

export async function appendMockPrompt(prompt: PromptListing): Promise<PromptListing> {
  const existing = await readMockPrompts();
  const next = [prompt, ...existing.filter((entry) => entry.promptId !== prompt.promptId)];
  await writeMockPrompts(next);
  return prompt;
}
