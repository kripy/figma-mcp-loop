# Figma → Claude Code Handoff Template

A checklist and naming spec for designers before handing a Figma file to a developer using Claude Code + Figma MCP.

> **Prefer to start from a Figma file?** Duplicate the [Figma MCP Loop](https://www.figma.com/community/file/1649213954960222549/figma-mcp-loop) Community template — page structure, naming conventions, and example components already wired up.

---

## 1. Page Structure

One Figma page per concern. Name them exactly:

| Page name | What goes here |
|-----------|---------------|
| `🎨 Tokens` | All color, type, and spacing variables |
| `🧩 Components` | Every reusable component and its variants |
| `📐 Page Layouts` | Full-page frames — one frame per route |

Claude reads pages by name. Keep them consistent across projects.

---

## 2. Frame Naming

Name every top-level frame as `Route/Section`:

```
Homepage/Hero
Homepage/Features
Homepage/Footer
Course-Landing/Enrol
Course-Landing/Testimonials
About/Team
Dashboard/Sidebar
```

**Rule:** If the name could belong to any project, it's not specific enough.
`Frame 12` → useless. `Homepage/Hero` → Claude knows exactly what to build.

---

## 3. Component Naming

Name every component as `Type/Variant`:

```
Button/Primary
Button/Secondary
Button/Disabled
Button/Loading

Card/Course
Card/Testimonial
Card/Stat

Input/Default
Input/Error
Input/Success
Input/Disabled

Nav/Desktop
Nav/Mobile
Nav/Mobile-Open

Badge/Info
Badge/Success
Badge/Warning
Badge/Error
```

Use **Figma Variants** for each state. Claude maps variant names directly to props in code.

---

## 4. Design Variables

Define variables for everything repeatable. Follow this naming scheme:

### Colors
```
color/brand/primary        → #4B5EF8
color/brand/secondary      → #1A1A2E
color/neutral/0            → #FFFFFF
color/neutral/50           → #FAFAFA
color/neutral/100          → #F5F5F7
color/neutral/200          → #E5E5EA
color/neutral/500          → #8E8E93
color/neutral/900          → #1C1C1E
color/feedback/success     → #34C759
color/feedback/warning     → #FF9500
color/feedback/error       → #FF3B30
```

### Typography
```
type/heading/h1            → Inter Bold, 48
type/heading/h2            → Inter Bold, 36
type/heading/h3            → Inter SemiBold, 28
type/heading/h4            → Inter SemiBold, 22
type/body/lg               → Inter Regular, 18
type/body/md               → Inter Regular, 16
type/body/sm               → Inter Regular, 14
type/label/md              → Inter Medium, 14
type/label/sm              → Inter Medium, 12
type/code                  → JetBrains Mono Regular, 14
```

### Spacing
```
spacing/2xs    → 4
spacing/xs     → 8
spacing/sm     → 12
spacing/md     → 16
spacing/lg     → 24
spacing/xl     → 32
spacing/2xl    → 48
spacing/3xl    → 64
spacing/4xl    → 96
```

### Radii
```
radius/sm      → 4
radius/md      → 8
radius/lg      → 12
radius/xl      → 16
radius/full    → 9999
```

Claude reads these and maps them to CSS custom properties / Tailwind tokens automatically.

---

## 5. Auto Layout

Apply Auto Layout to **every frame and component**. Never use manual positioning.

For each frame, set explicitly:
- **Direction** — horizontal or vertical
- **Padding** — use spacing variables, not custom values
- **Gap** — use spacing variables
- **Alignment** — fill, fixed, or hug

If a frame is not using Auto Layout, Claude has to guess the spacing — and it will be wrong.

---

## 6. Layer Hygiene

Rename every meaningful layer. Delete unused layers.

| Instead of... | Use... |
|---------------|--------|
| `Group 42` | `Hero / Content` |
| `Rectangle 7` | `Card / Background` |
| `Frame 3` | `Nav / Logo Lockup` |
| `Ellipse 1` | `Avatar / Image` |
| `Vector` | `Icon / Arrow Right` |

**Rule:** If you wouldn't put that layer name in a code review, rename it.

---

## Pre-Handoff Checklist

Before sharing the Figma file link with a developer:

- [ ] File has `🎨 Tokens`, `🧩 Components`, and `📐 Page Layouts` pages
- [ ] All top-level frames named as `Route/Section`
- [ ] All components named as `Type/Variant` with Figma Variants configured
- [ ] Color, type, and spacing variables defined and applied (not hardcoded)
- [ ] Every frame and component uses Auto Layout with explicit padding and gap
- [ ] No unnamed layers (`Frame 3`, `Group 42`, `Rectangle 7`, etc.)
- [ ] Unused layers deleted
- [ ] Interactive states (hover, focus, disabled, error) exist as variants
- [ ] Mobile and desktop breakpoints are separate frames (not hidden layers)

---

## What the Developer Does With This

Once the file passes the checklist, the developer runs Claude Code with the Figma MCP server and points it at the file URL. Claude will:

1. Read page names to understand project structure
2. Read frame names to know which route/component to build
3. Read design variables to generate CSS tokens / Tailwind config
4. Read Auto Layout values to output accurate flexbox/grid
5. Map component variants to code props
6. Generate production-ready component code

A clean Figma file = accurate code on the first pass. A messy one = back-and-forth.
