# EduVault Smart Contract Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Contract Architecture](#contract-architecture)
3. [Prerequisites](#prerequisites)
4. [Getting Your Keys](#getting-your-keys)
5. [Environment Setup](#environment-setup)
6. [Deployment Process](#deployment-process)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Overview

EduVault uses a single smart contract `EduVaultMarketplace.sol` deployed on the **0G Newton Testnet** (chainId: 16602). This marketplace enables buying and selling of AI prompts with on-chain licensing.

### Network Details

| Property | Value |
|----------|-------|
| Network Name | 0G Newton Testnet |
| Chain ID | 16602 |
| RPC URL | https://evmrpc-testnet.0g.ai |
| Block Explorer | https://chainscan-newton.0g.ai |
| Native Currency | OG (18 decimals) |

---

## Contract Architecture

### Contract: EduVaultMarketplace.sol

**Location:** `contracts/EduVaultMarketplace.sol`

**Compiler Version:** Solidity ^0.8.24

**Dependencies:**
- `@openzeppelin/contracts/utils/ReentrancyGuard.sol`

### Core Data Structures

```solidity
struct Prompt {
    address seller;       // Creator of the prompt
    uint256 priceWei;     // Price in wei (native OG tokens)
    string metadataURI;   // URI pointing to off-chain metadata (0G Storage)
    bool isActive;        // Whether prompt is available for purchase
}
```

### State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `_nextPromptId` | `uint256` | Auto-incrementing ID counter |
| `_prompts` | `mapping(uint256 => Prompt)` | Prompt storage by ID |
| `_proceeds` | `mapping(address => uint256)` | Seller earnings balance |
| `_licenses` | `mapping(uint256 => mapping(address => bool))` | Purchase records |

### Functions

| Function | Type | Parameters | Description |
|----------|------|------------|-------------|
| `listPrompt` | External | `metadataURI` (string), `priceWei` (uint256) | List a new prompt for sale |
| `buyPrompt` | Payable | `promptId` (uint256) | Purchase a prompt license |
| `withdrawProceeds` | External | None | Withdraw earned funds |
| `getPrompt` | View | `promptId` (uint256) | Get prompt details |
| `hasLicense` | View | `promptId`, `user` (address) | Check if user owns license |
| `proceedsOf` | View | `seller` (address) | Check seller's balance |

### Events

| Event | Parameters | When Emitted |
|-------|------------|--------------|
| `PromptListed` | `promptId`, `seller`, `priceWei`, `metadataURI` | New prompt created |
| `PromptPurchased` | `promptId`, `buyer`, `priceWei` | Prompt purchased |
| `Withdrawn` | `seller`, `amount` | Funds withdrawn |

---

## Prerequisites

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Required Tools

- Node.js >= 18
- pnpm (or npm/yarn)
- Git

### 3. Required Accounts & Keys

You need to obtain:

| Key/Resource | Purpose | How to Get |
|--------------|---------|------------|
| **Deployer Private Key** | Deploy contracts | MetaMask wallet private key |
| **OG Testnet Tokens** | Pay gas fees | Faucet (see below) |
| **0G Storage Private Key** | Upload metadata to 0G Storage | Same or different wallet |
| **0G Compute Private Key** | AI inference services | Same or different wallet |
| **WalletConnect Project ID** | Wallet connection in frontend | WalletConnect Cloud |

---

## Getting Your Keys

### Step 1: Create/Prepare Wallet

1. **MetaMask Setup:**
   - Open MetaMask
   - Go to Settings → Networks → Add Network
   - Add 0G Newton Testnet manually:
     ```
     Network Name: 0G Newton Testnet
     RPC URL: https://evmrpc-testnet.0g.ai
     Chain ID: 16602
     Currency Symbol: OG
     Block Explorer: https://chainscan-newton.0g.ai
     ```

2. **Export Private Key:**
   - MetaMask → Account Details → Show Private Key
   - Enter your password
   - Copy the 64-character hex string (without 0x prefix)

### Step 2: Get Testnet Tokens (OG)

**Option A: Official Faucet**
1. Visit: https://faucet.0g.ai/
2. Connect your wallet
3. Request testnet tokens

**Option B: Discord Faucet**
1. Join 0G Discord: https://discord.gg/0glabs
2. Go to #faucet channel
3. Use command: `!faucet <your-address>`

**Note:** You need OG tokens for:
- Deploying contracts (~0.01-0.1 OG estimated)
- Listing prompts (gas)
- Uploading to 0G Storage (gas)
- AI inference (compute fees)

### Step 3: Get WalletConnect Project ID

1. Visit: https://cloud.walletconnect.com/
2. Sign up/Login
3. Create a new project
4. Copy the Project ID

### Step 4: Prepare Private Keys

For security, you can use separate keys for different purposes:

| Key Variable | Recommended | Notes |
|--------------|-------------|-------|
| `DEPLOYER_PRIVATE_KEY` | One-time deploy wallet | Only needs enough OG for deployment |
| `OG_STORAGE_PRIVATE_KEY` | Server wallet | Needs OG for storage uploads |
| `OG_COMPUTE_PRIVATE_KEY` | Server wallet | Needs OG for compute fees |

**Security Best Practices:**
- Never commit private keys to git
- Use different keys for production vs development
- Store keys securely (use environment variables or secret managers)

---

## Environment Setup

### Step 1: Create .env File

Create a `.env` file in the project root:

```bash
cp .env.example .env
# or create manually
touch .env
```

### Step 2: Configure Environment Variables

```env
# ============================================
# CLIENT-SIDE VARIABLES (Safe to expose)
# ============================================

# Blockchain Network Configuration
NEXT_PUBLIC_CHAIN_ID=16602
NEXT_PUBLIC_RPC_URL=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_BLOCK_EXPLORER=https://chainscan-newton.0g.ai

# Deployed Contract Address (set after deployment)
NEXT_PUBLIC_MARKETPLACE_ADDRESS=

# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here

# Mock Mode (set to "false" for production)
NEXT_PUBLIC_ENABLE_MOCKS=true

# ============================================
# SERVER-SIDE VARIABLES (KEEP SECRET!)
# ============================================

# Contract Deployer Private Key (without 0x prefix)
DEPLOYER_PRIVATE_KEY=your-deployer-private-key-here

# 0G Storage Configuration
OG_STORAGE_RPC_URL=https://evmrpc-testnet.0g.ai
OG_STORAGE_INDEXER_RPC=https://indexer-storage-testnet-standard.0g.ai
OG_STORAGE_PRIVATE_KEY=your-storage-private-key-here

# 0G Compute Configuration
OG_COMPUTE_RPC_URL=https://evmrpc-testnet.0g.ai
OG_COMPUTE_PRIVATE_KEY=your-compute-private-key-here
OG_COMPUTE_DEFAULT_PROVIDER=
OG_COMPUTE_DEFAULT_MODEL=qwen/qwen-2.5-7b-instruct
OG_COMPUTE_PROMPT_FALLBACK_FEE=0.01

# Indexer Configuration
INDEXER_START_BLOCK=0
```

### Step 3: Verify Configuration

The environment variables are validated by `lib/env.ts`:

| Variable | Required | Default | Validation |
|----------|----------|---------|------------|
| `NEXT_PUBLIC_CHAIN_ID` | No | 16602 | Must be number |
| `NEXT_PUBLIC_RPC_URL` | No | https://evmrpc-testnet.0g.ai | Must be URL |
| `NEXT_PUBLIC_BLOCK_EXPLORER` | No | https://chainscan-newton.0g.ai | Must be URL |
| `NEXT_PUBLIC_MARKETPLACE_ADDRESS` | No | "" | Contract address |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | No | "" | WalletConnect ID |
| `NEXT_PUBLIC_ENABLE_MOCKS` | No | true | "true" or "false" |
| `OG_STORAGE_PRIVATE_KEY` | When not mocking | - | Valid private key |
| `OG_COMPUTE_PRIVATE_KEY` | When not mocking | - | Valid private key |

---

## Deployment Process

### Step 1: Compile Contract

```bash
pnpm contract:compile
```

This runs: `hardhat compile`

Output will be in `artifacts/` directory.

### Step 2: Run Tests (Optional but Recommended)

```bash
pnpm contract:test
```

### Step 3: Local Deployment (Testing)

Test deployment locally first:

```bash
pnpm contract:deploy:local
```

This deploys to Hardhat's local network (chainId: 31337).

### Step 4: Deploy to 0G Newton Testnet

```bash
pnpm contract:deploy:newton
```

This runs the deployment script with the `ogNewton` network configuration.

### Step 5: Record Contract Address

After deployment, you'll see output like:

```
Deploying with: 0x1234...your-address
EduVaultMarketplace deployed at: 0x5678...contract-address
Deployment metadata written to /path/to/deployments/ogNewton.json
```

The deployment info is saved to `deployments/ogNewton.json`:

```json
{
  "contract": "EduVaultMarketplace",
  "address": "0x5678...contract-address",
  "network": "ogNewton",
  "chainId": 16602,
  "deployedAt": "2024-01-01T00:00:00.000Z"
}
```

### Step 6: Update Environment

Copy the deployed contract address and update `.env`:

```env
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x5678...contract-address
```

---

## Post-Deployment

### Verify Deployment

1. **Check Block Explorer:**
   - Go to: https://chainscan-newton.0g.ai/address/<your-contract-address>
   - Verify the contract is deployed
   - Check transaction details

2. **Test Contract Interaction:**

   Using the frontend:
   ```bash
   pnpm dev
   ```

   Or using hardhat console:
   ```bash
   npx hardhat console --network ogNewton
   ```

   ```javascript
   const contract = await ethers.getContractAt(
     "EduVaultMarketplace",
     "0xYourContractAddress"
   );
   const nextId = await contract._nextPromptId();
   console.log("Next prompt ID:", nextId.toString());
   ```

### Contract ABI

The contract ABI is available in:
- `lib/contracts/eduvault-marketplace.ts` (TypeScript format for frontend)
- `artifacts/contracts/EduVaultMarketplace.sol/EduVaultMarketplace.json` (Full artifact)

---

## Troubleshooting

### Common Issues

#### 1. "insufficient funds for intrinsic transaction cost"
- **Cause:** Deployer wallet doesn't have enough OG tokens
- **Solution:** Get more OG from faucet

#### 2. "Invalid private key"
- **Cause:** Private key format is wrong
- **Solution:** Ensure key is 64 hex characters, without 0x prefix

#### 3. "Network timeout"
- **Cause:** RPC URL unreachable
- **Solution:** Check network connectivity, try alternative RPC

#### 4. "Contract creation code overlap"
- **Cause:** Contract already deployed at this address
- **Solution:** Normal, just use existing deployment

#### 5. "Nonce too low"
- **Cause:** Pending transactions not mined yet
- **Solution:** Wait or reset MetaMask nonce

### Debug Commands

```bash
# Check hardhat configuration
npx hardhat vars list

# View network config
npx hardhat show-network ogNewton

# Run with verbose logging
npx hardhat run scripts/deploy-marketplace.ts --network ogNewton --verbose
```

### Getting Help

- 0G Documentation: https://docs.0g.ai/
- 0G Discord: https://discord.gg/0glabs
- Hardhat Docs: https://hardhat.org/docs

---

## Summary Checklist

Before deploying, ensure you have:

- [ ] MetaMask installed with 0G Newton Testnet configured
- [ ] OG testnet tokens in your deployer wallet
- [ ] Private key exported (without 0x prefix)
- [ ] `.env` file created with all required variables
- [ ] `DEPLOYER_PRIVATE_KEY` set in `.env`
- [ ] Contract compiled (`pnpm contract:compile`)
- [ ] Tests passing (`pnpm contract:test`)
- [ ] Ready to update `NEXT_PUBLIC_MARKETPLACE_ADDRESS` after deployment

After deployment:

- [ ] Contract address recorded in `deployments/ogNewton.json`
- [ ] `NEXT_PUBLIC_MARKETPLACE_ADDRESS` updated in `.env`
- [ ] Contract verified on block explorer
- [ ] Frontend updated and tested