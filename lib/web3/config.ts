import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import type { Chain } from "viem";
import { getClientEnv } from "@/lib/env";

const env = getClientEnv();

const chainId = Number(env.NEXT_PUBLIC_CHAIN_ID);

export const ogChain: Chain = {
  id: Number.isNaN(chainId) ? 16600 : chainId,
  name: "0G Newton Testnet",
  nativeCurrency: {
    name: "OG",
    symbol: "OG",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [env.NEXT_PUBLIC_RPC_URL],
    },
    public: {
      http: [env.NEXT_PUBLIC_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "0G Explorer",
      url: env.NEXT_PUBLIC_BLOCK_EXPLORER,
    },
  },
  testnet: true,
};

export const wagmiConfig = getDefaultConfig({
  appName: "EduVault",
  projectId:
    env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-walletconnect-project-id",
  chains: [ogChain],
  transports: {
    [ogChain.id]: http(env.NEXT_PUBLIC_RPC_URL),
  },
  ssr: true,
});
