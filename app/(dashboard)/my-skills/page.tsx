"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CircleHelp, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function MySkillsPageContent() {
  const searchParams = useSearchParams();
  const state = searchParams.get("state") ?? "empty";
  const [progress] = useState(65);

  const content = useMemo(() => {
    if (state === "mapping") {
      return (
        <div className="space-y-5">
          <Card className="border-[#e4eaf4]">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-5 grid h-[220px] w-[220px] place-items-center rounded-full bg-[radial-gradient(circle,_#e9d7ff_0,_#e9d7ff_28%,_#dcbdfd_28%,_#dcbdfd_48%,_#efe3ff_48%,_#efe3ff_66%,_transparent_66%)]">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-b from-[#8336ff] to-[#6920f0] text-4xl text-white">🧠</div>
              </div>
              <h1 className="text-[56px] font-black text-[#161f35]">EduVault AI is mapping your skills...</h1>
              <p className="mx-auto mt-2 max-w-2xl text-xl text-[#667391]">
                Analyzing academic background, identifying strengths, and detecting productivity gaps.
              </p>

              <div className="mx-auto mt-8 max-w-[560px] space-y-2 text-left">
                <div className="flex items-center justify-between text-base font-bold">
                  <span className="text-[#7b2ff7]">Processing data...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
                <p className="text-sm text-[#9aa3b8]">Estimated remaining time: 14 seconds</p>
              </div>

              <Button variant="outline" className="mt-6">Cancel Analysis</Button>
            </CardContent>
          </Card>

          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.1fr]">
            <Card className="border-[#e4eaf4]"><CardContent className="p-4"><p className="text-xs font-black uppercase tracking-wide text-[#7b89a5]">Metadata Extraction</p><p className="text-base font-bold text-[#1f2941]">Complete</p></CardContent></Card>
            <Card className="border-[#e4eaf4]"><CardContent className="p-4"><p className="text-xs font-black uppercase tracking-wide text-[#7b89a5]">Concept Relation</p><p className="text-base font-bold text-[#1f2941]">In Progress</p></CardContent></Card>
            <Card className="border-[#e4eaf4]"><CardContent className="space-y-3 p-4"><p className="text-base font-black text-[#7b2ff7]">Strategist AI</p><div className="rounded-xl bg-[#f4f7fc] p-3 text-sm text-[#5f6f8f]">I&apos;m currently scanning your paper. Almost there!</div><div className="rounded-xl bg-[#7b2ff7] p-3 text-sm text-white">Thanks, let me know when it&apos;s ready.</div></CardContent></Card>
          </div>
        </div>
      );
    }

    if (state === "error") {
      return (
        <Card className="border-[#e4eaf4]">
          <CardContent className="space-y-5 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ffe6e3] text-[#f04438]">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h1 className="text-[58px] font-black text-[#172038]">Skill Mapping Failed</h1>
            <p className="mx-auto max-w-2xl text-lg text-[#667391]">We couldn&apos;t map your skills due to a file corruption error. Please try re-uploading your document.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button>Try Again</Button>
              <Button variant="outline">Contact Support</Button>
            </div>
            <div className="mx-auto grid max-w-[700px] gap-2 text-left text-sm text-[#6d7893] sm:grid-cols-2">
              <p>• Ensure file is under 10MB</p>
              <p>• Use PDF or DOCX formats</p>
              <p>• Remove password protection</p>
              <p>• Try a different browser</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-[#e4eaf4]">
        <CardContent className="space-y-5 p-8 text-center">
          <div className="mx-auto grid h-[240px] w-[240px] place-items-center rounded-full bg-[#f2ebff]">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-[#7b2ff7] shadow-[0_12px_30px_-20px_rgba(123,47,247,0.8)]">
              <UploadCloud className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-[62px] font-black text-[#172038]">No skills mapped yet</h1>
          <p className="mx-auto max-w-2xl text-xl text-[#667391]">
            Upload your academic work or transcripts to see your personalized skill graph and productivity gaps.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild className="h-12 px-6 text-base">
              <Link href="/my-skills/library">+ Upload First Document</Link>
            </Button>
          </div>
          <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#8892aa] hover:text-[#7b2ff7]">
            <CircleHelp className="h-4 w-4" /> Learn how the skill mapping algorithm works
          </button>
        </CardContent>
      </Card>
    );
  }, [progress, state]);

  return <div className="space-y-4">{content}</div>;
}

export default function MySkillsPage() {
  return (
    <Suspense fallback={null}>
      <MySkillsPageContent />
    </Suspense>
  );
}
