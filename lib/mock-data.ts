import type { PromptListing, TxRecord } from "@/lib/types";

export const MOCK_PROMPTS: PromptListing[] = [
  {
    promptId: 1,
    seller: "0x4f9d8ba2e65f0f9cfd285f56f0e3a5f5719d6f6b",
    priceWei: "50000000000000000",
    metadataURI: "0g://mock-metadata-1",
    isActive: true,
    metadata: {
      title: "Smart Contract Auditor Kit",
      category: "Coding",
      shortDescription:
        "Extract security vulnerabilities and generate detailed fix reports automatically.",
      features: [
        "Comprehensive audit report",
        "Security patch recommendations",
        "Gas optimization suite",
        "Unit test templates",
      ],
      creatorHandle: "@BlockchainWizard",
      icon: "shield",
      promptTemplateRef: "0g://mock-template-1",
      version: "1.0.0",
    },
  },
  {
    promptId: 2,
    seller: "0x77f14f7a85f9d6f1dd2e0ce10edb56e295f95d9c",
    priceWei: "20000000000000000",
    metadataURI: "0g://mock-metadata-2",
    isActive: true,
    metadata: {
      title: "Technical Writer GPT Max",
      category: "Writing",
      shortDescription:
        "Transform messy notes into high-converting documentation and SEO-optimized blog posts.",
      features: [
        "Technical docs from rough notes",
        "SEO keyword expansion",
        "Style-guide aware rewrites",
      ],
      creatorHandle: "@PenMaster_X",
      icon: "code",
      promptTemplateRef: "0g://mock-template-2",
      version: "1.0.0",
    },
  },
  {
    promptId: 3,
    seller: "0x11be55d09f26f1a6dd38a7f51889ce07f298f97d",
    priceWei: "80000000000000000",
    metadataURI: "0g://mock-metadata-3",
    isActive: true,
    metadata: {
      title: "Market Researcher Pro",
      category: "Research",
      shortDescription:
        "Summarize whitepapers into executive briefs with decision-ready insights.",
      features: [
        "Literature synthesis",
        "Competitive analysis matrix",
        "Executive recommendation memo",
      ],
      creatorHandle: "@AlphaSeeker",
      icon: "research",
      promptTemplateRef: "0g://mock-template-3",
      version: "1.0.0",
    },
  },
];

export const MOCK_TXS: TxRecord[] = [
  {
    id: "tx-1",
    date: "2026-02-22T10:35:00.000Z",
    action: "Prompt Purchase",
    amountEth: "-0.12",
    status: "Success",
    txHash: "0x3f...82e1",
  },
  {
    id: "tx-2",
    date: "2026-02-21T09:45:00.000Z",
    action: "NFT Mint",
    amountEth: "-0.05",
    status: "Success",
    txHash: "0xfa...1c09",
  },
  {
    id: "tx-3",
    date: "2026-02-20T18:12:00.000Z",
    action: "Wallet Deposit",
    amountEth: "+1.50",
    status: "Pending",
    txHash: "0x8b...a49d",
  },
];
