import { AppShell } from "@/components/layout/app-shell";
import { WalletGuard } from "@/components/auth/wallet-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletGuard>
      <AppShell>{children}</AppShell>
    </WalletGuard>
  );
}
