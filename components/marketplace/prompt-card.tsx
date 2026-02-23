import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PromptListing } from "@/lib/types";
import { formatEther } from "viem";
import {
  BadgeCheck,
  Binary,
  BrainCircuit,
  FlaskConical,
  LineChart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const ICON_MAP = {
  shield: ShieldCheck,
  code: Binary,
  research: LineChart,
  sparkles: Sparkles,
  flask: FlaskConical,
  brain: BrainCircuit,
  database: BadgeCheck,
};

export function PromptCard({ prompt }: { prompt: PromptListing }) {
  const Icon = ICON_MAP[prompt.metadata?.icon ?? "sparkles"];
  const price = Number(formatEther(BigInt(prompt.priceWei))).toFixed(2);

  return (
    <Card className="rounded-2xl border-[#e3e8f2] shadow-none transition-shadow hover:shadow-[0_18px_35px_-25px_rgba(22,32,56,0.45)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f2ebff] text-[#7b2ff7]">
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="secondary" className="bg-[#dcfce7] text-[#0f9f61]">
            +{2 + prompt.promptId} HOURS/TASK
          </Badge>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[31px] font-bold leading-tight text-[#172038]">{prompt.metadata?.title ?? `Prompt #${prompt.promptId}`}</h3>
          <p className="min-h-[52px] text-base leading-relaxed text-[#65708a]">{prompt.metadata?.shortDescription ?? "No description available."}</p>
        </div>

        <div className="flex items-center justify-between text-sm font-semibold text-[#47516a]">
          <span>{prompt.metadata?.creatorHandle ?? "@unknown"}</span>
          <span className="text-[#9aa2b8]">• {prompt.metadata?.category ?? "All"}</span>
        </div>

        <div className="flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#95a0b8]">Price</p>
            <p className="text-[36px] font-black leading-none text-[#1a2238]">{price} ETH</p>
          </div>
          <Button asChild className="h-10 min-w-[138px]">
            <Link href={`/dashboard/marketplace/${prompt.promptId}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
