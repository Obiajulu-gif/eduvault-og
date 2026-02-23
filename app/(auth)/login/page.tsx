"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("name@university.edu");
  const [password, setPassword] = useState("password123");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(searchParams.get("state") === "error" ? "Invalid email or password" : "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await login(email, password);
    if (!result.ok) {
      setSubmitting(false);
      setError(result.error ?? "Invalid email or password");
      return;
    }

    if (remember) {
      localStorage.setItem("eduvault-remember", email);
    }

    router.push("/overview");
  };

  return (
    <AuthShell
      topRight={<Link href="/signup" className="text-[#7b2ff7] hover:underline">Sign up</Link>}
      footerLinks={[
        { href: "#", label: "Privacy Policy" },
        { href: "#", label: "Terms of Service" },
        { href: "#", label: "Cookies" },
      ]}
    >
      <Card className="w-full max-w-[620px] border-[#e2e8f3]">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-[56px] font-black">Welcome back</CardTitle>
          <p className="text-base text-[#7985a2]">Access your secure educational vault</p>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-[#f8c6c3] bg-[#fff2f1] px-3 py-2 text-sm font-semibold text-[#d92d20]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
                <p className="pt-1 text-xs font-medium">Please check your credentials and try again.</p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca7be]" />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <Link href="/forgot-password" className="text-sm font-semibold text-[#7b2ff7] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca7be]" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Eye className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca7be]" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-[#6d7893]">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded" />
              Remember this device
            </label>

            <Button type="submit" className="h-12 w-full text-base" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </Button>

            <div className="my-2 flex items-center gap-3 py-1 text-xs font-bold uppercase tracking-wide text-[#98a2b7]">
              <span className="h-px flex-1 bg-[#e7ecf5]" />
              or continue with
              <span className="h-px flex-1 bg-[#e7ecf5]" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" type="button">Google</Button>
              <Button variant="outline" type="button">GitHub</Button>
            </div>

            <div className="pt-2 text-center text-sm text-[#7d88a2]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-bold text-[#7b2ff7] hover:underline">
                Sign up for free
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
