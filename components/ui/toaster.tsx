"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      richColors
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "12px",
          border: "1px solid #e2e8f3",
          background: "#ffffff",
          color: "#1d2433",
        },
      }}
    />
  );
}
