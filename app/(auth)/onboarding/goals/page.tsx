"use client";

import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

export default function OnboardingGoalsPage() {
  const router = useRouter();

  return (
    <AuthShell topRight={<button className="text-[#7b2ff7]">Save & Exit</button>}>
      <Card className="w-full max-w-[720px] border-[#e2e8f3]">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-bold text-[#7c87a1]">
              <span>ONBOARDING - Step 1: Academic Background & Goals</span>
              <span>33% Complete</span>
            </div>
            <Progress value={33} className="h-2.5" />
          </div>

          <div className="space-y-3 text-center">
            <h1 className="text-[52px] font-black">Let&apos;s build your vault.</h1>
            <p className="text-base text-[#697694]">
              Tell us about your background so we can tailor your workspace for maximum productivity.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>What is your current field of study or work?</Label>
              <Input defaultValue="Computer Science" />
            </div>

            <div className="space-y-2">
              <Label>What is your primary career goal?</Label>
              <div className="grid grid-cols-3 gap-2 text-sm font-semibold text-[#5d6780]">
                <button type="button" className="rounded-xl border border-[#d8dfec] px-3 py-2 hover:border-[#b7c3db]">Academic Research</button>
                <button type="button" className="rounded-xl border border-[#d8dfec] px-3 py-2 hover:border-[#b7c3db]">Industry Leadership</button>
                <button type="button" className="rounded-xl border border-[#d8dfec] px-3 py-2 hover:border-[#b7c3db]">Academic Excellence</button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>What is your biggest productivity hurdle?</Label>
              <Textarea defaultValue="Information overload, managing citations, or formatting complex documents..." />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button className="text-sm font-semibold text-[#71809f]">I&apos;ll do this later</button>
              <Button onClick={() => router.push("/onboarding/privacy")}>Continue to Step 2</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
