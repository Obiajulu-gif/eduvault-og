# Complete Deployment Data Sheet

## All Data You Need to Deploy Contracts

---

## 1. Network Configuration

### 0G Newton Testnet

```json
{
  "networkName": "ogNewton",
  "chainId": 16602,
  "rpcUrl": "https://evmrpc-testnet.0g.ai",
  "blockExplorer": "https://chainscan-newton.0g.ai",
  "nativeCurrency": {
    "name": "OG",
    "symbol": "OG",
    "decimals": 18
  }
}
```

### Add to MetaMask

```javascript
// Run in browser console on any page
ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x40D8',  // 16602 in hex
    chainName: '0G Newton Testnet',
    nativeCurrency: {
      name: 'OG',
      symbol: 'OG',
      decimals: 18
    },
    rpcUrls: ['https://evmrpc-testnet.0g.ai'],
    blockExplorerUrls: ['https://chainscan-newton.0g.ai']
  }]
});
```

---

## 2. Keys Required

### Keys Overview

| Key | Variable Name | Purpose | Where to Get |
|-----|---------------|---------|--------------|
| Deployer Private Key | `DEPLOYER_PRIVATE_KEY` | Deploy contract | MetaMask export |
| Storage Private Key | `OG_STORAGE_PRIVATE_KEY` | Upload to 0G Storage | MetaMask export |
| Compute Private Key | `OG_COMPUTE_PRIVATE_KEY` | AI inference payments | MetaMask export |
| WalletConnect ID | `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Wallet connection | walletconnect.com |

### Getting Private Key from MetaMask

1. Open MetaMask
2. Click account icon (top right)
3. Go to "Account Details"
4. Click "Show Private Key"
5. Enter password
6. Copy the 64-character string (without `0x` prefix)

**Example format:**
```
a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2
```

### Getting WalletConnect Project ID

1. Go to https://cloud.walletconnect.com/
2. Sign in (GitHub, Google, or Email)
3. Click "Create Project"
4. Enter project name: "EduVault"
5. Copy the Project ID

---

## 3. Getting Testnet Tokens (OG)

### Faucet Options

| Faucet | URL | Requirements |
|--------|-----|--------------|
| Official 0G Faucet | https://faucet.0g.ai/ | Twitter/Discord verification |
| Discord Faucet | https://discord.gg/0glabs | Join #faucet channel |

### Discord Faucet Command

```
!faucet 0xYourWalletAddress
```

### Expected Gas Costs

| Operation | Estimated Gas | Estimated Cost (OG) |
|-----------|---------------|---------------------|
| Contract Deployment | ~1,500,000 gas | ~0.01-0.05 OG |
| List Prompt | ~100,000 gas | ~0.001 OG |
| Buy Prompt | ~80,000 gas | ~0.0008 OG |
| Withdraw | ~50,000 gas | ~0.0005 OG |
| Upload to 0G Storage | ~200,000 gas | ~0.002 OG |

**Recommendation:** Have at least 0.5 OG for testing and deployment.

---

## 4. Environment Variables Template

### Create `.env` File

```bash
# Copy this entire block to your .env file
# Replace all placeholder values with your actual values

# ============================================
# PUBLIC VARIABLES (Visible in browser)
# ============================================

# Blockchain network
NEXT_PUBLIC_CHAIN_ID=16602
NEXT_PUBLIC_RPC_URL=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_BLOCK_EXPLORER=https://chainscan-newton.0g.ai

# Contract address (set after deployment)
NEXT_PUBLIC_MARKETPLACE_ADDRESS=

# WalletConnect (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Mock mode: "true" for development, "false" for production
NEXT_PUBLIC_ENABLE_MOCKS=true

# ============================================
# SECRET VARIABLES (Never expose to browser!)
# ============================================

# Deployer wallet (deploys the contract)
DEPLOYER_PRIVATE_KEY=your-64-char-private-key-without-0x

# Storage wallet (uploads to 0G Storage)
OG_STORAGE_RPC_URL=https://evmrpc-testnet.0g.ai
OG_STORAGE_INDEXER_RPC=https://indexer-storage-testnet-standard.0g.ai
OG_STORAGE_PRIVATE_KEY=your-64-char-private-key-without-0x

# Compute wallet (pays for AI inference)
OG_COMPUTE_RPC_URL=https://evmrpc-testnet.0g.ai
OG_COMPUTE_PRIVATE_KEY=your-64-char-private-key-without-0x
OG_COMPUTE_DEFAULT_PROVIDER=
OG_COMPUTE_DEFAULT_MODEL=qwen/qwen-2.5-7b-instruct
OG_COMPUTE_PROMPT_FALLBACK_FEE=0.01

# Indexer start block
INDEXER_START_BLOCK=0
```

---

## 5. Contract Details

### Contract Information

```
Name: EduVaultMarketplace
File: contracts/EduVaultMarketplace.sol
Compiler: Solidity ^0.8.24
Optimizer: Enabled, 200 runs
```

### Contract ABI (for verification)

```json
[
  {
    "type": "function",
    "name": "listPrompt",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "metadataURI", "type": "string" },
      { "name": "priceWei", "type": "uint256" }
    ],
    "outputs": [{ "name": "promptId", "type": "uint256" }]
  },
  {
    "type": "function",
    "name": "buyPrompt",
    "stateMutability": "payable",
    "inputs": [{ "name": "promptId", "type": "uint256" }],
    "outputs": []
  },
  {
    "type": "function",
    "name": "withdrawProceeds",
    "stateMutability": "nonpayable",
    "inputs": [],
    "outputs": []
  },
  {
    "type": "function",
    "name": "getPrompt",
    "stateMutability": "view",
    "inputs": [{ "name": "promptId", "type": "uint256" }],
    "outputs": [
      { "name": "seller", "type": "address" },
      { "name": "priceWei", "type": "uint256" },
      { "name": "metadataURI", "type": "string" },
      { "name": "isActive", "type": "bool" }
    ]
  },
  {
    "type": "function",
    "name": "hasLicense",
    "stateMutability": "view",
    "inputs": [
      { "name": "promptId", "type": "uint256" },
      { "name": "user", "type": "address" }
    ],
    "outputs": [{ "name": "licensed", "type": "bool" }]
  },
  {
    "type": "function",
    "name": "proceedsOf",
    "stateMutability": "view",
    "inputs": [{ "name": "seller", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }]
  },
  {
    "type": "event",
    "name": "PromptListed",
    "inputs": [
      { "indexed": true, "name": "promptId", "type": "uint256" },
      { "indexed": true, "name": "seller", "type": "address" },
      { "indexed": false, "name": "priceWei", "type": "uint256" },
      { "indexed": false, "name": "metadataURI", "type": "string" }
    ]
  },
  {
    "type": "event",
    "name": "PromptPurchased",
    "inputs": [
      { "indexed": true, "name": "promptId", "type": "uint256" },
      { "indexed": true, "name": "buyer", "type": "address" },
      { "indexed": false, "name": "priceWei", "type": "uint256" }
    ]
  },
  {
    "type": "event",
    "name": "Withdrawn",
    "inputs": [
      { "indexed": true, "name": "seller", "type": "address" },
      { "indexed": false, "name": "amount", "type": "uint256" }
    ]
  }
]
```

---

## 6. Deployment Steps (Copy-Paste Ready)

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Create Environment File

```bash
# Create .env file
cat > .env << 'EOF'
NEXT_PUBLIC_CHAIN_ID=16602
NEXT_PUBLIC_RPC_URL=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_BLOCK_EXPLORER=https://chainscan-newton.0g.ai
NEXT_PUBLIC_MARKETPLACE_ADDRESS=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_ENABLE_MOCKS=true
DEPLOYER_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
OG_STORAGE_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
OG_STORAGE_RPC_URL=https://evmrpc-testnet.0g.ai
OG_STORAGE_INDEXER_RPC=https://indexer-storage-testnet-standard.0g.ai
OG_COMPUTE_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
OG_COMPUTE_RPC_URL=https://evmrpc-testnet.0g.ai
EOF
```

### Step 3: Edit .env and Add Your Keys

```bash
nano .env  # or use your preferred editor
```

### Step 4: Compile Contract

```bash
pnpm contract:compile
```

### Step 5: Run Tests

```bash
pnpm contract:test
```

### Step 6: Deploy to Testnet

```bash
pnpm contract:deploy:newton
```

### Step 7: Copy Contract Address

After deployment, copy the address from the output:

```
EduVaultMarketplace deployed at: 0x[YOUR_CONTRACT_ADDRESS]
```

### Step 8: Update .env with Contract Address

```bash
# Replace with your actual address
sed -i 's/NEXT_PUBLIC_MARKETPLACE_ADDRESS=/NEXT_PUBLIC_MARKETPLACE_ADDRESS=0xYOUR_CONTRACT_ADDRESS/' .env
```

---

## 7. Useful Resources

### Links

| Resource | URL |
|----------|-----|
| 0G Website | https://0g.ai/ |
| 0G Docs | https://docs.0g.ai/ |
| 0G Discord | https://discord.gg/0glabs |
| 0G Faucet | https://faucet.0g.ai/ |
| Block Explorer | https://chainscan-newton.0g.ai/ |
| WalletConnect Cloud | https://cloud.walletconnect.com/ |

### Project Files Reference

```
eduvault-og/
├── contracts/
│   └── EduVaultMarketplace.sol    # Contract source
├── scripts/
│   └── deploy-marketplace.ts      # Deployment script
├── lib/
│   ├── env.ts                     # Environment validation
│   ├── contracts/
│   │   └── eduvault-marketplace.ts # Contract ABI
│   └── server/
│       ├── storage-client.ts      # 0G Storage integration
│       └── compute-client.ts      # 0G Compute integration
├── hardhat.config.ts              # Hardhat config
├── deployments/
│   └── ogNewton.json              # Created after deployment
└── .env                           # Your secrets (git-ignored)
```

---

## 8. Verification Checklist

### Before Deployment

- [ ] Installed dependencies: `pnpm install`
- [ ] MetaMask has 0G Newton Testnet configured
- [ ] Deployer wallet has OG tokens (0.1+ recommended)
- [ ] Private key exported (64 chars, no `0x`)
- [ ] `.env` file created with `DEPLOYER_PRIVATE_KEY`
- [ ] Contract compiles: `pnpm contract:compile`
- [ ] Tests pass: `pnpm contract:test`

### After Deployment

- [ ] Contract address in `deployments/ogNewton.json`
- [ ] `NEXT_PUBLIC_MARKETPLACE_ADDRESS` updated in `.env`
- [ ] Contract visible on block explorer
- [ ] Frontend works: `pnpm dev`

---

## Need Help?

1. Check the detailed guide: `docs/contracts/DEPLOYMENT_GUIDE.md`
2. 0G Discord: https://discord.gg/0glabs
3. 0G Docs: https://docs.0g.ai/