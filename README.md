# EduVault — 0G + Supabase MVP

> We recommend that reviewers and contributors run EduVault locally, using the `docs/` folder to obtain the 0G and Supabase API keys they need and copying them into `.env.local` (without ever committing secrets). For package management, use `bun` if possible (preferred) or `pnpm` as a fallback: install dependencies, run a production `build`, then `start` the app to verify everything end‑to‑end. Once your local setup and documentation are validated, push the updated `docs/` folder to GitHub (after checking that no private keys or sensitive values are included).

EduVault is a decentralized AI Prompt Marketplace and Research Vault built on the 0G ecosystem, with Supabase handling authentication and metadata. This README explains how to run the project locally, how 0G is wired into the codebase (storage, compute, chain), and how to deploy it in a production-ready way.

### Table of contents

- [1. Developer recommendations](#1-developer-recommendations)
- [2. What EduVault does](#2-what-eduvault-does)
- [3. Tech stack & architecture](#3-tech-stack--architecture)
- [4. How 0G is used (storage, compute, chain)](#4-how-0g-is-used-storage-compute-chain)
- [5. Environment variables](#5-environment-variables)
- [6. Local development](#6-local-development)
- [7. API routes](#7-api-routes)
- [8. Smart contracts](#8-smart-contracts)
- [9. Deployment (Vercel)](#9-deployment-vercel)
- [10. Developer notes & mock mode](#10-developer-notes--mock-mode)
- [11. Linting & tests](#11-linting--tests)
- [12. Security checklist](#12-security-checklist)
- [13. Project structure](#13-project-structure)

---

## 1. Developer recommendations

- **Run it locally first**: The `docs/` folder documents how to obtain the 0G and Supabase API keys you need. Copy any required values into `.env.local` and **never commit secrets**.
- **Preferred package manager**: `bun` is recommended; `pnpm` is the fallback.
- **Local commands with bun (recommended)**:

```bash
bun install
bun run build
bun run start
```

- **Local commands with pnpm**:

```bash
pnpm install --legacy-peer-deps --no-frozen-lockfile
pnpm build
pnpm start
```

- After you have verified your local setup and written documentation, push the `docs/` folder to GitHub (only after checking that no private keys or secrets are inside).

---

## 2. What EduVault does

EduVault is a marketplace and research workspace where:
- **Creators** publish AI prompt templates. Prompt metadata is stored on 0G Storage and indexed on-chain via the EduVault marketplace contract.
- **Buyers** purchase licenses to prompts on-chain and gain access to run them.
- **Users** execute prompts via 0G Compute services, stream model outputs into the UI, and save research artifacts back to 0G Storage.

Supabase provides authentication and user metadata; Next.js (App Router) powers the dashboard and marketplace UI.

---

## 3. Tech stack & architecture

- **Frontend**
  - Next.js App Router (TypeScript, Tailwind)
  - Wallet integration via `@rainbow-me/rainbowkit`, `wagmi`, `viem`
  - React Query for data fetching, sonner for toasts, zod for validation

- **Backend / APIs**
  - Next.js API routes in `app/api/*`
  - Supabase SDK: `@supabase/supabase-js`
  - 0G SDKs:
    - `@0glabs/0g-ts-sdk` for Storage
    - `@0glabs/0g-serving-broker` for Compute

- **Smart contracts & blockchain**
  - Hardhat + ethers
  - Solidity marketplace contract `EduVaultMarketplace.sol`
  - Target network: 0G Newton / Galileo testnets (see `docs/contracts/*`)

---

## 4. How 0G is used (storage, compute, chain)

This repo integrates 0G in three places: **storage**, **compute**, and **on-chain marketplace**.

- **Storage (0G Storage / `@0glabs/0g-ts-sdk`)**
  - Implemented in server-side helpers and API routes:
    - `lib/server/storage-client.ts`
    - `app/api/storage/upload`
    - `app/api/storage/upload-json`
    - `app/api/storage/download`
  - Used for:
    - Prompt template uploads
    - Prompt metadata uploads
    - Research artifact autosave and download
  - Controlled by `OG_STORAGE_*` env vars.

- **Compute (0G Compute / `@0glabs/0g-serving-broker`)**
  - Implemented in `lib/server/compute-client.ts`.
  - Responsibilities:
    - Create a compute broker from an ethers wallet using `OG_COMPUTE_PRIVATE_KEY` and `OG_COMPUTE_RPC_URL`.
    - Ensure a **ledger** exists:
      - If no ledger is found, it calls `addLedger` with an initial OG amount.
      - If balance is below the internal target, it calls `depositFund` to top up.
    - Discover services with `broker.inference.listService`, pick chatbot services, and acknowledge providers via `acknowledgeProviderSigner`.
    - Build and send requests to providers (`/chat/completions`) using generated headers.
    - Handle both **single-shot** (`inferSkillMapping`) and **streaming** (`streamPromptInference`) inference flows.
    - Call `broker.inference.processResponse` to verify TEE responses and manage usage-based fees.

  - Internal defaults in code:
    - `TARGET_LEDGER_OG = 1` — recommended minimum ledger balance.
    - `INITIAL_PROVIDER_TRANSFER = 0.5` — suggested provider sub-account funding.
    - Balances are converted between OG and bigints using `ethers.parseEther` / `ethers.formatEther`.

- **On-chain marketplace (0G chain + contract)**
  - Contract: `contracts/EduVaultMarketplace.sol`
  - Key methods:
    - `listPrompt(metadataURI, priceWei)`
    - `buyPrompt(promptId)` (payable)
    - `withdrawProceeds()`
    - `getPrompt(promptId)`
    - `hasLicense(promptId, user)`
  - Events:
    - `PromptListed`, `PromptPurchased`, `Withdrawn`
  - The frontend reads from this contract using the address in `NEXT_PUBLIC_MARKETPLACE_ADDRESS`.

For deeper details on 0G integration, see:
- `docs/compute/compute.md`
- `docs/contracts/DEPLOYMENT_GUIDE.md`
- `docs/contracts/COMPLETE_DATA.md`

---

## 5. Environment variables

Use `.env.local` for local development. `.env.example` documents the structure. **Do not commit real values.**

**Public / client-side (safe to expose)**:
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_BLOCK_EXPLORER`
- `NEXT_PUBLIC_MARKETPLACE_ADDRESS`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ENABLE_MOCKS` (`true` for mock mode, `false` for live 0G + Supabase)

**Server / secret (never exposed to browser)**:
- `DEPLOYER_PRIVATE_KEY`
- `OG_STORAGE_PRIVATE_KEY`
- `OG_COMPUTE_PRIVATE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**0G-specific RPC and config**:
- `OG_STORAGE_RPC_URL`
- `OG_STORAGE_INDEXER_RPC`
- `OG_COMPUTE_RPC_URL`
- `OG_COMPUTE_DEFAULT_PROVIDER` (optional)
- `OG_COMPUTE_DEFAULT_MODEL` (optional, e.g. `qwen/qwen-2.5-7b-instruct`)
- `OG_COMPUTE_PROMPT_FALLBACK_FEE` (optional)
- `INDEXER_START_BLOCK`

`lib/env.ts` validates and reads these variables for runtime safety.

---

## 6. Local development

**Prerequisites**
- Node.js (check `docs/compute/compute.md` for recommended versions for 0G SDKs).
- `bun` (preferred) or `pnpm` installed globally.

**Using bun (preferred)**:

```bash
# install dependencies
bun install

# dev mode
bun run dev

# production build + start
bun run build
bun run start
```

**Using pnpm**:

```bash
pnpm install --legacy-peer-deps --no-frozen-lockfile

cp .env.example .env.local
# fill in SUPABASE and OG_* keys if you want live mode

pnpm dev
```

Then open `http://localhost:3000`.

Notes:
- For fast iteration without keys, keep `NEXT_PUBLIC_ENABLE_MOCKS=true` and omit OG private keys.
- For full end-to-end 0G behavior, set `NEXT_PUBLIC_ENABLE_MOCKS=false` and provide valid `OG_*` envs.

---

## 7. API routes

Key server routes (under `app/api`):
- `POST /api/storage/upload` — upload binary templates or artifacts to 0G Storage.
- `POST /api/storage/upload-json` — upload JSON metadata to 0G Storage.
- `GET /api/storage/download?ref=...` — download artifacts/metadata from 0G Storage.
- `POST /api/compute/infer` — one-shot inference via 0G Compute, returns JSON.
- `POST /api/compute/stream` — streaming inference via 0G Compute, used by chat / research UIs.
- `GET /api/prompts` — lightweight indexer for available prompts.
- `GET /api/prompts/[promptId]` — fetch a single prompt by id.
- `GET /api/txs?address=...` — transaction listing for an address.

These routes all use the 0G SDKs when **mock mode is disabled** and required OG_* env vars are set.

---

## 8. Smart contracts

- Main contract: `contracts/EduVaultMarketplace.sol`
- Tooling: Hardhat + ethers

**Useful scripts (see `package.json`)**:
- `pnpm contract:compile` — compile contracts.
- `pnpm contract:test` — run Hardhat tests.
- `pnpm contract:deploy:local` — deploy to local Hardhat network.
- `pnpm contract:deploy:newton` — deploy to 0G Newton testnet.
- `pnpm contract:deploy:galileo` — deploy to 0G Galileo testnet.
- `pnpm contract:verify:galileo` — verify contract on Galileo explorer.

After deployment:
- Read the deployed address from the console or `deployments/<network>.json`.
- Set `NEXT_PUBLIC_MARKETPLACE_ADDRESS` to the deployed address.

For full deployment instructions, see `docs/contracts/DEPLOYMENT_GUIDE.md` and `docs/contracts/COMPLETE_DATA.md`.

---

## 9. Deployment (Vercel)

Add all necessary env vars in your Vercel project settings. Example (replace placeholders):

```env
NEXT_PUBLIC_CHAIN_ID=16602
NEXT_PUBLIC_RPC_URL=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_BLOCK_EXPLORER=https://chainscan-galileo.0g.ai
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_ENABLE_MOCKS=false

DEPLOYER_PRIVATE_KEY=0x...
OG_STORAGE_RPC_URL=https://evmrpc-testnet.0g.ai
OG_STORAGE_INDEXER_RPC=https://indexer-storage-testnet-standard.0g.ai
OG_STORAGE_PRIVATE_KEY=0x...
OG_COMPUTE_RPC_URL=https://evmrpc-testnet.0g.ai
OG_COMPUTE_PRIVATE_KEY=0x...
OG_COMPUTE_DEFAULT_PROVIDER=0x...
OG_COMPUTE_DEFAULT_MODEL=qwen/qwen-2.5-7b-instruct
OG_COMPUTE_PROMPT_FALLBACK_FEE=0.01
INDEXER_START_BLOCK=0
SUPABASE_SERVICE_ROLE_KEY=...
```

Then:

```bash
pnpm build
pnpm start
```

or the equivalent `bun` commands locally to validate before deploying.

---

## 10. Developer notes & mock mode

- **Mock mode**:
  - Enabled when `NEXT_PUBLIC_ENABLE_MOCKS=true` or when OG_* private keys are missing.
  - `inferSkillMapping` and `streamPromptInference` in `lib/server/compute-client.ts` return mock data in this mode.
- **Ledger behavior**:
  - If no ledger exists for the compute wallet, the code attempts to create one using `addLedger`.
  - If ledger balance is below `TARGET_LEDGER_OG` (1 OG), it attempts to top up via `depositFund`.
- **Logging**:
  - The compute client logs:
    - mock vs real mode
    - wallet address and OG balances
    - available services and chosen provider
    - verification results from `processResponse`.
- **Fallback providers**:
  - If the primary provider fails, the client lists all chatbot services and tries them in sequence until one succeeds.

---

## 11. Linting & tests

- Lint:

```bash
pnpm lint
```

- Contract tests:

```bash
pnpm contract:test
```

---

## 12. Security checklist

- Do **not** commit `.env`, `.env.local`, or any private keys.
- Rotate any key that has been exposed or shared.
- On Vercel, double-check that secrets are only configured as **server-side** env vars.
- Never log full private keys—log only short prefixes when needed for debugging.

---

## 13. Project structure

- `app/` — Next.js App Router pages and layouts.
- `components/` — Reusable UI components (e.g. `components/chat/chat-panel.tsx`).
- `lib/`
  - `lib/env.ts` — environment validation and access helpers.
  - `lib/server/compute-client.ts` — 0G Compute integration (broker, ledger, inference).
  - `lib/server/storage-client.ts` — 0G Storage integration.
- `contracts/` — Solidity contracts (`EduVaultMarketplace.sol`).
- `scripts/` — Hardhat deployment scripts.
- `deployments/` — deployment metadata per network.
- `docs/` — human-readable documentation for 0G usage and deployment:
  - `docs/compute/compute.md` — 0G Compute CLI/SDK docs and examples.
  - `docs/contracts/DEPLOYMENT_GUIDE.md` — step-by-step deployment guide.
  - `docs/contracts/COMPLETE_DATA.md` — all required deployment data and env templates.
  - `docs/contracts/QUICK_REFERENCE.md` — quick commands and env reference.

