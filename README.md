# The Angled-Cut Handbook

A single, self-contained HTML page: a beginner-friendly, illustrated guide to calculating and making angled cuts in wood.

**Open `angled-cuts-guide.html` in any browser.** It works offline, with no external images, fonts, or libraries.

## What's inside

1. **Vocabulary**: crosscut vs rip, miter vs bevel vs compound, long and short point, kerf
2. **Finding the angle**: the half-angle rule, polygon frames (3–12 sides), out-of-square corners, braces and T-joints, saw scale vs geometry
3. **Lengths**: offset = W × tan θ on a real 2×4, inside vs outside length, bevel lengths, offset tables for 2×4 / 2×6 / 1×4, rules of thumb
4. **Slopes and pitch**: X-in-12 ↔ degrees, plumb and level cuts
5. **Compound cuts**: miter and bevel settings from the tilt, lookup table including crown molding
6. **Measuring, marking, checking**: speed square, combination square, sliding bevel, protractor, transferring angles, kerf and waste side, how errors add up
7. **Cheat sheet**: every formula and table, plus a small calculator

## How the file is organised

Everything lives in `angled-cuts-guide.html`, in clearly commented blocks:

| Block | What it holds |
| --- | --- |
| `<style>` | Design tokens (`:root`) with light and dark palettes, then page, figure, and SVG classes |
| HTML `<section class="sheet">` | One per section, with `<article class="topic">` per subsection |
| `DRAWING KIT` script | `K.fig(S)`: a small SVG builder (boards with grain, dimensions, angle arcs, callouts, isometric solids). World units are inches. |
| `SHARED DRAWING HELPERS` | `endCut`, `polyFrame`, `walls`, reused by several figures |
| `FIGURES` script | `FIG.name = () => svg`, grouped by sheet |
| `TABLES` script | `TABLES.name = () => rows`, all computed from the formulas |
| `PAGE WIRING` | Renders figures and tables, numbers figures, highlights the sheet index, runs the calculator |

### Adding a topic

1. Add an `<article class="topic" id="...">` inside the right sheet (or a new `<section class="sheet" data-sheet="8">`).
2. Put a figure placeholder in it: `<figure class="fig"><div class="art" data-fig="myFigure"></div><figcaption>…</figcaption></figure>`.
3. Write `FIG.myFigure = () => { const f = fig(24); /* draw */ return f.svg('alt text'); };` in the FIGURES script.
4. Add a link to the `<nav class="toc">` list.

Figures are numbered automatically per sheet.

### Visual language

- Tan with grain lines: **board**
- Red hatch: **waste**. Red dashed: **planned cut**. Red solid edge: **cut face**
- Blue with arrows: **dimensions**
- Purple arcs: **angles**
