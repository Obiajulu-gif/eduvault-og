import type { PromptListing, TxRecord, SkillMappingResult } from "@/lib/types";
import { MOCK_PROMPTS, MOCK_TXS } from "@/lib/mock-data";

async function parseJson<T>(response: Response): Promise<T> {
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }
  return payload as T;
}

export async function fetchPrompts(filters?: { seller?: string; buyer?: string }) {
  const params = new URLSearchParams();
  if (filters?.seller) params.set("seller", filters.seller);
  if (filters?.buyer) params.set("buyer", filters.buyer);

  try {
    const response = await fetch(`/api/prompts${params.toString() ? `?${params}` : ""}`, {
      cache: "no-store",
    });
    const payload = await parseJson<{ prompts: PromptListing[] }>(response);
    return payload.prompts;
  } catch {
    if (filters?.seller) {
      return MOCK_PROMPTS.filter((entry) => entry.seller.toLowerCase() === filters.seller!.toLowerCase());
    }
    if (filters?.buyer) {
      return MOCK_PROMPTS.slice(0, 3).map((entry, index) => ({
        ...entry,
        licensed: index < 2,
      }));
    }
    return MOCK_PROMPTS;
  }
}

export async function fetchPrompt(promptId: string | number) {
  try {
    const response = await fetch(`/api/prompts/${promptId}`, { cache: "no-store" });
    return parseJson<{ prompt: PromptListing }>(response);
  } catch {
    const fallback = MOCK_PROMPTS.find((entry) => entry.promptId === Number(promptId)) ?? MOCK_PROMPTS[0];
    return { prompt: fallback };
  }
}

export async function fetchTxHistory(address?: string) {
  const params = new URLSearchParams();
  if (address) params.set("address", address);

  try {
    const response = await fetch(`/api/txs${params.toString() ? `?${params}` : ""}`, {
      cache: "no-store",
    });
    const payload = await parseJson<{ transactions: TxRecord[] }>(response);
    return payload.transactions;
  } catch {
    return MOCK_TXS;
  }
}

export async function runSkillMapping(input: string) {
  const response = await fetch("/api/compute/infer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "skill-mapping", input }),
  });

  const payload = await parseJson<{ result: SkillMappingResult }>(response);
  return payload.result;
}
