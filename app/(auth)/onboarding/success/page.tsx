"use client";

import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OnboardingSuccessPage() {
  const router = useRouter();

  return (
    <AuthShell topRight={<span className="text-xs font-bold text-[#7b2ff7]">Status: Ready</span>}>
      <Card className="w-full max-w-[760px] border-[#e2e8f3]">
        <CardContent className="space-y-6 p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#efe2ff] text-3xl text-[#7b2ff7]">✓</div>
          <p className="mx-auto inline-flex rounded-full bg-[#f4ecff] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#7b2ff7]">
            AI Mapping Complete
          </p>
          <h1 className="text-[58px] font-black">AI has mapped your potential.</h1>
          <p className="text-lg text-[#697694]">
            Your personalized EduVault is prepared. We&apos;ve organized your learning path and categorized your existing knowledge.
          </p>

          <div className="rounded-2xl border border-[#eadfff] bg-[#faf5ff] p-4 text-left">
            <p className="text-xl font-bold text-[#1f2941]">Main Knowledge Vault</p>
            <p className="text-sm text-[#7c88a3]">Auto-configured • 0 Documents</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => router.push("/overview")}>Go to Dashboard</Button>
            <Button variant="outline">Upload first document</Button>
          </div>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
