# portfolio-payload

The **whole** `examples/portfolio/` site wired into **Payload CMS** (Payload 3, embedded in Next.js,
SQLite). Every page — Home, About, Blog, Article — is rendered from CMS content instead of hardcoded
HTML, and every page is pixel-verified against the static (already Figma-verified) portfolio.

This is the Payload counterpart to `examples/positivus-sanity/`: same loop, different CMS. Where
Sanity is hosted, Payload self-hosts inside the Next.js app with a local SQLite file — zero external
infrastructure to boot.

## What's CMS-driven

- **`/`** — Home. Hero, skills, "latest work" cards, and client quotes, from the `home` global.
- **`/about`** — About. Persona card, bio, and body paragraphs, from the `about` global.
- **`/blog`** — the Journal listing. Tiles from the `posts` collection, newest first.
- **`/posts/[slug]`** — article page. Header, featured image, Lexical rich-text body, and a
  "More from the journal" strip of the 3 next-newest posts.
- **`/work/[slug]`** — case-study pages built from a `case-studies` collection with a flexible
  **blocks** layout. The Home "latest work" cards link straight to them. Seeded with six fictional
  projects (named to match the cards, e.g. `/work/free-bird`); the template is pixel-matched to the
  static `examples/portfolio/free-bird.html`.
- The shared footer message comes from the `site-settings` global; **`/admin`** is the Payload UI.

The only things left hardcoded are true chrome, not content: the nav structure and the footer social
icons (fixed SVG assets). The original "featured on" logo strip was removed from both this port and the
static `examples/portfolio/index.html`.

## Data model

**Collections** (`src/collections/`):
- `posts` — `title`, `slug` (auto from title), `tag`, `excerpt`, `thumbnail` (upload → `media`,
  340×220), `featuredImage` (1080×480), `author`, `publishedDate`, `readingTime`, `body` (Lexical).
- `case-studies` — `title`, `slug`, `subtitle`, `intro`, `services[]`, `ctaHeading`/`ctaAccent`, and a
  `layout` **blocks** field with four block types: `media` (variant phones/wide/tall × white/cream),
  `split` (two labelled columns), `quote`, and `chapter` (title + paragraphs). Reorder/add sections
  in `/admin`.
- `media`, `users` — supporting.

**Globals** (`src/globals/`):
- `home` — `hero` group, `skills[]`, `work[]` (title/artist/image), `clients[]` (quote/name/company/avatar).
- `about` — `persona` group, `bio`, `lead`, `lines[]` (with a `highlight` flag for the teal/pink style).
- `site-settings` — `footerHeading`, `footerBody`.

## Run it

```bash
npm install
npm run seed     # SQLite schema + admin user + 6 posts + home/about/site-settings globals + images
npm run dev      # http://localhost:3000  (admin at /admin)
```

Default admin from the seed: `admin@example.com` / `changeme123` (override with `SEED_EMAIL` /
`SEED_PASSWORD`). Config lives in `.env` (copy from `.env.example`) — `DATABASE_URI` points at the
local `portfolio.db`, `PAYLOAD_SECRET` is a random hex string.

`npm run seed` is idempotent — it wipes `posts` + `media`, re-uploads all images (deduped by
filename), re-creates the posts, and repopulates the three globals. Re-run it any time to reset.

## How it matches the design

Pages reuse `examples/portfolio`'s CSS verbatim (copied to `src/app/(frontend)/portfolio.css`) and the
same asset files (`public/assets/`). Two CMS-specific CSS additions bridge the gap:

1. The Lexical `RichText` component wraps its output in `.payload-richtext`, so that wrapper re-creates
   the article body's flex column + `28px` gap to preserve vertical rhythm.
2. Plain `h2` / `blockquote` / `a` inside the article body are styled to match the static
   `.article-body__sub` / `.article-pullquote` classes.

Pages are `force-dynamic` and read through Payload's local API on every request, so admin edits show up
immediately (no cache to bust).

## Verification

Rendered with headless Chrome at 1280px wide and PIL-diffed against the static portfolio (which is
itself pixel-verified against the Figma route frames):

| Page | Mean abs pixel diff (/255) |
|---|---|
| `/` (Home) | ~0.04 |
| `/about` | ~0.07 |
| `/blog` | ~0.05 |
| `/posts/designing-with-unicorns` | ~0.06 |
| `/work/[slug]` | ~0.00 vs static `free-bird.html` (same template; CSS placeholders, no image re-encode) |

Layout is pixel-identical on every page (best vertical alignment is 0px); the residual is JPEG
re-encode noise inside images (sharp re-encodes uploads) plus a few sub-pixel rows in the footer.
**Edit-through verified** for both collections (post excerpt) and globals (footer heading): an API
update appears on the live page on the next request.

Two things surfaced during verification and were fixed:
- The Lexical `RichText` wrapper spacing (see above) — dropped the article diff from 15.8 → 0.06.
- The static `examples/portfolio/index.html` was requesting Epilogue `400;500;600` (no `700`) while
  its sibling pages request `700`. The hero `<h1>` inherits the browser-default `700`, so it rendered
  as *faux-bold* only on Home. Added `700` to `index.html` (matching about/blog) so the baseline is
  consistent and both sides render real Epilogue Bold.
