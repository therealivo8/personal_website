# PRD 01 — Foundation, Design System & Layout

**Status:** Draft
**Phase:** MVP
**Depends on:** —
**Blocks:** 02, 03, 04, 05, 06, 07

---

## 1. Problem

Every subsequent PRD needs a running Next.js application, a consistent visual language, and shared page chrome. Without these defined first, each feature invents its own spacing, colors, and typography, and the site reads as five different sites stitched together.

## 2. Scope

**In scope:** Next.js project initialization, design tokens, base typography, the UI primitives that PRDs 03–06 actually consume, header/footer/nav, dark mode, and the root layout.

**Out of scope:** Any page content (PRDs 03–06), content loading (PRD 02), analytics (PRD 08).

**Explicitly not built:** A general-purpose component library. Only components with a named consumer in another PRD get built. No speculative `<Modal>`, `<Tabs>`, or `<Accordion>`.

## 3. Requirements

### 3.1 Project initialization

- Next.js 16 with App Router, TypeScript, Tailwind v4, ESLint, `src/` directory, and the `@/*` import alias.
- `tsconfig.json` runs with `strict: true`. `any` requires an inline justification comment.
- React 19.
- The dev server starts with `npm run dev` and serves a working page at `/`.

### 3.2 Design tokens

Tokens are defined once in `src/styles/globals.css` using Tailwind v4's `@theme` directive. No hardcoded hex values anywhere in components.

**Color:** a neutral gray scale (50–950) for surfaces and text, plus a single accent hue used sparingly for links, focus rings, and primary actions. Semantic aliases are what components reference:

| Token              | Light       | Dark        | Used for                     |
| ------------------ | ----------- | ----------- | ---------------------------- |
| `--color-bg`       | neutral-50  | neutral-950 | Page background              |
| `--color-surface`  | white       | neutral-900 | Cards, elevated panels       |
| `--color-border`   | neutral-200 | neutral-800 | Dividers, card borders       |
| `--color-fg`       | neutral-900 | neutral-50  | Primary text                 |
| `--color-fg-muted` | neutral-600 | neutral-400 | Secondary text, metadata     |
| `--color-accent`   | accent-600  | accent-400  | Links, focus, primary action |

Both dark and light values of every semantic token must meet WCAG AA contrast (4.5:1 body, 3:1 large text) against their intended background. This is verified in PRD 07, but the tokens are chosen here to satisfy it.

**Typography:** one sans-serif for UI and body (`next/font` with a variable font, `display: swap`, self-hosted — no external font CDN), one monospace for code. A modular type scale from `text-sm` through `text-5xl`. Body copy at 16px minimum, line-height 1.6–1.75, measure capped at ~68 characters via a `max-w-prose` constraint.

**Spacing:** Tailwind's default 4px-based scale. No arbitrary values like `p-[13px]` outside of genuinely one-off cases.

**Radius, shadow, motion:** a small set of radius tokens, restrained shadows, and transitions at 150–200ms. All motion respects `prefers-reduced-motion: reduce` — under that media query, transitions and animations resolve to near-instant.

### 3.3 Dark mode

- Three states: light, dark, system. Default is system.
- Preference persists in `localStorage`.
- **No flash of incorrect theme.** A small blocking inline script in `<head>` reads the stored preference and sets a `data-theme` attribute on `<html>` before first paint. This is the one place a render-blocking script is acceptable.
- The toggle is a keyboard-accessible button in the header with an accessible name that reflects the current state.

### 3.4 UI primitives

Each primitive is justified by a downstream consumer:

| Component   | Consumers                                   | Notes                                                                                                          |
| ----------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `Button`    | Homepage CTA, Contact form, Résumé download | Variants: `primary`, `secondary`, `ghost`. Renders as `<button>` or, via `asChild`, as `<a>`. Never a `<div>`. |
| `Card`      | Project cards, blog post cards              | Composable: `Card`, `CardHeader`, `CardBody`, `CardFooter`.                                                    |
| `Badge`     | Tech tags, blog tags                        | Optional `href` to become a link.                                                                              |
| `Prose`     | MDX post and case-study bodies              | Typographic wrapper for long-form content.                                                                     |
| `Container` | Every page                                  | Centers content, caps width, applies responsive horizontal padding.                                            |
| `Section`   | Homepage sections                           | Consistent vertical rhythm between page sections.                                                              |

Every interactive element has a visible focus indicator that is **not** the browser default removed — a 2px accent ring with sufficient offset, applied via `:focus-visible`.

### 3.5 Layout & navigation

**Header** — sticky, backdrop-blurred, sits above content. Contains name/wordmark linking to `/`, primary nav (About, Projects, Blog, Résumé, Contact), and the theme toggle. On viewports under `md`, nav collapses into a disclosure menu that:

- opens and closes via keyboard,
- traps focus while open,
- closes on `Escape` and returns focus to the trigger,
- is marked with `aria-expanded` and `aria-controls`.

The current route's nav item carries `aria-current="page"` and a visual active state.

**Footer** — profile links (GitHub, LinkedIn, X/Bluesky, email), an RSS link, and a copyright line. Icon-only links have accessible names.

**Skip link** — the first focusable element on the page, visually hidden until focused, jumping to `#main`. The `<main>` element carries `id="main"`.

**Root layout** — sets `<html lang="en">`, applies font variables, renders the theme script, header, `<main>`, and footer. Defines default metadata that child routes extend (title template, description, Open Graph defaults) — the full metadata contract is specified in PRD 07.

### 3.6 Responsive behavior

Mobile-first. Breakpoints are Tailwind defaults. The site is usable and correct at 320px width; no horizontal page scroll at any viewport. Tap targets are at least 44×44 CSS pixels.

## 4. Acceptance criteria

- [ ] `npm run dev`, `npm run build`, `npm run typecheck`, and `npm run lint` all succeed on a clean clone.
- [ ] Every semantic color token passes WCAG AA against its paired background, in both themes.
- [ ] Toggling the theme and hard-reloading produces no flash of the wrong theme.
- [ ] The entire header and footer are operable by keyboard alone, in a logical tab order.
- [ ] The mobile menu traps focus, closes on `Escape`, and restores focus to its trigger.
- [ ] The skip link is the first tab stop and moves focus to `<main>`.
- [ ] No component contains a hardcoded color value.
- [ ] With `prefers-reduced-motion: reduce`, no transition exceeds 1ms.
- [ ] At 320px viewport width, `document.documentElement.scrollWidth` does not exceed the viewport width on any route.

## 5. Open questions

- Accent hue: to be chosen by the owner. Any hue works provided the AA contrast requirement holds in both themes.
- Wordmark: plain text name in v1. A logo mark is deferred.
