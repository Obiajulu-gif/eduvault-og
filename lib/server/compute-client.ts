import { createZGComputeNetworkBroker, type ZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { ethers } from "ethers";
import OpenAI from "openai";
import { assertComputeEnv, isMockMode } from "@/lib/env";
import type { SkillMappingResult } from "@/lib/types";

// Ledger and transfer configuration
const TARGET_LEDGER_OG = 1; // number of OG for addLedger/depositFund
const TARGET_LEDGER_NEURONS = ethers.parseEther(String(TARGET_LEDGER_OG)); // bigint neurons for comparisons
const MIN_WALLET_BALANCE_FOR_SETUP = TARGET_LEDGER_NEURONS; // Recommended minimum wallet balance to set up compute
const INITIAL_PROVIDER_TRANSFER = ethers.parseEther("0.5"); // bigint neurons to transfer to provider sub-account

let brokerPromise: Promise<ZGComputeNetworkBroker | null> | null = null;
let isBrokerInitialized = false;
let initializedProviderAddress: string | null = null;

async function getBroker() {
  if (brokerPromise) return brokerPromise;

  brokerPromise = (async () => {
    const env = assertComputeEnv();
    
    console.log("[Compute] Mock mode:", isMockMode());
    console.log("[Compute] Private key set:", !!env.OG_COMPUTE_PRIVATE_KEY);
    console.log("[Compute] Private key prefix:", env.OG_COMPUTE_PRIVATE_KEY?.slice(0, 10) || "none");
    
    if (isMockMode() || !env.OG_COMPUTE_PRIVATE_KEY) {
      console.log("[Compute] Mock mode enabled or no private key, using mock");
      return null;
    }

    try {
      const provider = new ethers.JsonRpcProvider(env.OG_COMPUTE_RPC_URL);
      const wallet = new ethers.Wallet(env.OG_COMPUTE_PRIVATE_KEY, provider);
      console.log("[Compute] Initializing broker with wallet:", wallet.address);
      
      const balance = await provider.getBalance(wallet.address);
      console.log("[Compute] Wallet balance:", ethers.formatEther(balance), "OG");
      
      if (balance < MIN_WALLET_BALANCE_FOR_SETUP) {
        console.warn(
          "[Compute] Low wallet balance for compute. Recommended at least",
          ethers.formatEther(MIN_WALLET_BALANCE_FOR_SETUP),
          "OG, current:",
          ethers.formatEther(balance),
        );
      }
      
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

    // Ensure ledger exists – if not, create it following 0G SDK docs:
    // await broker.ledger.addLedger(ethers.parseEther("0.1"));
    let ledger: any | null = null;
    try {
      ledger = await broker.ledger.getLedger();
      console.log("[Compute] Existing ledger info:", ledger);
    } catch (err: any) {
      const msg = (err?.reason || err?.message || "").toString();
      if (msg.includes("LedgerNotExists") || msg.includes("Account does not exist")) {
        console.log("[Compute] No ledger found on-chain, creating with addLedger(parseEther(\"0.1\"))...");
        const initialNeurons = ethers.parseEther("0.1");
        const initialOgNumber = Number(ethers.formatEther(initialNeurons));
        try {
          // SDK variants accept OG number; pass numeric OG to avoid internal toFixed errors
          await (broker.ledger as any).addLedger(initialOgNumber);
          console.log("[Compute] Ledger created request sent with", initialOgNumber, "OG");
          ledger = await broker.ledger.getLedger();
          console.log("[Compute] Ledger after creation:", ledger);
        } catch (addError: any) {
          console.error("[Compute] addLedger failed:", addError?.message ?? addError);
          throw addError;
        }
      } else {
        console.error("[Compute] Unexpected getLedger error:", msg);
        throw err;
      }
    }

    // At this point we expect a ledger object
    if (!ledger) {
      throw new Error("Ledger not available after creation attempt");
    }

    // Normalize balance from possible shapes
    const rawBalance: bigint =
      typeof (ledger as any).totalBalance === "bigint"
        ? (ledger as any).totalBalance
        : typeof (ledger as any).balance === "bigint"
        ? (ledger as any).balance
        : 0n;

    console.log("[Compute] Ledger balance (OG):", ethers.formatEther(rawBalance));

    // Optional: top up if below our internal target using neurons, per latest docs
    if (rawBalance < TARGET_LEDGER_NEURONS) {
      const topUpNeurons = TARGET_LEDGER_NEURONS - rawBalance;
      const topUpOgNumber = Number(ethers.formatEther(topUpNeurons));
      console.log(
        "[Compute] Topping up ledger. Current (OG):",
        ethers.formatEther(rawBalance),
        "Target (OG):",
        ethers.formatEther(TARGET_LEDGER_NEURONS),
      );
      try {
        // depositFund accepts OG amount (number)
        await (broker.ledger as any).depositFund(topUpOgNumber);
        console.log("[Compute] Ledger topped up by", topUpOgNumber, "OG");
      } catch (depositError: any) {
        console.error("[Compute] depositFund error (non-fatal):", depositError?.message ?? depositError);
      }
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
      initializedProviderAddress = providerAddress;
      
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

async function processResponseWithVerification(
  broker: ZGComputeNetworkBroker,
  providerAddress: string,
  response: Response,
  data: any,
): Promise<void> {
  try {
    let chatID = response.headers.get("ZG-Res-Key") || response.headers.get("zg-res-key");
    
    if (!chatID && data.id) {
      chatID = data.id;
    }
    
    const usage = data.usage ? JSON.stringify(data.usage) : undefined;
    
    if (chatID) {
      const isValid = await broker.inference.processResponse(
        providerAddress,
        chatID,
        usage || "{}"
      );
      console.log("[Compute] Response verified, valid:", isValid);
    } else if (usage) {
      await broker.inference.processResponse(
        providerAddress,
        undefined,
        usage
      );
      console.log("[Compute] Response processed (no verification)");
    } else {
      console.log("[Compute] No usage data for processing");
    }
  } catch (error) {
    console.error("[Compute] Process response error:", error);
  }
}

export async function inferSkillMapping(input: string): Promise<SkillMappingResult> {
  const env = assertComputeEnv();
  
  console.log("[Compute] === inferSkillMapping called ===");
  console.log("[Compute] isMockMode():", isMockMode());
  console.log("[Compute] hasPrivateKey:", !!env.OG_COMPUTE_PRIVATE_KEY);
  
  if (isMockMode()) {
    console.log("[Compute] Using mock - mock mode is enabled");
    return mockSkillMapping(input);
  }
  
  if (!env.OG_COMPUTE_PRIVATE_KEY) {
    console.log("[Compute] Using mock - no private key");
    return mockSkillMapping(input);
  }
  
  const resolved = await resolveProviderAndModel();
  if (!resolved) {
    console.log("[Compute] Using mock - failed to resolve provider");
    return mockSkillMapping(input);
  }

  const { broker, providerAddress, endpoint, model } = resolved;
  let selectedProvider = providerAddress;
  console.log("[Compute] Using real compute:", selectedProvider, endpoint, model);

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

    // Try primary provider, then fall back to other chatbot providers if primary fails
    let response: Response | null = null;
    let data: any = null;
    let content = "";
    try {
      const headers = await broker.inference.getRequestHeaders(providerAddress, prompt);
      
      response = await fetch(`${endpoint}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ 
          messages: [{ role: "user", content: prompt }], 
          model,
          temperature: 0.2 
        })
      });
    } catch (reqError) {
      console.warn("[Compute] Primary provider request failed, will try fallbacks:", reqError);
    }

    if (!response || !response.ok) {
      console.log("[Compute] Attempting fallback providers...");
      const services = await broker.inference.listService();
      const chatbotServices = services.filter((s: any) => s.serviceType === "chatbot");
      for (const s of chatbotServices) {
        if (s.provider === selectedProvider) continue;
        try {
          const meta = await broker.inference.getServiceMetadata(s.provider);
          const headers = await broker.inference.getRequestHeaders(s.provider, prompt);
          const res = await fetch(`${meta.endpoint}/chat/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify({ messages: [{ role: "user", content: prompt }], model: meta.model || model }),
          });
          if (!res.ok) {
            const text = await res.text();
            console.warn("[Compute] Fallback provider failed:", s.provider, res.status, text);
            continue;
          }
          response = res;
          selectedProvider = s.provider;
          data = await response.json();
          content = data.choices?.[0]?.message?.content ?? "";
          break;
        } catch (err) {
          console.warn("[Compute] Fallback attempt error for provider", s.provider, err);
          continue;
        }
      }
    } else {
      data = await response.json();
      content = data.choices?.[0]?.message?.content ?? "";
    }

    if (!response || !response.ok) {
      console.error("[Compute] All providers failed or no response received");
      return mockSkillMapping(input);
    }
    await processResponseWithVerification(broker, selectedProvider, response, data);

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
  const env = assertComputeEnv();
  
  if (isMockMode() || !env.OG_COMPUTE_PRIVATE_KEY) {
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

  const resolved = await resolveProviderAndModel();

  if (!resolved) {
    console.log("[Compute] Using mock streaming - failed to resolve");
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
  let selectedProvider = providerAddress;
  callbacks.onLog(`[init] Using provider: ${selectedProvider}`);

  try {
    let response: Response | null = null;
    try {
      const headers = await broker.inference.getRequestHeaders(providerAddress, fullPrompt);
      callbacks.onLog(`[request] Sending to ${endpoint}`);
      response = await fetch(`${endpoint}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ 
          messages: [{ role: "user", content: fullPrompt }], 
          model,
          temperature: 0.35,
          stream: true
        })
      });
    } catch (reqErr) {
      console.warn("[Compute] Primary streaming request failed, will attempt fallbacks:", reqErr);
    }

    if (!response || !response.ok) {
      callbacks.onLog("[request] Primary streaming provider failed, trying fallback chatbot providers...");
      const services = await broker.inference.listService();
      const chatbotServices = services.filter((s: any) => s.serviceType === "chatbot");
      for (const s of chatbotServices) {
        if (s.provider === selectedProvider) continue;
        try {
          const meta = await broker.inference.getServiceMetadata(s.provider);
          const headers = await broker.inference.getRequestHeaders(s.provider, fullPrompt);
          const res = await fetch(`${meta.endpoint}/chat/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify({ messages: [{ role: "user", content: fullPrompt }], model: meta.model || model, stream: true }),
          });
          if (!res.ok) {
            const text = await res.text();
            callbacks.onLog(`[error] Fallback provider ${s.provider} failed: ${res.status} ${text}`);
            continue;
          }
          response = res;
          selectedProvider = s.provider;
          callbacks.onLog(`[request] Using fallback provider ${s.provider}`);
          break;
        } catch (e) {
          callbacks.onLog(`[error] Fallback attempt failed for provider ${s.provider}: ${String(e)}`);
          continue;
        }
      }
    }

    if (!response) {
      throw new Error("All streaming providers failed");
    }

    if (!response.ok) {
      const errorText = await response.text();
      callbacks.onLog(`[error] API error: ${response.status} ${errorText}`);
      throw new Error(`API error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    let chatID = response.headers.get("ZG-Res-Key") || response.headers.get("zg-res-key");
    let usage: any = null;
    let streamChatID: string | null = null;
    
    const decoder = new TextDecoder();
    const reader = response.body.getReader();
    let rawBody = "";
    let complete = "";
    let chunkCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      rawBody += decoder.decode(value, { stream: true });
    }

    for (const line of rawBody.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') continue;

      try {
        const jsonStr = trimmed.startsWith('data:') ? trimmed.slice(5).trim() : trimmed;
        const message = JSON.parse(jsonStr);

        if (!streamChatID && (message.id || message.chatID)) {
          streamChatID = message.id || message.chatID;
        }

        if (message.usage) {
          usage = message.usage;
        }

        const content = message.choices?.[0]?.delta?.content ?? "";
        if (content) {
          chunkCount += 1;
          complete += content;
          callbacks.onChunk(content);
          callbacks.onLog(`[chunk:${chunkCount}] ${content.slice(0, 50)}...`);
          callbacks.onProgress(Math.min(95, 15 + chunkCount * 3));
        }
      } catch {}
    }

    const finalChatID = chatID || streamChatID;
    
    if (finalChatID) {
      const isValid = await broker.inference.processResponse(
        selectedProvider,
        finalChatID,
        JSON.stringify(usage || {})
      );
      callbacks.onLog(`[verify] Response verified, valid: ${isValid}`);
    } else if (usage) {
      await broker.inference.processResponse(
        selectedProvider,
        undefined,
        JSON.stringify(usage)
      );
      callbacks.onLog(`[verify] Response processed (no verification)`);
    }

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

// Admin helpers exported for runtime APIs / testing
export async function getBrokerInstance(): Promise<ZGComputeNetworkBroker | null> {
  return await getBroker();
}

export function getInitializedProviderAddress(): string | null {
  return initializedProviderAddress;
}

export async function getComputeStatus() {
  const env = assertComputeEnv();
  if (isMockMode()) return { mock: true };

  try {
    const provider = new ethers.JsonRpcProvider(env.OG_COMPUTE_RPC_URL);
    const wallet = new ethers.Wallet(env.OG_COMPUTE_PRIVATE_KEY!, provider);
    const balance = await provider.getBalance(wallet.address);
    const broker = await getBroker();
    const ledger = broker ? await broker.ledger.getLedger() : null;
    return {
      address: wallet.address,
      balance: ethers.formatEther(balance),
      initializedProviderAddress,
      ledger,
    };
  } catch (error: any) {
    return { error: error?.message ?? String(error) };
  }
}