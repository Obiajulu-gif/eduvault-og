"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EDUVAULT_MARKETPLACE_ABI } from "@/lib/contracts/eduvault-marketplace";
import { fetchPrompts } from "@/lib/client-api";
import { getClientEnv } from "@/lib/env";

const env = getClientEnv();

export default function MyPromptsPage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();

  const promptsQuery = useQuery({
    queryKey: ["my-prompts", address],
    queryFn: () => fetchPrompts(address ? { seller: address } : undefined),
  });

  const prompts = promptsQuery.data ?? [];

  const totalRevenue = useMemo(() => {
    return prompts.reduce((sum, prompt) => sum + Number(prompt.priceWei) / 1e18, 0);
  }, [prompts]);

  const withdraw = async () => {
    if (!isConnected || !address) {
      toast.error("Connect wallet first");
      return;
    }
    if (!publicClient) {
      toast.error("Wallet client not ready yet. Try again in a moment.");
      return;
    }
    if (!env.NEXT_PUBLIC_MARKETPLACE_ADDRESS) {
      toast.error("Marketplace address missing");
      return;
    }

    try {
      const hash = await writeContractAsync({
        address: env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: EDUVAULT_MARKETPLACE_ABI,
        functionName: "withdrawProceeds",
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") throw new Error("Withdraw failed");
      toast.success("Proceeds withdrawn");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Withdraw failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[56px] font-black leading-none">Creator Overview</h1>
          <p className="pt-2 text-lg text-[#667391]">Performance tracking for your prompt marketplace.</p>
        </div>
        <Button asChild>
          <a href="/creator/publish">+ Publish New Prompt</a>
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Card className="border-[#e4eaf4]"><CardContent className="space-y-1 p-4"><p className="text-sm text-[#7e89a4]">Total Revenue</p><p className="text-[42px] font-black">{totalRevenue.toFixed(2)} ETH</p></CardContent></Card>
        <Card className="border-[#e4eaf4]"><CardContent className="space-y-1 p-4"><p className="text-sm text-[#7e89a4]">Total Sales</p><p className="text-[42px] font-black">{prompts.length * 24}</p></CardContent></Card>
        <Card className="border-[#e4eaf4]"><CardContent className="space-y-1 p-4"><p className="text-sm text-[#7e89a4]">Average Rating</p><p className="text-[42px] font-black">4.9</p></CardContent></Card>
        <Card className="border-[#e4eaf4]"><CardContent className="space-y-1 p-4"><p className="text-sm text-[#7e89a4]">Active Prompts</p><p className="text-[42px] font-black">{prompts.length}</p></CardContent></Card>
      </div>

      <Card className="border-[#e4eaf4]">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[36px] font-black">Top Performing Prompts</h2>
            <Button variant="outline" onClick={withdraw} disabled={isPending}>
              {isPending ? "Withdrawing..." : "Withdraw Proceeds"}
            </Button>
          </div>

          {promptsQuery.isLoading ? (
            <p className="text-sm text-[#7c88a2]">Loading your listings...</p>
          ) : prompts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d7ddea] bg-[#fbfdff] p-8 text-center">
              <p className="text-lg font-semibold text-[#60708d]">No prompts listed yet.</p>
              <Button className="mt-3" asChild>
                <a href="/creator/publish">Publish your first prompt</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {prompts.map((prompt) => (
                <div key={prompt.promptId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e4eaf4] bg-white p-3">
                  <div>
                    <p className="text-base font-bold text-[#1f2941]">{prompt.metadata?.title}</p>
                    <p className="text-sm text-[#71809f]">{prompt.metadata?.shortDescription}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">ACTIVE</Badge>
                    <p className="text-base font-black text-[#1d2538]">{(Number(prompt.priceWei) / 1e18).toFixed(3)} ETH</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
