# The verification loop

The whole point of this repo. Below is the workflow that took the Positivus build from "looks right" to "measured against the source frame and within 0.5%."

## Prerequisites

- Google Chrome installed (`/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome` on macOS)
- Python 3 with Pillow: `pip install pillow`
- Figma MCP server connected to Claude Code, with the source file accessible
- The built page locally (`index.html` + assets)

## Step 1 — render the build

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless \
  --disable-gpu \
  --hide-scrollbars \
  --window-size=1440,9500 \
  --screenshot=build.png \
  "file://$(pwd)/index.html"
```

Notes:
- `--window-size` height should exceed the expected page height. Chrome crops to actual content.
- For local file access from JS probes, add `--allow-file-access-from-files`.

## Step 2 — fetch the Figma frame

From inside Claude Code with the Figma MCP server active:

```
get_screenshot(fileKey=<your-file-key>, nodeId=<home-frame-id>)
```

Save as `figma.png`. This is the canonical rendering at the design's native resolution.

## Step 3 — diff by section landmarks, not whole-image pixel equality

Whole-image pixel equality is too strict (fonts antialias differently, raster assets export at 1x vs 2x). What you actually want: do the section bands land at the same Y coordinates?

```python
from PIL import Image
import numpy as np

def find_band_tops(img_path, brand_rgb, tolerance=10):
    """Return Y coordinates where a brand-colored band starts."""
    img = np.array(Image.open(img_path).convert("RGB"))
    target = np.array(brand_rgb)
    mask = np.all(np.abs(img.astype(int) - target) < tolerance, axis=-1)
    row_has_band = mask.any(axis=1)
    transitions = np.where(np.diff(row_has_band.astype(int)) == 1)[0]
    return transitions.tolist()

build_bands  = find_band_tops("build.png",  brand_rgb=(185, 255, 102))   # Positivus green
figma_bands  = find_band_tops("figma.png",  brand_rgb=(185, 255, 102))

for b, f in zip(build_bands, figma_bands):
    print(f"build:{b:>5}  figma:{f:>5}  delta:{b - f:>+4}")
```

Any delta over a few pixels = a layout bug. Investigate.

## Step 4 — side-by-side composite for ambiguous cases

When the numbers disagree but you can't tell why:

```python
from PIL import Image

a = Image.open("build.png")
b = Image.open("figma.png")
h = max(a.height, b.height)
out = Image.new("RGB", (a.width + b.width, h), "white")
out.paste(a, (0, 0))
out.paste(b, (a.width, 0))
out.save("diff.png")
```

## Step 5 — DOM probe for layout bugs the screenshot misses

Some bugs (margin collapse, accidental overflow, swallowed CSS rules) are invisible in a screenshot once the page has stabilised. Catch them by reading `getBoundingClientRect` live:

```html
<!-- inject into index.html during a debug pass -->
<script>
  window.addEventListener("load", () => {
    document.querySelectorAll(".section").forEach((el) => {
      const r = el.getBoundingClientRect();
      console.log(JSON.stringify({
        cls: el.className,
        top: r.top + window.scrollY,
        bottom: r.bottom + window.scrollY,
        height: r.height,
      }));
    });
  });
</script>
```

Then dump and grep:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --dump-dom \
  "file://$(pwd)/index.html" 2>&1 | grep -E "section|top|bottom"
```

This loop caught a stray `*/` inside a CSS comment that had silently killed a margin rule — 840px of page height missing, invisible until the section coordinates didn't match.

## Step 6 — mobile widths need an iframe harness

**Gotcha:** headless Chrome silently clamps windows below 500px wide. Naive mobile screenshots will look fine while real device-mode bugs slip through.

Workaround: embed the page in a fixed-width iframe, run the overflow probe from the parent frame, and flag any element where `rect.right > innerWidth` or `rect.left < -1`.

```html
<!-- harness.html -->
<!DOCTYPE html>
<style>iframe { display: block; border: 1px solid red; margin-bottom: 20px; }</style>
<iframe src="index.html" width="430" height="800"></iframe>
<iframe src="index.html" width="393" height="800"></iframe>
<iframe src="index.html" width="375" height="800"></iframe>
<iframe src="index.html" width="360" height="800"></iframe>
<script>
  window.addEventListener("load", () => {
    document.querySelectorAll("iframe").forEach((f) => {
      f.addEventListener("load", () => {
        const win = f.contentWindow;
        const overflows = [];
        win.document.querySelectorAll("*").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > win.innerWidth + 1 || r.left < -1) {
            overflows.push({ width: f.width, tag: el.tagName, cls: el.className, right: r.right });
          }
        });
        console.log(f.width, JSON.stringify(overflows, null, 2));
      });
    });
  });
</script>
```

Run with `--allow-file-access-from-files` so the parent frame can read into iframe documents.

## Putting it together

Once you have these pieces, the loop is:

1. Claude writes / edits the build
2. Run step 1 (render)
3. Run step 3 (compare landmark Y coordinates)
4. If deltas exceed threshold → feed the offsets back into the next prompt and iterate
5. Run step 6 at the end to catch mobile-width overflow

This is the loop. It's not magic — just measurement.
