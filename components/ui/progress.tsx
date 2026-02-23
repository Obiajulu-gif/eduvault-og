"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  return (
    <div className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-[#e8edf5]", className)} {...props}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#7b2ff7] to-[#9747ff] transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
