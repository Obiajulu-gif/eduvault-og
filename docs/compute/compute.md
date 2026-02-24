0G Compute Inference

0G Compute Network provides decentralized AI inference services, supporting various AI models including Large Language Models (LLM), text-to-image generation, and speech-to-text processing.
Prerequisites

    Node.js >= 22.0.0
    A wallet with 0G tokens (either testnet or mainnet)
    EVM compatible wallet (for Web UI)

Supported Service Types

    Chatbot Services: Conversational AI with models like GPT, DeepSeek, and others
    Text-to-Image: Generate images from text descriptions using Stable Diffusion and similar models
    Speech-to-Text: Transcribe audio to text using Whisper and other speech recognition models

Available Services
Testnet Services
View Testnet Services (2 Available)
#	Model	Type	Provider	Input (per 1M tokens)	Output (per 1M tokens)
1	qwen-2.5-7b-instruct	Chatbot	0xa48f01...	0.05 0G	0.10 0G
2	qwen-image-edit-2511	Image-Edit	0x4b2a9...	-	0.005 0G/image

Available Models by Type:

Chatbots (1 model):

    Qwen 2.5 7B Instruct: Fast and efficient conversational model

Image-Edit (1 model):

    Qwen Image Edit 2511: Advanced image editing and manipulation model

All testnet services feature TeeML verifiability and are ideal for development and testing.
Mainnet Services
View Mainnet Services (6 Available)
Choose Your Interface
Feature	Web UI	CLI	SDK
Setup time	~1 min	~2 min	~5 min
Interactive chat	✅	❌	❌
Automation	❌	✅	✅
App integration	❌	❌	✅
Direct API access	❌	❌	✅

    Web UI
    CLI
    SDK

Best for: Application integration and programmatic access
Installation

pnpm add @0glabs/0g-serving-broker

Starter Kits Available

Get up and running quickly with our comprehensive TypeScript starter kit within minutes.

    TypeScript Starter Kit - Complete examples with TypeScript and CLI tool

Initialize the Broker

    Node.js
    Browser

import { ethers } from "ethers";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";

// Choose your network
const RPC_URL = process.env.NODE_ENV === 'production'
  ? "https://evmrpc.0g.ai"  // Mainnet
  : "https://evmrpc-testnet.0g.ai";  // Testnet

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const broker = await createZGComputeNetworkBroker(wallet);

Discover Services

// List all available services
const services = await broker.inference.listService();

// Filter by service type
const chatbotServices = services.filter(s => s.serviceType === 'chatbot');
const imageServices = services.filter(s => s.serviceType === 'text-to-image');
const speechServices = services.filter(s => s.serviceType === 'speech-to-text');

Account Management

For detailed account operations, see Account Management.

const account = await broker.ledger.getLedger();
await broker.ledger.depositFund(10);
// Required before first use of a provider
await broker.inference.acknowledgeProviderSigner(providerAddress);

Make Inference Requests

    Chatbot
    Text-to-Image
    Speech-to-Text

const messages = [{ role: "user", content: "Hello!" }];

// Get service metadata
const { endpoint, model } = await broker.inference.getServiceMetadata(providerAddress);

// Generate auth headers
const headers = await broker.inference.getRequestHeaders(
  providerAddress
);

// Make request
const response = await fetch(`${endpoint}/chat/completions`, {
  method: "POST",
  headers: { "Content-Type": "application/json", ...headers },
  body: JSON.stringify({ messages, model })
});

const data = await response.json();
const answer = data.choices[0].message.content;

Response Verification

The processResponse method handles response verification and automatic fee management. Both parameters are optional:

    receivedContent: The usage data from the service response. When provided, the SDK caches accumulated usage and automatically transfers funds from your main account to the provider's sub-account to prevent service interruptions.
    chatID: Response identifier for verifiable TEE services. Different service types handle this differently.

    Chatbot
    Text-to-Image
    Speech-to-Text
    Streaming Responses

For chatbot services, pass the usage data from the response to enable automatic fee management:

// Standard chat completion
const response = await fetch(`${endpoint}/chat/completions`, {
  method: "POST",
  headers: { "Content-Type": "application/json", ...headers },
  body: JSON.stringify({ messages, model })
});

const data = await response.json();

// Process response for automatic fee management
if (data.usage) {
  await broker.inference.processResponse(
    providerAddress,
    undefined,              // chatID is undefined for non-verifiable responses
    JSON.stringify(data.usage)  // Pass usage data for fee calculation
  );
}

// For verifiable TEE services with chatID
// Check response headers first
let chatID = response.headers.get("ZG-Res-Key") || response.headers.get("zg-res-key");

// If not found in response headers, check response body
if (!chatID) {
  chatID = data.id || data.chatID;
}

if (chatID) {
  const isValid = await broker.inference.processResponse(
    providerAddress,
    chatID,           // Verify the response integrity
    JSON.stringify(data.usage)  // Also manage fees
  );
}

Response Verification

The processResponse method handles response verification and automatic fee management. Both parameters are optional:

    receivedContent: The usage data from the service response. When provided, the SDK caches accumulated usage and automatically transfers funds from your main account to the provider's sub-account to prevent service interruptions.
    chatID: Response identifier for verifiable TEE services. Different service types handle this differently.

    Chatbot
    Text-to-Image
    Speech-to-Text
    Streaming Responses

For streaming responses, handle chatID differently based on service type:

    Chatbot Streaming
    Speech-to-Text Streaming

// For chatbot streaming, first check headers then try to get ID from stream
let chatID = response.headers.get("ZG-Res-Key") || response.headers.get("zg-res-key");

let usage = null;
let streamChatID = null; // Will try to get from stream data
const decoder = new TextDecoder();
const reader = response.body.getReader();

// Process stream
let rawBody = '';
while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  rawBody += decoder.decode(value, { stream: true });
}

// Parse usage and chatID from stream data
for (const line of rawBody.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed === 'data: [DONE]') continue;

  try {
    const jsonStr = trimmed.startsWith('data:')
      ? trimmed.slice(5).trim()
      : trimmed;
    const message = JSON.parse(jsonStr);

    // For chatbot, try to get ID from stream data
    if (!streamChatID && (message.id || message.chatID)) {
      streamChatID = message.id || message.chatID;
    }

    if (message.usage) {
      usage = message.usage;
    }
  } catch {}
}

// Use chatID from header if available, otherwise use chatID from stream data
const finalChatID = chatID || streamChatID;

// Process with chatID for verification if available
if (finalChatID) {
  const isValid = await broker.inference.processResponse(
    providerAddress,
    finalChatID,
    JSON.stringify(usage || {})
  );
  console.log("Chatbot streaming response valid:", isValid);
} else if (usage) {
  // Fallback: process without verification
  await broker.inference.processResponse(
    providerAddress,
    undefined,
    JSON.stringify(usage)
  );
}

Key Points:

    Always call processResponse after receiving responses to maintain proper fee management
    The SDK automatically handles fund transfers to prevent service interruptions
    For verifiable TEE services, the method also validates response integrity
    chatID retrieval principle: Always prioritize ZG-Res-Key from response headers. Only use fallback methods when header is not present.
    chatID retrieval varies by service type:
        Chatbot: First try ZG-Res-Key header, then check data.id (completion ID from response body) as fallback
        Text-to-Image & Speech-to-Text: Always get chatID from ZG-Res-Key response header
        Streaming responses:
            Chatbot streaming: Check headers first, then try to get id from stream data as fallback
            Speech-to-text streaming: Get chatID from ZG-Res-Key header immediately
    Usage data format varies by service type but typically includes token counts or request metrics


Key Points:

    Always call processResponse after receiving responses to maintain proper fee management
    The SDK automatically handles fund transfers to prevent service interruptions
    For verifiable TEE services, the method also validates response integrity
    chatID retrieval principle: Always prioritize ZG-Res-Key from response headers. Only use fallback methods when header is not present.
    chatID retrieval varies by service type:
        Chatbot: First try ZG-Res-Key header, then check data.id (completion ID from response body) as fallback
        Text-to-Image & Speech-to-Text: Always get chatID from ZG-Res-Key response header
        Streaming responses:
            Chatbot streaming: Check headers first, then try to get id from stream data as fallback
            Speech-to-text streaming: Get chatID from ZG-Res-Key header immediately
    Usage data format varies by service type but typically includes token counts or request metrics

Error: Insufficient balance

Your account doesn't have enough funds. Add more using CLI or SDK:

CLI:
Deposit to Main Account

0g-compute-cli deposit --amount 5

Transfer to Provider Sub-Account

0g-compute-cli transfer-fund --provider <PROVIDER_ADDRESS> --amount 5

SDK:

await broker.ledger.depositFund(1);

0g-compute-cli deposit --amount 5

Transfer to Provider Sub-Account

0g-compute-cli transfer-fund --provider <PROVIDER_ADDRESS> --amount 5

SDK:

await broker.ledger.depositFund(1);

Error: Provider not acknowledged

You need to acknowledge the provider before using their service:

CLI:

0g-compute-cli inference acknowledge-provider --provider <PROVIDER_ADDRESS>

SDK:

await broker.inference.acknowledgeProviderSigner(providerAddress);

SDK:

await broker.inference.acknowledgeProviderSigner(providerAddress);

Error: No funds in provider sub-account

Transfer funds to the specific provider sub-account:

0g-compute-cli transfer-fund --provider <PROVIDER_ADDRESS> --amount 5

Check your account balance:

0g-compute-cli get-account

Check your account balance:

0g-compute-cli get-account

Web UI not starting

If the web UI fails to start:

    Check if another service is using port 3090:

0g-compute-cli ui start-web --port 3091

    Ensure the package was installed globally:

pnpm add @0glabs/0g-serving-broker -g

    Ensure the package was installed globally:

pnpm add @0glabs/0g-serving-broker -g

Troubleshooting
Common Issues
Error: Insufficient balance
Error: Provider not acknowledged
Error: No funds in provider sub-account
Web UI not starting
Next Steps

    Manage Accounts → Account Management Guide
    Fine-tune Models → Fine-tuning Guide
    Become a Provider → Provider Setup
    View Examples → GitHub

Questions? Join our Discord for support.
Previous
Account
Next
Fine-tuning

    Prerequisites
    Supported Service Types
    Available Services
    Choose Your Interface
        Option 1: Use the Hosted Web UI
        Option 2: Run Locally
        Getting Started
        Installation
        Setup Environment
        Create Account & Add Funds
        CLI Commands
        API Usage Examples
        Start Local Proxy Server
        Installation
        Initialize the Broker
        Discover Services
        Account Management
        Make Inference Requests
        Response Verification
    Troubleshooting
        Common Issues
    Next Steps

Docs

    Introduction
    Run a Node

Community

    Discord
    Telegram
    X(Twitter)

More

    Blog
    GitHub

0G Labs Logo
Copyright © 2026 0G Labs, Built with Docusaurus.