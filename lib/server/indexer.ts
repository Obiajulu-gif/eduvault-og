import { parseAbiItem } from "viem";
import { getClientEnv, isMockMode } from "@/lib/env";
import { EDUVAULT_MARKETPLACE_ABI } from "@/lib/contracts/eduvault-marketplace";
import type { PromptListing, TxRecord } from "@/lib/types";
import { MOCK_PROMPTS, MOCK_TXS } from "@/lib/mock-data";
import { serverPublicClient } from "@/lib/server/public-client";
import { resolveMetadataFromUri } from "@/lib/server/storage-client";

const listedEvent = parseAbiItem(
  "event PromptListed(uint256 indexed promptId, address indexed seller, uint256 priceWei, string metadataURI)",
);
const purchasedEvent = parseAbiItem(
  "event PromptPurchased(uint256 indexed promptId, address indexed buyer, uint256 priceWei)",
);

let cache: {
  at: number;
  prompts: PromptListing[];
  txs: TxRecord[];
} | null = null;

const CACHE_TTL_MS = 20_000;

function explorerTxUrl(txHash: string) {
  const env = getClientEnv();
  return `${env.NEXT_PUBLIC_BLOCK_EXPLORER.replace(/\/$/, "")}/tx/${txHash}`;
}

export async function indexMarketplaceData(force = false) {
  const env = getClientEnv();

  if (isMockMode() || !env.NEXT_PUBLIC_MARKETPLACE_ADDRESS) {
    return {
      prompts: MOCK_PROMPTS,
      txs: MOCK_TXS,
    };
  }

  if (!force && cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return {
      prompts: cache.prompts,
      txs: cache.txs,
    };
  }

  const address = env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;

  const listedLogs = await serverPublicClient.getLogs({
    address,
    event: listedEvent,
    fromBlock: BigInt(Math.max(0, Number(process.env.INDEXER_START_BLOCK ?? "0"))),
    toBlock: "latest",
  });

  const purchases = await serverPublicClient.getLogs({
    address,
    event: purchasedEvent,
    fromBlock: BigInt(Math.max(0, Number(process.env.INDEXER_START_BLOCK ?? "0"))),
    toBlock: "latest",
  });

  const prompts: PromptListing[] = await Promise.all(
    listedLogs.map(async (log) => {
      const promptId = Number(log.args.promptId ?? 0n);
      const data = await serverPublicClient.readContract({
        address,
        abi: EDUVAULT_MARKETPLACE_ABI,
        functionName: "getPrompt",
        args: [BigInt(promptId)],
      });

      const [seller, priceWei, metadataURI, isActive] = data;
      const metadata = await resolveMetadataFromUri(metadataURI);

      return {
        promptId,
        seller,
        priceWei: priceWei.toString(),
        metadataURI,
        isActive,
        metadata: metadata ?? undefined,
        txHash: log.transactionHash,
        createdAt: Number(log.blockNumber),
      };
    }),
  );

  const txs: TxRecord[] = purchases.map((log, index) => ({
    id: `purchase-${index}-${log.transactionHash}`,
    date: new Date().toISOString(),
    action: "Prompt Purchase",
    amountEth: `-${Number(log.args.priceWei ?? 0n) / 1e18}`,
    status: "Success",
    txHash: `${log.transactionHash.slice(0, 6)}...${log.transactionHash.slice(-4)}`,
    promptId: Number(log.args.promptId ?? 0n),
    explorerUrl: explorerTxUrl(log.transactionHash),
  }));

  const sortedPrompts = prompts
    .filter((prompt) => prompt.isActive)
    .sort((a, b) => b.promptId - a.promptId);

  cache = {
    at: Date.now(),
    prompts: sortedPrompts,
    txs,
  };

  return {
    prompts: sortedPrompts,
    txs,
  };
}
