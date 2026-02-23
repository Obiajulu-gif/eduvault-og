"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PromptListing } from "@/lib/types";
import { formatEther, parseEther } from "viem";
import { EDUVAULT_MARKETPLACE_ABI } from "@/lib/contracts/eduvault-marketplace";
import { getClientEnv } from "@/lib/env";
import { usePublicClient, useWriteContract } from "wagmi";

const env = getClientEnv();

type PurchaseStep = "review" | "pending" | "success" | "error";

interface PurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: PromptListing;
  onPurchased?: (txHash: string) => void;
  disabled?: boolean;
  disabledReason?: string;
}

export function PurchaseModal({
  open,
  onOpenChange,
  prompt,
  onPurchased,
  disabled,
  disabledReason,
}: PurchaseModalProps) {
  const [step, setStep] = useState<PurchaseStep>("review");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();

  const gasEstimate = useMemo(() => parseEther("0.002"), []);
  const price = BigInt(prompt.priceWei);
  const total = price + gasEstimate;

  const resetAndClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("review");
      setErrorMessage("");
    }, 180);
  };

  const handleConfirm = async () => {
    if (disabled) return;
    if (!env.NEXT_PUBLIC_MARKETPLACE_ADDRESS) {
      setStep("error");
      setErrorMessage("NEXT_PUBLIC_MARKETPLACE_ADDRESS is missing.");
      return;
    }

    try {
      setStep("pending");
      const hash = await writeContractAsync({
        address: env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: EDUVAULT_MARKETPLACE_ABI,
        functionName: "buyPrompt",
        args: [BigInt(prompt.promptId)],
        value: BigInt(prompt.priceWei),
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status === "success") {
        setStep("success");
        onPurchased?.(hash);
      } else {
        throw new Error("Transaction reverted");
      }
    } catch (error) {
      setStep("error");
      setErrorMessage(error instanceof Error ? error.message : "Purchase failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[760px] p-0">
        <div className="h-1 rounded-t-2xl bg-gradient-to-r from-[#7b2ff7] via-[#9b4dff] to-[#7b2ff7]" />
        <div className="p-6">
          <DialogHeader>
            <DialogTitle>
              {step === "review" && "Confirm Purchase"}
              {step === "pending" && "Awaiting Wallet Confirmation"}
              {step === "success" && "Purchase Complete"}
              {step === "error" && "Transaction Failed"}
            </DialogTitle>
            <DialogDescription>
              {step === "review" && "Step 1 of 3: Transaction Review"}
              {step === "pending" && "Step 2 of 3: Pending transaction"}
              {step === "success" && "Step 3 of 3: License activated"}
              {step === "error" && "Step 3 of 3: Resolve and retry"}
            </DialogDescription>
          </DialogHeader>

          {step === "review" && (
            <div className="mt-6 space-y-5">
              <Card className="border-[#e3e9f3] shadow-none">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ebe2ff] text-[#7b2ff7]">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#7b2ff7]">Selected Prompt</p>
                      <p className="text-base font-bold text-[#1b2338]">{prompt.metadata?.title ?? `Prompt #${prompt.promptId}`}</p>
                      <p className="text-sm text-[#71809f]">Author {prompt.metadata?.creatorHandle ?? "Unknown"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm text-[#52607d]">
                    <div className="flex items-center justify-between">
                      <span>Price</span>
                      <span className="font-semibold text-[#1e2740]">{Number(formatEther(price)).toFixed(3)} ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Network Fee (Gas)</span>
                      <span className="font-semibold text-[#1e2740]">~{Number(formatEther(gasEstimate)).toFixed(3)} ETH</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#1a2338]">Total Amount</span>
                    <span className="text-[36px] font-black text-[#7b2ff7]">{Number(formatEther(total)).toFixed(3)} ETH</span>
                  </div>
                </CardContent>
              </Card>

              {disabled && (
                <div className="rounded-xl border border-[#fee4e2] bg-[#fff6f6] p-3 text-sm text-[#d92d20]">
                  {disabledReason ?? "Connect wallet and switch to the configured 0G chain to continue."}
                </div>
              )}

              <div className="rounded-xl bg-[#f5f8ff] p-3 text-sm text-[#66769a]">
                By clicking confirm, you will be prompted by your wallet to sign the transaction on the configured network.
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="secondary" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button onClick={handleConfirm} disabled={disabled || isPending}>
                  Confirm & Pay
                </Button>
              </div>
            </div>
          )}

          {step === "pending" && (
            <div className="mt-8 flex flex-col items-center gap-4 pb-2 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#7b2ff7]" />
              <p className="text-base text-[#4f5d7a]">Please confirm in your wallet and wait for on-chain finality.</p>
              <Badge variant="warning">Transaction Pending</Badge>
              <Button variant="secondary" onClick={resetAndClose}>
                Close
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="mt-8 flex flex-col items-center gap-4 pb-2 text-center">
              <CheckCircle2 className="h-10 w-10 text-[#0f9f61]" />
              <p className="text-2xl font-black text-[#18223a]">License Activated</p>
              <p className="max-w-lg text-base text-[#5f6f8f]">You can now execute this prompt in your Research Vault and save results to 0G Storage.</p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={resetAndClose}>
                  Close
                </Button>
                <Button onClick={resetAndClose}>Continue</Button>
              </div>
            </div>
          )}

          {step === "error" && (
            <div className="mt-8 flex flex-col items-center gap-4 pb-2 text-center">
              <AlertCircle className="h-10 w-10 text-[#f04438]" />
              <p className="text-2xl font-black text-[#18223a]">Purchase Failed</p>
              <p className="max-w-lg text-sm text-[#d92d20]">{errorMessage}</p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={resetAndClose}>
                  Close
                </Button>
                <Button onClick={handleConfirm}>Retry</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
