/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@0glabs/0g-serving-broker",
      "@0glabs/0g-ts-sdk",
      "ethers",
      "openai",
    ],
    optimizePackageImports: [
      "@tanstack/react-query",
      "@rainbow-me/rainbowkit",
      "lucide-react",
      "wagmi",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  poweredByHeader: false,
};

export default nextConfig;
