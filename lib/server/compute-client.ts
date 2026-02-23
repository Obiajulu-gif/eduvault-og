import { createZGComputeNetworkBroker, type ZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { ethers } from "ethers";
import OpenAI from "openai";
import { assertComputeEnv, isMockMode } from "@/lib/env";
import type { SkillMappingResult } from "@/lib/types";

const NEURON_PER_OG = 1_000_000_000_000_000_000n;

let brokerPromise: Promise<ZGComputeNetworkBroker | null> | null = null;
let isBrokerInitialized = false;

async function getBroker() {
  if (brokerPromise) return brokerPromise;

  brokerPromise = (async () => {
    const env = assertComputeEnv();
    if (isMockMode() || !env.OG_COMPUTE_PRIVATE_KEY) {
      console.log("[Compute] Mock mode enabled or no private key, using mock");
      return null;
    }

    try {
      const provider = new ethers.JsonRpcProvider(env.OG_COMPUTE_RPC_URL);
      const wallet = new ethers.Wallet(env.OG_COMPUTE_PRIVATE_KEY, provider);
      console.log("[Compute] Initializing broker with wallet:", wallet.address);
      const broker = await createZGComputeNetworkBroker(wallet);
      
      await setupAccount(broker, env);
      
      return broker;
    } catch (error) {
      console.error("[Compute] Failed to initialize broker:", error);
      return null;
    }
  })();

  return brokerPromise;
}

async function setupAccount(broker: ZGComputeNetworkBroker, env: { OG_COMPUTE_DEFAULT_PROVIDER?: string }) {
  if (isBrokerInitialized) return;
  
  try {
    console.log("[Compute] Setting up account...");
    
    const ledger = await broker.ledger.getLedger();
    console.log("[Compute] Ledger info:", ledger);
    
    const hasLedger = ledger && ledger.totalBalance !== undefined && ledger.totalBalance !== 0n;
    
    if (!hasLedger) {
      console.log("[Compute] Creating ledger with initial balance...");
      await broker.ledger.addLedger(3);
      console.log("[Compute] Ledger created with 3 OG");
    } else {
      console.log("[Compute] Ledger exists with balance:", ethers.formatEther(ledger.totalBalance), "OG");
    }

    const services = await broker.inference.listService();
    console.log("[Compute] Available services:", services.length);
    
    let providerAddress = env.OG_COMPUTE_DEFAULT_PROVIDER;
    
    if (!providerAddress) {
      const chatbotService = services.find((s: any) => s.serviceType === "chatbot");
      if (chatbotService) {
        providerAddress = chatbotService.provider;
        console.log("[Compute] Using first chatbot provider:", providerAddress);
      }
    }
    
    if (providerAddress) {
      try {
        console.log("[Compute] Acknowledging provider:", providerAddress);
        await broker.inference.acknowledgeProviderSigner(providerAddress);
        console.log("[Compute] Provider acknowledged");
      } catch (ackError: any) {
        const msg = ackError.message?.toLowerCase() || "";
        if (msg.includes("already") || msg.includes("acknowledged")) {
          console.log("[Compute] Provider already acknowledged");
        } else {
          console.error("[Compute] Acknowledge error:", ackError.message);
        }
      }

      try {
        console.log("[Compute] Transferring funds to provider...");
        await broker.ledger.transferFund(providerAddress, "inference", NEURON_PER_OG);
        console.log("[Compute] Transferred 1 OG to provider");
      } catch (transferError: any) {
        const msg = transferError.message?.toLowerCase() || "";
        if (msg.includes("already") || msg.includes("sufficient")) {
          console.log("[Compute] Provider already has funds or transfer failed");
        } else {
          console.error("[Compute] Transfer error:", transferError.message);
        }
      }
    }
    
    isBrokerInitialized = true;
    console.log("[Compute] Account setup complete");
  } catch (error) {
    console.error("[Compute] Setup account error:", error);
  }
}

async function resolveProviderAndModel() {
  const env = assertComputeEnv();
  const broker = await getBroker();
  if (!broker) return null;

  try {
    const services = await broker.inference.listService();
    console.log("[Compute] Found", services.length, "services");
    
    let selected = services[0];
    
    if (env.OG_COMPUTE_DEFAULT_PROVIDER) {
      const found = services.find((s: any) => 
        s.provider.toLowerCase() === env.OG_COMPUTE_DEFAULT_PROVIDER?.toLowerCase()
      );
      if (found) selected = found;
    } else {
      const chatbot = services.find((s: any) => s.serviceType === "chatbot");
      if (chatbot) selected = chatbot;
    }

    if (!selected) {
      throw new Error("No compute services available");
    }

    console.log("[Compute] Using provider:", selected.provider, "model:", selected.serviceType);

    const meta = await broker.inference.getServiceMetadata(selected.provider);
    return {
      broker,
      providerAddress: selected.provider,
      endpoint: meta.endpoint,
      model: env.OG_COMPUTE_DEFAULT_MODEL || meta.model,
    };
  } catch (error) {
    console.error("[Compute] resolveProviderAndModel error:", error);
    return null;
  }
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
    console.log("[Compute] Using mock skill mapping");
    return mockSkillMapping(input);
  }

  const { broker, providerAddress, endpoint, model } = resolved;
  console.log("[Compute] Using real compute:", providerAddress, endpoint, model);

  try {
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
      { headers: Object.fromEntries(Object.entries(headers).map(([k, v]) => [k, String(v)])) }
    );

    const content = completion.choices[0]?.message?.content ?? "";
    await broker.inference.processResponse(providerAddress, completion.id, content);

    try {
      return JSON.parse(content) as SkillMappingResult;
    } catch {
      return mockSkillMapping(input);
    }
  } catch (error) {
    console.error("[Compute] Inference error:", error);
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
    console.log("[Compute] Using mock streaming");
    const steps = [
      "[init] Initial prompt received. Validating input...",
      "[process] Accessing citation index and semantic vectors...",
      "[analyze] Extracting thematic clusters from source material...",
      "[reason] Applying Socratic methodology for deductive reasoning...",
      "[complete] Synthesizing framework and action summary...",
    ];

    const outputChunks = [
      "Based on your input, here's my analysis:\n\n",
      "1. Key insights extracted from your request.\n",
      "2. Strategic recommendations provided.\n",
      "3. Actionable next steps outlined.\n",
    ];

    for (let i = 0; i < steps.length; i += 1) {
      callbacks.onLog(steps[i]);
      callbacks.onProgress(Math.min(85, 15 + i * 15));
      await new Promise((resolve) => setTimeout(resolve, 500));
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
  callbacks.onLog(`[init] Using provider: ${providerAddress}`);

  try {
    const headers = await broker.inference.getRequestHeaders(providerAddress, fullPrompt);
    const openai = new OpenAI({ baseURL: endpoint, apiKey: "" });

    callbacks.onLog(`[request] Sending to ${endpoint}`);

    const stream = await openai.chat.completions.create(
      {
        model,
        messages: [{ role: "user", content: fullPrompt }],
        stream: true,
        temperature: 0.35,
      },
      { headers: Object.fromEntries(Object.entries(headers).map(([k, v]) => [k, String(v)])) }
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
      callbacks.onLog(`[chunk:${chunkCount}] ${content.slice(0, 50)}...`);
      callbacks.onProgress(Math.min(95, 15 + chunkCount * 3));
    }

    await broker.inference.processResponse(providerAddress, chatId, complete);
    callbacks.onLog(`[complete] Response processed successfully`);
    callbacks.onProgress(100);

    return {
      output: complete,
      provider: providerAddress,
      model,
    };
  } catch (error) {
    console.error("[Compute] Stream error:", error);
    callbacks.onLog(`[error] ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
}
