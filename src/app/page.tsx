import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Container, Section } from "@/components/ui/container";
import { site } from "@/lib/site";

/**
 * Homepage hero — PRD 03 §3.1.
 * Sections 3.2 (featured projects) and 3.3 (recent writing) land in Phase 2,
 * once the content layer from PRD 02 exists.
 */
export default function Home() {
  return (
    <Container>
      <Section>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {site.name}
        </h1>

        <p className="text-fg mt-4 max-w-2xl text-lg sm:text-xl">
          {site.hero.positioning}
        </p>

        <p className="text-fg-muted mt-4 max-w-2xl leading-relaxed">
          {site.hero.supporting}
        </p>

        {/* Omitted entirely when null, rather than rendered empty (PRD 03 §3.1). */}
        {site.hero.availability && (
          <p className="border-border text-fg-muted mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
            <span className="bg-accent size-2 rounded-full" aria-hidden="true" />
            {site.hero.availability}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link href="/resume">View résumé</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>

        <ul className="mt-8 flex items-center gap-1">
          {[
            { href: site.profiles.github, label: "GitHub", Icon: GithubIcon },
            {
              href: site.profiles.linkedin,
              label: "LinkedIn",
              Icon: LinkedinIcon,
            },
            { href: `mailto:${site.email}`, label: "Email", Icon: Mail },
          ].map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                className="text-fg-muted hover:text-fg inline-flex size-11 items-center justify-center rounded-lg transition-colors"
              >
                <Icon className="size-5" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </Container>
  );
}
