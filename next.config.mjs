/** @type {import('next').NextConfig} */
const nextConfig = {
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
