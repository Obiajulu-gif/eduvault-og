"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  Brain,
  ChevronDown,
  Compass,
  LayoutDashboard,
  Shield,
  Wallet,
  Activity,
  Sparkles,
  Store,
} from "lucide-react";
import { useMemo } from "react";
import { useAccount, useBalance, useChainId, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, shortAddress } from "@/lib/utils";
import { getClientEnv } from "@/lib/env";
import { Logo } from "@/components/layout/logo";
import { useAuth } from "@/components/auth/auth-provider";

const env = getClientEnv();
const targetChainId = Number(env.NEXT_PUBLIC_CHAIN_ID);

const primaryNav = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/my-skills", label: "My Skills", icon: Brain },
];

const marketNav = [
  { href: "/marketplace", label: "Browse Prompts", icon: Store },
  { href: "/marketplace/my-prompts", label: "My Prompts", icon: BookOpen },
  { href: "/creator/publish", label: "Creator Tool", icon: Sparkles },
];

const lowerNav = [
  { href: "/research-vault", label: "Research Vault", icon: Compass },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/activities", label: "Activities", icon: Activity },
  { href: "/settings/security", label: "Settings", icon: Shield },
];

function NavLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
        active ? "bg-[#f1e8ff] text-[#7b2ff7] shadow-[inset_-2px_0_0_0_#7b2ff7]" : "text-[#5b647d] hover:bg-[#f4f7fc] hover:text-[#222b3d]",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const crumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return ["EduVault", "Overview"];
    return ["EduVault", ...parts.map((part) => part.replace(/-/g, " ").replace(/\b\w/g, (match) => match.toUpperCase()))];
  }, [pathname]);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address, query: { enabled: Boolean(address) } });
  const { openConnectModal } = useConnectModal();
  const { switchChain, isPending: switching } = useSwitchChain();
  const wrongChain = isConnected && chainId !== targetChainId;

  const initials = (user?.name ?? "Jane Doe")
    .split(" ")
    .map((chunk) => chunk[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#162038]">
      <div className="mx-auto flex min-h-screen w-full">
        <aside className="sticky top-0 hidden h-screen w-[280px] border-r border-[#e7ecf5] bg-white px-4 py-5 lg:flex lg:flex-col">
          <div className="mb-8">
            <Logo />
          </div>

          <nav className="space-y-1">
            {primaryNav.map((item) => (
              <NavLink key={item.href} {...item} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} />
            ))}
          </nav>

          <div className="mt-5 space-y-1">
            <p className="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-wide text-[#7c87a2]">Marketplace</p>
            <ChevronDown className="absolute right-8 mt-[-22px] h-4 w-4 text-[#8893ab]" />
            {marketNav.map((item) => (
              <NavLink key={item.href} {...item} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} />
            ))}
          </div>

          <div className="mt-4 space-y-1">
            {lowerNav.map((item) => (
              <NavLink key={item.href} {...item} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} />
            ))}
          </div>

          <div className="mt-auto space-y-3 pb-2 pt-6">
            <div className="flex items-center justify-between rounded-xl bg-[#f5f7fc] px-3 py-2.5">
              <div>
                <p className="text-sm font-semibold text-[#283047]">{user?.name ?? "Jane Doe"}</p>
                <p className="text-xs font-semibold text-[#7b2ff7]">{isConnected ? `${balance?.formatted?.slice(0, 6) ?? "0.00"} ETH` : "0.00 ETH"}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffe8d9] text-sm font-bold text-[#806442]">{initials}</div>
            </div>
            <Button className="h-11 w-full" onClick={() => openConnectModal?.()}>
              {isConnected ? shortAddress(address, 3) : "Connect Wallet"}
            </Button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#e7ecf5] bg-white px-5 lg:px-8">
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#8d97ad]">
              {crumbs.map((crumb, index) => (
                <div key={`${crumb}-${index}`} className="flex items-center gap-2">
                  <span className={cn(index === crumbs.length - 1 && "font-semibold text-[#384159]")}>{crumb}</span>
                  {index !== crumbs.length - 1 && <span>/</span>}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              <Badge className="h-8 px-3 text-[13px] font-bold" variant="outline">
                {isConnected ? `${Number(balance?.formatted ?? 0).toFixed(2)} ETH` : "ETH 0.00"}
              </Badge>

              {!isConnected ? (
                <Button variant="outline" size="sm" onClick={() => openConnectModal?.()}>
                  Connect Wallet
                </Button>
              ) : wrongChain ? (
                <Button size="sm" onClick={() => switchChain({ chainId: targetChainId })} disabled={switching}>
                  {switching ? "Switching..." : "Switch Network"}
                </Button>
              ) : (
                <Button variant="outline" size="sm">
                  {shortAddress(address)}
                </Button>
              )}

              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe5f0] bg-white text-[#7c86a0] transition-colors hover:text-[#1f283b]">
                <Bell className="h-4 w-4" />
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#efe3ff] text-sm font-black text-[#7b2ff7]">
                {initials}
              </div>
            </div>
          </header>

          <main className="flex-1 px-5 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function useWrongChainState() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  return {
    wrongChain: isConnected && chainId !== targetChainId,
    targetChainId,
  };
}
