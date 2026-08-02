# PRD 04 — Projects Index & Case Studies

**Status:** Draft
**Phase:** MVP
**Depends on:** 01, 02
**Blocks:** —

---

## 1. Problem

Goal G2: an engineer should be able to assess technical depth in five minutes. Screenshots and a tech-stack list do not achieve that — they show _what_ was built, not whether the builder exercised judgment. The projects section is the site's core evidence, and it must be structured to surface reasoning.

This is the section that most distinguishes a strong engineer's site from a weak one, and the one most often done badly.

## 2. Scope

**In scope:** `/projects` index, `/projects/[slug]` case study template, the case-study content structure, and filtering.

**Out of scope:** the content of specific projects (owner-authored), homepage surfacing (PRD 03).

## 3. Requirements

### 3.1 Projects index — `/projects`

- Page heading plus a one-sentence framing line.
- A grid of project cards sourced from `getAllProjects()`, sorted by `order` then `timeframe` descending.
- Each card: title, `summary`, `stack` badges, `status` indicator, and `timeframe`. Whole card links to the case study.
- Archived projects render in a visually de-emphasized state but remain present. Hiding old work loses evidence of range.

**Filtering by technology:**

- Derived from the union of all `stack` values; not hardcoded.
- URL-driven via a query parameter (`/projects?tech=typescript`) so filtered views are linkable and survive a reload.
- Implemented so the **unfiltered page is fully server-rendered**. Filtering may use a small client component, but with JavaScript disabled the page shows all projects rather than none.
- An active filter is announced to assistive technology via a live region stating the result count.
- A visible "Clear filter" control appears whenever a filter is active.
- If a filter yields zero results — only possible via a hand-edited URL — an empty state explains this and offers a reset.

### 3.2 Case study — `/projects/[slug]`

Statically generated for every slug from `getAllProjectSlugs()`. Unknown slugs return a proper 404.

**Header block:** title, `timeframe`, `role`, `status`, `stack` badges, and links (`live`, `source`, `writeup`) as buttons. Links to external sites carry `rel="noopener noreferrer"` and are marked as external.

**Metrics band:** when `metrics` are present, they render as a prominent row. Metrics are the fastest credibility signal available to Persona B — "p95 340ms → 90ms" communicates more than a paragraph.

**Body:** authored MDX, rendered through `Prose` (PRD 01) with the overrides from PRD 02. The template does not enforce a section structure at build time, but the authoring guide (§3.3) specifies the expected shape, and empty case studies are caught in review rather than by the compiler.

**On-page navigation:** case studies longer than roughly 1,200 words get a table of contents built from `h2`/`h3` elements. On large viewports it is a sticky sidebar; on small viewports, a collapsible disclosure above the body. The TOC is generated from the rendered heading tree — never hand-maintained in frontmatter.

**Footer:** previous/next project navigation and a contact CTA.

### 3.3 Case study authoring structure

Every case study is expected to cover, in order:

1. **Context** — what the system is, who uses it, why it existed. Two to four sentences.
2. **Problem** — the specific technical problem, with the constraint that made it hard. Vague problems produce vague case studies.
3. **Approach** — what was built and how it works. An architecture diagram is strongly encouraged.
4. **Tradeoffs** — what alternatives were considered and _why they were rejected_. **This is the most important section**; it is the primary evidence of engineering judgment and the one Persona B reads most closely.
5. **Outcome** — measurable results where they exist. Honest qualitative results where they do not. Do not invent numbers.
6. **What I'd do differently** — retrospective judgment. Optional but high-signal; willingness to critique one's own work reads as senior.

A template lives at `docs/templates/project.mdx` so a new case study starts from this skeleton.

**Confidentiality:** every project sets `confidentialityReviewed: true` (enforced by PRD 02) only after the author has confirmed it contains no employer-confidential architecture, metrics, customer names, or unreleased roadmap detail. When in doubt, describe the problem shape without proprietary specifics. This addresses Risk Q4 in PRD 00.

### 3.4 Media

- All images through `next/image` with explicit dimensions and meaningful `alt`.
- Architecture diagrams **must** be legible in both light and dark themes. Preferred: inline SVG using CSS-variable colors, or Mermaid rendered at build time. A dark-only PNG that becomes an unreadable dark rectangle on a light background is a defect.
- Diagrams conveying information require a text description — either descriptive `alt` or adjacent prose. A diagram whose content exists nowhere in text is inaccessible.
- Video demos, if any, are muted, loop, carry no autoplaying audio, and are lazy-loaded below the fold.

## 4. Acceptance criteria

- [ ] `/projects` renders every non-archived project with JavaScript disabled.
- [ ] Filtering updates the URL, and reloading a filtered URL reproduces the same view.
- [ ] With JavaScript disabled, `/projects` shows all projects rather than an empty grid.
- [ ] Filter result counts are announced via a live region.
- [ ] Every project slug produces a statically generated page; an unknown slug returns 404.
- [ ] A case study over 1,200 words renders a TOC whose links jump to the correct headings.
- [ ] Every architecture diagram is legible in both themes.
- [ ] No case study ships with `confidentialityReviewed: false`.
- [ ] Prev/next navigation is correct at the boundaries (first project has no "previous").
- [ ] Every image has non-empty `alt`, except purely decorative images which use `alt=""`.

## 5. Open questions

- Minimum project count for launch: three strong case studies beat eight thin ones. Recommendation: do not launch this section with fewer than two complete case studies.
- Whether to include a "side projects" tier with lighter treatment. Deferred to v2.
