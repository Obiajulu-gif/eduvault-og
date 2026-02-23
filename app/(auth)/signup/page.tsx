"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/auth/auth-provider";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane@example.com");
  const [password, setPassword] = useState("strong-pass#1");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const strength = Math.min(100, Math.max(40, password.length * 8));

  return (
    <AuthShell topRight={<Link href="/login" className="text-[#7b2ff7] hover:underline">Log in</Link>}>
      <Card className="w-full max-w-[620px] border-[#e2e8f3]">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-[54px] font-black">Create your account</CardTitle>
          <p className="text-base text-[#7985a2]">Secure your educational resources today.</p>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setSubmitting(true);
              setError("");

              const result = await signup(name, email, password);
              if (!result.ok) {
                setError(result.error ?? "Failed to create account");
                setSubmitting(false);
                return;
              }

              router.push("/verify-email");
            }}
          >
            {error && <div className="rounded-xl border border-[#f8c6c3] bg-[#fff2f1] px-3 py-2 text-sm font-semibold text-[#d92d20]">{error}</div>}

            <div className="grid gap-3 sm:grid-cols-2">
              <Button type="button" variant="outline">Google</Button>
              <Button type="button" variant="outline">GitHub</Button>
            </div>

            <div className="my-2 flex items-center gap-3 py-1 text-xs font-bold uppercase tracking-wide text-[#98a2b7]">
              <span className="h-px flex-1 bg-[#e7ecf5]" />
              or continue with
              <span className="h-px flex-1 bg-[#e7ecf5]" />
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pr-10"
                  required
                />
                <Eye className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca7be]" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-[#95a0b8]">
                  <span>Password Strength</span>
                  <span className="text-[#7b2ff7]">{strength > 70 ? "Strong" : "Medium"}</span>
                </div>
                <Progress value={strength} className="h-2" />
                <p className="text-xs text-[#7d88a2]">Must be at least 8 characters with a mix of symbols.</p>
              </div>
            </div>

            <Button type="submit" className="h-12 w-full text-base" disabled={submitting}>
              {submitting ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-center text-xs text-[#95a0b8]">
              By signing up, you agree to EduVault&apos;s Terms of Service and Privacy Policy.
            </p>
          </form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
