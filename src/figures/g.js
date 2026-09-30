/* Guide G · Framing & Construction */

// a vertical stud or any board seen from the side, lower-left at (x, y)
const stud = (f, x, y, h, o = {}) => f.plank(x, y, o.w || 1.5, h, { grain: 90, seed: Math.round(x * 7 + y), sp: o.sp || 6, cls: o.cls });
const plate = (f, x, y, w, o = {}) => f.plank(x, y, w, o.h || 1.5, { seed: Math.round(x + y * 3), sp: o.sp || 6, cls: o.cls });

/* ---------- Layout basics ---------- */
FIG.layoutMarks = () => {
  const f = fig(7), L = 96, T = 3.5;
  plate(f, 0, 0, L, { h: T }); plate(f, 0, T + 0.1, L, { h: T, cls: 'wood2' });
  f.text([-1, T / 2], 'bottom', { anchor: 'end', size: 10, cls: 'lbl-s' }); f.text([-1, T * 1.5], 'top', { anchor: 'end', size: 10, cls: 'lbl-s' });
  const mark = (x, letter, side = 1) => { f.line([x, -0.4], [x, 2 * T + 0.5], 'pencil'); f.text([x + side * 0.75, T], letter, { cls: 'lbl-b halo', size: 12 }); f.text([x + side * 0.75, 2 * T - 1.2], letter, { cls: 'lbl-b halo', size: 12 }); };
  mark(0.02, 'X'); mark(15.25, 'X'); mark(31.25, 'X');
  mark(38, 'K'); mark(39.5, 'J');
  mark(47.25, 'C'); mark(63.25, 'C');
  mark(70.25, 'J', -1); mark(71.75, 'K', -1);
  mark(79.25, 'X'); mark(95.25 - 0.02, 'X');
  f.dim([39.5 + 1.5, -0.4], [70.25 - 1.5 + 0.02, -0.4], -1.2, 'window rough opening', { size: 11 });
  return f.svg('Ganged top and bottom plates with layout marks');
};

FIG.studLayout = () => {
  const f = fig(6.5), L = 100;
  plate(f, 0, 0, L, { h: 3.5 });
  for (let k = 0; k <= 6; k++) { const x = k === 0 ? 0 : 16 * k - 0.75; f.rect(x, 3.6, 1.5, 6, 'wood2'); f.poly([[x, 3.6], [x + 1.5, 3.6], [x + 1.5, 9.6], [x, 9.6]], 'edge'); if (k) { f.line([x, 0], [x, 3.5], 'pencil'); f.text([x + 0.75, 1.75], 'X', { cls: 'lbl-b', size: 11 }); } }
  f.poly([[0, 10.2], [48, 10.2], [48, 13.2], [0, 13.2]], 'tool-t'); f.text([24, 11.7], 'first 4 × 8 sheet', { size: 11, cls: 'lbl' });
  f.line([48, 3.6], [48, 13.6], 'sq');
  f.note([48, 13.2], [14, -14], 'sheet edge on the stud center at 48″');
  f.poly([[0, -0.5], [L, -0.5], [L, -2], [0, -2]], 'tape');
  for (let i = 1; i < L; i++) f.line([i, -0.5], [i, i % 16 ? -0.9 : -1.4], 'tapetick');
  [16, 32, 48, 64, 80, 96].forEach(x => f.text([x, -1.65], String(x), { cls: 'tapered', size: 10 }));
  f.dim([0, 3.5], [15.25, 3.5], 5.6, '15¼″', { size: 11 });
  return f.svg('Stud layout at 16 inches on center');
};

/* ---------- Walls ---------- */
FIG.wallParts = () => {
  const f = fig(5), L = 96, H = 97.125, ro = [32, 64], sill = 36, hdr = 82.5;
  plate(f, 0, 0, L); plate(f, 0, H - 3, L, { cls: 'wood2' }); plate(f, 0, H - 1.5, L);
  const studH = H - 4.5;
  [0, 15.25, 79.25, L - 1.5].forEach(x => stud(f, x, 1.5, studH));
  stud(f, ro[0] - 3, 1.5, studH); stud(f, ro[1] + 1.5, 1.5, studH);
  stud(f, ro[0] - 1.5, 1.5, hdr - 1.5, { cls: 'wood2' }); stud(f, ro[1], 1.5, hdr - 1.5, { cls: 'wood2' });
  f.plank(ro[0] - 1.5, hdr, ro[1] - ro[0] + 3, 9.25, { seed: 9, sp: 5 });
  f.plank(ro[0], sill - 1.5, ro[1] - ro[0], 1.5, { seed: 8, cls: 'wood2' });
  [47.25].forEach(x => { stud(f, x, 1.5, sill - 3); stud(f, x, hdr + 9.25, H - 3 - hdr - 9.25); });
  f.rect(ro[0], sill, ro[1] - ro[0], hdr - sill, 'glass');
  const lab = (p, t, off) => f.note(p, off, t);
  lab([16, H - 0.75], 'double top plate', [10, -16]); lab([8, 0.75], 'bottom plate', [0, 20]);
  lab([ro[0] - 2.25, 60], 'king stud', [-40, 0]); lab([ro[0] - 0.75, 30], 'jack stud', [-40, 6]);
  lab([48, hdr + 5], 'header', [60, -8]); lab([48, sill - 0.75], 'sill', [60, 6]); lab([48, 16], 'cripple', [60, 0]); lab([48, hdr + 11], 'cripple', [66, -14]);
  f.text([48, 60], 'window rough opening', { cls: 'lbl-s', size: 11 });
  lab([80, 50], 'stud', [30, 0]);
  return f.svg('Parts of a framed wall with a window');
};

FIG.wallHeight = () => {
  const f = fig(4.2), H = 97.125;
  plate(f, 0, 0, 12); stud(f, 5.25, 1.5, 92.625); plate(f, 0, 94.125, 12, { cls: 'wood2' }); plate(f, 0, 95.625, 12);
  f.dim([12, 1.5], [12, 94.125], -3, '92⅝″ stud', { size: 11, flat: true });
  f.dim([-0.3, 0], [-0.3, H], 3, '97⅛″ wall', { size: 11, flat: true });
  f.note([6, 0.75], [30, 14], 'bottom plate 1½″'); f.note([6, 96.4], [30, -10], 'double top plate 3″');
  return f.svg('Stud length and wall height');
};

FIG.roughOpening = () => {
  const f = fig(4.2), ro = 34, x0 = 10, hh = 82.5, hd = 9.25, H = 97.125;
  plate(f, 0, 0, x0 + 1.5 * 2); plate(f, x0 + 3 + ro, 0, 12);
  plate(f, 0, H - 3, x0 + 2 * 3 + ro + 12, { cls: 'wood2' }); plate(f, 0, H - 1.5, x0 + 2 * 3 + ro + 12);
  stud(f, 0, 1.5, 92.625);
  stud(f, x0, 1.5, 92.625); stud(f, x0 + 1.5, 1.5, hh - 1.5, { cls: 'wood2' });
  stud(f, x0 + 3 + ro, 1.5, hh - 1.5, { cls: 'wood2' }); stud(f, x0 + 4.5 + ro, 1.5, 92.625);
  f.plank(x0 + 1.5, hh, ro + 3, hd, { seed: 4, sp: 5 });
  stud(f, x0 + 3 + ro / 2 - 0.75, hh + hd, H - 3 - hh - hd);
  f.rect(x0 + 3, 0, ro, hh, 'glass');
  f.dim([x0 + 3, 20], [x0 + 3 + ro, 20], 0, 'RO 34″', { size: 11, noext: true });
  f.dim([x0 + 3 + ro / 2 + 4, 0], [x0 + 3 + ro / 2 + 4, hh], 0, '82½″', { size: 11, flat: true, noext: true });
  f.dim([x0 + 1.5, hh + hd], [x0 + 4.5 + ro, hh + hd], 2, 'header 37″', { size: 11 });
  f.note([x0 + 2.25, 40], [-26, 0], 'jack 81″', { anchor: 'end' }); f.note([x0 + 0.75, 70], [-26, 0], 'king', { anchor: 'end' });
  f.text([x0 + 3 + ro / 2, 8], 'bottom plate cut out later', { cls: 'lbl-s', size: 10 });
  return f.svg('Rough opening framing for a door');
};

FIG.squareWall = () => {
  const f = fig(3.4), L = 144, H = 97.125;
  f.plank(0, 0, L, 1.5, { seed: 1, sp: 5 }); f.plank(0, H - 1.5, L, 1.5, { seed: 2, sp: 5 });
  for (let x = 0; x <= L - 1.5; x += 16) stud(f, Math.min(x, L - 1.5), 1.5, H - 3, { sp: 4 });
  stud(f, L - 1.5, 1.5, H - 3, { sp: 4 });
  f.line([0, 0], [L, H], 'dimline'); f.line([L, 0], [0, H], 'dimline');
  f.text([L * 0.3, H * 0.3], '173¾″', { cls: 'dimtext halo', size: 12 }); f.text([L * 0.7, H * 0.3], '173¾″', { cls: 'dimtext halo', size: 12 });
  f.poly([[3, 4], [L - 3, H - 4], [L - 6, H - 4], [6, 4]].map(p => p), 'tool-t');
  f.note([L / 2 + 10, H / 2 + 4], [30, -24], 'temporary brace, nailed after squaring');
  f.dim([0, 0], [L, 0], -6, '144″', { size: 11 }); f.dim([L, 0], [L, H], -6, '97⅛″', { size: 11, flat: true });
  return f.svg('Squaring a wall with diagonals');
};

/* ---------- Rafters ---------- */
FIG.rafterTerms = () => {
  const f = fig(2.4), span = 288, run = 144, rise = 72, wallH = 40, oh = 12, W = 5.5, ph = F.pitchDeg(6);
  const u = K.dir(ph), n = [-u[1], u[0]];
  f.rect(0, 0, 5.5, wallH, 'wall'); f.rect(span - 5.5, 0, 5.5, wallH, 'wall');
  const ridge = [run, wallH + rise];
  const rafter = (dx) => {
    const base = [dx > 0 ? -oh : span + oh, wallH - oh * 0.5];
    const top = ridge;
    const a = dx > 0 ? base : top, b = dx > 0 ? top : base;
    f.board([a, b, K.add(b, K.mul(dx > 0 ? n : [n[0] * -1, n[1]], W)), K.add(a, K.mul(dx > 0 ? n : [n[0] * -1, n[1]], W))], { grain: dx > 0 ? ph : -ph, seed: dx > 0 ? 1 : 2, sp: 5 });
  };
  rafter(1); rafter(-1);
  f.rect(run - 0.75, wallH + rise - 6, 1.5, 12, 'wood2');
  f.dim([0, -4], [span, -4], -4, 'span 24′ (outside to outside)', { size: 11 });
  f.dim([0, wallH], [run, wallH], -10, 'run 12′', { size: 11 });
  f.dim([run, wallH], [run, wallH + rise], -6, 'rise 6′', { size: 11, flat: true });
  f.dim([-oh, wallH - oh / 2], [0, wallH], 8, 'overhang', { size: 10 });
  const o = [span - 40, wallH + 20]; f.line(o, [o[0] + 24, o[1] - 12], 'pencil'); f.pline([[o[0] + 8, o[1] - 4], [o[0] + 8, o[1] - 12], [o[0] + 24, o[1] - 12]], 'leader');
  f.text([o[0] + 16, o[1] - 16], '12', { size: 10 }); f.text([o[0] + 6, o[1] - 8], '6', { size: 10, anchor: 'end' });
  f.note(ridge, [16, -14], 'ridge board');
  f.text([run, wallH / 2], 'attic / room', { cls: 'lbl-s', size: 11 });
  return f.svg('Gable roof terms');
};

FIG.rafterLength = () => {
  const f = fig(4.2), run = 144, ph = F.pitchDeg(6), W = 5.5, r2 = 0.75;
  f.rect(-3.5, -10, 3.5, 10, 'wall');
  f.rect(run - 0.75, 60, 1.5, 22, 'wood2');
  const y0 = 0, xs = [0, run - r2], ys = xs.map(x => x * K.tan(ph));
  const hp = W / K.cos(ph);
  f.board([[xs[0], ys[0]], [xs[1], ys[1]], [xs[1], ys[1] + hp], [xs[0], ys[0] + hp]], { grain: ph, seed: 3, sp: 5 });
  f.line([xs[1], ys[1]], [xs[1], ys[1] + hp], 'cutline');
  f.line([run, 50], [run, 90], 'axis');
  f.dim([run - r2, 88], [run, 88], 2, '¾″', { size: 10 });
  f.dim([0, -12], [run - r2, -12], -3, 'run 143¼″ (144 − ¾)', { size: 11 });
  f.dim([0, hp], [xs[1], ys[1] + hp], 4, 'line length 160³⁄₁₆″', { size: 11 });
  f.note([run, 86], [18, -10], 'ridge center line');
  f.note([0, hp / 2], [-20, 20], 'outside of wall', { anchor: 'end' });
  return f.svg('Common rafter length with ridge reduction');
};

FIG.birdsmouth = () => {
  // wall top plate from x = 0 (outside face, eave side) to 3.5; the rafter rises to the right toward the ridge
  const f = fig(22), ph = F.pitchDeg(6), W = 5.5, seat = 3.5, heel = seat * K.tan(ph);
  f.rect(0, -8, 3.5, 8, 'wall'); plate(f, 0, -3, 3.5, { cls: 'wood2' }); plate(f, 0, -1.5, 3.5);
  const bot = x => x * K.tan(ph) - heel, hp = W / K.cos(ph);
  const xa = -5, xb = 9;
  const pts = [[xa, bot(xa)], [0, bot(0)], [0, 0], [3.5, 0], [xb, bot(xb)], [xb, bot(xb) + hp], [xa, bot(xa) + hp]];
  f.board(pts, { grain: ph, seed: 4 });
  f.line([0, 0], [3.5, 0], 'cutline'); f.line([0, 0], [0, bot(0)], 'cutline');
  f.dim([0, 0], [3.5, 0], -0.5, '3½″ seat', { size: 11, lo: 12 });
  f.dim([0, bot(0)], [0, 0], 1.2, '1¾″ heel', { size: 11, flat: true });
  f.note([2.6, 0], [30, -34], 'seat cut (level)');
  f.note([0, -1], [-40, 26], 'heel cut (plumb)', { anchor: 'end' });
  f.text([5.5, bot(5.5) + hp / 2 + 0.4], '2×6 rafter, 6-in-12', { cls: 'onwood', size: 11 });
  f.text([1.75, -5.5], 'wall', { cls: 'lbl-s', size: 11 });
  f.text([-4, bot(-4) - 0.8], '← tail (eave)', { cls: 'lbl-s', size: 10 });
  f.text([8, bot(8) + hp + 0.8], 'to the ridge →', { cls: 'lbl-s', size: 10 });
  return f.svg('Birds mouth notch on a rafter');
};

FIG.speedSquareRafter = () => {
  // rafter lying flat, top edge at y = W; the ridge end will be to the right, so plumb lines lean left going down
  const f = fig(26), ph = F.pitchDeg(6), W = 5.5, P = [6, W];
  f.plank(-2, 0, 16, W, { seed: 5 });
  const { A, B } = speedSquareAt(f, P, 180 - ph, { scale: false });
  const foot = K.meet(P, K.dir(270 - ph), [0, 0], [1, 0]);
  f.line(P, foot, 'pencil');
  f.note(P, [18, -18], 'pivot on the top edge');
  f.note(K.meet(P, [-1, 0], A, K.sub(B, A)), [-20, -26], 'top edge crosses COMMON 6', { anchor: 'end' });
  f.note(K.lerp(P, foot, 0.7), [30, 16], 'plumb line (vertical once installed)');
  f.line(P, [P[0], 1.5], 'sq');
  f.angle(P, 2.6, 270 - ph, 270, '26.6°', { lr: 26 });
  return f.svg('Marking a plumb line with a speed square');
};

FIG.stepOff = () => {
  const f = fig(7), ph = F.pitchDeg(6), W = 5.5;
  const L = 64, top = x => W / K.cos(ph);
  f.plank(0, 0, L, W, { seed: 6, sp: 6 });
  const u = K.dir(-ph), step = 12 / K.cos(ph);
  for (let i = 0; i < 4; i++) {
    const E1 = [4 + i * step, W], E2 = K.add(E1, K.mul(K.dir(0), step));
    const H = K.add(E1, K.mul(K.dir(-ph), 12 * 1));
    const Hh = K.meet(E1, K.dir(-ph), E2, K.dir(-90 - ph + 90 - 90 + 0));
    // blade from E1 at -ph (12), tongue from its end back up to the edge (6)
    const heel = K.add(E1, K.mul(K.dir(-ph), 12 * K.cos(0)));
    const blade = K.add(E1, K.mul(K.dir(-ph), 12)), tongueTop = K.add(blade, K.mul(K.dir(90 - ph), 6));
    f.pline([E1, blade, tongueTop], i === 0 ? 'tool-o' : 'hidden-l');
    f.line(tongueTop, blade, 'pencil');
    f.text(K.lerp(E1, blade, 0.5), '12', { size: 10, cls: 'lbl-s', dy: 10 });
    f.text(K.lerp(blade, tongueTop, 0.5), '6', { size: 10, cls: 'lbl-s', dx: 8 });
    f.text([tongueTop[0], W + 1.5], String(i + 1), { size: 11, cls: 'lbl-b' });
  }
  f.text([L - 6, W / 2], '… 11 steps + 11¼″', { cls: 'onwood', size: 11 });
  f.text([L / 2, -2.2], 'each step: 12″ on the blade, 6″ on the tongue, both on the top edge', { cls: 'lbl-s', size: 11 });
  return f.svg('Stepping off a rafter with a framing square');
};

FIG.hips = () => {
  const f = fig(2.2), L = 240, B = 168, h = B / 2;
  f.rect(0, 0, L, B, 'glass');
  const r0 = [h, h], r1 = [L - h, h];
  f.line([0, 0], r0, 'plan-line'); f.line([0, B], r0, 'plan-line'); f.line([L, 0], r1, 'plan-line'); f.line([L, B], r1, 'plan-line');
  f.line(r0, r1, 'plan-line');
  for (let x = 24; x < L - 12; x += 24) { if (x > h - 2 && x < L - h + 2) { f.line([x, 0], [x, h - 1], 'thin'); f.line([x, B], [x, h + 1], 'thin'); } }
  f.note([h / 2, h / 2], [-30, 20], 'hip rafter (45° in plan)', { anchor: 'end' });
  f.note([L / 2, h], [10, -20], 'ridge');
  f.note([L / 2, B * 0.8], [30, -10], 'common rafters');
  f.dim([0, 0], [h, 0], -10, '12″ common run', { size: 10 });
  f.dim([0, 0], [h * 0.9, h * 0.9], 10, '16.97″ hip run per foot', { size: 10 });
  return f.svg('Hip roof in plan');
};

/* ---------- Stairs ---------- */
function stairProfile(f, n, R, T, x0 = 0, y0 = 0, o = {}) {
  const pts = [[x0, y0]];
  let x = x0, y = y0;
  for (let i = 0; i < n; i++) { y += R; pts.push([x, y]); if (i < n - 1) { x += T; pts.push([x, y]); } }
  return pts;
}
FIG.stairTerms = () => {
  const f = fig(7), n = 5, R = 7, T = 10.5;
  const s = stairProfile(f, n, R, T);
  const top = s[s.length - 1];
  f.rect(top[0], top[1] - 9, 30, 9, 'wall'); f.text([top[0] + 15, top[1] - 4.5], 'deck / floor', { cls: 'lbl-s', size: 10 });
  const outline = s.concat([[top[0], top[1] - 11.25], [5, -3]]);
  f.board(outline, { grain: F.pitchDeg(R / T * 12), seed: 3, sp: 6 });
  for (let i = 0; i < n - 1; i++) f.plank(i * T - 1, (i + 1) * R, T + 1, 1.2, { seed: i, cls: 'wood2', sp: 4 });
  f.rect(-10, -3, 70, 3, 'wall');
  f.dim([T * 2, 2 * R], [T * 2, 3 * R], -1.5, 'riser', { size: 10, flat: true });
  f.dim([T, 2 * R + 1.2], [2 * T, 2 * R + 1.2], 1.2, 'tread', { size: 10 });
  f.note([T - 1, 2 * R + 0.6], [-20, -16], 'nosing', { anchor: 'end' });
  f.note([T * 1.5, R], [26, 24], 'stringer');
  f.dim([-6, 0], [-6, top[1]], 2, 'total rise', { size: 10, flat: true });
  f.dim([0, -5], [top[0], -5], -1, 'total run', { size: 10 });
  return f.svg('Stair parts');
};

FIG.stairMath = () => {
  const f = fig(6), s = F.stairs(42), R = s.riser, T = 10.5;
  const pts = stairProfile(f, s.risers, R, T);
  f.rect(pts[pts.length - 1][0], 42 - 8, 16, 8, 'wall');
  f.board(pts.concat([[pts[pts.length - 1][0], 42 - 11.25], [6, -2]]), { grain: 33.7, seed: 7, sp: 6 });
  f.rect(-10, -2, 80, 2, 'wall');
  pts.forEach((p, i) => { if (i % 2 === 1 && i < pts.length - 1) f.text(K.add(p, [-1.2, -R / 2]), '7″', { cls: 'dimtext', size: 10, anchor: 'end' }); });
  f.dim([0, 0], [0, 42], 5, '42″ = 6 × 7″', { size: 11, flat: true });
  f.dim([0, -2], [5 * T, -2], -2.5, '52½″ = 5 × 10½″', { size: 11 });
  return f.svg('Stair with six seven inch risers');
};

FIG.stairLayout = () => {
  const f = fig(9), R = 7, T = 10.5, W = 11.25, ang = K.atan(R / T);
  // stringer drawn level; the steps are laid out along its top edge
  const L = 70;
  f.plank(0, 0, L, W, { seed: 8, sp: 7 });
  const hyp = Math.hypot(R, T), u = K.dir(0);
  const notch = [];
  for (let i = 0; i < 4; i++) {
    const a = [6 + i * hyp, W], b = K.add(a, K.mul(K.dir(-ang), 0));
    const pRise = K.add(a, K.mul(K.dir(-90 + 0 - 0), 0));
    const corner = K.add(a, K.mul(K.dir(-(90 - ang)), R));
    const next = [a[0] + hyp, W];
    f.pline([a, corner, next], i === 0 ? 'pencil' : 'pencil');
    if (i === 1) { f.pline([K.add(a, [0, 0]), corner, next], 'tool-o'); f.circle(a, 3, 'dot'); f.circle(next, 3, 'dot'); f.note(corner, [0, 24], 'framing square: tongue 7″, blade 10½″', { anchor: 'middle' }); }
    f.poly([a, corner, next], 'waste');
  }
  f.note([6 + 2 * hyp, W], [10, -18], 'stair gauges ride the top edge');
  f.text([L - 8, 3], '2×12 stringer', { cls: 'onwood', size: 11 });
  return f.svg('Laying out stair notches with a framing square');
};

FIG.stairDrop = () => {
  const f = fig(16), R = 7, T = 10.5, t = 1.5;
  f.rect(-4, -1.5, 22, 1.5, 'wall'); f.text([14, -0.75], 'ground', { cls: 'lbl-s', size: 10 });
  const pts = [[0, 0], [0, R - t], [T, R - t], [T, 2 * R - t], [T + 4, 2 * R - t], [T + 4, 2 * R - t - 9], [6, 0]];
  f.board(pts, { grain: 33.7, seed: 5 });
  f.plank(-1, R - t, T + 1, t, { cls: 'wood2', seed: 2 }); f.plank(T - 1, 2 * R - t, 5, t, { cls: 'wood2', seed: 3 });
  f.poly([[0, 0], [8, 0], [8, -0.001], [0, -0.001]], 'edge');
  f.rect(0, 0, 6, t, 'hidden-l'); f.note([3, t / 2], [-30, -26], 'cut off 1½″ (tread thickness)', { anchor: 'end' });
  f.dim([T + 3, 0], [T + 3, R], -3.5, '7″', { size: 11, flat: true });
  f.dim([T + 5, R], [T + 5, 2 * R], -1.5, '7″', { size: 11, flat: true });
  return f.svg('Dropping the stringer by the tread thickness');
};

/* ---------- Blocking and sheathing ---------- */
FIG.blocking = () => {
  const f = fig(7);
  for (let k = 0; k < 5; k++) stud(f, k * 16 - 0.75 + 0.75, 0, 40);
  for (let k = 0; k < 4; k++) f.plank(k * 16 + 1.5, 18 + (k % 2 ? 1.5 : 0), 14.5, 1.5, { seed: k, cls: 'wood2' });
  f.dim([1.5, 21], [16, 21], 2.6, '14½″', { size: 11 });
  f.dim([0.75, -1], [16.75, -1], -1.5, '16″ OC', { size: 11 });
  f.note([40, 19.5], [30, -30], 'staggered so each end can be nailed');
  return f.svg('Staggered blocking between studs');
};

FIG.sheathing = () => {
  const f = fig(3.6), L = 144, H = 97.125;
  f.plank(0, 0, L, 1.5, { seed: 1, sp: 5 }); f.plank(0, H - 3, L, 3, { seed: 2, sp: 5 });
  const xs = [0]; for (let x = 15.25; x < L - 1.5; x += 16) xs.push(x); xs.push(L - 1.5);
  xs.forEach(x => f.rect(x, 1.5, 1.5, H - 4.5, 'wood2'));
  [[0, 47.94], [48.06, 95.94], [96.06, 144]].forEach(([a, b], i) => { f.rect(a, 0, b - a, H, 'tool-t'); f.text([(a + b) / 2, H / 2], 'sheet ' + (i + 1), { size: 11, cls: 'lbl-b' }); });
  [48, 96].forEach(x => { f.line([x, -3], [x, H + 3], 'sq'); f.text([x, H + 6], x + '″', { cls: 'dimtext', size: 11 }); });
  f.note([48, 20], [24, 0], '⅛″ gap on the stud center');
  return f.svg('Wall sheathing joints on stud centers');
};

/* ---------- Decks ---------- */
FIG.deckLayout = () => {
  const f = fig(2.1), L = 192, D = 144;
  f.rect(-20, D, L + 40, 14, 'wall'); f.text([L / 2, D + 7], 'house', { cls: 'lbl-s', size: 11 });
  f.plank(0, D - 1.5, L, 1.5, { seed: 1 }); f.note([L / 2, D - 0.75], [20, -20], 'ledger');
  const bb = (x, y, dx, dy) => { f.line([x - 12 * dx, y], [x + 12 * dx, y], 'tool-o'); f.line([x, y - 12 * dy], [x, y + 12 * dy], 'tool-o'); };
  f.line([0, D], [0, -30], 'chalk'); f.line([L, D], [L, -30], 'chalk'); f.line([-30, 0], [L + 30, 0], 'chalk');
  f.line([0, D], [L, 0], 'dimline'); f.line([L, D], [0, 0], 'dimline');
  f.text([L * 0.3, D * 0.62], '20′', { cls: 'dimtext halo', size: 12 }); f.text([L * 0.7, D * 0.62], '20′', { cls: 'dimtext halo', size: 12 });
  f.circle([0, D - 72], 3, 'dot'); f.circle([96, D], 3, 'dot'); f.line([0, D - 72], [96, D], 'tape');
  f.text([30, D - 20], '6-8-10', { cls: 'lbl-b halo', size: 11 });
  f.rect(-36, -36, 24, 6, 'tool-o'); f.rect(L + 12, -36, 24, 6, 'tool-o');
  f.note([-24, -33], [-10, 20], 'batter boards', { anchor: 'end' });
  f.dim([0, 0], [L, 0], -18, '16′', { size: 11 }); f.dim([L, 0], [L, D], -18, '12′', { size: 11, flat: true });
  return f.svg('Deck layout with strings and diagonals');
};

FIG.posts = () => {
  const a = fig(20), p = 3.5;
  a.plank(0, 0, p, 14, { grain: 90, seed: 2 });
  a.line([-1, 10], [p + 1, 10], 'pencil');
  a.rect(0, 10, p, 4, 'waste');
  a.line([-3, 10], [-1, 10], 'laser'); a.text([-3.3, 10], 'level line from the ledger', { anchor: 'end', size: 11, cls: 'lbl' });
  a.dim([p, 10], [p, 11.75], -1.2, '1¾″ from this side', { size: 10, flat: true });
  a.dim([p, 11.75], [p, 13.5], -1.2, '… then the other', { size: 10, flat: true });
  a.text([p / 2, 5], '4×4 post', { cls: 'onwood', size: 11, rot: -90 });
  const b = fig(7), W = 5.5, c = 30;
  b.board([[0, 0], [60, 0], [60, W], [W, W]].map(q => q), { seed: 3 });
  const d = K.dir(45), n = [-d[1], d[0]];
  const s0 = [60, 0], s1 = K.add(s0, K.mul(d, c));
  const q = [s0, s1, K.add(s1, K.mul(n, W)), K.add(s0, K.add(K.mul(n, W), K.mul(d, -W * K.tan(22.5))))];
  b.board([s0, s1, K.add(s1, K.mul(n, W)), K.add(s0, K.mul(n, W)).map((v, i) => v)].map(v => v), { grain: 45, seed: 4, cls: 'wood2' });
  b.line(s0, K.add(s0, K.mul(n, W)), 'cutline');
  b.angle(s0, 8, 45, 180, '135°', { lr: 12 });
  b.text([30, -5], 'rim joists at a 45° corner: saw 22.5° each', { cls: 'lbl-b', size: 11 });
  return panels([[a.svg('Cutting a post to height'), 'Post cut to a level line'], [b.svg('Angled deck corner'), 'Angled corner (plan)']]);
};
