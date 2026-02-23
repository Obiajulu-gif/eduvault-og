import { createPublicClient, http } from "viem";
import { getClientEnv } from "@/lib/env";
import { ogChain } from "@/lib/web3/config";

const env = getClientEnv();

export const publicClient = createPublicClient({
  chain: ogChain,
  transport: http(env.NEXT_PUBLIC_RPC_URL),
});
