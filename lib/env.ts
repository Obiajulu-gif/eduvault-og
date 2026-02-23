import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_CHAIN_ID: z.string().default("16600"),
  NEXT_PUBLIC_RPC_URL: z.string().url().default("https://evmrpc-testnet.0g.ai"),
  NEXT_PUBLIC_BLOCK_EXPLORER: z.string().url().default("https://chainscan-newton.0g.ai"),
  NEXT_PUBLIC_MARKETPLACE_ADDRESS: z.string().default(""),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().default(""),
  NEXT_PUBLIC_SUPABASE_URL: z.string().default(""),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default(""),
  NEXT_PUBLIC_ENABLE_MOCKS: z.enum(["true", "false"]).default("true"),
});

const serverEnvSchema = z.object({
  OG_STORAGE_RPC_URL: z.string().url().default("https://evmrpc-testnet.0g.ai"),
  OG_STORAGE_INDEXER_RPC: z
    .string()
    .url()
    .default("https://indexer-storage-testnet-standard.0g.ai"),
  OG_STORAGE_PRIVATE_KEY: z.string().optional(),
  OG_COMPUTE_PRIVATE_KEY: z.string().optional(),
  OG_COMPUTE_RPC_URL: z.string().url().default("https://evmrpc-testnet.0g.ai"),
  OG_COMPUTE_DEFAULT_PROVIDER: z.string().optional(),
  OG_COMPUTE_DEFAULT_MODEL: z.string().default("qwen/qwen-2.5-7b-instruct"),
  OG_COMPUTE_PROMPT_FALLBACK_FEE: z.string().default("0.01"),
  INDEXER_START_BLOCK: z.string().default("0"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

let parsedClientEnv: ClientEnv | null = null;
let parsedServerEnv: ServerEnv | null = null;

function formatError(prefix: string, err: z.ZodError) {
  const details = err.issues
    .map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`)
    .join("; ");
  return `${prefix} ${details}`;
}

export function getClientEnv(): ClientEnv {
  if (parsedClientEnv) return parsedClientEnv;
  const result = clientEnvSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(formatError("Invalid client env:", result.error));
  }
  parsedClientEnv = result.data;
  return parsedClientEnv;
}

export function getServerEnv(): ServerEnv {
  if (parsedServerEnv) return parsedServerEnv;
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(formatError("Invalid server env:", result.error));
  }
  parsedServerEnv = result.data;
  return parsedServerEnv;
}

export function isMockMode() {
  return getClientEnv().NEXT_PUBLIC_ENABLE_MOCKS === "true";
}

export function isSupabaseConfigured() {
  const env = getClientEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function assertStorageEnv() {
  const env = getServerEnv();
  if (isMockMode()) return env;
  if (!env.OG_STORAGE_PRIVATE_KEY) {
    throw new Error(
      "Missing OG_STORAGE_PRIVATE_KEY. Set it in .env or enable NEXT_PUBLIC_ENABLE_MOCKS=true.",
    );
  }
  return env;
}

export function assertComputeEnv() {
  const env = getServerEnv();
  if (isMockMode()) return env;
  if (!env.OG_COMPUTE_PRIVATE_KEY) {
    throw new Error(
      "Missing OG_COMPUTE_PRIVATE_KEY. Set it in .env or enable NEXT_PUBLIC_ENABLE_MOCKS=true.",
    );
  }
  return env;
}
