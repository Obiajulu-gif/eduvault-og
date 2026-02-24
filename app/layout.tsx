import type { Metadata } from "next";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import "./globals.css";

const AppProviders = dynamic(
  () => import("@/components/providers/app-providers").then((mod) => mod.AppProviders),
  { ssr: false }
);

const manrope = localFont({
  src: [
    { path: "../public/fonts/manrope-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/manrope-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/manrope-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/manrope-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "EduVault",
  description: "Decentralized AI Prompt Marketplace + Research Vault on 0G",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} bg-[#f6f7fb] font-sans text-[#172038] antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
