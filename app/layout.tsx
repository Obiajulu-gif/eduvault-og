import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
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
