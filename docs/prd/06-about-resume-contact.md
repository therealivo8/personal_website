# PRD 06 — About, Résumé & Contact

**Status:** Draft
**Phase:** MVP
**Depends on:** 01
**Blocks:** —

---

## 1. Problem

These three pages close the loop for both primary personas. `/about` gives Persona C (and any human) a reason to trust the person behind the work. `/resume` gives Persona A the artifact they actually need to move a candidate forward. `/contact` is where a positive evaluation converts into a message — and if it has friction, the entire site's value leaks out at the last step.

## 2. Scope

**In scope:** `/about`, `/resume`, `/contact`, and the contact form's server action.

**Out of scope:** newsletter signup (v2, PRD 08).

---

## 3. About — `/about`

### 3.1 Requirements

Long-form, first-person, and genuinely written — not a résumé restated in prose.

Suggested structure:

1. **Now** — current role, what is being worked on, what is interesting about it.
2. **Path** — career narrative. How the person got here and what shaped their approach. This is where Persona C forms an impression.
3. **How I work** — engineering values stated concretely. "I write tests before I write the code that needs them" is useful; "I value quality" is not.
4. **Outside work** — brief, human, optional. One short paragraph.
5. **Elsewhere** — profile links, speaking, open source.

Authored as MDX so it can use `Prose` and callouts, and edited without touching JSX. An optional portrait uses `next/image` with meaningful `alt`.

Length target: 400–800 words. Long enough to be real, short enough to be read.

### 3.2 Acceptance criteria

- [ ] Content is authored in MDX, not hardcoded in a component.
- [ ] Exactly one `<h1>`; heading levels descend without skipping.
- [ ] Measure is capped at ~68 characters.
- [ ] Renders fully with JavaScript disabled.

---

## 4. Résumé — `/resume`

### 4.1 Requirements

Two representations, one source of truth where practical:

**Web version** — a real HTML page, not an embedded PDF viewer. PDF embeds are slow, unreadable on phones, invisible to search engines, and hostile to screen readers. Persona A is frequently on mobile.

Structure: name and contact header; a two-to-three sentence summary; experience (company, title, dates, and 3–5 outcome-oriented bullets each); selected projects linking into `/projects`; skills grouped by category; education; and optionally certifications, talks, or publications.

Data lives in `content/resume.ts` as a typed structure validated by Zod, so the page is a pure render of data. Dates render in `<time>` elements. Experience bullets emphasize outcomes over responsibilities.

**PDF version** — `public/resume.pdf`, downloadable from a prominent button on this page, from the homepage hero, and from the footer. The link states that it is a PDF and includes the file size, so nobody is surprised by the download.

The PDF is maintained separately in v1 (see PRD 00, Q5). Generating it from `resume.ts` is a v2 candidate. **A stale PDF that disagrees with the web version is a correctness bug** — a checklist item in `docs/RELEASE.md` requires updating both together.

**Print stylesheet** — `@media print` rules so browser-printing `/resume` produces a clean document: no header, footer, nav, or theme toggle; black text on white; URLs for links expanded via `content: attr(href)`; no page breaks inside a job entry.

### 4.2 Acceptance criteria

- [ ] The web résumé is semantic HTML, fully readable at 375px width.
- [ ] It is generated from typed data, not hand-written JSX per job.
- [ ] The PDF link is present on `/resume`, the homepage, and the footer, and states type and size.
- [ ] Printing produces a clean single-column document with no site chrome.
- [ ] Dates use `<time datetime="...">`.
- [ ] The email address is a `mailto:` link and is also selectable as plain text.
- [ ] Content of the web version and the PDF match at release time.

---

## 5. Contact — `/contact`

### 5.1 Requirements

**Direct methods first.** The email address appears as plain text and a `mailto:` link above the form. Many recruiters will not use a form, and forcing them to is a lost lead. Profile links (LinkedIn, GitHub) also appear here.

**Form fields:** name (required, 1–100), email (required, valid), subject (optional, ≤ 150), message (required, 10–2000). A live character counter on the message field, announced politely to assistive technology.

**Accessibility and validation:**

- Every input has a real `<label>`; placeholders are never used as labels.
- The form works with JavaScript disabled via a progressively enhanced server action.
- Validation errors are associated with their inputs via `aria-describedby` and `aria-invalid`, and focus moves to the first invalid field on failed submission.
- Validation messages are specific: "Enter a valid email address," not "Invalid input."
- Success and failure states are announced through a live region, not conveyed by color alone.
- Submission is disabled while in flight, with a visible pending state.

**Server action:**

- Re-validates every field server-side with the same Zod schema used on the client. **Client-side validation is a convenience, never a trust boundary.**
- Sends mail through a transactional provider (Resend or equivalent) with the API key in a server-only environment variable. It must never reach the client bundle.
- Returns a typed result; the UI never exposes raw provider errors or stack traces to the user.

**Spam mitigation** (addressing PRD 00's spam risk):

- A honeypot field, visually hidden but not `display: none`, and excluded from the tab order. Submissions that fill it are silently accepted-and-discarded so bots receive no failure signal.
- A minimum time-to-submit threshold (a few seconds); faster submissions are treated as automated.
- IP-based rate limiting: a small number of submissions per address per hour.
- No CAPTCHA in v1 — it adds friction for Persona A and a third-party script. Revisit only if spam is proven to be a real problem in practice.

**Privacy:** a one-line note stating what happens to submitted data and that it is not added to any mailing list.

**Confirmation:** on success, an inline confirmation replaces the form with a clear message and expected response time. No redirect to a separate thank-you page — it loses context.

### 5.2 Acceptance criteria

- [ ] The email address is visible and copyable without submitting anything.
- [ ] The form submits successfully with JavaScript disabled.
- [ ] Server-side validation rejects payloads that bypass the client entirely.
- [ ] Every input has an associated `<label>`; no placeholder-as-label.
- [ ] Errors are programmatically associated with inputs, and focus moves to the first error.
- [ ] Success and error states are announced by a screen reader.
- [ ] A honeypot submission returns an apparent success and sends no mail.
- [ ] Rate limiting blocks submissions past the threshold.
- [ ] No provider API key appears in any client bundle.
- [ ] The form is fully operable by keyboard.

## 6. Open questions

- Which email address receives submissions (PRD 00, Q3).
- Whether to state a target response time explicitly. Recommendation: yes, and make it conservative.
