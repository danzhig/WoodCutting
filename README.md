# Plumb & Square

An illustrated, beginner-friendly woodworking handbook for cutting, framing and spindle turning.

**Open `plumb-and-square.html` in any browser.** It is one self-contained file that works offline, with no external images, fonts or libraries.

## How it reads

The handbook is made of guides, each a small book on one subject. You read it like a textbook, **one topic per page**:

- **Home** shows every guide. Each guide opens to a cover page with its contents.
- **Turn pages** with the Previous/Next buttons at the bottom of every page, the ← → keys, or a swipe on a phone.
- **Contents** (top left) lists every guide, section and topic, and searches titles, defined terms and text.
- Every page has its own link (for example `plumb-and-square.html#c-offset`), and the handbook remembers where you stopped.
- **Print** (top right) prints this page, this guide, or the whole handbook in an ink-saving scheme for white paper: line drawings, no filled backgrounds, figures never split across pages.

Every topic follows the same pattern: plain-language explanation → diagram → formula or steps → worked example with real numbers → common mistake, plus a safety note on any power-tool topic and links to related topics.

## Working on it

The built file is generated from `src/`. Edit the sources, then rebuild:

```sh
node build.js                 # writes plumb-and-square.html
node tools/test-formulas.js   # checks the worked-example numbers against the formulas
node tools/check.js           # opens every page in Chromium (needs Playwright) and reports problems
```

| Path | What it holds |
| --- | --- |
| `src/shell.html` | Page skeleton: top bar, contents drawer, home page, and include markers |
| `src/styles.css` | Design tokens (light and dark), reader layout, diagram classes, print scheme |
| `src/guides/*.html` | One file per guide. Each topic is an `<article class="topic">` |
| `src/figures/*.js` | Diagrams for each guide, as `FIG.name = () => svg` |
| `src/kit.js` | The SVG drawing kit (boards, dimensions, angles, isometric solids, machines, spindles) |
| `src/helpers.js` | Shared drawing helpers used by several guides |
| `src/formulas.js` | Every calculation, used by text examples, tables, figures and calculators |
| `src/tables.js` | Tables, computed from the formulas |
| `src/calc.js` | The calculators in the Reference Shelf |
| `src/reader.js` | The page-turning reader: numbering, covers, pagers, contents, search, printing |

### Adding a topic

1. In the right `src/guides/*.html` file, add an article inside a section:
   ```html
   <article class="topic" id="c-my-topic" data-title="My topic">
     …explanation, figures, formula, example, mistake…
     <p class="seealso"><b>See also</b><a class="ref" href="#c-offset"></a></p>
   </article>
   ```
2. For a figure, add `<figure class="fig"><div class="art" data-fig="myFigure"></div><figcaption>…</figcaption></figure>` and write `FIG.myFigure` in that guide's `src/figures/*.js`.
3. Run `node build.js`.

Numbers (C2.1), page headers, pagers, the guide covers, the contents drawer, figure numbers, search and the glossary are all generated. An empty `<a class="ref" href="#id"></a>` fills itself in with the topic's number and title. Terms wrapped in `<dfn>` go into the glossary automatically.

A new section is a `<div class="gsection" data-title="…">` inside a guide. A new guide is a new file in `src/guides/` with a `<section class="guide" data-letter data-title data-sub>` wrapper.

### Visual language

- Tan board with grain lines; red hatch for waste; red dashed for a planned cut; red solid edge for a cut face
- Blue with arrows: dimensions. Purple arcs: angles
- Bold black arrow: feed direction. Curved black arrow: rotation. Red cross-hatch: danger zone
- Grey: machines and tools

Code-dependent numbers (stairs, notching) are typical US (IRC) values; always check your local code.
