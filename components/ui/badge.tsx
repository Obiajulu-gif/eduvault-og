import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#efe6ff] text-[#7b2ff7]",
        secondary: "bg-[#e9f7ee] text-[#1d9f5c]",
        warning: "bg-[#fff2d8] text-[#b7791f]",
        destructive: "bg-[#fee4e2] text-[#d92d20]",
        outline: "border border-[#d7ddea] text-[#65708b]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
