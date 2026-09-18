import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-brand text-white hover:bg-brand-dark",
        outline: "border border-border bg-surface hover:bg-background",
        ghost: "hover:bg-background",
        danger: "bg-danger text-white hover:bg-red-800",
      },
      size: {
        default: "h-11 px-5 py-3",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = "Button";
