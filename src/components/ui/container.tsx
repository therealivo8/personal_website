import { cn } from "@/lib/cn";

/** PRD 01 §3.4 — centers content, caps width, applies responsive padding. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/** Consistent vertical rhythm between page sections. */
export function Section({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  return (
    <section className={cn("py-14 sm:py-20", className)} {...props}>
      {children}
    </section>
  );
}
