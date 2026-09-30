# Plumb & Square

An illustrated, beginner-friendly woodworking handbook for cutting, framing, spindle turning and choosing wood.

**Open `plumb-and-square.html` in any browser.** It is one self-contained file that works offline, with no external images, fonts or libraries.

## How it reads

The handbook is made of guides, each a small book on one subject. You read it like a textbook, **one topic per page**:

- **Home** shows every guide. Each guide opens to a cover page with its contents.
- **Turn pages** with the Previous/Next buttons at the bottom of every page, the ← → keys, or a swipe on a phone.
- **Contents** (top left) lists every guide, section and topic, and searches titles, defined terms and text.
- Every page has its own link (for example `plumb-and-square.html#c-offset`), and the handbook remembers where you stopped.
- **Print** (top right) prints this page, this guide, or the whole handbook in an ink-saving scheme for white paper: line drawings, no filled backgrounds, each guide starting on a new page with its cover, and figures never split across pages. Each wood species prints on exactly one page. The whole handbook is about 179 US Letter pages. The browser’s own Print (Ctrl/Cmd+P) prints the page on screen.

Every topic follows the same pattern: plain-language explanation → diagram → formula or steps → worked example with real numbers → common mistake, plus a safety note on any power-tool topic and links to related topics.

## The guides (181 pages: home, 11 guide covers, 169 topics)

| | Guide | Topics | Covers |
| --- | --- | --- | --- |
| A | Lumber & Numbers | 12 | Cut vocabulary, nominal vs actual sizes, grain, board defects, wood movement, reading a tape, fractions, cut lists |
| B | Measure & Mark | 22 | Tape hook, story sticks, speed square, framing square, combination square, protractor, angle finders, sliding bevel, digital gauges, levels, plumb bobs, chalk lines, contour gauge, scribing, measuring corners and slopes, checking square |
| C | The Angle Book | 18 | Half-angle rule, polygons, odd and irregular corners, braces, saw scale vs geometry, error build-up, offsets and lengths, pitch, plumb and level cuts, compound cuts, tapers |
| D | The Saw Guide | 27 | Miter saw (safety, capacity, mirror pairs, stops, calibration), table saw (kickback, push sticks, setup, rips, bevels, miter gauge, sleds and the 5-cut method, taper jig, dadoes, sheet goods, blades), circular saw, hand saws, jigsaw, coping saw |
| E | Trim & Finish | 11 | Inside and outside corners, measuring trim, coping, room order, scarf joints, returns, casing reveals, crown (spring angle, nested, flat) |
| F | Joining Angled Work | 5 | Gluing end grain, reinforcing miters, nailing trim, clamping, wood movement in wide miters |
| G | Framing & Construction | 21 | Layout, walls, rough openings, rafters, bird's mouth, rafter layout, hips, stairs, blocking, sheathing, decks and posts |
| H | Spindle Turning | 15 | Lathe parts, safety, speed, blanks, mounting, tools, tool rest, riding the bevel, beads and coves, calipers, story sticks, tapers, tenons, sharpening, finishing |
| I | Judging Wood | 9 | Reading a species page, hardness vs strength vs stiffness, shrinkage and stability, rot and outdoor use, what carvers and turners look for, wood dust, comparison charts and tables, choosing a wood for the job |
| J | Wood Species | 25 | One page per wood (read Guide I first): spruce (SPF), lodgepole pine, Douglas fir, white pine, western red cedar, yellow cedar, hemlock, larch, hard and soft maple, red and white oak, ash, yellow birch, cherry, walnut, hickory, beech, yellow poplar, aspen, basswood, butternut, mahogany, sapele, teak |
| K | The Reference Shelf | 4 | Formula sheet, tables, nine calculators, glossary (built automatically from every defined term) |

## Working on it

The built file is generated from `src/`. Edit the sources, then rebuild:

```sh
node build.js                 # writes plumb-and-square.html
node tools/test-formulas.js   # checks the worked-example numbers against the formulas
node tools/check.js           # opens every page in Chromium (needs Playwright) and reports problems
```

### Hosting on Vercel

Import the repository in Vercel and deploy with the default settings; `vercel.json` does the rest. Each deploy runs `node build.js`, copies the result to `public/index.html` and serves that folder, so the site always matches `src/`. It needs no dependencies and no environment variables. Pushes to `main` go to production.

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
| `src/species.js` | Wood species data (Guides I and J): numbers, colours, ratings, and the species stat card, meters and tables drawn from them |
| `src/calc.js` | The calculators in the Reference Shelf |
| `src/reader.js` | The page-turning reader: numbering, covers, pagers, contents, search, printing |
| `vercel.json` | Vercel build settings (build command, output folder) |

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

A new wood species is one record in `WOODS` (`src/species.js`) plus an article with `<div class="spec" data-spec="key"></div>` in `src/guides/j-wood-species.html`; the sample, facts, numbers, meters and comparison tables follow automatically.

Numbers (C2.1), page headers, pagers, the guide covers, the contents drawer, figure numbers, search and the glossary are all generated. An empty `<a class="ref" href="#id"></a>` fills itself in with the topic's number and title. Terms wrapped in `<dfn>` go into the glossary automatically.

A new section is a `<div class="gsection" data-title="…">` inside a guide. A new guide is a new file in `src/guides/` with a `<section class="guide" data-letter data-title data-sub>` wrapper.

### Visual language

- Tan board with grain lines; red hatch for waste; red dashed for a planned cut; red solid edge for a cut face
- Blue with arrows: dimensions. Purple arcs: angles
- Bold black arrow: feed direction. Curved black arrow: rotation. Red cross-hatch: danger zone
- Grey: machines and tools

Code-dependent numbers (stairs, guards, notching, deck permits) follow the National Building Code – 2023 Alberta Edition as used in Calgary (metric values from the code, inch values rounded to the safe side). Always check with the City of Calgary.

Wood species numbers are averages at 12% moisture content from the US Forest Products Laboratory and the Wood Database; the working ratings are the handbook’s own judgement from published working notes.
