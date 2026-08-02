# PRD 03 — Homepage

**Status:** Draft
**Phase:** MVP
**Depends on:** 01, 02
**Blocks:** —

---

## 1. Problem

The homepage carries Goal G1 almost entirely: a recruiter decides in under 60 seconds whether to keep reading. It must answer _who is this, what do they do, are they any good, and how do I reach them_ without requiring a single click — while still giving an engineer a path deeper into the work.

Most engineer homepages fail one of two ways: a full-viewport animated hero with no information, or an undifferentiated wall of links. This one optimizes for information density at a glance.

## 2. Scope

**In scope:** the `/` route and its sections.

**Out of scope:** the destination pages it links to (PRDs 04, 05, 06).

## 3. Requirements

### 3.1 Hero — above the fold

Must be fully legible without scrolling at 375×667 (small phone) and 1440×900 (laptop).

Contains, in this order:

1. **Name** — largest text on the page, an `<h1>`.
2. **Positioning line** — one sentence: current role, domain, and what the person is good at. Concrete, not aspirational. "Backend engineer building payments infrastructure at scale" beats "passionate about technology."
3. **Supporting sentence** — 1–2 lines of specificity: notable systems, scale, or focus areas.
4. **Availability signal** — a small, visually distinct status line, e.g. "Open to senior backend roles" or "Not currently looking." Content-driven so it can be updated in one place. Omitted entirely when not applicable rather than rendered empty.
5. **Primary CTAs** — "View résumé" (primary) and "Get in touch" (secondary). Both are real links; neither is JS-dependent.
6. **Profile links** — GitHub, LinkedIn, email, and optionally X/Bluesky. Icon links with accessible names.

An optional portrait may sit alongside. If present it uses `next/image` with explicit dimensions, `priority`, and meaningful `alt`. If absent, the layout must not reserve empty space.

**No typewriter effect, no animated particle background, no scroll-jacking.** These delay LCP and add nothing for the target personas.

### 3.2 Featured projects

Two to three projects where `featured: true`, sourced via `getFeaturedProjects(3)` from PRD 02.

Each card shows: title, `summary`, up to 5 `stack` badges, and up to 2 `metrics` when present. The entire card is a single link to the case study — not nested interactive elements. If a card needs both a case-study link and an external source link, the external link sits outside the card's primary link target to avoid nested anchors.

Section ends with "View all projects →" linking to `/projects`.

If fewer than 2 projects are marked featured, the section falls back to the 2 most recent projects rather than rendering a near-empty section.

### 3.3 Recent writing

The 3 most recent non-draft posts: title, `publishedAt` (in a `<time datetime>` element), `readingTime`, and up to 3 tags.

**This section is omitted entirely when there are zero published posts.** An empty "Recent writing" heading signals abandonment, which is worse than not having a blog. This matters at launch, when the blog (PRD 05) is a v1 deliverable and the homepage ships in MVP.

Ends with "Read all posts →" linking to `/blog`.

### 3.4 Brief about

Two to three sentences of personality with a link to `/about`. Optionally a compact row of current primary technologies. This is deliberately short — the full narrative belongs on `/about`.

### 3.5 Closing CTA

A final contact prompt: one sentence plus a button to `/contact`, and the email address as plain selectable text for people who prefer to copy it.

### 3.6 Rendering & performance

- Statically generated. No client-side data fetching.
- The only client components permitted are the theme toggle and the mobile menu, both inherited from PRD 01.
- Hero content is server-rendered HTML — never revealed by JavaScript, never faded in on mount. LCP must not depend on the JS bundle.
- Total JavaScript for this route stays within the budget in PRD 07 §2.4. That budget is set against the Next/React runtime floor (~150 KB gzipped); the figure to defend here is app code, not the total.

## 4. Acceptance criteria

- [ ] At 375×667 with JavaScript disabled, name, positioning line, and both CTAs are visible without scrolling.
- [ ] The page renders correctly and completely with JavaScript disabled.
- [ ] Exactly one `<h1>` exists; heading levels descend without skipping.
- [ ] With zero published posts, the "Recent writing" section is absent from the DOM.
- [ ] With zero featured projects, the section falls back to recent projects and never renders empty.
- [ ] LCP element is the hero heading or portrait, and LCP is under 1.5s on simulated 4G.
- [ ] Cumulative Layout Shift is under 0.05.
- [ ] Every card is reachable and activatable by keyboard, with no nested interactive elements.
- [ ] All content originates from the content layer or a single site-config module — no strings hardcoded in JSX.

## 5. Open questions

- Whether to include a portrait. Recruiters respond well to a face; it is entirely the owner's call. The layout supports both.
- Whether the availability signal should be present at launch — depends on current job-search status.
