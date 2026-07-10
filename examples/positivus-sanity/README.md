# Positivus — Sanity + Next.js

The [`positivus`](../positivus/) example proves **Figma → code → diff**. This one adds the next
link: **plug that output into a CMS** so content becomes editable, without losing the pixel-verified
match.

It's the same page, rendered by Next.js (App Router) from Sanity content. **Every section** —
hero, services, CTA, case studies, process, team, testimonials, contact, footer — is wired through
Sanity → GROQ → React, and the full page is headless-diff verified against the original static build
at **zero pixel drift** (8317px, all 36 green-band landmarks aligned, max delta 0px).

## The core idea: the Figma format already maps onto Sanity

The "Figma format" in [`../../HANDOFF_TEMPLATE.md`](../../HANDOFF_TEMPLATE.md) separates exactly the
three concerns a CMS-backed frontend needs:

| Figma format page | Becomes | Lives in |
|---|---|---|
| `🎨 Tokens` (`color/`, `type/`, `spacing/`, `radius/`) | Design tokens → CSS custom properties | code (`src/app/globals.css`) |
| `🧩 Components` (`Type/Variant`, e.g. `Button/Primary`) | React components; **variant axes → Sanity enum fields** | code + `sanity/schemaTypes/` |
| `📐 Page Layouts` (`Route/Section`) | A page document with section content | Sanity content |

**Presentation lives in code, content + variant *choices* live in Sanity.** The Figma format is what
makes that split mechanical instead of guesswork.

### Variant axes become validated enum fields

The most useful consequence: a Figma component's variant axis becomes a constrained dropdown in the
CMS, so an editor **cannot** produce a card/button that doesn't exist in the design system.

| Figma variant | Sanity field (`options.list`) | CSS modifier |
|---|---|---|
| `Button/Style` | `button.style`: primary \| secondary \| accent | `.button--*` |
| `Link/Color` | `link.color`: dark \| light \| green | `.link--*` |
| `ServiceCard/Theme` | `serviceCard.theme`: grey \| green \| dark | `.service-card--*` |

See `sanity/schemaTypes/objects/button.ts`, `link.ts`, and `sanity/schemaTypes/serviceCard.ts`.

## Layout

```
positivus-sanity/
├── sanity.config.ts            # Studio config (singleton Homepage), mounted at /studio
├── sanity/schemaTypes/         # full content model for the page
│   ├── objects/                # button, link, navLink (reusable; carry variant enums)
│   ├── serviceCard.ts          # the wired slice — theme enum + titleLines + illustration + link
│   ├── caseStudy / processStep / teamMember / testimonial.ts
│   └── homePage.ts             # singleton document, one field group per section
├── src/
│   ├── app/
│   │   ├── globals.css         # verbatim copy of ../positivus/css/styles.css (verified)
│   │   ├── page.tsx            # Services from Sanity; other sections static JSX
│   │   └── studio/[[...tool]]/ # embedded Sanity Studio
│   ├── components/
│   │   ├── ServiceCard.tsx     # emits the exact `.service-card--{theme}` markup
│   │   └── sections/Services.tsx
│   └── sanity/                 # client, image url builder, GROQ queries, env
├── scripts/seed.ts             # uploads illustrations + creates the homePage doc
└── public/assets/              # copied from ../positivus/assets/
```

## Setup

Prereqs: Node 20+, a free Sanity account, and Google Chrome for the diff.

```bash
cd examples/positivus-sanity
npm install

# 1. Create (or reuse) a Sanity project — interactive, run it yourself:
npx sanity@latest login
npx sanity@latest init --project-plan free   # note the projectId + dataset

# 2. Configure env
cp .env.local.example .env.local              # fill in projectId / dataset
# add SANITY_API_TOKEN (dashboard → API → Tokens, Editor role) for the seed

# 3. Seed content (uploads illustrations + creates the homepage doc)
npm run seed

# 4. Run
npm run dev          # site at /, Studio at /studio
```

## Verify (same loop as the static example)

The pixel-diff loop from [`../../docs/VERIFY.md`](../../docs/VERIFY.md) works unchanged — just point
it at the dev server instead of a `file://` path:

```bash
npm run dev   # in one terminal
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars \
  --window-size=1440,9500 --screenshot=build.png \
  http://localhost:3000
```

Then `get_screenshot` the Figma Home frame and run the PIL band diff (green `#B9FF66`). The band
Y-coordinates should match the static baseline within a few px (the committed build matches at 0px).

**Proof it's genuinely CMS-driven:** in `/studio` → Homepage, change a Service card's **Theme**
dropdown (e.g. card 02 green → dark) and **Publish**, then reload `/` — the card background flips.
The variant choice lives in Sanity; the code just renders it. The same applies to every section's
text, links, team members, testimonials, etc.

## How the sections map

The whole page renders from the `homePage` singleton (`homePage.ts`, one field group per section):

- **Scalar text** (hero/CTA/intro headings + descriptions, contact, footer) → string/text fields,
  read in the GROQ query and rendered directly in `src/app/page.tsx`.
- **Repeatable items** (services, case studies, process steps, team, testimonials) → arrays of the
  object types in `sanity/schemaTypes/`, mapped to markup in `page.tsx` (services/testimonials have
  their own components: `Services.tsx`, `TestimonialsCarousel.tsx`).
- **Variant axes** (button style, link color, service-card theme) → enum fields → CSS modifiers.

To add a new section, mirror that pattern: schema field group → GROQ projection → render in
`page.tsx` (reusing the existing BEM classes) → re-run the diff to confirm bands stay put.

## Notes

- CSS is the pixel-verified `styles.css`, imported globally and unchanged; components emit the same
  BEM class names, so the rendered HTML matches the static build.
- Image sizing matters for the diff: service illustrations (210px sources) are served at 2× for
  retina; team photos (~103px sources) are served at native size — upscaling them spreads the
  green-leaf antialiasing and adds spurious band edges. Match the source resolution.
- Licensing is unchanged from the static example — see [`../positivus/NOTICE.md`](../positivus/NOTICE.md).
  The Positivus design is © Olga Averchenko, CC BY 4.0.
```
