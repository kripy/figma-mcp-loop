# Portfolio — Figma → static build (loop-verified)

Two things live here:
1. A **static HTML/CSS build** of the portfolio (`index.html` + `about.html`), generated from the
   Figma design and **pixel-diff verified** against the Figma frames (zero-dependency, like
   [`../positivus/`](../positivus/)).
2. The record of the **Figma reformat** that made the file loop-ready (below).

Next pass: `portfolio-sanity` — wire the sections into Sanity + Next.js, like
[`../positivus-sanity/`](../positivus-sanity/).

## Static build

```
portfolio/
├── index.html      # Home (nav, hero, logos, skills, latest work, clients, footer/contact)
├── about.html      # About (nav, pink header/bio, body w/ teal highlights, footer/contact)
├── blog.html       # The Journal (nav, photo hero banner, 2×3 post-tile grid, footer/contact)
├── article.html    # Single post (nav, header, featured image, prose + pull-quote, related, footer)
├── css/styles.css  # tokens (Epilogue + palette) → base → sections → blog → article → responsive
└── assets/         # SVG logos/icons + JPG/PNG photos, pulled from Figma via get_design_context
```

The **blog** page was built **Figma-first**: a `Post tile` component + `Blog/Desktop` route frame
were designed in Figma from the Tokens (see the reformat record below), then coded here and
pixel-diffed — the design-led half of the loop, end to end.

Design context (exact measurements + asset URLs) came from `get_design_context` on the route
frames; the numbers summed to the frame heights exactly (Home = 80 + 624 + 167 + 688 + 1016 + 676 +
669 = 3920px). CSS uses the token palette from the `🎨 Tokens` page (teal `#009379`, pink, neutrals)
and the Epilogue type ramp.

### Verification (loop)

Rendered headless and pixel-diffed against `get_screenshot` of the Figma route frames:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars \
  --window-size=1280,4300 --screenshot=build.png "file://$PWD/index.html"
```

- **Home** vs `Home/Desktop` (1280×3920): logos hairlines exact (704 / 869), submit button top
  within **8px** over a 3920px page (~99.8%). The only fixes the loop caught: footer textarea height
  (7 lines = 231px box, not 189) and border-box adding a few px on the logos/footer hairlines.
- **About** vs `About/Desktop` (1280×1927): pink header band 80→615 (Figma 80→616), both teal
  highlight lines within 2px.
- **Blog** vs `Blog/Desktop` (1280×2553): at first pass pink hero band **exact** (80→595), teal
  eyebrow + tag-pill rows within 1px, content height **exact** (2482). Responsive: 0 overflow at
  390 / 768px. *(The hero was then changed to a photo background —
  `jezael-melgoza.jpg` under a 50% black scrim, pink eyebrow, white title/subtitle — and the change
  was pushed back to the Figma `Blog/Desktop` frame via `upload_assets` + `use_figma`, so design and
  code stay in sync.)*
- **Article** vs `Article/Desktop` (1280×2931): **exact** — every teal landmark (tag, pull-quote,
  related-tile pills) at identical Y [160, 1229, 1724, 1960], related (cream) section top 1562, and
  content height 2860 all matched first pass. Responsive: 0 overflow at 390 / 768px.
- The residual "content-height is ~70px short" reading is a Figma **frame-edge artifact** (Figma's
  screenshot reports near-full-frame height); the real bottom content — the submit button — aligns.

### Responsive

Pragmatic fluid breakpoints (in `styles.css`, all `@media` — desktop rules untouched):
- **≤1024px:** padding shrinks to 40px; header/footer/about-header stack and centre; logos, skills,
  work rows and client cards wrap; fixed widths become `max-width` + fluid.
- **≤640px:** padding 20px; hero title 40px; work/skill/client cards go single-column with fluid
  square images.

Verified via the iframe harness (`docs/VERIFY.md` — headless Chrome clamps <500px): **0 overflowing
elements** at 390 / 768px on both pages (was 96 at 390px before). This is a graceful collapse of the
desktop layout, **not** a pixel-match of the Figma mobile frames (which use a hamburger nav, a
re-cased title, and a strict 2-col logo grid) — that fidelity is deferred to `portfolio-sanity`.

---

## Figma reformat record

## Source file

- **Figma file:** "Portfolio - MCP" — `fileKey 7ZkI83sSVEdHW2S03wYfai` (a `/design/` file, editable).
- A whimsical portfolio template. Font **Epilogue**. Two routes: **Home** (portfolio landing) and
  **About**.
- ⚠️ The repo dir is `portfolio/` (renamed from the original empty `saas-company/`) — the design
  turned out to be a portfolio, not a SaaS site. The first two files tried were Figma **Sites**
  (`/site/…`) files, which the design MCP tools don't support — only `/design/…` files work.

## What was reformatted (pragmatic pass)

Before: 2 pages — a `Cover` and a `Components` page (already decent: section components with
`Property=Desktop|Mobile` variants), plus a page literally named `Design` holding the assembled
pages. No token variables, no Tokens page, non-standard page/frame names.

After — **4 pages** matching our format:

| Page | Contents |
|---|---|
| `Cover` | Untouched (community thumbnail) |
| `🎨 Tokens` | New. `Tokens` variable collection (18 vars) + 8 text styles + a visual token sheet |
| `🧩 Components` | Renamed from `Components`. Section + atom components (variants left as-is) |
| `📐 Page Layouts` | Renamed from `Design`. The assembled full-page route frames, renamed to `Route/Section` |

**Note:** the assembled full pages already existed in the template (they were on the `Design` page),
so we renamed them rather than reconstructing from section instances — these are the real
designer-assembled layouts.

## Page Layouts — route frames

| Frame | Node ID | Size |
|---|---|---|
| `Home/Desktop` | `176:2329` | 1280 × 3920 |
| `Home/Mobile` | `176:2337` | 375 × 8074 |
| `About/Desktop` | `176:2345` | 1280 × 1927 |
| `About/Mobile` | `176:2350` | 375 × 3079 |

Home = Navigation → Header (hero "My awesome portfolio") → Logos → Latest work (skills + work
cards) → Clients → Contact ("Let's work together") → Footer.
About = Navigation → About header (bio) → Body → Contact → Footer.

## 🧩 Components — section component sets (Desktop / Mobile variants)

For the code pass, these are the building blocks (Desktop variant node IDs):

| Section | set | Desktop | Mobile |
|---|---|---|---|
| Navigation | `176:2288` | `33:559` | `55:1478` |
| Header (hero) | `176:2264` | `33:586` | `51:961` |
| Logos Section | `176:2121` | `179:1328` | `176:2119` |
| Video Section | `176:1816` | `33:3118` | `33:3664` |
| Skills Section | `176:1526` | `33:1136` | `51:1479` |
| Latest work Section | `170:2871` | `33:1331` | `51:1607` |
| About header | `176:1691` | `39:4631` | `51:2014` |
| Body | `176:1692` | `39:4713` | `75:1794` |
| Clients Section | `170:3844` | `33:1903` | `51:1853` |
| Footer | `176:1082` | `176:886` | `176:1081` |

Atoms: Button `33:3155`, Text input `33:3160`, Logo `33:555`, Menu `55:1472`, Work card `51:1500`,
Skill `176:1278`, Star / Rate stars, Author images, Image placeholder.

## 🎨 Tokens (`Tokens` collection, 18 variables)

Extracted from the file's actual usage:

**Colors**
| Variable | Value |
|---|---|
| `color/brand/primary` | `#009379` (teal) |
| `color/brand/accent` | `#f6dce9` (pink hero) |
| `color/neutral/0` | `#ffffff` |
| `color/neutral/50` | `#fffcf5` (cream) |
| `color/neutral/100` | `#f3f3f3` (input grey) |
| `color/neutral/900` | `#2d2d2d` (text) |
| `color/neutral/1000` | `#000000` |

**Type — text styles** (Epilogue): `type/hero` (SemiBold 80), `type/heading/h2` (SemiBold 32),
`type/heading/h3` (SemiBold 27), `type/subtitle` (SemiBold 20/30), `type/label` (Medium 24),
`type/body` (Regular 17/27), `type/body-sm` (Regular 16), `type/label-sm` (SemiBold 16).

**Spacing** (FLOAT): `spacing/2xs..4xl` = 4/8/12/16/24/32/48/64/96.
**Radius** (FLOAT): `radius/sm` = 1, `radius/pill` = 100.

## Flagged — manual / out of scope this pass

- **Rename component variants** to strict `Type/Variant` (kept `Property=Desktop|Mobile` to avoid
  breaking instances).
- **Bind existing nodes to the new variables** (tokens created + a swatch sheet binds them, but the
  section components still use raw hex/fonts). Rebinding every node is a large, higher-risk job.
- **Full Auto-Layout audit** across all components.

## Next pass — `portfolio-sanity`

Static build ✅ done (above). Remaining: create `examples/portfolio-sanity/` (Next.js + embedded
Sanity Studio), model the sections as Sanity content, render from the CMS reusing this `styles.css`,
and re-verify with the same pixel-diff — exactly like [`../positivus-sanity/`](../positivus-sanity/).
Route frames to diff against: `Home/Desktop` `176:2329`, `About/Desktop` `176:2345`.
