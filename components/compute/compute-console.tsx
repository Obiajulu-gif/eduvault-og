"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ComputeConsoleProps {
  progress: number;
  logs: string[];
  preview: string;
  syncing?: boolean;
}

export function ComputeConsole({ progress, logs, preview, syncing = false }: ComputeConsoleProps) {
  const latestLogs = useMemo(() => logs.slice(-12), [logs]);

  return (
    <div className="space-y-4">
      <Card className="border-[#e1e7f2] shadow-none">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#7b2ff7]">Overall Progress</p>
              <p className="text-sm text-[#7d88a2]">Estimated time remaining: {Math.max(5, 60 - Math.floor(progress))} seconds</p>
            </div>
            <p className="text-[40px] font-black text-[#1a2238]">{progress}%</p>
          </div>
          <Progress value={progress} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1.6fr]">
        <Card className="overflow-hidden border-[#2f3654] bg-[#191d33] text-[#e7ebf5] shadow-none">
          <div className="flex items-center justify-between border-b border-[#2d3556] px-4 py-3 text-xs uppercase tracking-wider text-[#8a95b5]">
            <div className="flex gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
            </div>
            Execution_Log.sys
          </div>
          <CardContent className="space-y-2 p-4 font-mono text-xs leading-relaxed">
            {latestLogs.length > 0 ? (
              latestLogs.map((line, index) => (
                <div key={`${line}-${index}`} className="text-[#96a2c8]">
                  {line}
                </div>
              ))
            ) : (
              <p className="text-[#7f8bb1]">Logs will appear here...</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#e1e7f2] shadow-none">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-[#25304a]">Live Framework Preview</p>
              {syncing ? <Badge>Syncing</Badge> : <Badge variant="secondary">Ready</Badge>}
            </div>
            <div className="min-h-[338px] rounded-2xl border border-[#ecf1f8] bg-[#fcfdff] p-4 text-sm leading-relaxed text-[#526182]">
              {preview || "Preview chunks will appear in real-time as the model generates output."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
