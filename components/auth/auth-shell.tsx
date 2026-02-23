import Link from "next/link";
import { Logo } from "@/components/layout/logo";

interface AuthShellProps {
  children: React.ReactNode;
  topRight?: React.ReactNode;
  footerLinks?: Array<{ href: string; label: string }>;
}

export function AuthShell({ children, topRight, footerLinks = [] }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b border-[#e9edf6] bg-white px-4 md:px-8">
        <Logo />
        <div className="text-sm font-semibold text-[#7d88a2]">{topRight}</div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">{children}</main>

      <footer className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 text-xs font-semibold text-[#a4adc0]">
        <span>© 2024 EduVault Inc. All rights reserved.</span>
        <div className="flex items-center gap-5">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#7b2ff7]">
              {link.label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
