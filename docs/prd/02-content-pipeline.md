# PRD 02 — Content Pipeline (MDX + Typed Frontmatter)

**Status:** Draft
**Phase:** MVP
**Depends on:** 01
**Blocks:** 03, 04, 05

---

## 1. Problem

Goal G4 requires that publishing a project or post takes under 15 minutes and no code changes. That only holds if there is a single, well-defined content layer: files on disk with validated frontmatter, loaded through one typed API. Without it, every page hand-rolls its own file reading and the frontmatter silently drifts until something renders blank in production.

## 2. Scope

**In scope:** content directory structure, frontmatter schemas, the loader API, MDX rendering configuration, MDX component overrides, and build-time validation.

**Out of scope:** the pages that consume this (PRDs 03–05), résumé data (PRD 06).

## 3. Requirements

### 3.1 Storage

All content lives in `content/` in the repository, versioned in git. One MDX file per item. The filename (minus extension) is the URL slug: `content/blog/why-i-left-microservices.mdx` → `/blog/why-i-left-microservices`.

Slugs are lowercase kebab-case and must match `^[a-z0-9]+(-[a-z0-9]+)*$`. Slugs are permanent once published — renaming breaks inbound links. If a slug must change, PRD 07's redirect mechanism handles the old path.

Per-item images live in `public/images/{blog,projects}/{slug}/`.

### 3.2 Frontmatter schemas

Every schema is a Zod schema. Parsing happens at build time; a validation failure **fails the build** with a message naming the file and the offending field. Content that does not validate never ships.

**Blog post:**

| Field         | Type                  | Required            | Notes                                                                         |
| ------------- | --------------------- | ------------------- | ----------------------------------------------------------------------------- |
| `title`       | string, 1–80 chars    | yes                 |                                                                               |
| `description` | string, 50–160 chars  | yes                 | Used verbatim as the meta description; the length bound is an SEO constraint. |
| `publishedAt` | ISO date `YYYY-MM-DD` | yes                 |                                                                               |
| `updatedAt`   | ISO date              | no                  | Rendered as "Updated on…" when present.                                       |
| `tags`        | string[], 1–5 items   | yes                 | Kebab-case; validated against a canonical tag list.                           |
| `draft`       | boolean               | no, default `false` | Drafts are excluded from production builds.                                   |
| `heroImage`   | object `{ src, alt }` | no                  | `alt` is required whenever `src` is present.                                  |
| `featured`    | boolean               | no, default `false` | Eligible for homepage surfacing.                                              |

**Project:**

| Field                     | Type                                              | Required            | Notes                                                                        |
| ------------------------- | ------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------- |
| `title`                   | string                                            | yes                 |                                                                              |
| `description`             | string, 50–160 chars                              | yes                 |                                                                              |
| `summary`                 | string, ≤ 240 chars                               | yes                 | One-line pitch for cards.                                                    |
| `role`                    | string                                            | yes                 | e.g. "Solo developer", "Tech lead, 4 engineers".                             |
| `timeframe`               | string                                            | yes                 | e.g. "2025 — present".                                                       |
| `stack`                   | string[], 1–12                                    | yes                 | Validated against a canonical technology list.                               |
| `status`                  | enum: `active`, `completed`, `archived`           | yes                 |                                                                              |
| `featured`                | boolean                                           | no, default `false` |                                                                              |
| `order`                   | number                                            | no                  | Manual sort weight; lower sorts first.                                       |
| `links`                   | object: optional `live`, `source`, `writeup` URLs | no                  | Each must be a valid absolute URL.                                           |
| `heroImage`               | `{ src, alt }`                                    | no                  |                                                                              |
| `metrics`                 | array of `{ label, value }`, ≤ 4                  | no                  | e.g. "p95 latency" / "120ms".                                                |
| `confidentialityReviewed` | boolean                                           | yes                 | Must be `true` to build. Forces an explicit check against Risk Q4 in PRD 00. |

**Canonical lists** (tags, technologies) live in `src/lib/content/taxonomy.ts` as `as const` arrays. Adding a new tag or technology is a deliberate one-line edit, which prevents `nextjs` / `next.js` / `Next.js` fragmentation.

### 3.3 Loader API

A single module, `src/lib/content/`, exports typed functions. No page reads the filesystem directly.

```ts
getAllPosts(opts?: { includeDrafts?: boolean }): Promise<Post[]>   // sorted by publishedAt desc
getPostBySlug(slug: string): Promise<Post | null>
getAllPostSlugs(): Promise<string[]>
getPostsByTag(tag: string): Promise<Post[]>
getAllTags(): Promise<Array<{ tag: string; count: number }>>

getAllProjects(): Promise<Project[]>                               // sorted by order, then timeframe desc
getProjectBySlug(slug: string): Promise<Project | null>
getAllProjectSlugs(): Promise<string[]>
getFeaturedProjects(limit?: number): Promise<Project[]>
```

Behavior:

- Results are cached per build; the content directory is read and parsed once, not once per page.
- `draft: true` items are excluded unless `includeDrafts` is passed, and are **always** excluded when `NODE_ENV === 'production'`. Drafts remain visible in local development.
- Every returned item includes derived fields the pages need: `slug`, `readingTime` (words ÷ 220, rounded up, minimum 1), and `wordCount`.

### 3.4 MDX rendering

Configured plugins:

- `remark-gfm` — tables, strikethrough, task lists, autolinks.
- `rehype-slug` — stable `id` on every heading.
- `rehype-autolink-headings` — an anchor link on each heading, in `append` mode, with an accessible name ("Link to section: {heading}") rather than a bare `#`.
- `rehype-pretty-code` (Shiki) — build-time syntax highlighting. Dual light/dark themes driven by CSS variables so highlighting follows the theme toggle with **zero client-side JavaScript**. This is a hard constraint: no runtime highlighter.

### 3.5 MDX component overrides

A shared `mdx-components.tsx` maps markdown elements to the design system:

- `a` — internal links use `next/link`; external links get `target="_blank" rel="noopener noreferrer"` and a visually indicated external-link affordance.
- `img` — routed through `next/image`. **A missing `alt` fails the build.** Requires explicit dimensions to prevent layout shift.
- `pre` / `code` — styled code blocks with an optional filename caption and a copy-to-clipboard button. The copy button is the only interactive client component in prose.
- `h2`–`h4` — design-system typography with anchor targets.
- `blockquote`, `table`, `ul`, `ol`, `hr` — token-based styling. Tables scroll horizontally within their own container rather than forcing page-level horizontal scroll.

Custom components available to authors: `Callout` (variants `note`, `warn`, `tip`), `Figure` (image + caption), and `Aside`. Any component that renders text must expose that text to assistive technology.

### 3.6 Validation script

`npm run content:check` validates every content file against its schema and additionally asserts:

- slug format is valid and unique within its collection,
- every referenced local image exists on disk,
- every tag and technology appears in the canonical taxonomy,
- `description` is within the 50–160 character bound,
- projects have `confidentialityReviewed: true`.

This script runs in CI (PRD 09) and as part of `npm run build`.

## 4. Acceptance criteria

- [ ] A post with a missing required field fails the build, and the error message names the file and field.
- [ ] A post with `draft: true` renders in `npm run dev` and is absent from `npm run build` output.
- [ ] An MDX image without `alt` fails the build.
- [ ] Code blocks are highlighted with zero highlighting-related JavaScript in the client bundle.
- [ ] Switching themes recolors code blocks without a network request or re-render.
- [ ] `readingTime` is present on every post and is at least 1.
- [ ] `getAllPosts()` returns posts in descending `publishedAt` order.
- [ ] Adding a tag not present in the taxonomy fails `npm run content:check`.
- [ ] The content directory is parsed once per build regardless of page count.

## 5. Open questions

- Whether to adopt a library (Content Collections, Velite) or hand-roll the loader. Either satisfies this PRD; the API contract in §3.3 is what matters. Recommendation: start hand-rolled — roughly 150 lines — to avoid a dependency on a fast-moving package for something this simple.
