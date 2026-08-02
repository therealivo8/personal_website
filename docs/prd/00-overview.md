# PRD 00 — Personal Website: Master Overview

**Status:** Draft
**Owner:** therealivo8
**Last updated:** 2026-07-29

---

## 1. Summary

A personal website for a software engineer that serves three audiences at once: recruiters and hiring managers evaluating a candidate, engineers evaluating technical depth, and anyone who arrives via a link and wants to know who this person is. The site is a statically generated Next.js application, content-authored in MDX, deployed on Vercel.

The site is **not** a blog platform, a CMS, or a SaaS product. It is a fast, durable, low-maintenance personal presence that the owner controls end to end.

## 2. Goals

| #   | Goal                                                                    | Why it matters                                                                                                       |
| --- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| G1  | A recruiter can determine fit in under 60 seconds                       | Recruiters skim. If the value proposition, stack, and contact path are not immediately legible, the visit is wasted. |
| G2  | An engineer can assess technical depth in under 5 minutes               | Project case studies with real architecture decisions, tradeoffs, and outcomes — not screenshot galleries.           |
| G3  | The site is the canonical, owner-controlled home for the personal brand | One URL to put on a résumé, GitHub profile, conference bio, and email signature.                                     |
| G4  | Adding a project or post takes under 15 minutes and no code changes     | Content lives in MDX files with typed frontmatter. Low friction means the site stays current.                        |
| G5  | The site stays fast and accessible under real conditions                | Performance and a11y are correctness requirements, not polish.                                                       |

## 3. Non-goals

- **No comments, likes, or social features.** No moderation burden.
- **No authentication or user accounts.** Nothing to log into.
- **No database.** Content is files in git. This is a deliberate durability choice.
- **No CMS in v1.** MDX in the repo is the authoring surface. Revisit only if authoring friction is proven real.
- **No newsletter or email capture in v1.** Deferred to v2 (see PRD 08).
- **No i18n.** English only.
- **No dynamic server rendering.** Every page is statically generated at build time, with one exception: the contact form's server action (PRD 06).

## 4. Target users

### Persona A — "Dana", technical recruiter

Scanning 40 candidates today. Wants: current role and years of experience, primary stack, location and work authorization signals, whether the person is open to opportunities, and a way to contact or download a résumé. Leaves in 30–90 seconds either way. Often on mobile.

**Implication:** above-the-fold identity + stack + CTA on the homepage; a résumé that is one click from every page; a contact route that does not require opening an email client.

### Persona B — "Sam", engineering manager or senior engineer

Has already decided the candidate is plausible. Wants evidence of judgment: what problem was solved, what was chosen and rejected, what broke, what the measurable outcome was. Skeptical of marketing language.

**Implication:** project case studies structured around problem → approach → tradeoffs → outcome, with links to source and live demos where they exist.

### Persona C — "Alex", peer or acquaintance

Arrived from a GitHub profile, a talk, or a shared link. Wants to know who this is and where else to find them.

**Implication:** a genuine About page and a clean set of profile links.

## 5. Information architecture

```
/                    Homepage — identity, value prop, featured projects, recent writing, CTA
/about               Long-form bio, career narrative, current focus, tools
/projects            Index of all projects, filterable by tech
/projects/[slug]     Project case study
/blog                Index of all posts, reverse chronological
/blog/[slug]         Post
/blog/tags/[tag]     Posts filtered by tag
/resume              Résumé, web-readable, with a PDF download
/contact             Contact form + direct email + social links
/rss.xml             Feed
/sitemap.xml         Sitemap
/robots.txt          Robots
/og/[...]            Dynamically generated Open Graph images
```

Global chrome: a header with logo/name and nav (About, Projects, Blog, Résumé, Contact), a theme toggle, and a footer with profile links and a copyright line.

## 6. Technical foundation

| Concern            | Decision                                 | Rationale                                                                                                       |
| ------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Framework          | Next.js 16, App Router                   | SSG output, file-based routing, first-class metadata and OG image APIs, matches existing workspace conventions. |
| Language           | TypeScript, `strict: true`               | Typed frontmatter is the mechanism that keeps content valid.                                                    |
| Styling            | Tailwind CSS v4                          | CSS-first config via `@theme`. Design tokens defined once in `globals.css`.                                     |
| Content            | MDX via Content Collections (see PRD 02) | Content in git, validated by Zod at build time.                                                                 |
| Content validation | Zod schemas                              | A malformed post fails the build rather than shipping broken.                                                   |
| Rendering          | Static Site Generation for all routes    | Predictable, cacheable, cheap, and fast.                                                                        |
| Hosting            | Vercel                                   | Zero-config for Next.js, preview deployments per PR, edge CDN.                                                  |
| Package manager    | npm                                      | Matches workspace.                                                                                              |
| Node               | 24.x                                     | Matches local toolchain.                                                                                        |
| Testing            | Vitest (unit), Playwright (e2e smoke)    | See PRD 09.                                                                                                     |
| Linting            | ESLint + Prettier                        | See PRD 09.                                                                                                     |

### Repository layout

```
personal_website/
├── docs/prd/                 # These documents
├── content/
│   ├── blog/                 # *.mdx posts
│   ├── projects/             # *.mdx case studies
│   └── resume.ts             # Typed résumé data
├── public/
│   ├── images/
│   └── resume.pdf
├── src/
│   ├── app/                  # App Router routes
│   ├── components/
│   │   ├── ui/               # Primitives: Button, Card, Badge, Prose
│   │   ├── layout/           # Header, Footer, ThemeToggle
│   │   └── content/          # MDX component overrides
│   ├── lib/                  # content loaders, utils, metadata helpers
│   └── styles/globals.css
├── tests/
└── config files
```

## 7. PRD index

| PRD                                      | Title                                      | Phase | Depends on |
| ---------------------------------------- | ------------------------------------------ | ----- | ---------- |
| [01](./01-foundation.md)                 | Foundation, design system & layout         | MVP   | —          |
| [02](./02-content-pipeline.md)           | Content pipeline (MDX + typed frontmatter) | MVP   | 01         |
| [03](./03-homepage.md)                   | Homepage                                   | MVP   | 01, 02     |
| [04](./04-projects.md)                   | Projects index & case studies              | MVP   | 01, 02     |
| [05](./05-blog.md)                       | Blog index, posts & tags                   | v1    | 01, 02     |
| [06](./06-about-resume-contact.md)       | About, Résumé & Contact                    | MVP   | 01         |
| [07](./07-seo-performance-a11y.md)       | SEO, performance & accessibility           | MVP   | 01–06      |
| [08](./08-analytics-and-v2.md)           | Analytics & v2 enhancements                | v2    | 07         |
| [09](./09-tooling-testing-deployment.md) | Tooling, testing & deployment              | MVP   | 01         |

See [ROADMAP.md](./ROADMAP.md) for sequencing.

## 8. Success metrics

| Metric                          | Target             | How measured                                           |
| ------------------------------- | ------------------ | ------------------------------------------------------ |
| Lighthouse Performance (mobile) | ≥ 95               | CI run against production build                        |
| Lighthouse Accessibility        | 100                | CI                                                     |
| Lighthouse SEO                  | 100                | CI                                                     |
| Largest Contentful Paint        | < 1.5s on 4G       | Lighthouse / Vercel Speed Insights                     |
| Cumulative Layout Shift         | < 0.05             | Same                                                   |
| App-code JS on homepage         | < 30 KB gzipped    | `next build`; excludes framework runtime (PRD 07 §2.4) |
| Time to publish a new post      | < 15 min           | Owner judgment: write MDX, commit, push                |
| Build time                      | < 60s              | CI                                                     |
| Axe violations                  | 0 serious/critical | Playwright + axe-core in CI                            |

## 9. Open questions

| #   | Question                                                                                                           | Owner | Blocks                            |
| --- | ------------------------------------------------------------------------------------------------------------------ | ----- | --------------------------------- |
| Q1  | What is the domain name?                                                                                           | Owner | PRD 07 (canonical URLs), 09 (DNS) |
| Q2  | Is the site bilingual/localized ever? Assumed no.                                                                  | Owner | —                                 |
| Q3  | Which email address receives contact form submissions?                                                             | Owner | PRD 06                            |
| Q4  | Are there projects under NDA that need sanitized case studies?                                                     | Owner | PRD 04                            |
| Q5  | Should the résumé PDF be generated from the same data, or maintained separately? v1 assumes separately maintained. | Owner | PRD 06                            |

## 10. Risks

| Risk                                                     | Impact                                 | Mitigation                                                                                         |
| -------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Site is built but never updated; content goes stale      | High — a stale site is worse than none | G4: keep authoring friction minimal. Roadmap includes seeding real content, not lorem ipsum.       |
| Over-engineering the design system before content exists | Medium — delays launch indefinitely    | PRD 01 scopes the design system to exactly the primitives PRDs 03–06 consume. Nothing speculative. |
| Case studies leak employer-confidential detail           | High                                   | Q4. PRD 04 requires an explicit confidentiality review per project.                                |
| Contact form becomes a spam vector                       | Medium                                 | PRD 06 specifies honeypot + rate limiting + server-side validation.                                |
