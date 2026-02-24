/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
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
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };
    return config;
  },
  poweredByHeader: false,
};

export default nextConfig;
