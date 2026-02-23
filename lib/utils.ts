import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddress(address?: string | null, size = 4) {
  if (!address) return "Not connected";
  return `${address.slice(0, size + 2)}...${address.slice(-size)}`;
}

export function formatEth(value: bigint | string | number | undefined | null, max = 4) {
  if (value === null || value === undefined) return "0";
  const numeric = typeof value === "bigint" ? Number(value) / 1e18 : Number(value);
  if (!Number.isFinite(numeric)) return "0";
  return numeric.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: max,
  });
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
