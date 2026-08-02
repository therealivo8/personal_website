# PRD 05 — Blog Index, Posts & Tags

**Status:** Draft
**Phase:** v1 (post-MVP)
**Depends on:** 01, 02
**Blocks:** —

---

## 1. Problem

Writing is the highest-leverage credibility signal an engineer controls: it demonstrates communication ability and depth simultaneously, and it is the main way people discover a personal site organically. But a blog is also the single largest ongoing maintenance commitment on the site, and an abandoned blog with three 2023 posts actively damages Goal G3.

Consequently: the blog ships in **v1, not MVP**, and only once there are at least three posts ready to publish. The infrastructure is built once, then left alone.

## 2. Scope

**In scope:** `/blog`, `/blog/[slug]`, `/blog/tags/[tag]`, and RSS.

**Out of scope:** search (v2, PRD 08), comments (non-goal), newsletter (v2).

## 3. Requirements

### 3.1 Blog index — `/blog`

- Heading and a one-line description of what is written about here.
- Posts from `getAllPosts()`, reverse-chronological.
- Each entry: title (linked), `publishedAt` in a `<time datetime>` element, `readingTime`, `description`, and tags.
- Tags on the index link to their tag pages.
- **Pagination is deferred until there are more than 30 posts.** Below that, one page is faster and better for both users and crawlers. When it becomes necessary, paginate at `/blog/page/[n]` with `rel="prev"`/`rel="next"` — not infinite scroll, which breaks linking and keyboard use.
- An empty state exists but should never appear in production, since the section only ships with posts.

### 3.2 Post — `/blog/[slug]`

Statically generated per slug. Unknown slugs 404.

**Header:** `<h1>` title, publication date, `readingTime`, tags, and "Updated on {date}" when `updatedAt` is present. Optional hero image.

**Body:** MDX through `Prose` with PRD 02's overrides. Measure capped at ~68 characters; body text at least 16px.

**Table of contents** for posts over ~1,200 words, on the same terms as PRD 04 §3.2.

**Footer:**

- Tags, linked to tag pages.
- Previous/next post navigation by publication date.
- A share affordance — a "Copy link" button and a plain link to share on the owner's preferred network. **No third-party share widgets**; they are tracking scripts wearing a button costume.

### 3.3 Tag pages — `/blog/tags/[tag]`

- Generated for every tag returned by `getAllTags()`.
- Lists matching posts using the same entry treatment as the index.
- `<h1>` reads "Posts tagged {tag}" with the post count.
- A link back to the full blog.
- Tags with zero published posts produce no page and 404 — this can happen when the only post carrying a tag is a draft.
- An optional `/blog/tags` index listing all tags with counts.

### 3.4 RSS — `/rss.xml`

- Valid RSS 2.0, generated at build time.
- The 20 most recent non-draft posts.
- Each item: title, absolute link, `description`, `pubDate` in RFC 822 format, and GUID.
- Full post content in `content:encoded`, with **absolute URLs for all images and links** — relative URLs break in every feed reader.
- Autodiscovery `<link rel="alternate" type="application/rss+xml">` in the document head on every page.
- Validates against the W3C Feed Validator.

### 3.5 Reading experience

- Code blocks: syntax highlighted at build time (PRD 02), horizontally scrollable within their own container, with a copy button and optional filename caption.
- Footnotes via `remark-gfm`, with bidirectional links between reference and definition.
- Headings carry stable anchor links, so deep links into a post survive.
- All content is server-rendered. The only client-side JavaScript in a post is the code copy button and the share button.

## 4. Acceptance criteria

- [ ] Every non-draft post has a statically generated page.
- [ ] Drafts are absent from the index, tag pages, RSS, and sitemap in a production build.
- [ ] `/rss.xml` passes the W3C Feed Validator.
- [ ] Every URL in the feed — links and image sources — is absolute.
- [ ] Feed autodiscovery is present in the head on every page.
- [ ] Dates render in a `<time datetime="...">` element with a machine-readable value.
- [ ] Tag pages exist for every tag with at least one published post, and only those.
- [ ] Posts render completely with JavaScript disabled.
- [ ] Code block horizontal scrolling never causes page-level horizontal scroll.
- [ ] Prev/next navigation is correct at both boundaries.

## 5. Open questions

- Post-slug URL shape: `/blog/[slug]` versus a dated `/blog/2026/[slug]`. Recommendation: undated. Dated URLs make older posts look stale and complicate updating evergreen content.
- Whether to cross-post to a third-party platform with a canonical link back. Deferred; the canonical tag support in PRD 07 makes it possible either way.
