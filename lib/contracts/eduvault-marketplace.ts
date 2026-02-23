export const EDUVAULT_MARKETPLACE_ABI = [
  {
    type: "function",
    name: "listPrompt",
    stateMutability: "nonpayable",
    inputs: [
      { name: "metadataURI", type: "string" },
      { name: "priceWei", type: "uint256" },
    ],
    outputs: [{ name: "promptId", type: "uint256" }],
  },
  {
    type: "function",
    name: "buyPrompt",
    stateMutability: "payable",
    inputs: [{ name: "promptId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "withdrawProceeds",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "getPrompt",
    stateMutability: "view",
    inputs: [{ name: "promptId", type: "uint256" }],
    outputs: [
      { name: "seller", type: "address" },
      { name: "priceWei", type: "uint256" },
      { name: "metadataURI", type: "string" },
      { name: "isActive", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "hasLicense",
    stateMutability: "view",
    inputs: [
      { name: "promptId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    outputs: [{ name: "licensed", type: "bool" }],
  },
  {
    type: "event",
    name: "PromptListed",
    anonymous: false,
    inputs: [
      { indexed: true, name: "promptId", type: "uint256" },
      { indexed: true, name: "seller", type: "address" },
      { indexed: false, name: "priceWei", type: "uint256" },
      { indexed: false, name: "metadataURI", type: "string" },
    ],
  },
  {
    type: "event",
    name: "PromptPurchased",
    anonymous: false,
    inputs: [
      { indexed: true, name: "promptId", type: "uint256" },
      { indexed: true, name: "buyer", type: "address" },
      { indexed: false, name: "priceWei", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "Withdrawn",
    anonymous: false,
    inputs: [
      { indexed: true, name: "seller", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
  },
] as const;
