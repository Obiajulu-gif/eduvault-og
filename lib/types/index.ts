export type PromptCategory = "Coding" | "Writing" | "Research" | "All";

export type PromptIcon =
  | "shield"
  | "code"
  | "research"
  | "sparkles"
  | "flask"
  | "brain"
  | "database";

export interface PromptMetadata {
  title: string;
  category: PromptCategory;
  shortDescription: string;
  features: string[];
  creatorHandle: string;
  icon: PromptIcon;
  promptTemplateRef: string;
  version: string;
}

export interface PromptListing {
  promptId: number;
  seller: string;
  priceWei: string;
  metadataURI: string;
  isActive: boolean;
  metadata?: PromptMetadata;
  licensed?: boolean;
  txHash?: string;
  createdAt?: number;
}

export interface TxRecord {
  id: string;
  date: string;
  action: "Prompt Purchase" | "NFT Mint" | "Wallet Deposit" | "Prompt Listed";
  amountEth: string;
  status: "Success" | "Pending" | "Failed";
  txHash: string;
  promptId?: number;
  explorerUrl?: string;
}

export interface SkillMappingResult {
  detectedSkills: Array<{
    name: string;
    level: "beginner" | "intermediate" | "advanced";
    confidence: number;
  }>;
  strengths: string[];
  gaps: string[];
  roadmap: Array<{
    week: number;
    focus: string;
    tasks: string[];
  }>;
}

export interface ComputeStreamEvent {
  type: "log" | "chunk" | "progress" | "done" | "error";
  message?: string;
  chunk?: string;
  progress?: number;
  outputRef?: string;
  payload?: unknown;
}
