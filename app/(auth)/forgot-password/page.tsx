"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function ForgotPasswordPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSuccess = searchParams.get("state") === "success";

  return (
    <AuthShell topRight={<Link href="#" className="text-[#7b2ff7]">Help Center</Link>}>
      <Card className="w-full max-w-[620px] border-[#e2e8f3]">
        {!isSuccess ? (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-[48px] font-black">Reset your password</CardTitle>
              <p className="text-base text-[#7985a2]">No worries, we&apos;ll send reset instructions to your registered email.</p>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  router.push("/forgot-password?state=success");
                }}
              >
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca7be]" />
                    <Input type="email" className="pl-10" defaultValue="name@university.edu" required />
                  </div>
                </div>
                <Button type="submit" className="h-12 w-full text-base">
                  Send reset link
                </Button>
                <div className="text-center text-sm text-[#7d88a2]">
                  <Link href="/login" className="font-semibold hover:text-[#7b2ff7]">← Back to log in</Link>
                </div>
              </form>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-[50px] font-black">Check your email</CardTitle>
              <p className="text-xl font-bold text-[#7b2ff7]">Reset Link Sent!</p>
            </CardHeader>
            <CardContent className="space-y-5 text-center">
              <p className="text-base text-[#677492]">
                We&apos;ve sent a password recovery link to your registered email address. Please follow the instructions to regain access.
              </p>
              <Button className="h-12 w-full text-base" onClick={() => router.push("/login")}>
                Return to Login
              </Button>
              <p className="text-sm text-[#7d88a2]">
                Didn&apos;t receive the email? <button className="font-semibold text-[#7b2ff7]">Resend Recovery Link</button>
              </p>
              <div className="rounded-xl bg-[#f5f7fc] p-3 text-left text-xs text-[#76829d]">
                Check your spam folder if the email does not appear in a few minutes.
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </AuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}
