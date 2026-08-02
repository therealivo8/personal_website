# Personal Website

A personal site for a software engineer: portfolio case studies, writing, and a résumé.

Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4. Statically generated, deployed on Vercel.

## Requirements

- Node 24.x
- npm

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

The site runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                 | Purpose                         |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Development server              |
| `npm run build`        | Production build                |
| `npm run start`        | Serve the production build      |
| `npm run typecheck`    | `tsc --noEmit`                  |
| `npm run lint`         | ESLint (a11y rules are errors)  |
| `npm run format`       | Prettier write                  |
| `npm run format:check` | Prettier check                  |
| `npm run check`        | typecheck + lint + format check |

Run `npm run check` before pushing.

## Where things live

```
docs/prd/            Product requirements — start with 00-overview.md
src/app/             Routes (App Router)
src/components/ui/   Design-system primitives
src/components/layout/  Header, footer, theme
src/lib/site.ts      Name, bio, links, résumé metadata — edit this first
src/app/globals.css  Design tokens
```

**To change your name, bio, links, or availability status, edit [src/lib/site.ts](src/lib/site.ts).** No page hardcodes that content.

## Design system

Colors are semantic tokens (`bg-bg`, `text-fg`, `text-fg-muted`, `bg-accent`, `border-border`) defined in [src/app/globals.css](src/app/globals.css). Components never use raw color values, so both themes stay correct.

Dark mode is driven by `data-theme` on `<html>`, set before first paint by an inline script to avoid a flash of the wrong theme.

## Current status

Phase 0 (foundation) is complete: design tokens, primitives, header/footer, dark mode, tooling.

Not yet built — see [docs/prd/ROADMAP.md](docs/prd/ROADMAP.md):

- Content pipeline (PRD 02) — MDX loading and validation
- Projects, blog, about, résumé, contact pages (PRDs 04–06)
- SEO metadata, OG images, sitemap (PRD 07)
- Tests and CI (PRD 09)

Nav links to `/about`, `/projects`, `/blog`, `/resume`, and `/contact` currently 404 — those routes arrive with their PRDs.

## Deployment

Connect the repository to Vercel. `main` deploys to production; pull requests get preview deployments. Set environment variables in the Vercel dashboard — `RESEND_API_KEY` and `CONTACT_TO_EMAIL` must remain server-only.

Before launch, replace the placeholder `site.url` in [src/lib/site.ts](src/lib/site.ts) with the real domain; canonical URLs, the sitemap, and RSS all derive from it.
