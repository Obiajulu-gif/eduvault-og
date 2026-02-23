import { createZGComputeNetworkBroker, type ZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { ethers } from "ethers";
import OpenAI from "openai";
import { assertComputeEnv, isMockMode } from "@/lib/env";
import type { SkillMappingResult } from "@/lib/types";

let brokerPromise: Promise<ZGComputeNetworkBroker | null> | null = null;

async function getBroker() {
  if (brokerPromise) return brokerPromise;

  brokerPromise = (async () => {
    const env = assertComputeEnv();
    if (isMockMode() || !env.OG_COMPUTE_PRIVATE_KEY) {
      return null;
    }

    const provider = new ethers.JsonRpcProvider(env.OG_COMPUTE_RPC_URL);
    const wallet = new ethers.Wallet(env.OG_COMPUTE_PRIVATE_KEY, provider);
    return createZGComputeNetworkBroker(wallet);
  })();

  return brokerPromise;
}

async function resolveProviderAndModel() {
  const env = assertComputeEnv();
  const broker = await getBroker();
  if (!broker) return null;

  const services = await broker.inference.listService();
  const selected =
    services.find((service: any) => service.provider.toLowerCase() === env.OG_COMPUTE_DEFAULT_PROVIDER?.toLowerCase()) || services[0];

  if (!selected) {
    throw new Error("No 0G compute services available for configured wallet.");
  }

  const meta = await broker.inference.getServiceMetadata(selected.provider);
  return {
    broker,
    providerAddress: selected.provider,
    endpoint: meta.endpoint,
    model: env.OG_COMPUTE_DEFAULT_MODEL || meta.model,
  };
}

function mockSkillMapping(input: string): SkillMappingResult {
  const lower = input.toLowerCase();
  const skills: SkillMappingResult["detectedSkills"] = [];

  if (lower.includes("solidity") || lower.includes("smart contract")) {
    skills.push({ name: "Solidity", level: "intermediate", confidence: 0.82 });
  }
  if (lower.includes("research") || lower.includes("paper")) {
    skills.push({ name: "Research Synthesis", level: "advanced", confidence: 0.88 });
  }
  if (lower.includes("python") || lower.includes("data")) {
    skills.push({ name: "Python", level: "intermediate", confidence: 0.79 });
  }

  if (skills.length === 0) {
    skills.push({ name: "Critical Thinking", level: "intermediate", confidence: 0.74 });
  }

  return {
    detectedSkills: skills,
    strengths: ["Structured reasoning", "Ability to synthesize evidence"],
    gaps: ["Production deployment patterns", "Advanced benchmarking"],
    roadmap: [
      {
        week: 1,
        focus: "Solidify prompt architecture",
        tasks: ["Create reusable templates", "Benchmark 3 baseline prompts"],
      },
      {
        week: 2,
        focus: "Improve validation rigor",
        tasks: ["Add metric rubric", "Run A/B tests across two models"],
      },
      {
        week: 3,
        focus: "Ship portfolio outputs",
        tasks: ["Publish one premium prompt", "Document execution reports"],
      },
    ],
  };
}

export async function inferSkillMapping(input: string): Promise<SkillMappingResult> {
  const resolved = await resolveProviderAndModel().catch(() => null);
  if (!resolved) {
    return mockSkillMapping(input);
  }

  const { broker, providerAddress, endpoint, model } = resolved;

  try {
    await broker.inference.acknowledgeProviderSigner(providerAddress);
  } catch {
    // ignore already acknowledged
  }

  const prompt = `Return ONLY valid JSON with this exact schema:\n${JSON.stringify(
    {
      detectedSkills: [{ name: "Solidity", level: "intermediate", confidence: 0.82 }],
      strengths: ["..."],
      gaps: ["..."],
      roadmap: [{ week: 1, focus: "...", tasks: ["..."] }],
    },
    null,
    2,
  )}\n\nInput:\n${input}`;

  const headers = await broker.inference.getRequestHeaders(providerAddress, prompt);
  const openai = new OpenAI({ baseURL: endpoint, apiKey: "" });

  const completion = await openai.chat.completions.create(
    {
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    },
    { headers: Object.fromEntries(Object.entries(headers).map(([k, v]) => [k, String(v)])) },
  );

  const content = completion.choices[0]?.message?.content ?? "";
  await broker.inference.processResponse(providerAddress, completion.id, content);

  try {
    return JSON.parse(content) as SkillMappingResult;
  } catch {
    return mockSkillMapping(input);
  }
}

export interface StreamCallbacks {
  onLog: (log: string) => void;
  onChunk: (chunk: string) => void;
  onProgress: (progress: number) => void;
}

export async function streamPromptInference(
  fullPrompt: string,
  callbacks: StreamCallbacks,
): Promise<{ output: string; provider: string; model: string }> {
  const resolved = await resolveProviderAndModel().catch(() => null);

  if (!resolved) {
    const steps = [
      "[09:44:12] Initial prompt received. Validating input...",
      "[09:44:15] Accessing citation index and semantic vectors...",
      "[09:44:19] Extracting thematic clusters from source material...",
      "[09:44:24] Applying Socratic methodology for deductive reasoning...",
      "[09:44:33] Synthesizing framework and action summary...",
    ];

    const outputChunks = [
      "Executive Summary:\n",
      "1. Core hypothesis established with strong signal confidence.\n",
      "2. Contradictions resolved through source triangulation.\n",
      "3. Recommended next action: run validation sprint on top two findings.\n",
    ];

    for (let i = 0; i < steps.length; i += 1) {
      callbacks.onLog(steps[i]);
      callbacks.onProgress(Math.min(85, 15 + i * 15));
      await new Promise((resolve) => setTimeout(resolve, 650));
      if (outputChunks[i]) callbacks.onChunk(outputChunks[i]);
    }

    callbacks.onProgress(100);
    return {
      output: outputChunks.join(""),
      provider: "mock-provider",
      model: "mock-model",
    };
  }

  const { broker, endpoint, model, providerAddress } = resolved;
  callbacks.onLog(`[init] Using provider ${providerAddress}`);

  try {
    await broker.inference.acknowledgeProviderSigner(providerAddress);
  } catch {
    // ignore
  }

  const headers = await broker.inference.getRequestHeaders(providerAddress, fullPrompt);
  const openai = new OpenAI({ baseURL: endpoint, apiKey: "" });

  const stream = await openai.chat.completions.create(
    {
      model,
      messages: [{ role: "user", content: fullPrompt }],
      stream: true,
      temperature: 0.35,
    },
    { headers: Object.fromEntries(Object.entries(headers).map(([k, v]) => [k, String(v)])) },
  );

  let complete = "";
  let chunkCount = 0;
  let chatId = "";

  for await (const part of stream) {
    chatId = part.id;
    const content = part.choices?.[0]?.delta?.content ?? "";
    if (!content) continue;
    chunkCount += 1;
    complete += content;
    callbacks.onChunk(content);
    callbacks.onLog(`[chunk:${chunkCount}] ${content.slice(0, 90)}`);
    callbacks.onProgress(Math.min(95, 15 + chunkCount * 3));
  }

  await broker.inference.processResponse(providerAddress, chatId, complete);
  callbacks.onProgress(100);

  return {
    output: complete,
    provider: providerAddress,
    model,
  };
}
