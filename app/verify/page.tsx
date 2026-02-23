"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpenCheck,
  CheckCircle2,
  Facebook,
  FileCheck2,
  Fingerprint,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  Search,
  ShieldCheck,
  Twitter,
  Youtube,
} from "lucide-react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { getClientEnv } from "@/lib/env";
import { shortAddress } from "@/lib/utils";

const env = getClientEnv();
const targetChainId = Number(env.NEXT_PUBLIC_CHAIN_ID);

const compliance = ["SOC2 TYPE II", "GDPR", "FERPA", "CCPA"];

const steps = [
  {
    title: "Input Credential ID",
    description: "Receive a unique identifier from the candidate or find it on their official EduVault profile.",
    icon: FileCheck2,
  },
  {
    title: "Blockchain Check",
    description: "Our engine queries the immutable ledger to ensure the certificate was issued by an authorized institution.",
    icon: Fingerprint,
  },
  {
    title: "Verified Report",
    description: "Instantly receive a tamper-proof report detailing specific skills, project outputs, and achievement dates.",
    icon: CheckCircle2,
  },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-6 w-6 place-items-center rounded-md bg-[#7e2df8] text-white">
        <BookOpenCheck className="h-3.5 w-3.5" />
      </span>
      <span className="text-[22px] font-black tracking-tight text-[#121b32]">EduVault</span>
    </div>
  );
}

export default function VerifyPage() {
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: switching } = useSwitchChain();
  const wrongChain = isConnected && chainId !== targetChainId;
  const [pendingDashboardRedirect, setPendingDashboardRedirect] = useState(false);

  useEffect(() => {
    if (pendingDashboardRedirect && isConnected && !wrongChain) {
      setPendingDashboardRedirect(false);
      router.push("/overview");
    }
  }, [isConnected, pendingDashboardRedirect, router, wrongChain]);

  const handleWalletAction = () => {
    if (!isConnected) {
      setPendingDashboardRedirect(true);
      openConnectModal?.();
      return;
    }

    if (wrongChain) {
      setPendingDashboardRedirect(true);
      switchChain({ chainId: targetChainId });
      return;
    }

    router.push("/overview");
  };

  const walletButtonLabel = !isConnected
    ? "Connect 0G Galileo"
    : wrongChain
      ? (switching ? "Switching..." : "Switch to 0G Galileo")
      : shortAddress(address, 4);

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#121b32]">
      <header className="border-b border-[#e8edf6] bg-white">
        <div className="mx-auto flex h-[68px] w-full max-w-[1240px] items-center justify-between px-4 md:px-8">
          <Brand />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#47526f] md:flex">
            <Link href="/" className="hover:text-[#7e2df8]">
              Home
            </Link>
            <Link href="/marketplace" className="hover:text-[#7e2df8]">
              Marketplace
            </Link>
            <Link href="/verify" className="text-[#7e2df8]">
              Verify
            </Link>
            <a href="#contact" className="hover:text-[#7e2df8]">
              Contact
            </a>
          </nav>
          <button
            type="button"
            onClick={handleWalletAction}
            className="rounded-[10px] bg-[#7e2df8] px-4 py-2 text-sm font-bold text-white shadow-[0_14px_24px_-16px_rgba(126,45,248,0.95)] disabled:opacity-70"
            disabled={switching}
          >
            {walletButtonLabel}
          </button>
        </div>
      </header>

      <main>
        <section className="bg-[#f4f0fb]">
          <div className="mx-auto w-full max-w-[1240px] px-4 pb-20 pt-16 text-center md:px-8 md:pb-24 md:pt-20">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#eadcff] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#7e2df8]">
              Blockchain Verified
            </p>
            <h1 className="mt-4 text-[56px] font-black leading-[0.95] md:text-[80px]">
              Instant Credential
              <br />
              Verification
            </h1>
            <p className="mx-auto mt-5 max-w-[760px] text-lg leading-relaxed text-[#5f6a88]">
              Eliminate resume fraud with EduVault&apos;s blockchain-backed verification system. Securely validate academic and
              professional achievements in seconds.
            </p>

            <div className="mx-auto mt-8 flex max-w-[760px] flex-col gap-2 rounded-2xl border border-[#dde4f2] bg-white p-2 shadow-[0_20px_35px_-30px_rgba(18,27,50,0.7)] md:flex-row md:items-center">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#f8faff] px-3 py-3 text-[#9aa6bf]">
                <Search className="h-4 w-4" />
                Enter Credential ID (e.g., EV-9823-XQ-2024)
              </div>
              <button
                type="button"
                onClick={handleWalletAction}
                className="h-12 rounded-xl bg-[#7e2df8] px-8 text-sm font-extrabold text-white disabled:opacity-70"
                disabled={switching}
              >
                Verify
              </button>
            </div>

            <p className="mt-3 inline-flex items-center gap-2 text-sm text-[#7e89a4]">
              <Lock className="h-3.5 w-3.5" />
              EduVault only displays authorized public credential data.
            </p>
          </div>
        </section>

        <section className="border-y border-[#e7edf7] bg-white py-8">
          <div className="mx-auto w-full max-w-[1240px] px-4 md:px-8">
            <p className="text-center text-xs font-bold uppercase tracking-wide text-[#9aa6bf]">Trusted Compliance & Security</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {compliance.map((item) => (
                <div key={item} className="rounded-xl border border-[#e7edf7] bg-[#f8faff] px-4 py-3 text-center text-sm font-black text-[#47526f]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-[#e3e9f3] bg-white p-5 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f2e9ff] text-[#7e2df8]">
                  <step.icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-[30px] font-black leading-none">
                  {index + 1}. {step.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#62708d]">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white py-8">
          <div className="mx-auto w-full max-w-[1240px] px-4 md:px-8">
            <div className="rounded-2xl border border-[#e3e9f3] bg-[#fcfdff] p-5 md:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-[44px] font-black leading-none">Verification Results</h2>
                <p className="text-sm font-bold uppercase tracking-wide text-[#7e2df8]">Download Verification Report</p>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.8fr]">
                <div className="rounded-2xl border border-[#e3e9f3] bg-white p-5">
                  <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-[#e4ddff]">
                    <img
                      src="https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=240&q=80"
                      alt="Alex Rivers"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-4 text-center text-[36px] font-black leading-none">Alex Rivers</p>
                  <p className="mt-1 text-center text-sm text-[#687693]">Senior Full Stack Developer</p>
                  <p className="mt-4 rounded-full bg-[#f1e6ff] px-3 py-1 text-center text-xs font-black uppercase tracking-wide text-[#7e2df8]">
                    Verified by EduVault AI
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#e3e9f3] bg-white p-5">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-[#7e2df8] text-[34px] font-black">89%</div>
                      <div>
                        <p className="text-[34px] font-black leading-none">Technical Roadmap Progress</p>
                        <p className="mt-2 text-sm text-[#6b7894]">
                          Alex has completed 24 out of 27 mandatory milestones for the Senior Cloud Architect career path.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#e3e9f3] bg-white p-5">
                    <p className="text-[30px] font-black leading-none">Verified Technical Skills</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {["TypeScript", "AWS Lambda", "PostgreSQL", "Rust", "OAuth 2.0", "System Design"].map((skill) => (
                        <div key={skill} className="rounded-xl border border-[#e8eef7] bg-[#fbfdff] px-3 py-2">
                          <p className="font-bold text-[#27314a]">{skill}</p>
                          <p className="text-[10px] font-black uppercase tracking-wide text-[#7e2df8]">Verified</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(110deg,#6422e7_0%,#9039ff_52%,#732cf3_100%)]">
          <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
            <h2 className="max-w-[540px] text-[48px] font-black leading-[0.95] text-white">
              Your Academic Work Is More Valuable Than You Think.
            </h2>
            <div className="flex w-full max-w-[530px] items-center gap-2 rounded-2xl bg-white/25 p-2">
              <div className="flex h-12 flex-1 items-center gap-2 rounded-xl bg-white/20 px-3 text-white/85">
                <Mail className="h-4 w-4" />
                name@email.com
              </div>
              <button
                type="button"
                onClick={handleWalletAction}
                className="h-12 rounded-xl bg-[#182742] px-10 text-sm font-extrabold text-white disabled:opacity-70"
                disabled={switching}
              >
                {walletButtonLabel}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-[#131f37] text-[#cad4e8]">
        <div className="mx-auto grid w-full max-w-[1240px] gap-8 px-4 py-14 md:grid-cols-4 md:px-8">
          <div>
            <Brand />
            <p className="mt-5 max-w-[280px] text-sm leading-relaxed text-[#b9c4db]">
              AI-powered career intelligence and on-chain productivity tools for ambitious students and creators.
            </p>
          </div>

          <div>
            <p className="mb-3 text-[34px] font-black leading-none text-white">Quick links</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-white">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-white">
                  Verify
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[34px] font-black leading-none text-white">Resources</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[34px] font-black leading-none text-white">Social media</p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
