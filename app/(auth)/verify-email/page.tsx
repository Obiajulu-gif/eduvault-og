"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSuccess = searchParams.get("state") === "success";

  return (
    <AuthShell>
      <Card className="w-full max-w-[620px] border-[#e2e8f3]">
        {!isSuccess ? (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-[50px] font-black">Verify your email</CardTitle>
              <p className="text-base text-[#7985a2]">We sent a verification link to jane@example.com. Please check your inbox.</p>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <Button className="h-12 w-full text-base" onClick={() => router.push("/verify-email?state=success")}>
                Open Email App
              </Button>
              <p className="text-sm text-[#7d88a2]">
                Didn&apos;t receive the email? <button className="font-semibold text-[#7b2ff7]">Resend verification email</button>
              </p>
              <Link href="/login" className="block text-sm font-semibold text-[#8893ac] hover:text-[#7b2ff7]">
                ← Back to login
              </Link>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-[48px] font-black">Email Verified Successfully!</CardTitle>
              <p className="text-base text-[#7985a2]">Your account is now secure and ready for the next step.</p>
            </CardHeader>
            <CardContent className="space-y-5 text-center">
              <Button className="h-12 w-full text-base" onClick={() => router.push("/onboarding/goals")}>Continue to Onboarding</Button>
              <Link href="/login" className="block text-sm font-semibold text-[#8893ac] hover:text-[#7b2ff7]">
                Back to login
              </Link>
            </CardContent>
          </>
        )}
      </Card>
    </AuthShell>
  );
}
