/// <reference types="node" />
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

const deployerPk = process.env.DEPLOYER_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "cancun",
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    ogGalileo: {
      url: process.env.NEXT_PUBLIC_RPC_URL || "https://evmrpc-testnet.0g.ai",
      chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 16602),
      accounts: deployerPk ? [deployerPk] : [],
    },
    // Backward-compatible alias for existing scripts
    ogNewton: {
      url: process.env.NEXT_PUBLIC_RPC_URL || "https://evmrpc-testnet.0g.ai",
      chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 16602),
      accounts: deployerPk ? [deployerPk] : [],
    },
  },
  etherscan: {
    apiKey: {
      ogGalileo: "empty",
    },
    customChains: [
      {
        network: "ogGalileo",
        chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 16602),
        urls: {
          apiURL: "https://chainscan-galileo.0g.ai/api",
          browserURL: "https://chainscan-galileo.0g.ai",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
