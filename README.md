# EduVault (0G MVP)

EduVault is a decentralized AI Prompt Marketplace + Research Vault built on the 0G ecosystem.

- Marketplace: creators list prompt tools, buyers purchase licenses on-chain.
- Research Vault: licensed users execute prompts through 0G Compute and autosave artifacts to 0G Storage.

## Stack

- Next.js App Router + TypeScript + Tailwind + shadcn-style components
- wagmi + viem + RainbowKit (wallet connect + chain switch)
- TanStack Query + Zod
- Hardhat + Solidity marketplace contract
- 0G Storage SDK: `@0glabs/0g-ts-sdk`
- 0G Compute broker: `@0glabs/0g-serving-broker`

## Architecture

```text
[User Wallet (RainbowKit)]
          |
          v
   [Next.js Frontend]
      |         |            \
      |         |             \
      v         v              v
[Marketplace SC on 0G]   [Compute API]   [Storage API]
      |                     |                |
      |                     v                v
      |             [0G Compute Broker]   [0G Storage Indexer]
      v                     |                |
   Events ---------> [Lightweight Indexer Cache] <----- metadata/artifacts refs
```

## Contract

`contracts/EduVaultMarketplace.sol`

Implemented functions/events:
- `listPrompt(string metadataURI, uint256 priceWei)`
- `buyPrompt(uint256 promptId) payable`
- `withdrawProceeds()`
- `getPrompt(uint256 promptId)`
- `hasLicense(uint256 promptId, address user)`
- Events: `PromptListed`, `PromptPurchased`, `Withdrawn`

Security:
- `nonReentrant` buy/withdraw
- `priceWei > 0` validation
- self-purchase prevented
- proceeds accounting per seller

## App Routes

Auth:
- `/login`, `/signup`, `/forgot-password`, `/verify-email`
- `/onboarding/goals`, `/onboarding/privacy`, `/onboarding/success`

App:
- `/overview`
- `/my-skills`, `/my-skills/library`
- `/marketplace`, `/marketplace/[promptId]`, `/marketplace/my-prompts`
- `/creator/publish`
- `/activities`
- `/wallet`
- `/research-vault`, `/research-vault/execute/[promptId]`
- `/settings/security`

## Run Locally

1. Install dependencies:
```bash
pnpm install --no-frozen-lockfile
```

2. Configure env:
```bash
cp .env.example .env
```

3. Start app:
```bash
pnpm dev
```

4. Open:
- App: `http://localhost:3000`

## Deploy Contract

1. Set `.env` values:
- `DEPLOYER_PRIVATE_KEY`
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_CHAIN_ID`

2. Compile/test:
```bash
pnpm contract:compile
pnpm contract:test
```

3. Deploy:
```bash
pnpm contract:deploy:newton
```

4. Copy deployed address into:
- `NEXT_PUBLIC_MARKETPLACE_ADDRESS`

Deployment metadata is written to `deployments/<network>.json`.

## APIs

Storage:
- `POST /api/storage/upload` (multipart)
- `POST /api/storage/upload-json`
- `GET /api/storage/download?ref=...`

Compute:
- `POST /api/compute/infer` (skill mapping)
- `POST /api/compute/stream` (SSE streaming)

Indexer:
- `GET /api/prompts`
- `GET /api/prompts/[promptId]`
- `GET /api/txs?address=...`

## End-to-End Flow (Creator -> Buyer -> Execute)

1. Creator publishes:
- Go to `/creator/publish`
- Upload prompt template (stored in 0G Storage)
- Publish listing (metadata uploaded to 0G Storage + `listPrompt` on-chain)

2. Buyer purchases:
- Open `/marketplace/[promptId]`
- Run purchase modal flow and confirm wallet tx (`buyPrompt`)
- License unlocks execution CTA

3. Execute + autosave:
- Open `/research-vault/execute/[promptId]`
- Start streaming compute job (`/api/compute/stream`)
- Output is autosaved via `/api/storage/upload-json`
- Download from `/research-vault`

## 0G Components Integrated

- 0G Chain: smart contract listing + purchase + proceeds withdraw + event indexing
- 0G Storage: prompt template uploads, metadata uploads, compute artifact autosave/download
- 0G Compute: server-side inference proxy, streamed token/log updates to UI

## Notes

- `NEXT_PUBLIC_ENABLE_MOCKS=true` allows UI/demo flow without funded 0G keys.
- Set it to `false` for strict live integrations and fail-fast env enforcement.
