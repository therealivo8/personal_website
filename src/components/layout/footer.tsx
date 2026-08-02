import { Mail, Rss } from "lucide-react";
import { Container } from "@/components/ui/container";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { site } from "@/lib/site";

/** PRD 01 §3.5 — icon-only links carry accessible names. */
const links = [
  { href: site.profiles.github, label: "GitHub", Icon: GithubIcon },
  { href: site.profiles.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: `mailto:${site.email}`, label: "Email", Icon: Mail },
  { href: "/rss.xml", label: "RSS feed", Icon: Rss },
];

export function Footer() {
  return (
    <footer className="border-border mt-auto border-t py-10">
      <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-fg-muted text-sm">
          © {new Date().getFullYear()} {site.name}
        </p>
        <ul className="flex items-center gap-1">
          {links.map(({ href, label, Icon }) => (
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
      </Container>
    </footer>
  );
}
