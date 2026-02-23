"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StorageFileUploader } from "@/components/storage/storage-file-uploader";
import { EDUVAULT_MARKETPLACE_ABI } from "@/lib/contracts/eduvault-marketplace";
import { getClientEnv } from "@/lib/env";
import { useWrongChainState } from "@/components/layout/app-shell";

const env = getClientEnv();

type WizardStep = "details" | "logic" | "pricing";

const stepOrder: WizardStep[] = ["details", "logic", "pricing"];

export default function PublishPromptPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { wrongChain } = useWrongChainState();
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();

  const [step, setStep] = useState<WizardStep>("details");
  const [title, setTitle] = useState("Advanced Python Debugger");
  const [category, setCategory] = useState("Coding");
  const [shortDescription, setShortDescription] = useState(
    "Explain what this prompt does in a few sentences...",
  );
  const [features, setFeatures] = useState(["Instant syntax error detection", "Unit test generation"]);
  const [priceEth, setPriceEth] = useState("0.025");
  const [templateRef, setTemplateRef] = useState("");
  const [publishing, setPublishing] = useState(false);

  const canPublish = useMemo(
    () => Boolean(title && shortDescription && templateRef && Number(priceEth) > 0),
    [priceEth, shortDescription, templateRef, title],
  );

  const currentStepIndex = stepOrder.indexOf(step);

  const saveDraft = () => {
    localStorage.setItem(
      "eduvault-draft-prompt",
      JSON.stringify({ title, category, shortDescription, features, priceEth, templateRef }),
    );
    toast.success("Draft saved locally");
  };

  const publish = async () => {
    if (!isConnected || !address) {
      toast.error("Connect wallet to publish");
      return;
    }

    if (wrongChain) {
      toast.error("Switch to configured 0G chain before publishing");
      return;
    }

    if (!publicClient) {
      toast.error("Wallet client not ready yet. Try again in a moment.");
      return;
    }

    if (!env.NEXT_PUBLIC_MARKETPLACE_ADDRESS) {
      toast.error("NEXT_PUBLIC_MARKETPLACE_ADDRESS missing in env");
      return;
    }

    if (!canPublish) {
      toast.error("Complete all required fields");
      return;
    }

    setPublishing(true);
    try {
      const metadata = {
        title,
        category,
        shortDescription,
        features,
        creatorHandle: `@${address.slice(2, 8)}`,
        icon: "code",
        promptTemplateRef: templateRef,
        version: "1.0.0",
      };

      const uploadResponse = await fetch("/api/storage/upload-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: metadata, fileName: `metadata-${Date.now()}.json` }),
      });

      const uploadPayload = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadPayload.error ?? "Failed to upload metadata");

      const hash = await writeContractAsync({
        address: env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: EDUVAULT_MARKETPLACE_ABI,
        functionName: "listPrompt",
        args: [uploadPayload.uri, parseEther(priceEth)],
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") throw new Error("Listing transaction reverted");

      toast.success("Prompt published to marketplace");
      router.push("/marketplace");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-[58px] font-black leading-none">Publish New Prompt</h1>
        <p className="text-lg text-[#667391]">Share your productivity tools with the world and earn ETH.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <Card className="border-[#e4eaf4]">
          <CardContent className="space-y-5 p-5">
            <div className="flex items-center justify-between">
              {stepOrder.map((item, index) => (
                <button
                  key={item}
                  className="flex items-center gap-2"
                  onClick={() => setStep(item)}
                  type="button"
                >
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                      index <= currentStepIndex ? "bg-[#7b2ff7] text-white" : "bg-[#eef2f8] text-[#8c97b0]"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className={`text-sm font-semibold ${index <= currentStepIndex ? "text-[#7b2ff7]" : "text-[#8c97b0]"}`}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </span>
                </button>
              ))}
            </div>

            {step === "details" && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Prompt Title</Label>
                    <Input value={title} onChange={(event) => setTitle(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Coding">Coding</SelectItem>
                        <SelectItem value="Writing">Writing</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                        <SelectItem value="All">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Textarea value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} maxLength={280} />
                  <p className="text-right text-xs text-[#97a2b8]">Max 280 characters</p>
                </div>

                <div className="space-y-2">
                  <Label>What it produces (Key Features)</Label>
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={`${feature}-${index}`} className="flex items-center gap-2">
                        <Input
                          value={feature}
                          onChange={(event) => {
                            setFeatures((prev) => prev.map((entry, entryIndex) => (entryIndex === index ? event.target.value : entry)));
                          }}
                        />
                        <button
                          className="rounded-lg border border-[#dce3ef] p-2 text-[#8b97af] hover:bg-[#f5f7fc]"
                          onClick={() => setFeatures((prev) => prev.filter((_, entryIndex) => entryIndex !== index))}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#7b2ff7]"
                      onClick={() => setFeatures((prev) => [...prev, ""])}
                    >
                      <Plus className="h-4 w-4" /> Add another bullet point
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === "logic" && (
              <div className="space-y-3">
                <Label>Upload Prompt Logic/Template</Label>
                <StorageFileUploader
                  accept=".json,.txt,.prompt"
                  onUploaded={(result) => {
                    setTemplateRef(result.uri);
                    toast.success("Template uploaded to 0G Storage");
                  }}
                />
                {templateRef && <p className="text-sm text-[#12a265]">Template ref: {templateRef}</p>}
              </div>
            )}

            {step === "pricing" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Price (ETH)</Label>
                  <Input value={priceEth} onChange={(event) => setPriceEth(event.target.value)} />
                </div>
                <Card className="border-[#fff0cc] bg-[#fff8ea]">
                  <CardContent className="p-3 text-sm text-[#a8721e]">
                    Tip: Prompts with clear “What it produces” bullet points sell 40% more often on EduVault.
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-3 border-t border-[#edf1f8] pt-4">
              <Button variant="secondary" onClick={saveDraft}>Save Draft</Button>
              <Button
                onClick={() => {
                  if (step !== "pricing") {
                    setStep(stepOrder[Math.min(currentStepIndex + 1, stepOrder.length - 1)]);
                    return;
                  }
                  void publish();
                }}
                disabled={publishing || isPending || (step === "pricing" && !canPublish)}
              >
                {step === "pricing" ? (publishing || isPending ? "Publishing..." : "Publish to Marketplace") : "Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e4eaf4]">
          <CardContent className="space-y-4 p-5">
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#8792ab]"><Eye className="h-3.5 w-3.5" /> Live Marketplace Preview</p>
            <div className="overflow-hidden rounded-2xl border border-[#e5eaf4]">
              <div className="h-36 bg-gradient-to-br from-[#7b2ff7] to-[#5b74ff]" />
              <div className="space-y-2 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#7b2ff7]">{category} Tool</p>
                <h3 className="text-[34px] font-black leading-none">{title || "Untitled Prompt"}</h3>
                <p className="text-sm text-[#667391]">{shortDescription}</p>
                <div className="space-y-1 text-sm text-[#54627f]">
                  {(features.filter(Boolean).slice(0, 3) || []).map((feature) => (
                    <p key={feature}>• {feature}</p>
                  ))}
                </div>
                <div className="pt-2">
                  <Button className="h-9">View Listing</Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#e7ecf5] bg-[#fafcff] p-3 text-sm text-[#6d7893]">
              Wallet: {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Not connected"}
              <br />
              Network: {wrongChain ? "Wrong chain" : "Ready"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
