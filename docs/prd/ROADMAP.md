# Implementation Roadmap

Sequencing for the PRDs in this directory. See [00-overview.md](./00-overview.md) for context.

---

## Phase 0 — Foundation

| PRD                                                | Deliverable                                                         |
| -------------------------------------------------- | ------------------------------------------------------------------- |
| [01](./01-foundation.md)                           | Next.js app, design tokens, UI primitives, header/footer, dark mode |
| [09](./09-tooling-testing-deployment.md) (partial) | Scripts, ESLint/Prettier, git hooks, CI skeleton, Vercel connection |

**Exit:** `npm run check` passes, the app deploys to a Vercel preview, and the layout is keyboard-navigable in both themes.

Doing PRD 09's tooling here rather than at the end means every later phase is checked as it lands, instead of accumulating debt that gets "cleaned up" never.

## Phase 1 — Content layer

| PRD                            | Deliverable                                                                 |
| ------------------------------ | --------------------------------------------------------------------------- |
| [02](./02-content-pipeline.md) | Content directories, Zod schemas, loader API, MDX pipeline, `content:check` |

**Exit:** a sample post and project render locally with highlighted code; invalid frontmatter fails the build.

## Phase 2 — MVP pages

| PRD                                | Deliverable                          |
| ---------------------------------- | ------------------------------------ |
| [03](./03-homepage.md)             | Homepage                             |
| [04](./04-projects.md)             | Projects index + case study template |
| [06](./06-about-resume-contact.md) | About, Résumé, Contact               |

Buildable in parallel once Phase 1 lands — they share primitives but not each other's code.

**Exit:** every MVP route renders real content and the site is navigable end to end.

## Phase 3 — Content authoring

Not a PRD, and the phase most likely to be underestimated. **The bottleneck for launch is writing, not code.**

- Two to three complete project case studies following PRD 04 §3.3, each confidentiality-reviewed.
- About page, 400–800 words.
- Résumé data plus a matching PDF.
- Real portrait and diagrams, if used.

**Exit:** zero placeholder text anywhere on the site.

## Phase 4 — Quality gates

| PRD                                             | Deliverable                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| [07](./07-seo-performance-a11y.md)              | Metadata, OG images, JSON-LD, sitemap, robots, budgets              |
| [09](./09-tooling-testing-deployment.md) (rest) | Unit tests, Playwright + axe, Lighthouse CI, security headers, docs |

**Exit:** all PRD 07 acceptance criteria pass in CI. Manual screen-reader pass complete.

## Phase 5 — Launch

- Domain configured; `metadataBase` and canonicals point at the real origin (PRD 00, Q1).
- `docs/RELEASE.md` checklist complete.
- Sitemap submitted to Google Search Console.
- Site URL added to GitHub profile, LinkedIn, and email signature.

**Exit:** production is live on the custom domain and indexed.

## Phase 6 — Blog

| PRD                | Deliverable                  |
| ------------------ | ---------------------------- |
| [05](./05-blog.md) | Blog index, posts, tags, RSS |

Deliberately after launch. Per PRD 05 §1, this ships only once **three posts are ready** — an empty blog is worse than no blog. The homepage's writing section (PRD 03 §3.3) stays hidden until then, which is why it was specified to omit itself when empty.

## Phase 7 — Post-launch

| PRD                            | Deliverable                                     |
| ------------------------------ | ----------------------------------------------- |
| [08](./08-analytics-and-v2.md) | Analytics, then backlog items by measured value |

Let real traffic decide what to build next rather than guessing.

---

## Dependency graph

```
01 ──┬── 02 ──┬── 03
     │        ├── 04
     │        └── 05 (Phase 6)
     ├── 06
     └── 09

03, 04, 06 ── 07 ── 08
```

## Critical path to launch

`01 → 02 → 04 → content authoring → 07 → launch`

Content authoring is on the critical path and has no code dependencies. **Start writing case studies during Phase 0** — they can be drafted before there is anything to render them.

## Blocking questions

| Question                      | Blocks                            | Needed by |
| ----------------------------- | --------------------------------- | --------- |
| Domain name (Q1)              | Canonical URLs, sitemap, RSS, DNS | Phase 4   |
| Contact email (Q3)            | Contact form delivery             | Phase 2   |
| NDA-constrained projects (Q4) | Case study content                | Phase 3   |
