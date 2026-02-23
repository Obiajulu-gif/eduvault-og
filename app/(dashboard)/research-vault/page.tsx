"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchPrompts } from "@/lib/client-api";

const LICENSED_KEY = "eduvault-licensed-prompts";
const RUNS_KEY = "eduvault-runs";

interface SavedRun {
  id: string;
  promptId: number;
  promptTitle: string;
  outputRef: string;
  createdAt: string;
}

export default function ResearchVaultPage() {
  const { address } = useAccount();
  const [licensedIds, setLicensedIds] = useState<number[]>([]);
  const [runs, setRuns] = useState<SavedRun[]>([]);

  useEffect(() => {
    const licensed = localStorage.getItem(LICENSED_KEY);
    const parsedLicensed = licensed ? (JSON.parse(licensed) as number[]) : [];
    setLicensedIds(parsedLicensed);

    const storedRuns = localStorage.getItem(RUNS_KEY);
    const parsedRuns = storedRuns ? (JSON.parse(storedRuns) as SavedRun[]) : [];
    setRuns(parsedRuns);
  }, []);

  const promptsQuery = useQuery({
    queryKey: ["vault-prompts", address],
    queryFn: () => fetchPrompts(address ? { buyer: address } : undefined),
  });

  const licensedPrompts = (promptsQuery.data ?? []).filter(
    (prompt) => prompt.licensed || licensedIds.includes(prompt.promptId),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[56px] font-black leading-none">Research Vault</h1>
          <p className="pt-2 text-lg text-[#667391]">Run purchased prompts and preserve output artifacts on 0G Storage.</p>
        </div>
      </div>

      <Card className="border-[#e4eaf4]">
        <CardContent className="space-y-4 p-5">
          <h2 className="text-[38px] font-black">Licensed Prompt Tools</h2>
          {promptsQuery.isLoading ? (
            <p className="text-sm text-[#8792ab]">Loading licenses...</p>
          ) : licensedPrompts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d7ddea] bg-[#fbfdff] p-8 text-center">
              <p className="text-lg font-semibold text-[#60708d]">No licensed prompts found yet.</p>
              <Button className="mt-3" asChild>
                <Link href="/dashboard/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {licensedPrompts.map((prompt) => (
                <Card key={prompt.promptId} className="border-[#e4eaf4]">
                  <CardContent className="space-y-2 p-4">
                    <p className="text-[30px] font-black leading-none">{prompt.metadata?.title ?? `Prompt #${prompt.promptId}`}</p>
                    <p className="text-sm text-[#697694]">{prompt.metadata?.shortDescription}</p>
                    <Button asChild>
                      <Link href={`/research-vault/execute/${prompt.promptId}`}>Execute</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#e4eaf4]">
        <CardContent className="space-y-4 p-5">
          <h2 className="text-[38px] font-black">Saved Runs</h2>
          {runs.length === 0 ? (
            <p className="text-sm text-[#8792ab]">No compute outputs saved yet.</p>
          ) : (
            <div className="space-y-3">
              {runs.map((run) => (
                <div key={run.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e4eaf4] p-3">
                  <div>
                    <p className="text-base font-bold text-[#27314a]">{run.promptTitle}</p>
                    <p className="text-sm text-[#71809f]">Saved {new Date(run.createdAt).toLocaleString()}</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href={`/api/storage/download?ref=${encodeURIComponent(run.outputRef)}`}>Download Output</a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
