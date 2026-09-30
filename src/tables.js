/* =====================================================================
   TABLES. Each entry fills <table data-table="name">. All numbers come from F (formulas.js).
   ===================================================================== */
const TABLES = {};
const POLY_NAMES = { 3: 'Triangle', 4: 'Square', 5: 'Pentagon', 6: 'Hexagon', 7: 'Heptagon', 8: 'Octagon', 9: 'Nonagon', 10: 'Decagon', 11: 'Hendecagon', 12: 'Dodecagon' };
const d2 = (x, dp = 2) => parseFloat(x.toFixed(dp)) + '°';
const head = cols => `<thead><tr>${cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead>`;
const row = (cells, cls = '') => `<tr${cls ? ` class="${cls}"` : ''}>${cells.map((c, i) => i ? `<td class="mono">${c}</td>` : `<th scope="row" style="text-align:left;color:var(--ink);font-weight:600">${c}</th>`).join('')}</tr>`;
const body = rows => '<tbody>' + rows.join('') + '</tbody>';
const inch = x => `${x.toFixed(2)}<span class="f">${K.frac(x)}</span>`;

/* ---- Guide A ---- */
TABLES.lumber = () => head(['Nominal', 'Actual size', 'Common use']) + body([
  ['1×2', '¾″ × 1½″', 'furring, cleats'], ['1×4', '¾″ × 3½″', 'trim, casing, boxes'], ['1×6', '¾″ × 5½″', 'shelves, fascia'],
  ['1×8', '¾″ × 7¼″', 'shelves, stair risers'], ['2×4', '1½″ × 3½″', 'wall studs, plates'], ['2×6', '1½″ × 5½″', 'exterior walls, rafters, decking frames'],
  ['2×8', '1½″ × 7¼″', 'joists, rafters, stair stringers'], ['2×10', '1½″ × 9¼″', 'joists, headers'], ['2×12', '1½″ × 11¼″', 'stringers, headers'],
  ['4×4', '3½″ × 3½″', 'deck and fence posts'], ['6×6', '5½″ × 5½″', 'structural posts']
].map(r => row(r))).replace(/<td class="mono">([^<]*[a-z][^<]*)<\/td>/g, '<td class="txt">$1</td>');

TABLES.sixteenths = () => head(['Fraction', 'Decimal', 'Fraction', 'Decimal']) + body(Array.from({ length: 8 }, (_, i) => {
  const a = i + 1, b = i + 9;
  return row([K.frac(a / 16).replace('″', ''), (a / 16).toFixed(4), K.frac(b / 16).replace('″', ''), (b / 16).toFixed(4)]);
}));

/* ---- Guide B ---- */
TABLES.threeFourFive = () => head(['Multiply by', 'Side 1', 'Side 2', 'Diagonal', 'Good for']) + body([
  [1, 'small frames, cabinets'], [2, 'walls, door openings'], [3, 'decks, floors'], [4, 'large slabs and foundations']
].map(([k, use]) => row(['×' + k, `${3 * k} ft`, `${4 * k} ft`, `${5 * k} ft`, use])));

/* ---- Guide C ---- */
TABLES.polygon = () => head(['Shape', 'Sides n', 'Corner angle', 'Cut to edge', 'Saw setting']) + body(
  [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => row([POLY_NAMES[n], n, d2(F.polyCorner(n)), d2(90 - 180 / n), d2(F.polySaw(n))], [4, 6, 8].includes(n) ? 'hl' : '')));
TABLES.polygonMini = () => head(['n', 'Corner', 'Saw']) + body([3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => row([n + ' · ' + POLY_NAMES[n], d2(F.polyCorner(n)), d2(F.polySaw(n))])));
TABLES.convert = () => head(['Saw setting', 'Geometric angle (to edge)', 'Where you see it']) + body(
  [[0, 'square crosscut'], [15, 'shallow miters'], [22.5, 'octagon'], [30, 'hexagon'], [45, 'square frame'], [60, 'triangle']].map(([s, w]) => row([s + '°', F.sawToGeo(s) + '°', w])));

const OFF_ANGLES = [5, 10, 15, 22.5, 30, 36, 45, 60];
TABLES.offsets = () => head(['Saw θ', 'tan θ', '2×4 face 3½″', '2×4 thick 1½″', '2×6 face 5½″', '1×4 face 3½″', '1×4 thick ¾″']) + body(
  OFF_ANGLES.map(a => row([a + '°', K.tan(a).toFixed(4), inch(F.offset(3.5, a)), inch(F.offset(1.5, a)), inch(F.offset(5.5, a)), inch(F.offset(3.5, a)), inch(F.offset(0.75, a))], [22.5, 30, 45, 60].includes(a) ? 'hl' : '')));
TABLES.offsets2x4 = () => head(['Saw θ', 'Face 3½″', 'Bevel 1½″']) + body(OFF_ANGLES.map(a => row([a + '°', inch(F.offset(3.5, a)), inch(F.offset(1.5, a))])));

TABLES.pitch = () => head(['Pitch', 'Degrees', 'Plumb cut (saw)', 'Level cut (saw)', 'Slope factor']) + body(
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(p => { const a = F.pitchDeg(p); return row([p + '-in-12', d2(a), d2(a, 1), d2(90 - a, 1), F.slopeFactor(p).toFixed(3)], p === 6 ? 'hl' : ''); }));
TABLES.pitchMini = () => head(['Pitch', 'Degrees', 'Factor']) + body([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(p => row([p + '/12', d2(F.pitchDeg(p)), F.slopeFactor(p).toFixed(3)])));

const COMPOUND_ROWS = [[4, 5], [4, 10], [4, 15], [4, 20], [4, 25], [4, 30], [4, 45], [6, 15], [6, 30], [8, 15], [8, 30]];
TABLES.compound = () => head(['Project', 'Sides', 'Tilt from vertical', 'Miter', 'Bevel']) + body(
  COMPOUND_ROWS.map(([n, S]) => { const c = F.compound(S, n); return row([n === 4 ? 'Box / planter' : POLY_NAMES[n] + ' planter', n, S + '°', d2(c.miter), d2(c.bevel)], S === 15 && n === 4 ? 'hl' : ''); })
    .concat([['Crown 52/38, 90° corner', 38], ['Crown 45/45, 90° corner', 45]].map(([name, S]) => { const c = F.compound(S, 4); return row([name, 4, S + '° spring', d2(c.miter), d2(c.bevel)]); })));
TABLES.compoundMini = () => head(['Tilt', 'Miter', 'Bevel']) + body([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 60].map(S => { const c = F.compound(S, 4); return row([S + '°', d2(c.miter), d2(c.bevel)]); }));

TABLES.taper = () => head(['Taken off one face', 'over 12″', 'over 24″', 'over 30″']) + body(
  [0.125, 0.25, 0.375, 0.5, 0.75, 1].map(r => row([K.frac(r), d2(F.taperAngle(r, 12)), d2(F.taperAngle(r, 24)), d2(F.taperAngle(r, 30))])));

/* ---- Guide E ---- */
TABLES.crownCorners = () => head(['Wall corner', 'Nested: miter only', '52/38 flat: miter', '52/38 flat: bevel', '45/45 flat: miter', '45/45 flat: bevel']) + body(
  [90, 135, 120, 100, 80].map(C => { const A = F.sawFromCorner(C), a = F.compoundA(38, A), b = F.compoundA(45, A); return row([C + '°', d2(F.crownNested(C)), d2(a.miter), d2(a.bevel), d2(b.miter), d2(b.bevel)], C === 90 ? 'hl' : ''); }));

/* ---- Guide G ---- */
TABLES.studLayout = () => head(['Stud', '16″ on center: mark at', 'Stud center', '24″ on center: mark at', 'Stud center']) + body(
  Array.from({ length: 7 }, (_, i) => { const k = i + 1; return row([k, K.frac(16 * k - 0.75), K.frac(16 * k), k <= 5 ? K.frac(24 * k - 0.75) : '·', k <= 5 ? K.frac(24 * k) : '·']); }));
TABLES.stairQuick = () => head(['Total rise', 'Risers', 'Riser height', 'Treads', 'Run at 10½″ treads']) + body(
  [14, 21, 28, 36, 42, 48, 60, 72, 96, 108].map(r => { const s = F.stairs(r); return row([K.frac(r), s.risers, K.frac(s.riser), s.treads, K.frac(s.totalRun)]); }));
TABLES.rafterQuick = () => head(['Pitch', 'Slope factor', 'Rafter per foot of run', 'Plumb-cut offset on 2×6', 'Plumb-cut offset on 2×8']) + body(
  [3, 4, 5, 6, 7, 8, 9, 10, 12].map(p => row([p + '/12', F.slopeFactor(p).toFixed(3), K.frac(12 * F.slopeFactor(p)), K.frac(5.5 * p / 12), K.frac(7.25 * p / 12)], p === 6 ? 'hl' : '')));

/* ---- Guide H ---- */
TABLES.latheSpeed = () => head(['Diameter', 'Start around', 'General turning', 'Upper limit']) + body(
  [0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6].map(d => { const s = F.latheRPM(d), cap = v => Math.min(v, 3500); return row([K.frac(d), Math.round(cap(s.low * 0.6) / 50) * 50 + ' RPM', `${Math.round(cap(s.low) / 50) * 50}–${Math.round(cap(s.high) / 50) * 50} RPM`, Math.round(cap(s.high) / 50) * 50 + ' RPM'], d === 2 ? 'hl' : ''); }));
