# PRD 08 — Analytics & v2 Enhancements

**Status:** Draft
**Phase:** v2 (post-launch)
**Depends on:** 07
**Blocks:** —

---

## 1. Problem

Two distinct post-launch concerns. First, without measurement there is no way to know whether Goal G1 is being met — whether recruiters reach the résumé, whether case studies are read. Second, there is a standing backlog of enhancements that would each dilute the MVP if pulled forward.

This PRD exists partly to be a **holding pen**: ideas recorded here are explicitly not in MVP, which is what keeps MVP shippable (PRD 00's over-engineering risk).

---

## 2. Analytics

### 2.1 Requirements

**Constraints, in priority order:**

1. No cookies, and no consent banner required. A cookie banner on a personal site is friction for Persona A and signals nothing good.
2. No personal data collection, no cross-site tracking, no fingerprinting.
3. Under 5 KB of JavaScript, loaded without blocking rendering.
4. Must not regress any PRD 07 budget. If it costs more than 2 Lighthouse points, it does not ship.

**Candidates:** Vercel Web Analytics (best integration if already hosting there), Plausible, or Umami. All are cookieless and privacy-preserving. Decision deferred to implementation.

**Events worth tracking** — deliberately minimal:

- Page views per route.
- Résumé PDF downloads. _The single most valuable signal on the site_: it means Persona A moved a candidate forward.
- Contact form submissions (count only, no content).
- Outbound clicks to GitHub and LinkedIn.
- Project case-study reads.

**Not tracked:** scroll depth, mouse movement, session recording, individual user journeys, anything resembling a per-visitor profile.

A `/privacy` page states plainly what is collected and what is not.

### 2.2 Questions the data should answer

- Do visitors reach `/resume`, or stop at the homepage? (Tests Goal G1.)
- Which projects get read? (Informs which work to write up next.)
- What fraction of `/contact` visits convert to a submission? (Detects friction at the final step.)
- Where does traffic come from — search, GitHub, LinkedIn, direct?

### 2.3 Acceptance criteria

- [ ] No cookies are set; no consent banner exists.
- [ ] Analytics script is under 5 KB and non-blocking.
- [ ] Lighthouse Performance stays ≥ 95 after integration.
- [ ] Résumé downloads and contact submissions are recorded.
- [ ] `/privacy` accurately describes the implementation.
- [ ] The site remains fully functional if the analytics script is blocked.

---

## 3. v2 enhancement backlog

Ordered by expected value. None are committed; each needs its own scoping before implementation.

| #   | Enhancement                           | Value  | Cost     | Notes                                                                                             |
| --- | ------------------------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------- |
| E1  | Blog search                           | Medium | Low      | Only worthwhile past ~20 posts. Client-side index over titles, descriptions, and tags.            |
| E2  | Résumé PDF generated from `resume.ts` | Medium | Medium   | Eliminates the stale-PDF defect class in PRD 06 §4.1.                                             |
| E3  | `/now` page                           | Low    | Very low | What is being worked on currently. Cheap, high personality, easy to let go stale.                 |
| E4  | `/uses` page                          | Low    | Very low | Tools and setup. Popular with engineers, irrelevant to recruiters.                                |
| E5  | Newsletter                            | Medium | Medium   | Only if writing cadence is established. Requires a provider and a privacy update.                 |
| E6  | Speaking / talks page                 | Medium | Low      | Only if there are talks to list.                                                                  |
| E7  | Reading list or book notes            | Low    | Low      | Ongoing maintenance burden.                                                                       |
| E8  | Web mentions                          | Low    | High     | Nice in principle; meaningful implementation and moderation cost.                                 |
| E9  | View counts on posts                  | Low    | Medium   | Requires a data store, which contradicts PRD 00's no-database non-goal.                           |
| E10 | Interactive demos in case studies     | High   | High     | Strongest possible signal for Persona B — but expensive and must not regress performance budgets. |
| E11 | Dedicated OG image per post           | Low    | Low      | PRD 07's generated templates already cover this adequately.                                       |

**Deliberately rejected**, not merely deferred:

- **Comments.** Moderation burden, spam, and no benefit to any target persona.
- **A chatbot trained on the résumé.** Novelty that undermines credibility with Persona A.
- **AI-generated blog posts.** The blog's entire value is evidence of the owner's thinking. Generated content destroys that value while appearing to add volume.
- **Auto-playing video or audio.** Hostile.
- **A cookie-consent banner.** Avoided by not using cookies in the first place.

## 4. Open questions

- Which analytics provider. Deferred to implementation; the constraints in §2.1 are what matter.
- Whether to publish traffic numbers openly. Owner's call.
