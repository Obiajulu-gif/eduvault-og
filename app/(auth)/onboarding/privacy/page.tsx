"use client";

import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function OnboardingPrivacyPage() {
  const router = useRouter();

  return (
    <AuthShell topRight={<button className="text-[#7b2ff7]">Save & Exit</button>}>
      <Card className="w-full max-w-[720px] border-[#e2e8f3]">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-bold text-[#7c87a1]">
              <span>Step 2 of 5</span>
              <span>40% Complete</span>
            </div>
            <Progress value={40} className="h-2.5" />
          </div>

          <div className="space-y-3 text-center">
            <h1 className="text-[52px] font-black">Your Data, Your Vault</h1>
            <p className="text-base text-[#697694]">At EduVault, we prioritize academic integrity with enterprise-grade privacy controls.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: "AI Analysis", body: "Processed securely without human viewing." },
              { title: "Data Ownership", body: "You own 100% of your files and intellectual property." },
              { title: "End-to-End", body: "Encrypted at rest and in transit." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-[#eadfff] bg-[#f8f2ff] p-3">
                <p className="font-bold text-[#222c43]">{item.title}</p>
                <p className="mt-1 text-sm text-[#6f7b97]">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#e2e8f3] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#212b42]">Anonymize my data for skill mapping</p>
                <p className="text-sm text-[#6f7b97]">Contribute to trends without sharing personal identity.</p>
              </div>
              <div className="h-7 w-12 rounded-full bg-[#7b2ff7] p-1">
                <div className="ml-auto h-5 w-5 rounded-full bg-white" />
              </div>
            </div>
          </div>

          <Button className="h-12 w-full text-base" onClick={() => router.push("/onboarding/success")}>Continue to Step 3</Button>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
