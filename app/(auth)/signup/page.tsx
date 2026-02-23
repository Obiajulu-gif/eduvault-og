"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/auth/auth-provider";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 35;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[a-z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  return Math.min(score, 100);
}

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthLabel = strength >= 80 ? "Strong" : strength >= 55 ? "Medium" : "Weak";

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

              if (password.length < 8) {
                setError("Password must be at least 8 characters long.");
                setSubmitting(false);
                return;
              }

              if (password !== confirmPassword) {
                setError("Passwords do not match.");
                setSubmitting(false);
                return;
              }

              if (!agreeToTerms) {
                setError("Please accept the Terms of Service and Privacy Policy.");
                setSubmitting(false);
                return;
              }

              const result = await signup(name.trim(), email.trim(), password);
              if (!result.ok) {
                setError(result.error ?? "Failed to create account");
                setSubmitting(false);
                return;
              }

              router.push("/verify-email");
            }}
          >
            {error && (
              <div className="rounded-xl border border-[#f8c6c3] bg-[#fff2f1] px-3 py-2 text-sm font-semibold text-[#d92d20]">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jane Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jane@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pr-10"
                  placeholder="At least 8 characters"
                  required
                />
                <Eye className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca7be]" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-[#95a0b8]">
                <span>Password Strength</span>
                <span className={strength >= 80 ? "text-[#0f9f61]" : "text-[#7b2ff7]"}>{strengthLabel}</span>
              </div>
              <Progress value={strength} className="h-2" />
              <p className="text-xs text-[#7d88a2]">Use uppercase, lowercase, number, and symbol for a stronger password.</p>
            </div>

            <label className="flex items-start gap-2 text-sm text-[#6d7893]">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(event) => setAgreeToTerms(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded"
              />
              <span>
                I agree to EduVault&apos;s Terms of Service and Privacy Policy.
              </span>
            </label>

            <Button type="submit" className="h-12 w-full text-base" disabled={submitting}>
              {submitting ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-[#7d88a2]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#7b2ff7] hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
