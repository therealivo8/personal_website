# PRD 07 — SEO, Performance & Accessibility

**Status:** Draft
**Phase:** MVP
**Depends on:** 01–06
**Blocks:** 08

---

## 1. Problem

A site nobody can find, that loads slowly, or that excludes users is not a working site. These three concerns are grouped because they share one root cause and one root fix: server-rendered semantic HTML, shipped in small quantities.

This PRD is a cross-cutting requirement layer, not a feature. Its criteria apply to every page built in PRDs 03–06 and are enforced in CI (PRD 09) rather than checked once at launch.

## 2. Requirements

### 2.1 Metadata

Every route exports Next.js `Metadata`. Nothing ships with a default or missing title.

**Root defaults:** a title template (`%s · {Name}`), site description, `metadataBase` set to the production origin (unblocks PRD 00 Q1 — required for absolute URL resolution), Open Graph defaults, and Twitter card defaults.

**Per route:**

- `title` and `description` — unique on every page. Descriptions between 50 and 160 characters, enforced for content by PRD 02's schemas.
- `alternates.canonical` — a self-referencing absolute canonical on every page. This is what makes cross-posting safe later (PRD 05, Q).
- Open Graph: `title`, `description`, `url`, `siteName`, `images`, `locale`, and `type` (`article` for posts and case studies, `website` elsewhere).
- Article metadata: `publishedTime`, `modifiedTime`, `authors`, `tags`.
- Twitter: `summary_large_image` with creator handle.

**Open Graph images** are generated at build time via `next/og` from a shared template that renders the page title, a subtitle, and the site wordmark on a branded background. Output is 1200×630. Every page has an OG image; a link preview with no image loses clicks. The template uses the design tokens from PRD 01 so previews look like the site.

### 2.2 Structured data

JSON-LD, rendered server-side:

- `Person` on the homepage and `/about`: name, job title, URL, `sameAs` profile links, and `knowsAbout`.
- `BlogPosting` on posts: headline, description, `datePublished`, `dateModified`, author, image.
- `BreadcrumbList` on nested routes.
- `WebSite` on the homepage.

All structured data must validate against Google's Rich Results Test. **Structured data must describe what is actually on the page** — marking up content that does not exist is a manipulation risk and will be penalized.

### 2.3 Crawlability

- `sitemap.xml` generated at build time via `app/sitemap.ts`, containing every published route with `lastModified`. Drafts are excluded.
- `robots.txt` via `app/robots.ts`, allowing all crawlers and pointing to the sitemap.
- Redirects for any changed slug, configured as permanent (308) in `next.config.ts`. This is the mechanism PRD 02 §3.1 relies on.
- No `noindex` on any public page.
- Internal links use `next/link` and are real `<a href>` elements — never `onClick` handlers on a `<div>`, which are invisible to crawlers and unusable by keyboard.

### 2.4 Performance

**Budgets** (measured on a production build, mobile emulation, 4G throttling):

| Metric                             | Budget           |
| ---------------------------------- | ---------------- |
| Lighthouse Performance             | ≥ 95             |
| LCP                                | < 1.5s           |
| CLS                                | < 0.05           |
| INP                                | < 200ms          |
| Total JS, homepage                 | < 175 KB gzipped |
| Total JS, any route                | < 200 KB gzipped |
| App code (excl. framework runtime) | < 30 KB gzipped  |

**On the JS budget.** Next 16 + React 19 ship roughly 150 KB gzipped of client runtime before a single line of application code — react-dom alone is ~70 KB gzipped in the emitted chunk. Any budget below that is unmeetable on this stack, so the totals above are set against the measured framework floor rather than an aspirational round number.

The number actually worth defending is the **app code** line: it is the only part under our control, and it is what regresses when a dependency is added carelessly. Measure it as total page JS minus the framework chunks. Note that Next also emits a `noModule` legacy chunk which modern browsers never fetch — exclude it when measuring.

If the framework floor itself becomes the problem, the real lever is shipping fewer client components (see the techniques below), not shaving kilobytes off app code.

**Techniques:**

- Static generation everywhere; no client-side data fetching for initial content.
- Client components only where interactivity genuinely requires them: theme toggle, mobile menu, project filter, code copy, contact form. Everything else is a server component. Each new `'use client'` boundary requires justification in review.
- `next/font` self-hosting with `display: swap` and preloaded subsets. No external font requests — they cost a DNS lookup, a connection, and a privacy exposure.
- `next/image` everywhere, serving AVIF and WebP, with explicit dimensions on every image to eliminate layout shift. `priority` on the LCP image only.
- Zero third-party scripts in MVP. Analytics (PRD 08) must be evaluated against these budgets before adoption.
- No layout shift from the theme script (handled in PRD 01) or from lazily loaded content above the fold.

### 2.5 Accessibility

Target: **WCAG 2.2 Level AA**.

- Semantic landmarks on every page: `header`, `nav`, `main`, `footer`. One `<main>` per page.
- Exactly one `<h1>` per page; heading levels descend without skipping.
- Contrast: 4.5:1 for body text, 3:1 for large text and meaningful UI boundaries — in **both** themes. Enforced by PRD 01's token choices.
- Visible `:focus-visible` indicators on every interactive element. Focus is never removed without an equivalent replacement.
- Full keyboard operability, in a logical order matching visual order. No keyboard traps except the intentional, escapable mobile-menu trap.
- Skip link as the first focusable element.
- Every image has appropriate `alt`; decorative images use `alt=""`.
- Icon-only controls have accessible names.
- Information is never conveyed by color alone.
- Form inputs have real labels, and errors are programmatically associated (PRD 06).
- `prefers-reduced-motion: reduce` is honored globally.
- The page is usable at 200% browser zoom and at 320px width without horizontal scrolling or content loss.
- Screen-reader smoke test on the primary flows: homepage → project → contact.

## 3. Acceptance criteria

- [ ] Every route has a unique title and description.
- [ ] Every route has a self-referencing canonical URL.
- [ ] Every route has an Open Graph image that renders correctly in a link preview.
- [ ] JSON-LD on the homepage, `/about`, and every post passes the Rich Results Test.
- [ ] `sitemap.xml` lists every published route and excludes drafts.
- [ ] `robots.txt` is present and references the sitemap.
- [ ] Lighthouse mobile scores meet §2.4's budgets on every primary route.
- [ ] `next build` output shows no route exceeding its JS budget.
- [ ] axe-core reports zero serious or critical violations on every route, in both themes.
- [ ] Every route is fully navigable by keyboard.
- [ ] Every route is usable at 320px width and 200% zoom with no horizontal scroll.
- [ ] Zero third-party network requests on any page in MVP.

## 4. Open questions

- Production domain (PRD 00, Q1). Required for `metadataBase`, canonicals, sitemap, and RSS absolute URLs. **This blocks final SEO verification** — a placeholder can be used during development but must be replaced before launch.
