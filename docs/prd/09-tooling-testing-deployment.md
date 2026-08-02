# PRD 09 — Tooling, Testing & Deployment

**Status:** Draft
**Phase:** MVP
**Depends on:** 01
**Blocks:** —

---

## 1. Problem

PRD 07 sets quality budgets. Budgets that are not enforced automatically decay — a personal site is worked on intermittently, often months apart, and by launch-plus-six-months nobody remembers which invariants mattered. Automation is what makes the standards survive the gaps between sessions.

The testing strategy is deliberately thin: this is a static content site with very little logic. Over-testing it is its own failure mode. Test the things that actually break.

## 2. Requirements

### 2.1 Local tooling

**Scripts:**

| Script          | Purpose                                                      |
| --------------- | ------------------------------------------------------------ |
| `dev`           | Development server                                           |
| `build`         | Production build (runs `content:check` first)                |
| `start`         | Serve the production build locally                           |
| `lint`          | ESLint                                                       |
| `format`        | Prettier write                                               |
| `format:check`  | Prettier check                                               |
| `typecheck`     | `tsc --noEmit`                                               |
| `test`          | Vitest unit tests                                            |
| `test:e2e`      | Playwright                                                   |
| `content:check` | Content validation (PRD 02 §3.6)                             |
| `check`         | `typecheck && lint && format:check && content:check && test` |

**ESLint:** `next/core-web-vitals`, TypeScript rules, and `eslint-plugin-jsx-a11y` in error mode. The a11y plugin catches a meaningful share of PRD 07 §2.5 violations at authoring time, which is far cheaper than catching them in CI.

**Prettier** with the Tailwind class-sorting plugin, so class order never appears in diffs as noise.

**Git hooks** via Husky + lint-staged: format and lint staged files on commit; run `typecheck` and `content:check` on pre-push. Hooks stay fast — anything slower than a few seconds gets bypassed and is therefore worthless.

**`.env.example`** documenting every environment variable. Real `.env*` files are gitignored. The only secret in MVP is the transactional email API key (PRD 06).

### 2.2 Testing

**Unit tests (Vitest)** — for logic that can actually be wrong:

- Content loaders: sorting, draft filtering, slug resolution, tag aggregation.
- `readingTime` computation, including the minimum-of-1 boundary.
- Frontmatter schema validation: valid input passes, each invalid case fails with a useful message.
- Date formatting.
- RSS generation: well-formed output, absolute URLs.

**Not unit tested:** component rendering snapshots. They break on every design change and catch nothing.

**E2E smoke tests (Playwright)** — the flows whose breakage would be embarrassing:

1. Homepage loads; hero, name, and CTAs are visible.
2. Navigation reaches every top-level route.
3. A project card leads to its case study, which renders content.
4. A blog post renders with highlighted code.
5. The résumé page loads and the PDF link resolves (HTTP 200).
6. The contact form submits successfully and shows a confirmation (against a mocked provider).
7. The theme toggle switches themes and survives a reload with no flash.
8. The mobile menu opens, traps focus, and closes on `Escape`.

**Accessibility tests** — `@axe-core/playwright` on every primary route, in **both themes**, asserting zero serious or critical violations. This is the automated half of PRD 07 §2.5; the manual screen-reader pass remains a release checklist item.

**Performance tests** — Lighthouse CI against the production build on `/`, `/projects`, a project page, `/blog`, a post, and `/resume`, asserting PRD 07 §2.4's budgets. Failing the budget fails the build.

### 2.3 CI

GitHub Actions on every push and pull request:

1. Install dependencies (cached).
2. `typecheck`, `lint`, `format:check`, `content:check` — parallel where possible.
3. Unit tests.
4. Production build.
5. Playwright e2e + axe against the built output.
6. Lighthouse CI against the built output.

CI must complete in under 5 minutes; beyond that it stops being run before merging. A red CI blocks merge to `main`.

### 2.4 Deployment

- **Vercel**, connected to the GitHub repository.
- `main` deploys to production. Every pull request gets a preview deployment — the primary review mechanism for a visual project.
- Environment variables set in the Vercel dashboard, scoped so the email API key is server-only and never exposed via a `NEXT_PUBLIC_` prefix.
- Custom domain with automatic TLS; `www` and apex resolve consistently, one permanently redirecting to the other.
- Security headers in `next.config.ts`: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and a `Content-Security-Policy`. The CSP must be verified against the theme script from PRD 01 (which needs a nonce or hash) and against any analytics script from PRD 08.
- Rollback is a Vercel instant rollback to the previous deployment.

### 2.5 Documentation

- `README.md` — what this is, how to run it, how to add a post or project, how to deploy.
- `docs/CONTENT.md` — the authoring guide: frontmatter reference, available MDX components, image conventions.
- `docs/RELEASE.md` — pre-launch and pre-release checklist, including the manual screen-reader pass and the résumé PDF/web parity check from PRD 06 §4.1.
- `docs/templates/` — `post.mdx` and `project.mdx` skeletons.

## 3. Acceptance criteria

- [ ] `npm run check` passes on a clean clone.
- [ ] CI runs on every push and PR and completes in under 5 minutes.
- [ ] A PR that introduces a serious axe violation fails CI.
- [ ] A PR that pushes a route past its JS budget fails CI.
- [ ] A PR with invalid frontmatter fails CI.
- [ ] Every PR produces a working preview deployment.
- [ ] `main` auto-deploys to production.
- [ ] No secret is present in the client bundle or in git history.
- [ ] Security headers are present on production responses and verified.
- [ ] A fresh clone can be run locally using only `README.md`.

## 4. Open questions

- Whether Lighthouse CI belongs on every PR or only on `main`. Recommendation: every PR, since a regression is far cheaper to fix before merge.
- Domain registrar and DNS provider (PRD 00, Q1).
