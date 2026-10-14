# figma-mcp-loop

**Figma → code → headless browser → diff → repeat.** A complete feedback loop for AI-generated frontends, with no human in the visual-comparison cycle.

The bottleneck in Figma-to-code isn't generation anymore. It's verification. This repo shows what changes when you close the loop:

- **Figma MCP** gets the design in
- **Claude Code** writes the HTML/CSS
- **Headless Chrome** renders the build
- **Pixel diff** compares the render against the Figma frame and reports offsets in coordinates, not vibes

On the Positivus landing page included as a worked example, the loop produced an 8317px render against an 8356px design — a 99.5% match, zero JS dependencies, one 5-line script for the carousel — and caught three bugs eyeballs would have missed (see `examples/positivus/README.md`).

---

## What's in here

```
figma-mcp-loop/
├── HANDOFF_TEMPLATE.md         # designer-facing spec: how to prepare a Figma file
├── examples/
│   ├── positivus/              # worked example: landing page built from a Figma file (zero-dep)
│   ├── positivus-sanity/       # the same page wired into Sanity + Next.js (CMS-driven, 0px drift)
│   ├── portfolio/              # full front-to-back demo (see its README)
│   │   │                       #   • Figma file reformatted to the HANDOFF format via Figma MCP
│   │   │                       #   • Home / About / Blog / Article coded static pages, pixel-verified
│   │   │                       #   • responsive; blog + article were built Figma-first then coded
│   │   ├── index.html  about.html  blog.html  article.html
│   │   ├── css/  assets/
│   │   └── README.md
│   └── portfolio-payload/      # the whole portfolio wired into Payload CMS (Payload 3 + Next.js + SQLite)
│       │                       #   • Home/About via globals, Blog/Article via collections
│       │                       #   • self-hosted, zero external infra; every page pixel-verified
│       └── README.md
└── docs/
    └── VERIFY.md               # the loop, step by step (commands you can paste)
```

Each example has its own README with build notes, the Figma↔code mapping, and verification results.
Together they show the loop end to end — **reformat Figma → generate code → pixel-diff → wire a CMS** —
and the same page proven against two different CMSes (Sanity, hosted; Payload, self-hosted).

## The loop, in one screen

```
┌─────────────┐    ┌─────────────┐    ┌───────────────┐    ┌────────────┐
│  Figma file │───▶│ Claude Code │───▶│ Headless      │───▶│ Pixel diff │
│             │    │ + Figma MCP │    │ Chrome render │    │ vs Figma   │
└─────────────┘    └─────────────┘    └───────────────┘    └─────┬──────┘
       ▲                                                          │
       │                       offsets / overflow / missing rules │
       └──────────────────────────────────────────────────────────┘
                              feed back into next iteration
```

## Why this matters

Two things changed that make this loop practical:

1. **Figma MCP** exposes design files as structured data — frame names, variables, Auto Layout values — instead of pixels. Claude reads the design like a developer reads a spec.
2. **Headless Chrome** lets Claude drive the browser, so the agent can verify its own output without a human in the loop.

Take either away and you're back to "looks about right." Together you get a feedback loop that converges on a match instead of drifting toward one.

## Getting started

1. **Start from the Figma file** — duplicate the [Figma MCP Loop](https://www.figma.com/community/file/1649213954960222549/figma-mcp-loop) Community template. Page structure, naming conventions, and example components are already wired up
2. Open the [worked example](examples/positivus/README.md) to see what a finished pass looks like
3. Read [`HANDOFF_TEMPLATE.md`](HANDOFF_TEMPLATE.md) — the designer-facing spec. A clean Figma file is the single biggest factor in first-pass accuracy
4. Read [`docs/VERIFY.md`](docs/VERIFY.md) — the verification loop with copy-pasteable commands

## Requirements for the loop itself

- [Claude Code](https://claude.com/claude-code)
- [Figma MCP server](https://www.figma.com/blog/introducing-figmas-dev-mode-mcp-server-beta/) configured in Claude Code
- Google Chrome (for `--headless --screenshot`)
- Python 3 with Pillow (for the diff harness)

## Credits

The Positivus example design — including all assets in `examples/positivus/assets/` — is a Figma Community template by **Olga Averchenko**, used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The original Figma file is the **"Positivus Landing Page Design"** on Figma Community.

Changes from the original: the design was implemented as HTML/CSS; copy in process cards 02–06 is invented (the original only defines card 01).

## License

- **Code** (HTML, CSS, scripts, docs) — MIT, see [`LICENSE`](LICENSE).
- **Positivus design assets** (`examples/positivus/assets/` and the visual design in `examples/positivus/index.html` / `css/styles.css`) — CC BY 4.0, © Olga Averchenko. See [`examples/positivus/NOTICE.md`](examples/positivus/NOTICE.md) for full attribution.

If you fork the loop and swap in a different Figma file, you only need to comply with that file's license — the MIT terms cover everything else.
