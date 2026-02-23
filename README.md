# EduVault (0G + Supabase MVP)

EduVault is a decentralized AI Prompt Marketplace + Research Vault on the 0G ecosystem.

- Landing page is now at `/` (public first screen).
- Auth routes: `/login`, `/signup`, `/verify-email`, `/forgot-password`.
- App routes: `/overview`, `/marketplace`, `/research-vault`, and related dashboard pages.

## Stack

- Next.js App Router + TypeScript + Tailwind
- RainbowKit + wagmi + viem
- Hardhat + Solidity marketplace contract
- 0G Storage SDK: `@0glabs/0g-ts-sdk`
- 0G Compute broker: `@0glabs/0g-serving-broker`
- Supabase Auth: `@supabase/supabase-js`

## Quick Start

1. Install dependencies:

```bash
pnpm install --no-frozen-lockfile
```

2. Create local env file:

```bash
cp .env.example .env.local
```

3. Start dev server:

```bash
pnpm dev
```

4. Open:
- `http://localhost:3000`

## Environment Variables

Use `.env.local` for local development and Vercel Environment Variables for deployment.

### Public / Client

- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_BLOCK_EXPLORER`
- `NEXT_PUBLIC_MARKETPLACE_ADDRESS`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ENABLE_MOCKS`

### Server / Secret

- `DEPLOYER_PRIVATE_KEY`
- `OG_STORAGE_PRIVATE_KEY`
- `OG_COMPUTE_PRIVATE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Supabase Setup

1. Create a Supabase project.
2. In Supabase Dashboard:
- Go to `Authentication -> Providers` and enable `Email`.
- Go to `Authentication -> URL Configuration`.
- Add your app URLs:
  - Local: `http://localhost:3000`
  - Vercel production URL
3. Copy keys into env:
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Publishable/anon key
- `SUPABASE_SERVICE_ROLE_KEY` = service role key (server-only; never expose client-side)
4. Set `NEXT_PUBLIC_ENABLE_MOCKS=false` to use Supabase + live 0G mode.

## 0G Setup (How 0G Is Done)

### 1) Chain + Contract

Contract file: `contracts/EduVaultMarketplace.sol`

Implemented methods/events:
- `listPrompt(string metadataURI, uint256 priceWei)`
- `buyPrompt(uint256 promptId) payable`
- `withdrawProceeds()`
- `getPrompt(uint256 promptId)`
- `hasLicense(uint256 promptId, address user)`
- Events: `PromptListed`, `PromptPurchased`, `Withdrawn`

Compile and test:

```bash
pnpm contract:compile
pnpm contract:test
```

Deploy to 0G Newton:

```bash
pnpm contract:deploy:newton
```

After deploy, set:
- `NEXT_PUBLIC_MARKETPLACE_ADDRESS=<deployed_address>`

Deployment metadata is written to `deployments/<network>.json`.

### 2) 0G Storage Integration

API routes:
- `POST /api/storage/upload`
- `POST /api/storage/upload-json`
- `GET /api/storage/download?ref=...`

Used for:
- Prompt template uploads
- Prompt metadata uploads
- Research artifact autosave/download

Required env for live mode:
- `OG_STORAGE_RPC_URL`
- `OG_STORAGE_INDEXER_RPC`
- `OG_STORAGE_PRIVATE_KEY`

### 3) 0G Compute Integration

API routes:
- `POST /api/compute/infer`
- `POST /api/compute/stream`

Used for:
- Server-side inference proxying
- Streaming model output to UI

Required env for live mode:
- `OG_COMPUTE_RPC_URL`
- `OG_COMPUTE_PRIVATE_KEY`
- Optional: `OG_COMPUTE_DEFAULT_PROVIDER`, `OG_COMPUTE_DEFAULT_MODEL`

### 4) Lightweight Indexer

API routes:
- `GET /api/prompts`
- `GET /api/prompts/[promptId]`
- `GET /api/txs?address=...`

Env:
- `INDEXER_START_BLOCK`

## End-to-End Flow

1. Creator publishes:
- Upload template (0G Storage)
- Upload metadata (0G Storage)
- Call `listPrompt` on 0G chain

2. Buyer purchases:
- Open listing `/marketplace/[promptId]`
- Confirm wallet tx (`buyPrompt`)

3. Execute and save:
- Run prompt in `/research-vault/execute/[promptId]`
- Stream output via compute API
- Autosave output to 0G Storage

## Build & Deploy

Local production build:

```bash
pnpm build
```

Vercel:
- Add all required env vars in Project Settings.
- Ensure `NEXT_PUBLIC_ENABLE_MOCKS=false` for live integrations.

## Security Notes

- Never commit `.env.local`, private keys, or service keys.
- If any private key was shared publicly, rotate it immediately and replace it everywhere.
