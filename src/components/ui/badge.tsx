import Link from "next/link";
import { cn } from "@/lib/cn";

/** PRD 01 §3.4 — tech tags and blog tags. Becomes a link when `href` is set. */
export function Badge({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn(
    "inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-fg-muted",
    href && "transition-colors hover:border-accent hover:text-fg",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <span className={classes}>{children}</span>;
}
