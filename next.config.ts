import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@0glabs/0g-serving-broker",
      "@0glabs/0g-ts-sdk",
      "ethers",
      "openai",
    ],
  },
};

export default nextConfig;
