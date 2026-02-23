"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TxHistoryTable } from "@/components/wallet/tx-history-table";
import { fetchTxHistory } from "@/lib/client-api";
import { shortAddress } from "@/lib/utils";

export default function WalletPage() {
  const { address, isConnected, connector } = useAccount();
  const { data: balance } = useBalance({ address, query: { enabled: Boolean(address) } });
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();

  const txQuery = useQuery({
    queryKey: ["tx-history", address],
    queryFn: () => fetchTxHistory(address),
  });

  const usdValue = Number(balance?.formatted ?? 0) * 1837;

  return (
    <div className="space-y-5">
      <h1 className="text-4xl font-black leading-tight text-[#151f36] md:text-[44px]">Wallet Management</h1>

      <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <Card className="border-[#e4eaf4]">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7d88a2]">Total Balance</p>
              <p className="text-5xl font-black leading-none text-[#151f36] md:text-[58px]">{Number(balance?.formatted ?? 0).toFixed(2)} ETH</p>
              <p className="text-base font-semibold text-[#96a0b7]">~ ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>+ Add Funds</Button>
              <Button variant="secondary">Withdraw</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e4eaf4]">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#1a2338] md:text-[28px]">Connected Wallets</h2>
              <Badge>2 Active</Badge>
            </div>

            <div className="space-y-2">
              {isConnected ? (
                <div className="rounded-xl border border-[#decdf7] bg-[#f7f0ff] p-3">
                  <p className="text-base font-bold text-[#27314a]">{connector?.name ?? "Wallet"}</p>
                  <p className="text-sm text-[#7e89a4]">{shortAddress(address)}</p>
                  <div className="mt-2 flex gap-2">
                    <Badge>Primary</Badge>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-[#7e89a4]" onClick={() => disconnect()}>
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[#e3e9f3] bg-white p-4 text-center">
                  <p className="text-sm text-[#7e89a4]">No wallet connected</p>
                  <Button className="mt-3" onClick={() => openConnectModal?.()}>
                    Connect Wallet
                  </Button>
                </div>
              )}
            </div>

            {isConnected && (
              <button
                className="w-full rounded-xl border border-dashed border-[#cfd8e8] px-3 py-2 text-sm font-semibold text-[#77839f] hover:border-[#7b2ff7] hover:text-[#7b2ff7]"
                onClick={() => openConnectModal?.()}
              >
                Connect Another Wallet
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {txQuery.isLoading ? (
        <Card className="border-[#e4eaf4]"><CardContent className="h-[320px] animate-pulse p-5" /></Card>
      ) : (
        <TxHistoryTable rows={txQuery.data ?? []} />
      )}

      <Card className="border-[#f6d3d2] bg-[#fff2f1]">
        <CardContent className="space-y-2 p-4">
          <p className="text-xl font-black text-[#b42318] md:text-2xl">Security Recommendation</p>
          <p className="text-base text-[#cf4b41]">
            Your wallet is currently the primary connection. We recommend enabling 2FA in account settings for an extra layer of protection.
          </p>
          <a href="/settings/security" className="text-sm font-bold underline text-[#b42318]">Configure Security Details</a>
        </CardContent>
      </Card>
    </div>
  );
}