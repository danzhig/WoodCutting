# Expansion brief: *Plumb & Square*, a woodworking handbook

Status: built. All five phases are done; see README.md for what shipped.

## 1. Goal

Grow the existing single-file guide (`angled-cuts-guide.html`) into a comprehensive, illustrated, beginner-friendly woodworking handbook. The theme is **cutting wood accurately**, with a **focus on construction and framing**, plus a dedicated **spindle-turning** guide for the lathe.

**Title and shape:** one handbook, **Plumb & Square: A Woodworking Handbook**, made up of nine separate **guides**, one per subject (listed in section 3). Each guide has its own title and cover page and reads like a small book on its own. The original *Angled-Cut Handbook* content becomes Guide C, *The Angle Book*, plus parts of other guides.

Keep everything that already works:
- All current content (vocabulary, joint angles, lengths, slopes, compound cuts, measuring, cheat sheet). It gets reorganised into the new structure, not deleted.
- Works offline as one downloadable `.html` file. No external images, fonts or libraries.
- One visual language: tan board, red waste/cut, blue dimensions, purple angles.
- Inline SVG diagrams, drawn to scale from the same formulas the text uses, including isometric views.
- Light and dark themes, and phone-friendly.
- The ink-saving "Print on white paper" scheme: line drawings, no background fills, no figure split across pages.
- Tone: plain language, define every term the first time it appears, intuition before formula, and real numbers in every worked example.

## 2. Audience

Comfortable with numbers, not a trained woodworker. Owns or uses a miter saw, a **table saw**, a circular saw, hand tools and a **wood lathe**. Wants to build real things: framing, trim, furniture parts and turned spindle work. All measurements are in **inches** (US customary); no metric.

## 3. Structure: Handbook → Guides → Sections → Topics

Organise the handbook in levels:
- **Guide:** a whole subject with its own title and cover page, e.g. Guide G, *Framing & Construction*.
- **Section:** a subcategory within a guide, e.g. "Stairs".
- **Topic:** one learnable unit, e.g. "Laying out a stringer". **One topic is one page** in the reader.

Number them as guide letter, section number, topic number: **B2.3** is Guide B, section 2, topic 3.

| Guide | Title | Subject |
| --- | --- | --- |
| A | **Lumber & Numbers** | Foundations: cut vocabulary, lumber, tape and fractions |
| B | **Measure & Mark** | Measuring and layout tools |
| C | **The Angle Book** | Angle and length geometry (the original handbook) |
| D | **The Saw Guide** | Miter saw, table saw, circular saw, hand saws |
| E | **Trim & Finish** | Trim and finish carpentry |
| F | **Joining Angled Work** | Gluing, reinforcing, clamping |
| G | **Framing & Construction** | Walls, rafters, stairs, sheathing, decks |
| H | **Spindle Turning** | The wood lathe, spindle work only |
| I | **The Reference Shelf** | Cheat sheets, calculators, glossary |


Every topic is **self-contained**, so it makes sense read on its own ("flip to it, learn it"). Each one follows the same template:

1. **What & why:** plain-language explanation, with terms defined.
2. **Diagram(s):** at least one per topic. Show top view + isometric, or assembled + exploded, where it helps.
3. **Steps and/or formula.**
4. **Worked example** with real numbers.
5. **Common mistake.**
6. **Safety note:** required on any topic where a power tool is running.
7. **See also:** links to related topics in other parts.

### Guide A · Lumber & Numbers *(foundations)*
- **A1 Vocabulary of cuts** *(existing 1.1–1.4)*: crosscut/rip, miter/bevel/compound, long/short point, kerf.
- **A2 Lumber basics**
  - Nominal vs actual sizes, including a sizes table for 1×, 2×, 4×4 and 6×6.
  - Grain direction and end grain.
  - Moisture and wood movement (why wide miters open and close with the seasons).
- **A3 Numbers at the bench**
  - Reading a tape measure to 1/16″.
  - Decimal ↔ fraction conversion, with a chart of 1/16ths to decimals *(recommendation 6)*.
  - Adding and subtracting fractions on a cut list.
  - Feet-inches ↔ inches.

### Guide B · Measure & Mark *(measuring and layout tools; new, expanded)*
Show how to hold, read and trust each tool. Each tool gets a top-view diagram of it in use and a "what number do I get, and what do I do with it" box.
- **B1 Straight measuring**
  - Tape measure: the hook's "true zero" movement; "burning an inch" for accuracy.
  - Folding rule.
  - Story sticks.
- **B2 Squares & triangles**
  - **Speed square** (the triangle), in depth:
    - Lip, pivot point, degree scale, common and hip/valley scales.
    - Marking 90° and 45° lines.
    - Pivoting to any angle.
    - Marking plumb and seat cuts on rafters.
    - Using it as a circular-saw guide.
  - **Framing square:** blade and tongue, rafter table, stair layout with stair gauges, and checking square on large assemblies.
  - **Combination square:** 90°, 45°, depth, marking gauge use, and checking the square itself for square.
- **B3 Angle tools**
  - **Protractor** (the half circle): inner and outer scales, placing the center mark, and reading an angle vs drawing one.
  - **Protractor angle finder** (two hinged arms): reads the corner, and often has a miter-setting scale too.
  - **Sliding T-bevel:** copy, lock and transfer.
  - **Digital angle finder:** inside and outside corners, and the "hold" button.
  - **Digital angle gauge** (magnetic cube): setting blade tilt on table and miter saws.
- **B4 Level, plumb & lines**
  - Spirit level and how to check one (flip test).
  - Plumb bob.
  - Chalk line.
  - Laser level (basics).
- **B5 Scribing & copying shapes**
  - Contour gauge.
  - Compass/dividers for scribing to uneven walls.
- **B6 Measuring what you need to cut** *(decision guide)*:
  - A table: "What are you measuring?" (inside corner, outside corner, slope or pitch, blade tilt, a round part's diameter) → which tool → how to read it → what number goes on the saw.
  - Include the existing "copying an angle" and compass-bisection topics.
- **B7 Checking square** *(recommendation 7)*
  - Diagonals method for frames, walls and decks.
  - 3-4-5 triangle, scaled to 6-8-10 and 9-12-15.
  - Squaring a large layout.

### Guide C · The Angle Book *(existing sections 2, 3, 5, regrouped)*
- **C1 Finding the angle:**
  - Half-angle rule.
  - Polygon frames.
  - Out-of-square corners.
  - **Irregular shapes, where every corner differs:** measure, halve, and label each joint separately *(recommendation 11)*.
  - Braces and T-joints.
  - Saw scale vs geometry.
- **C2 Lengths:** offset formula, inside vs outside length, bevel lengths, offset tables, rules of thumb.
- **C3 Slopes & pitch:** pitch ↔ degrees, plumb and level cuts.
- **C4 Compound cuts:** settings from tilt, table, splayed boxes.
- **C5 Tapers** *(recommendation 10)*:
  - Taper angle = arctan((wide − narrow) ÷ length).
  - Taper per foot.
  - Tapered legs and planter sides.
  - Links to the table-saw taper jig (D2).

### Guide D · The Saw Guide *(expanded; the table saw is its own full section)*
Each saw section covers: anatomy diagram, what its scales read (0 = square, or 90 = square?), setup and calibration, the cuts it does best, capacity limits, blade choice, and **safety**.
- **D1 Miter saw**
  - Anatomy, miter and bevel scales, detents and overriding them.
  - **Capacity:** width and height at 0°, 45° miter and 45° bevel. Sliding vs non-sliding. Cutting boards wider than capacity *(recommendation 12)*.
  - **Left- and right-hand pieces:** which way to swing or flip for mirror pairs, with a paired-piece diagram *(recommendation 3)*.
  - Stop blocks and repeat cuts.
  - Calibrating 0° and 45°.
  - Safety: hand zone, clamping small parts, letting the blade stop.
- **D2 Table saw** *(full section)*
  - Anatomy: blade, arbor, throat plate, fence, miter slots, miter gauge, riving knife, splitter, guard, anti-kickback pawls, height and tilt controls.
  - **Safety first:**
    - What kickback is and why it happens (wood pinched between the back of the blade and the fence).
    - Stance outside the kickback line.
    - Push sticks and push blocks, featherboards.
    - Blade height.
    - Never freehand.
    - Never use the fence as a stop for crosscuts (trapped offcut). Use a stop block set before the blade instead.
    - Keep the riving knife on.
  - Setup and calibration:
    - Blade parallel to the miter slot.
    - Fence parallel.
    - 90° and 45° tilt, set with a square and a digital gauge.
    - **The 5-cut method** for squaring a crosscut sled, with its formula and a worked example.
  - Rip cuts (narrow rips, thin strips), bevel rips (which way the blade tilts; keep the offcut free), chamfers.
  - Crosscuts with the miter gauge. **Reading miter-gauge scales, which differ by brand (some read 90° at square)** *(recommendation 5)*.
  - Crosscut sleds and miter sleds (a 45° sled for frames).
  - **Taper jig:** setting it from the taper angle, tapered legs example *(recommendation 10)*.
  - Grooves, dadoes and rabbets (brief).
  - Breaking down sheet goods safely: support and outfeed.
  - Blade choice: tooth count, rip/crosscut/combination blades, full vs thin kerf.
- **D3 Circular saw** *(framing workhorse)*
  - Bevel scale.
  - Depth setting (about ¼″ below the board).
  - Using a speed square as a cutting guide.
  - Rafter plumb cuts; gang cutting.
  - Long rips with a straightedge guide; cutting plywood.
  - Safety: support both sides so the kerf doesn't pinch.
- **D4 Hand saws & miter boxes:** push vs pull (Japanese) saws; miter box slots at 90°/45°/22.5°; starting a cut on the line.
- **D5 Jigsaw & coping saw:** bevel cuts with a jigsaw; the coping saw (leads into E2).

### Guide E · Trim & Finish
- **E1 Inside vs outside corners** *(recommendation 2)*: where the long point goes (wall side vs room side), with top-view diagrams of both. Measuring each with B3 tools.
- **E2 Coping inside corners** *(recommendation 4)*: why pros cope, then the steps: 45° reveal cut, coping saw back-cut, file to fit. Diagrams of the coped profile.
- **E3 Baseboard & casing**
  - Cut order around a room.
  - Scarf joints for long runs (splicing at 22.5° or 45°).
  - Mitered returns.
  - Casing reveals.
- **E4 Crown molding**
  - Spring angle.
  - **Nested method, "upside down and backwards"** with a crown stop, so there is no bevel to set *(recommendation 9)*.
  - Flat method using the existing compound table.
  - Settings for non-90° corners.

### Guide F · Joining Angled Work *(recommendation 8)*
- **F1 Gluing miters:** end grain soaks up glue (size it first), and glue alone is weak.
- **F2 Reinforcing:** splines, keys, biscuits, dowels, pocket screws, nails and brads. When to use which.
- **F3 Clamping:** band clamps, corner clamps, the painter's-tape trick, and dry-fit first.
- **F4 Wood movement in wide miters:** why they open, and designs that tolerate it.

### Guide G · Framing & Construction *(new; the construction focus)*
Label code-dependent numbers as "typical US (IRC) values, check your local code".
- **G1 Layout basics:** reading simple plans; layout marks (X, lines, crowns up); marking plates together.
- **G2 Walls**
  - Parts: top and bottom plates, studs, king studs, jack/trimmer studs, headers, cripples, sills.
  - Stud layout at 16″ and 24″ on center, including the first-stud offset so sheathing edges land on stud centers.
  - Precut studs and wall height (e.g. 92⅝″ stud + three 1½″ plates = 97⅛″).
  - Rough-opening math (header length = rough opening + 3″ for two jacks).
  - Squaring the wall with diagonals.
- **G3 Roof rafters** *(extends existing C3)*
  - Run, rise, pitch.
  - Common rafter length from the slope factor.
  - **Ridge reduction** (half the ridge thickness).
  - **Bird's mouth:** seat cut + heel cut, and how deep to cut it (with a rule of thumb).
  - Overhang and tail cuts.
  - Framing-square step-off method.
  - Speed-square rafter scales.
  - Hips and valleys (intro only).
- **G4 Stairs**
  - Total rise.
  - Number of risers = total rise ÷ target riser, rounded up; exact riser height.
  - Tread depth and the comfort rule (2R + T ≈ 24–25″).
  - Typical code limits.
  - Laying out a stringer with a framing square and stair gauges.
  - Dropping the stringer by one tread thickness.
  - Worked example for a real deck step.
- **G5 Braces, blocking & sheathing**
  - Existing brace topic.
  - Fire and solid blocking cut to fit between studs.
  - Cutting plywood/OSB sheathing: layout, factory edges, gaps.
- **G6 Decks & posts (brief):** squaring a deck layout, cutting posts to height, and angled deck corners (links to C1).

### Guide H · Spindle Turning *(new; the wood lathe, spindle work only)*
Scope is **spindle turning**: the grain runs along the lathe's axis (legs, handles, balusters, pens, candlesticks, tool handles). Bowl and faceplate turning are out of scope; mention them once so the reader knows they exist.
- **H1 Anatomy:** headstock, spindle and its threads, drive (spur) center, live center, tailstock, quill, tool rest and banjo, bed, speed control, indexing, Morse tapers (MT1/MT2).
- **H2 Safety at the lathe:**
  - Face shield.
  - No loose sleeves or jewelry; tie back long hair.
  - Check the blank for cracks and knots.
  - Spin by hand before switching on.
  - Start slow; stand out of the "line of fire".
  - Tool-rest position and height.
  - Swing the tool rest clear before sanding.
- **H3 Preparing a blank:** choosing straight-grained stock; finding centers (diagonals on the end, center finder); knocking off the corners (octagonal blank); mounting between centers.
- **H4 Speed:** the rule of thumb **diameter (in) × RPM ≈ 6,000–9,000**, with a speed table for ½″–6″ spindle diameters. Start lower for long, thin or unbalanced blanks.
- **H5 Holding the work:** between centers; a four-jaw chuck for spindle work held at one end (tenons; match the jaw dovetail); steady rests for long thin spindles.
- **H6 Turning tools & how they cut**
  - Spindle roughing gouge, spindle gouge, skew chisel, parting tool, beading and parting tool, scrapers.
  - "Riding the bevel" and cutting downhill with the grain.
  - Diagrams of the tool contacting the wood.
- **H7 Measuring on the lathe:** outside calipers, sizing diameters with a parting tool and calipers, story sticks and dividers for layout, and repeating a pattern (matching four table legs).
- **H8 Shapes & angles:** cylinders, **turning a taper to a given angle** (links to C5), beads, coves, fillets, V-cuts, chamfers, tenons.
- **H9 Sharpening spindle tools:** grinder setup, jigs, and typical bevel angles for each tool (given as ranges).
- **H10 Sanding & finishing on the lathe:** grit progression, lower speed, and finish choices.

### Guide I · The Reference Shelf
- **I1 Cheat sheets** (each guide also gets its own one-page summary): every formula and table, including the new ones:
  - Decimal↔fraction chart.
  - Stud layout marks.
  - Rafter and stair quick tables.
  - Miter-saw capacity checklist.
  - Lathe speed table.
- **I2 Calculators:**
  - Existing four.
  - New: fraction converter, stair calculator, rafter calculator (length, ridge reduction, bird's mouth marks), taper angle, and lathe RPM.
- **I3 Glossary:** every defined term, linking back to where it is first explained.

Safety: there is **no general shop-safety guide** (confirmed). Tool-specific safety is still built into every machine topic (D1–D5, H2), because it is part of using each tool correctly.

## 4. Navigation: a flip-able textbook, one topic at a time

There is **no long scroll mode**. The reader always sees one page at a time:
- **Home:** the handbook cover, the diagram key, and nine guide "spines" or cards (letter, title, one-line subject, number of topics).
- **Guide cover:** the guide's title, what it covers, and its section and topic list.
- **Topic page:** one topic, following the template in section 3. Each topic ends with **Previous / Next** buttons that show the neighbouring topics' titles. Next continues into the following guide at the end of a guide.

Getting around:
- **Page turning:** Previous/Next buttons, ← → keys, and swipe on phones. A gentle page-turn transition, off when the reader prefers reduced motion.
- **Breadcrumb** at the top of every page: Handbook › Guide › Section › Topic. Each part is clickable.
- **Progress:** "Topic 4 of 12 in this guide" and a thin progress bar.
- **Contents drawer:** opens over the page. It lists guides → sections → topics, with a search box that filters by title and glossary terms. The current topic is highlighted.
- **Deep links:** every page has a plain `#id` (e.g. `#d2-taper-jig`). The browser Back button returns to the previous page.
- **Resume:** remember the last topic per browser (localStorage, wrapped in try/catch) and show "Continue where you left off" on the home page.
- **Cross-references:** "See also" links jump straight to that topic's page.
- Every page starts at the top of the screen when opened, so it never feels like scrolling through a long document. A page may still scroll down if its content is taller than the screen.

Printing (a book on paper):
- Buttons for **"Print this topic"**, **"Print this guide"** and **"Print the whole handbook"**.
- All use the existing white-paper scheme. Each guide starts on a new page with its cover; each topic starts on a new page when that doesn't waste more than half a page; figures and boxes never split across pages.

## 5. Visual language additions

Keep the four existing colours. Add:
- **Feed direction:** a solid ink arrow for which way the wood moves.
- **Rotation:** a curved ink arrow for blade or lathe rotation.
- **Danger zone:** red cross-hatch plus a label, e.g. the kickback line or the lathe line of fire.
- **Machine parts:** steel grey outline, white in print.
- **Line style:** thin line weights for hidden or background parts.

Show every machine diagram both from above (the operator's view) and in isometric where it helps. Hands appear only as simple outlines, to show a safe position.

## 6. Accuracy rules

- Every formula is implemented once in JavaScript. Tables, calculators, diagrams and worked examples all use it, so the numbers can never disagree.
- Code-dependent values (stairs, notching, headers) are labelled *typical US IRC values; verify with your local building department*.
- Tool-specific facts that vary by brand (miter-gauge scales, chuck jaw angles, saw capacities) are stated as "varies; here's how to check yours". Never as a single universal number.
- Lathe speeds and sharpening angles are given as ranges, not single values.
- Every worked example is checked numerically before shipping.

## 7. Code organisation

The single file is about to grow several times over, so switch to a source folder plus a tiny build step:
- `src/guides/a-lumber-numbers.html`, `src/guides/b-measure-mark.html`, … one file per guide, holding its topic pages.
- `src/figures/a.js`, `src/figures/b.js`, … one figure file per guide.
- `src/reader.js`: the page-turning reader (routing, contents drawer, search, progress, resume, print choices).
- `src/kit.js`: the shared drawing kit (existing, plus new machine and rotation primitives).
- `src/formulas.js`: every formula, used by the text, tables, figures and calculators.
- `src/styles.css`: tokens, screen and print styles.
- `build.js`: plain Node, no dependencies. It inlines everything into **one** offline file, `plumb-and-square.html`, and also writes a sample print PDF. `angled-cuts-guide.html` is retired once its content has moved.
- A README section on how to add a guide, section, topic or figure.

## 8. Verification before each delivery

- No console errors. Every figure renders. No horizontal scroll at 400px width.
- Screenshots of every new figure in light and dark, reviewed for overlaps and wrong geometry.
- Printed to PDF on US Letter: check page breaks and that nothing splits.
- Spot-check every calculator against its worked example.

## 9. Delivery in phases (each phase is a complete, usable file)

1. **Restructure + reader:**
   - Handbook home page and guide covers; Guide → Section → Topic numbering.
   - The one-topic-at-a-time reader: page turning, breadcrumb, progress, contents drawer, search, deep links, resume, print choices.
   - Source folder and build step.
   - Existing content moved into Guides A, B, C, D1 and I, with no loss.
2. **Guide B (Measure & Mark)** and **Guide D (The Saw Guide, including the full table-saw section).**
3. **Guides E and F (Trim & Finish, Joining Angled Work).**
4. **Guide G (Framing & Construction).**
5. **Guide H (spindle turning)** and the expanded **Guide I** reference, calculators and glossary.

## 10. Decisions (confirmed)

1. **Title:** the handbook is *Plumb & Square: A Woodworking Handbook*, made of nine guides with their own titles (section 3).
2. **Reading:** one topic per page, like a flip-able textbook. No long-scroll mode.
3. **Safety:** no general shop-safety guide; tool-specific safety stays inside each machine topic.
4. **Lathe:** spindle turning only.
5. **Units:** inches only.
