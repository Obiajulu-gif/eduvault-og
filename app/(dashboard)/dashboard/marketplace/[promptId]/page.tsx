"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { AlertCircle, CheckCircle2, Shield } from "lucide-react";
import { fetchPrompt } from "@/lib/client-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PurchaseModal } from "@/components/marketplace/purchase-modal";
import { useWrongChainState } from "@/components/layout/app-shell";
import { formatEther } from "viem";

const LICENSED_KEY = "eduvault-licensed-prompts";

function readLicensedPromptIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LICENSED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as number[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function PromptDetailPage() {
  const params = useParams<{ promptId: string }>();
  const promptId = Number(params.promptId);
  const { isConnected } = useAccount();
  const { wrongChain } = useWrongChainState();

  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [licensed, setLicensed] = useState(false);

  const promptQuery = useQuery({
    queryKey: ["prompt", promptId],
    queryFn: () => fetchPrompt(promptId),
    enabled: Number.isFinite(promptId),
  });

  useEffect(() => {
    setLicensed(readLicensedPromptIds().includes(promptId));
  }, [promptId]);

  const priceLabel = useMemo(() => {
    const wei = promptQuery.data?.prompt.priceWei;
    if (!wei) return "0.00";
    return Number(formatEther(BigInt(wei))).toFixed(2);
  }, [promptQuery.data?.prompt.priceWei]);

  if (promptQuery.isLoading) {
    return <Card className="h-[380px] animate-pulse border-[#e4eaf4]" />;
  }

  if (promptQuery.error || !promptQuery.data?.prompt) {
    return (
      <Card className="border-[#f8c6c3] bg-[#fff2f1]">
        <CardContent className="space-y-4 p-6">
          <p className="text-base font-semibold text-[#d92d20]">Unable to load prompt details.</p>
          <Button onClick={() => promptQuery.refetch()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const prompt = promptQuery.data.prompt;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-sm text-[#8792ab]">
        <p>Marketplace | Security Tools | {prompt.metadata?.title ?? `Prompt #${prompt.promptId}`}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.8fr_1fr]">
        <section className="space-y-5">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#7b2ff7] text-4xl text-white shadow-[0_22px_34px_-24px_rgba(123,47,247,0.98)]">
              <Shield className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge>TOP RATED</Badge>
                <Badge variant="secondary" className="bg-[#efe6ff] text-[#7b2ff7]">GPT-4 OPTIMIZED</Badge>
              </div>
              <h1 className="text-4xl font-black leading-tight text-[#151f36] md:text-[44px]">{prompt.metadata?.title}</h1>
              <p className="text-sm text-[#6f7c99]">4.9 stars (124 reviews) | {prompt.metadata?.creatorHandle ?? "@creator"}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-[#e4eaf4] bg-white p-5">
            <h2 className="text-2xl font-black text-[#1a2338] md:text-[30px]">Detailed Description</h2>
            <p className="text-base leading-relaxed text-[#55627f]">
              {prompt.metadata?.shortDescription}
            </p>
            <p className="text-base leading-relaxed text-[#55627f]">
              Optimized for creator workflows. Includes multi-stage reasoning chains and final report templates for direct execution.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-[#e4eaf4] bg-white p-5">
            <h2 className="text-2xl font-black text-[#1a2338] md:text-[30px]">What it produces</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(prompt.metadata?.features ?? []).map((feature) => (
                <div key={feature} className="rounded-xl border border-[#e8eef7] bg-[#fbfdff] p-3">
                  <p className="font-semibold text-[#27314a]">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black text-[#1a2338] md:text-[34px]">User Reviews</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { name: "Alex Dev", text: "Incredible value. It found a reentrancy vulnerability in our swap logic that Mythril missed." },
                { name: "CryptoQueen", text: "Thorough report generation and excellent GPT-powered heuristics." },
              ].map((review) => (
                <Card key={review.name} className="border-[#e4eaf4]">
                  <CardContent className="space-y-2 p-4">
                    <p className="font-bold text-[#1f2941]">{review.name}</p>
                    <p className="text-sm text-[#5e6b87]">{review.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <Card className="border-[#dfd2f4]">
            <CardContent className="space-y-4 p-5">
              <p className="text-sm font-bold uppercase tracking-wide text-[#8792ab]">Price per license</p>
              <p className="text-5xl font-black leading-none text-[#151f36] md:text-[56px]">{priceLabel} ETH</p>
              <Button className="w-full" onClick={() => setPurchaseOpen(true)}>
                Buy with Crypto
              </Button>
              <p className="text-sm text-[#65708b]">
                {isConnected ? "Wallet connected" : "Wallet not connected"} | Balance and gas checks enabled
              </p>

              <Card className="border-[#ece4ff] bg-[#faf7ff]">
                <CardContent className="space-y-2 p-3">
                  <p className="font-bold text-[#222c43]">Mint as NFT</p>
                  <p className="text-sm text-[#667391]">Unlock a unique digital collectible certificate.</p>
                </CardContent>
              </Card>

              <div className="space-y-1 text-sm text-[#6c7894]">
                <div className="flex justify-between"><span>Network Fee</span><span>$4.20</span></div>
                <div className="flex justify-between"><span>EduVault Fee</span><span>$2.50</span></div>
              </div>
            </CardContent>
          </Card>

          {licensed ? (
            <Card className="border-[#d6f3df] bg-[#f0fcf4]">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2 text-[#109f61]">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-bold">Licensed</p>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/research-vault/execute/${prompt.promptId}`}>Execute Prompt</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-[#e5eaf4] bg-[#fbfdff]">
              <CardContent className="space-y-2 p-4 text-sm text-[#6a7692]">
                <div className="flex items-center gap-2 text-[#7b2ff7]">
                  <AlertCircle className="h-4 w-4" />
                  <p className="font-semibold">Purchase required</p>
                </div>
                <p>Buy this prompt to unlock execution and Research Vault storage.</p>
              </CardContent>
            </Card>
          )}

          {wrongChain && (
            <Card className="border-[#fff0cc] bg-[#fff7e6]">
              <CardContent className="p-3 text-sm text-[#b7791f]">Switch to the configured 0G network before buying.</CardContent>
            </Card>
          )}
        </aside>
      </div>

      <PurchaseModal
        open={purchaseOpen}
        onOpenChange={setPurchaseOpen}
        prompt={prompt}
        disabled={!isConnected || wrongChain}
        disabledReason={!isConnected ? "Connect wallet to continue." : "Switch to 0G chain to continue."}
        onPurchased={() => {
          const current = new Set(readLicensedPromptIds());
          current.add(prompt.promptId);
          localStorage.setItem(LICENSED_KEY, JSON.stringify(Array.from(current)));
          setLicensed(true);
        }}
      />
    </div>
  );
}
