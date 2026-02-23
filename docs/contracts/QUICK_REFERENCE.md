# Quick Reference: Contract Deployment

## Commands

```bash
# Compile contract
pnpm contract:compile

# Test locally
pnpm contract:test

# Deploy to local network
pnpm contract:deploy:local

# Deploy to 0G Newton Testnet
pnpm contract:deploy:newton
```

## Required Environment Variables

### Minimum for Deployment

```env
DEPLOYER_PRIVATE_KEY=your-private-key-without-0x-prefix
NEXT_PUBLIC_RPC_URL=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_CHAIN_ID=16602
```

### Full Setup

```env
# Frontend (Public)
NEXT_PUBLIC_CHAIN_ID=16602
NEXT_PUBLIC_RPC_URL=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_BLOCK_EXPLORER=https://chainscan-newton.0g.ai
NEXT_PUBLIC_MARKETPLACE_ADDRESS=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_ENABLE_MOCKS=false

# Backend (Secret)
DEPLOYER_PRIVATE_KEY=
OG_STORAGE_PRIVATE_KEY=
OG_STORAGE_RPC_URL=https://evmrpc-testnet.0g.ai
OG_STORAGE_INDEXER_RPC=https://indexer-storage-testnet-standard.0g.ai
OG_COMPUTE_PRIVATE_KEY=
OG_COMPUTE_RPC_URL=https://evmrpc-testnet.0g.ai
```

## Network Details

| Property | Value |
|----------|-------|
| Name | 0G Newton Testnet |
| Chain ID | 16602 |
| RPC | https://evmrpc-testnet.0g.ai |
| Explorer | https://chainscan-newton.0g.ai |
| Faucet | https://faucet.0g.ai/ |

## Contract Addresses

After deployment, check `deployments/ogNewton.json` for the address.

## Files

| File | Purpose |
|------|---------|
| `contracts/EduVaultMarketplace.sol` | Contract source |
| `scripts/deploy-marketplace.ts` | Deployment script |
| `hardhat.config.ts` | Hardhat configuration |
| `lib/env.ts` | Environment validation |
| `lib/contracts/eduvault-marketplace.ts` | Contract ABI |