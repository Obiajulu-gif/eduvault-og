"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpenCheck,
  Code2,
  Database,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Search,
  Twitter,
  Youtube,
} from "lucide-react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useDisconnect, useSwitchChain } from "wagmi";
import { getClientEnv } from "@/lib/env";

const env = getClientEnv();
const targetChainId = Number(env.NEXT_PUBLIC_CHAIN_ID);

const marketCards = [
  {
    category: "DATA SCIENCE",
    title: "Python for Data Science",
    desc: "Advanced data manipulation and visualization techniques validated by AI mapping.",
    author: "Alex J.",
    price: "0.05 ETH",
    color: "bg-[#d8cff6]",
    icon: "code",
  },
  {
    category: "BLOCKCHAIN",
    title: "Solidity Smart Contract Basics",
    desc: "Comprehensive understanding of Ethereum contracts and security patterns.",
    author: "Sarah M.",
    price: "0.08 ETH",
    color: "bg-[#c9e0f3]",
    icon: "db",
  },
  {
    category: "DATA SCIENCE",
    title: "Python for Data Science",
    desc: "Advanced data manipulation and visualization techniques validated by AI mapping.",
    author: "Alex J.",
    price: "0.05 ETH",
    color: "bg-[#d8cff6]",
    icon: "code",
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

export default function MarketplaceLandingPage() {
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: switching } = useSwitchChain();
  const wrongChain = isConnected && chainId !== targetChainId;
  const [pendingDashboardRedirect, setPendingDashboardRedirect] = useState(false);

  useEffect(() => {
    if (pendingDashboardRedirect && isConnected && !wrongChain) {
      setPendingDashboardRedirect(false);
      router.push("/dashboard");
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

    router.push("/dashboard");
  };

  const walletButtonLabel = !isConnected
    ? "Connect 0G Galileo"
    : wrongChain
      ? (switching ? "Switching..." : "Switch to 0G Galileo")
      : "Go to Dashboard";

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#121b32]">
      <header className="border-b border-[#e8edf6] bg-white">
        <div className="mx-auto flex h-[68px] w-full max-w-[1240px] items-center justify-between px-4 md:px-8">
          <Brand />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#47526f] md:flex">
            <Link href="/" className="hover:text-[#7e2df8]">
              Home
            </Link>
            <Link href="/marketplace" className="text-[#7e2df8]">
              Marketplace
            </Link>
            <Link href="/verify" className="hover:text-[#7e2df8]">
              Verify
            </Link>
            <a href="#contact" className="hover:text-[#7e2df8]">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {isConnected && !wrongChain ? (
              <>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="rounded-[10px] bg-[#7e2df8] px-4 py-2 text-sm font-bold text-white shadow-[0_14px_24px_-16px_rgba(126,45,248,0.95)]"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => disconnect()}
                  className="rounded-[10px] border border-[#d5deed] bg-white px-4 py-2 text-sm font-bold text-[#24314f]"
                >
                  Disconnect Wallet
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleWalletAction}
                className="rounded-[10px] bg-[#7e2df8] px-4 py-2 text-sm font-bold text-white shadow-[0_14px_24px_-16px_rgba(126,45,248,0.95)] disabled:opacity-70"
                disabled={switching}
              >
                {walletButtonLabel}
              </button>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-[1240px] px-4 pb-12 pt-16 text-center md:px-8 md:pb-16 md:pt-20">
          <h1 className="text-[56px] font-black leading-[0.95] md:text-[80px]">
            Precision Tools for
            <br />
            <span className="text-[#7e2df8]">Higher Performance</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[760px] text-lg leading-relaxed text-[#5f6a88]">
            Access the world&apos;s most advanced prompt engineering library for researchers, developers, and strategists.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleWalletAction}
              className="rounded-[12px] bg-[#7e2df8] px-8 py-3 text-sm font-bold text-white shadow-[0_18px_30px_-20px_rgba(126,45,248,0.98)] disabled:opacity-70"
              disabled={switching}
            >
              {isConnected && !wrongChain ? "Open Dashboard Marketplace" : "Explore Marketplace"}
            </button>
            <Link
              href="/verify"
              className="rounded-[12px] border border-[#d7dfed] bg-white px-8 py-3 text-sm font-bold text-[#22304d]"
            >
              How it works
            </Link>
          </div>

          <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-[#dce4f1] bg-white p-4 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#f8faff] px-3 py-2.5 text-[#9aa6bf]">
              <Search className="h-4 w-4" />
              Search for high-performance prompts...
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
              {["All", "Academic", "Technical", "Strategy", "Creative"].map((category) => (
                <span
                  key={category}
                  className={`rounded-lg px-3 py-2 ${category === "All" ? "bg-[#7e2df8] text-white" : "bg-[#eef2f8] text-[#5a6784]"}`}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto w-full max-w-[1240px] px-4 md:px-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-[54px] font-black leading-none">Marketplace Preview</h2>
                <p className="mt-2 text-base text-[#667492]">Discover top-tier skills minted by the community.</p>
              </div>
              <button
                type="button"
                onClick={handleWalletAction}
                className="text-xs font-black uppercase tracking-wide text-[#7e2df8] disabled:opacity-70"
                disabled={switching}
              >
                Enter Dashboard Marketplace -&gt;
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {marketCards.map((card, index) => (
                <article key={`${card.title}-${index}`} className="overflow-hidden rounded-2xl border border-[#dfe6f3] bg-white">
                  <div className={`grid h-[158px] place-items-center ${card.color}`}>
                    {card.icon === "db" ? (
                      <Database className="h-9 w-9 text-[#9b70fa]" />
                    ) : (
                      <Code2 className="h-9 w-9 text-[#9b70fa]" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex gap-2">
                      <span className="rounded bg-[#f1e6ff] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#7e2df8]">
                        {card.category}
                      </span>
                      <span className="rounded bg-[#dff5e8] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#1da35c]">
                        Verified
                      </span>
                    </div>
                    <h3 className="mt-3 text-[32px] font-black leading-none">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#63708e]">{card.desc}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-[#edf2f8] pt-3">
                      <p className="text-xs font-semibold text-[#6f7b97]">{card.author}</p>
                      <p className="text-lg font-black text-[#7e2df8]">{card.price}</p>
                    </div>
                  </div>
                </article>
              ))}
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
