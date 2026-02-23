import { createPublicClient, http } from "viem";
import { defineChain } from "viem";
import { getClientEnv } from "@/lib/env";

const env = getClientEnv();

const chainId = Number(env.NEXT_PUBLIC_CHAIN_ID);

export const serverChain = defineChain({
  id: Number.isNaN(chainId) ? 16600 : chainId,
  name: "0G Newton Testnet",
  nativeCurrency: { name: "OG", symbol: "OG", decimals: 18 },
  rpcUrls: {
    default: { http: [env.NEXT_PUBLIC_RPC_URL] },
  },
  blockExplorers: {
    default: {
      name: "0G Explorer",
      url: env.NEXT_PUBLIC_BLOCK_EXPLORER,
    },
  },
  testnet: true,
});

export const serverPublicClient = createPublicClient({
  chain: serverChain,
  transport: http(env.NEXT_PUBLIC_RPC_URL),
});
