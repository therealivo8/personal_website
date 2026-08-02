import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * PRD 01 §3.4 — renders as <button>, or as the child element via `asChild`
 * (used for links). Never a <div>.
 */
const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-on-accent hover:bg-accent-hover",
        secondary: "border border-border bg-surface text-fg hover:border-accent",
        ghost: "text-fg-muted hover:text-fg",
      },
      size: {
        // Minimum 44px tall to satisfy the tap-target rule in PRD 01 §3.6.
        md: "min-h-11 px-4 py-2.5 text-sm",
        lg: "min-h-12 px-5 py-3 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof button> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(button({ variant, size }), className)} {...props} />;
}
