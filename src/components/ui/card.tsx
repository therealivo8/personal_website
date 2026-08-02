import { cn } from "@/lib/cn";

/** PRD 01 §3.4 — composable card used by project and post listings. */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-border bg-surface rounded-[--radius-card] border p-5 transition-colors",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-2">{children}</div>;
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="text-fg-muted text-sm leading-relaxed">{children}</div>;
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex flex-wrap gap-2">{children}</div>;
}
