# Positivus — Figma-to-Code Build

A hand-built HTML/CSS implementation of the Positivus digital-marketing landing page,
generated from a Figma design file via the Figma MCP server and verified against it
with an automated pixel-diff loop.

- **Original design:** ["Positivus Landing Page Design"](https://www.figma.com/community/file/1230604708032389430) by **Olga Averchenko** on Figma Community, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — see [`NOTICE.md`](NOTICE.md)
- **Figma file key:** `49W8xQX6NoqxJrIvEqGprn`
- **Source of truth:** Home frame `1904:746` (1440 × 8356), Components page `403:244`
- **Stack:** plain HTML + CSS, zero dependencies. One 5-line script for the testimonial carousel.
- **Verified match:** rendered page is 8317px vs design's 8356px (99.5%), all section landmarks aligned.

## Structure

```
positivus/
├── index.html        # entire page, semantic markup
├── css/styles.css    # tokens → base → components → sections → responsive
└── assets/           # SVGs (icons/logos/illustrations) + PNGs (photos/raster art)
```

## How it maps to Figma

| Figma | Code |
|---|---|
| Variables (colors, radii) | CSS custom properties in `:root` |
| Button component (Style=Primary/Secondary/Accent) | `.button--primary/--secondary/--accent` |
| Heading component (Theme=Green/White/Black) | `.tag`, `.tag--white` |
| Link component (Type/Color variants) | `.link--dark/--light/--green` |
| Plus Icon (State=Open/Closed) | pure-CSS `.plus-icon` on `<details>` |
| Process accordion | native `<details>/<summary>` — no JS |
| Speech-bubble tails, dividers, radio buttons | recreated in CSS, not images |

Signature card style used throughout:
`border: 1px solid #191A23; border-radius: 45px; box-shadow: 0 5px 0 0 #191A23`

## Design tokens

- **Font:** Space Grotesk (400/500, Google Fonts)
- **Type scale:** h1 60 / h2 40 / h3 30 / h4 20 (Medium), body 18
- **Colors:** Green `#B9FF66`, Dark `#191A23`, Grey `#F3F3F3`, footer panel `#292A32`, placeholder `#898989`
- **Layout:** 1240px content + 100px side padding (1440 design width); sections 140px apart, intro→block 80px
- **Responsive:** breakpoints at 1200 / 1024 / 768px, derived from the desktop spec (no mobile frames in Figma)

## Verification workflow

Renders are compared against Figma programmatically — no eyeballing:

1. `Google Chrome --headless --screenshot --window-size=1440,9500 index.html`
2. Figma MCP `get_screenshot` of the Home frame at natural resolution
3. Python/PIL: locate section bands by brand color, diff Y-positions against
   `get_metadata` coordinates, build side-by-side slice composites
4. For layout debugging: inject a probe script logging `getBoundingClientRect`,
   then `--dump-dom` and grep
5. For mobile widths: headless Chrome silently clamps windows to 500px wide, so
   embed the page in a fixed-width `<iframe>` harness (430/393/375/360px) and run
   the overflow probe from the parent frame (needs `--allow-file-access-from-files`).
   Flag any element with `rect.right > innerWidth` or `rect.left < -1`, ignoring
   the testimonial carousel's intentional `overflow-x: auto` track

This loop caught the three worst bugs: a `*/` sequence inside a CSS comment that
silently swallowed the `.section` margin rule (−840px of page height), a
margin-collapse on the CTA card, and a 9px horizontal overflow at phone widths
(service-card illustration was `flex-shrink: 0`, making the page pannable in
device mode — fixed by letting it shrink below 165px).

## Known deviations from the Figma file

- **Process cards 02–06 body copy is invented** — the file only contains card 01's
  description. Replace with real copy.
- **Team→Testimonials gap is 140px in code, 208px in Figma** — every other section
  gap in the file is exactly 140; treated as a file inconsistency pending a fix.
- **Testimonials repeat the same John Smith quote ×3** — faithful to the file.
- **Raster images are 1x** (hero, services, team photos) — the MCP screenshot tool
  caps at 1x; slightly soft on retina until 2x exports are added in Figma.

## Outstanding Figma to-dos

1. Flatten each partner logo (Amazon, HubSpot fragments) into one named layer
2. Add real body copy to Process cards 02–06
3. Split footer social icons into components (`Platform=LinkedIn/Facebook/Twitter`)
4. Add 2x PNG export settings to raster nodes (hero, services, team pictures)
5. Fix the 208px Team→Testimonials gap (or confirm it's intentional)

After these land, re-pull the affected assets and delete the logos-bar inline
inset positioning in `index.html`.
