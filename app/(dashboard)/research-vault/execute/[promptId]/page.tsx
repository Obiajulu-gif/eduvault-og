"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchPrompt } from "@/lib/client-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ComputeConsole } from "@/components/compute/compute-console";

const RUNS_KEY = "eduvault-runs";

interface StreamPayload {
  type: "log" | "chunk" | "progress" | "done" | "error";
  message?: string;
  chunk?: string;
  progress?: number;
  outputRef?: string;
  payload?: unknown;
}

export default function ExecutePromptPage() {
  const params = useParams<{ promptId: string }>();
  const promptId = Number(params.promptId);

  const promptQuery = useQuery({
    queryKey: ["prompt-execute", promptId],
    queryFn: () => fetchPrompt(promptId),
    enabled: Number.isFinite(promptId),
  });

  const [customGoal, setCustomGoal] = useState("Generate a concise actionable research framework with assumptions and checks.");
  const [referenceNotes, setReferenceNotes] = useState("Include a section on contradictory evidence and confidence grading.");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [preview, setPreview] = useState("");
  const [running, setRunning] = useState(false);
  const [outputRef, setOutputRef] = useState("");

  const abortRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  const startExecution = async () => {
    if (!promptQuery.data?.prompt) return;

    setRunning(true);
    setProgress(0);
    setLogs([]);
    setPreview("");
    setOutputRef("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/compute/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptTitle: promptQuery.data.prompt.metadata?.title,
          template: `Features: ${(promptQuery.data.prompt.metadata?.features ?? []).join(", ")}`,
          inputs: {
            goal: customGoal,
            notes: referenceNotes,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to start streaming inference");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (!event.startsWith("data: ")) continue;
          const raw = event.slice(6);
          const payload = JSON.parse(raw) as StreamPayload;

          if (payload.type === "log" && payload.message) {
            setLogs((prev) => [...prev, payload.message!]);
          }

          if (payload.type === "chunk" && payload.chunk) {
            setPreview((prev) => prev + payload.chunk);
          }

          if (payload.type === "progress" && typeof payload.progress === "number") {
            setProgress(Math.max(0, Math.min(100, Math.round(payload.progress))));
          }

          if (payload.type === "done") {
            setProgress(100);
            const ref = payload.outputRef ?? "";
            setOutputRef(ref);

            const runsRaw = localStorage.getItem(RUNS_KEY);
            const runs = runsRaw ? (JSON.parse(runsRaw) as any[]) : [];
            runs.unshift({
              id: `${Date.now()}`,
              promptId,
              promptTitle: promptQuery.data.prompt.metadata?.title ?? `Prompt #${promptId}`,
              outputRef: ref,
              createdAt: new Date().toISOString(),
            });
            localStorage.setItem(RUNS_KEY, JSON.stringify(runs.slice(0, 20)));

            toast.success("Execution complete and autosaved to 0G Storage");
          }

          if (payload.type === "error") {
            throw new Error(payload.message ?? "Compute stream failed");
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast.error(error instanceof Error ? error.message : "Execution failed");
      }
    } finally {
      setRunning(false);
    }
  };

  const cancelExecution = () => {
    abortRef.current?.abort();
    setRunning(false);
    setLogs((prev) => [...prev, "[cancelled] Request aborted by user."]);
  };

  if (!promptQuery.data?.prompt) {
    return <Card className="h-[320px] animate-pulse border-[#e4eaf4]" />;
  }

  const prompt = promptQuery.data.prompt;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[58px] font-black leading-none">Executing Research Prompt</h1>
          <p className="pt-2 text-lg text-[#667391]">Our AI is synthesizing your custom research framework using 0G Compute inference.</p>
        </div>
        <Button variant="outline" onClick={cancelExecution} disabled={!running}>Cancel Generation</Button>
      </div>

      <Card className="border-[#e4eaf4]">
        <CardContent className="space-y-4 p-5">
          <h2 className="text-[36px] font-black">{prompt.metadata?.title}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#4f5d79]">Research Goal</label>
              <Input value={customGoal} onChange={(event) => setCustomGoal(event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#4f5d79]">Reference Notes</label>
              <Textarea value={referenceNotes} onChange={(event) => setReferenceNotes(event.target.value)} className="min-h-[80px]" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void startExecution()} disabled={running}>
              {running ? "Generating..." : "Start Generation"}
            </Button>
            {outputRef && (
              <Button variant="outline" asChild>
                <a href={`/api/storage/download?ref=${encodeURIComponent(outputRef)}`}>Download Output</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ComputeConsole progress={progress} logs={logs} preview={preview} syncing={running} />

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { title: "Pro Tip", copy: "You can customize Socratic tone level in generation settings." },
          { title: "Autosave", copy: "Every section generated is instantly backed up to your Vault." },
          { title: "Confidential", copy: "Academic integrity is maintained via private encrypted containers." },
        ].map((item) => (
          <Card key={item.title} className="border-[#e4eaf4]">
            <CardContent className="space-y-1 p-4">
              <p className="text-base font-bold text-[#222c43]">{item.title}</p>
              <p className="text-sm text-[#677492]">{item.copy}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
