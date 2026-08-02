/**
 * Single source of truth for site-wide content and configuration.
 * PRD 03 §4 requires that no page hardcodes these strings in JSX.
 */

export const site = {
  name: "Your Name",
  // TODO(Q1, PRD 00): replace with the real domain before launch. `metadataBase`,
  // canonical URLs, the sitemap and RSS absolute URLs all derive from this.
  url: "https://example.com",
  title: "Your Name — Software Engineer",
  description:
    "Software engineer building reliable backend systems. Case studies, writing, and a résumé.",
  locale: "en_US",

  /** PRD 03 §3.1 — the hero is content, not markup. */
  hero: {
    positioning: "Software engineer building reliable backend systems.",
    supporting:
      "I work on the parts of a product that have to stay up: data pipelines, APIs, and the infrastructure underneath them.",
    /** Set to null to omit the availability line entirely (PRD 03 §3.1). */
    availability: "Open to senior backend roles" as string | null,
  },

  about: {
    brief:
      "I've spent the last several years building systems where correctness and uptime matter more than novelty. I care about clear interfaces, honest postmortems, and code that the next person can read.",
  },

  email: "you@example.com",

  profiles: {
    github: "https://github.com/therealivo8",
    linkedin: "https://linkedin.com/in/your-handle",
  },

  resume: {
    path: "/resume.pdf",
    /** Shown next to the download link so nobody is surprised (PRD 06 §4.1). */
    sizeLabel: "PDF, 120 KB",
  },
} as const;

export const nav = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Résumé" },
  { href: "/contact", label: "Contact" },
] as const;
