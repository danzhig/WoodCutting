/* Guide B · Measure & Mark */

// ---- reusable tool drawings (top views, board edge along y = 0, face above it) ----
const boardFace = (f, x0, x1, W = 5.5, seed = 20) => f.board([[x0, 0], [x1, 0], [x1, W], [x0, W]], { seed });
function speedSquareAt(f, P, rot = 0, o = {}) {
  // right-angle (pivot) corner at P; lip leg along dir(rot), marking leg along dir(rot + 90)
  const A = K.add(P, K.mul(K.dir(rot), 7)), B = K.add(P, K.mul(K.dir(rot + 90), 7));
  const down = K.dir(rot - 90);
  f.poly([P, A, B], 'tool-t');
  f.poly([P, A, K.add(A, K.mul(down, 0.45)), K.add(P, K.mul(down, 0.45))], 'tool-d');
  for (let i = 1; i < 7; i++) { const q = K.add(P, K.mul(K.dir(rot + 90), i)); f.line(q, K.add(q, K.mul(K.dir(rot), 0.35)), 'tick'); }
  // degree scale: tick where the ray from the pivot at `a` (from the lip leg) meets the hypotenuse
  for (let a = 0; a <= 90; a += 5) {
    const q = K.meet(P, K.dir(rot + a), A, K.sub(B, A)), inward = K.norm(K.sub(P, q));
    f.line(q, K.add(q, K.mul(inward, a % 10 ? 0.25 : 0.45)), 'tick');
    if (o.scale && a % 30 === 0) f.text(K.add(q, K.mul(inward, 0.85)), String(a), { size: 9, cls: 'lbl-s' });
  }
  return { A, B };
}
function wallsOutside(f, C, L, thick) {
  // convex corner at the origin pointing down; wall material above, between rays at 90 ± C/2
  const a1 = 90 - C / 2, a2 = 90 + C / 2, u1 = K.dir(a1), u2 = K.dir(a2);
  const n1 = [u1[1], -u1[0]], n2 = [-u2[1], u2[0]]; // outward (room-side) normals
  const in1 = K.mul(n1, -thick), in2 = K.mul(n2, -thick);
  const inner = K.meet(in1, u1, in2, u2);
  f.poly([[0, 0], K.mul(u1, L), K.add(K.mul(u1, L), in1), inner, K.add(K.mul(u2, L), in2), K.mul(u2, L)], 'wall');
  return { u1, u2, n1, n2, a1, a2 };
}
function armsTool(f, V, d1, d2, len, label, o = {}) {
  // two-arm angle finder with its hinge at V, arms along unit directions d1, d2, offset `off` to one side
  // o.n1, o.n2: unit normals pointing to the side each arm sits on (the room side)
  const w = 0.5;
  const arm = (d, nn) => { const n = K.mul(nn, w); f.poly([V, K.add(V, K.mul(d, len)), K.add(K.add(V, K.mul(d, len)), n), K.add(V, n)], 'tool-t'); };
  arm(d1, o.n1); arm(d2, o.n2);
  f.disc(V, 0.9, 'tool');
  if (o.lcd) { const c = K.add(V, K.mul(K.norm(K.add(d1, d2)), o.lcdAt || 2.6)); f.rect(c[0] - 1.1, c[1] - 0.45, 2.2, 0.9, 'screen'); f.text(c, label, { cls: 'lcd', size: 13 }); }
  else if (label) f.text(K.add(V, K.mul(K.norm(K.add(d1, d2)), o.labelAt || 2.4)), label, { cls: 'angtext halo', size: 13 });
}

/* ---------- Straight measuring ---------- */
FIG.tapeHook = () => {
  const tape = (f, zero, x1) => {
    f.poly([[zero - 0.02, 1.52], [x1, 1.52], [x1, 1.72], [zero - 0.02, 1.72]], 'tape');
    for (let i = 0; i <= Math.floor(x1 - zero); i++) { const x = zero + i; f.line([x, 1.72], [x, i % 2 ? 1.62 : 1.56], 'tapetick'); if (i && i < x1 - zero) f.text([x, 1.95], String(i), { cls: 'dimtext', size: 10 }); }
  };
  const a = fig(38), t = 0.22;
  a.plank(0, 0, 8, 1.5, { seed: 2 });
  tape(a, 0, 8.3);
  a.poly([[-t, 0.6], [0, 0.6], [0, 1.72], [-t, 1.72]], 'tool-d');
  a.line([0, -0.5], [0, 2.4], 'sq');
  a.text([0, 2.65], 'true zero = board end', { cls: 'lbl-b', size: 11 });
  a.arrow([-0.2, -0.35], [-1.3, -0.35]); a.text([-0.75, -0.75], 'hook slides out', { size: 10, cls: 'lbl-s' });
  const b = fig(38);
  b.rect(-1.4, -0.4, 1.4, 3.2, 'wall');
  tape(b, 0, 8.3);
  b.poly([[0, 1.1], [t, 1.1], [t, 1.72], [0, 1.72]], 'tool-d');
  b.line([0, -0.3], [0, 2.4], 'sq');
  b.text([0.3, 2.65], 'true zero = wall face', { cls: 'lbl-b', size: 11, anchor: 'start' });
  b.arrow([0.9, 0.6], [0.25, 0.6]); b.text([1, 0.6], 'hook slides in', { size: 10, cls: 'lbl-s', anchor: 'start' });
  b.text([-0.7, 1.2], 'wall', { cls: 'lbl-s', size: 10, rot: -90 });
  return panels([[a.svg('Tape hooked over a board end'), 'Outside measurement: pull'], [b.svg('Tape pushed against a wall'), 'Inside measurement: push']]);
};

FIG.storyStick = () => {
  const f = fig(9), H = 36, shelves = [7.5, 16, 24.5];
  const side = (x, marks) => {
    f.plank(x, 0, 0.75, H, { grain: 90, seed: x });
    if (marks) shelves.forEach(y => f.plank(x + 0.75, y, 7, 0.75, { seed: y, sp: 5 }));
  };
  side(0, true); side(18, false);
  const stick = (x) => { f.plank(x, 0, 1, H + 2, { cls: 'wood2', grain: 90, seed: x + 3, sp: 5 }); shelves.forEach((y, i) => { f.line([x, y], [x + 1, y], 'pencil'); f.text([x - 0.3, y], 'S' + (i + 1), { anchor: 'end', size: 10, cls: 'lbl-b' }); }); };
  stick(-2.4); stick(15.8);
  shelves.forEach(y => { f.line([16.9, y], [18, y], 'pencil'); f.line([18.75, y], [20, y], 'pencil-d'); });
  f.text([-1.9, -1.6], 'stick', { size: 11, cls: 'lbl-s' });
  f.text([4, -1.6], 'side 1', { size: 11, cls: 'lbl-s' });
  f.text([16.3, -1.6], 'stick', { size: 11, cls: 'lbl-s' });
  f.text([18.6, -3], 'side 2: marks copied', { size: 11, cls: 'lbl-s' });
  f.line([-2.6, 0], [21, 0], 'thin'); f.text([21.2, 0], 'bottom', { size: 10, cls: 'lbl-s', anchor: 'start' });
  return f.svg('Story stick transferring shelf heights');
};

/* ---------- Squares ---------- */
FIG.speedSquare = () => {
  const f = fig(40);
  boardFace(f, -2.5, 9.5);
  speedSquareAt(f, [0, 0], 0, { scale: true });
  f.line([-0.1, 0.05], [-0.1, 5.5], 'pencil');
  f.line([7.12, 0.14], [1.62, 5.64], 'pencil');
  f.note([-0.1, 4.6], [-18, -8], '90° line');
  f.note([2.6, 4.65], [34, -24], '45° line');
  f.note([3.5, -0.45], [0, 24], 'lip hooks the edge', { anchor: 'middle' });
  f.note([0, 0], [-26, 20], 'pivot corner');
  f.note([4.6, 2.9], [46, 4], 'degree scale');
  f.text([-1.5, 2.75], '2×6 face', { cls: 'onwood', size: 11, rot: -90 });
  return f.svg('Speed square hooked on the edge of a 2 by 6');
};

FIG.speedPivot = () => {
  const f = fig(36), P = [1.5, 0], th = 30;
  boardFace(f, -3.5, 10);
  f.line([-3.5, 0], [10, 0], 'thin');
  speedSquareAt(f, P, -th, { scale: true });
  const end = K.meet(P, K.dir(90 - th), [0, 5.5], [1, 0]);
  f.line(P, end, 'pencil');
  f.line(P, [P[0], 5.2], 'sq');
  f.angle(P, 3.4, 90 - th, 90, 'saw 30°', { lr: 34 });
  f.angle(P, 2.2, 0, 90 - th, '60° from edge', { lr: 50 });
  f.note(K.meet(P, K.dir(0), K.add(P, K.mul(K.dir(-th), 7)), K.sub(K.add(P, K.mul(K.dir(90 - th), 7)), K.add(P, K.mul(K.dir(-th), 7)))), [18, 26], 'edge crosses the scale at 30');
  f.note(P, [-24, 22], 'pivot on the edge');
  return f.svg('Speed square pivoted to 30 degrees');
};

FIG.framingSquare = () => {
  const a = fig(10);
  a.poly([[0, 0], [24, 0], [24, 2], [1.5, 2], [1.5, 16], [0, 16]], 'tool');
  for (let i = 1; i < 24; i++) a.line([i, 0], [i, i % 2 ? 0.3 : 0.5], 'tick');
  for (let i = 1; i < 16; i++) a.line([0, i], [i % 2 ? 0.3 : 0.5, i], 'tick');
  a.text([13, 1], 'blade 24″ × 2″', { size: 12, cls: 'lbl-b' });
  a.text([0.75, 9], 'tongue 16″ × 1½″', { size: 12, cls: 'lbl-b', rot: -90 });
  a.note([0, 0], [-16, 18], 'heel');
  const b = fig(11), W = 9.25;
  const E1 = [0, W], blade = K.dir(-26.565), H = K.add(E1, K.mul(blade, 12)), E2 = K.add(H, K.mul(K.dir(63.435), 6));
  b.plank(-3, 0, 30, W, { seed: 5, sp: 8 });
  const ub = K.dir(153.435), ut = K.dir(63.435);
  b.poly([H, K.add(H, K.mul(ub, 24)), K.add(K.add(H, K.mul(ub, 24)), K.mul(ut, 2)), K.add(H, K.mul(ut, 2))], 'tool-t');
  b.poly([H, K.add(H, K.mul(ut, 16)), K.add(K.add(H, K.mul(ut, 16)), K.mul(ub, 1.5)), K.add(H, K.mul(ub, 1.5))], 'tool-t');
  b.line(H, E2, 'pencil'); b.line(H, E1, 'pencil');
  b.circle(E1, 3, 'dot'); b.circle(E2, 3, 'dot');
  b.text(E1, '12', { cls: 'lbl-b', dy: -14, size: 12 }); b.text(E2, '6', { cls: 'lbl-b', dy: -14, size: 12 });
  b.note(K.lerp(H, E2, 0.5), [40, 18], 'tongue edge: plumb line');
  b.note(K.lerp(H, E1, 0.55), [-10, 36], 'blade edge: level line', { anchor: 'end' });
  return panels([[a.svg('Parts of a framing square'), 'Blade, tongue and heel'], [b.svg('Framing square set to 12 and 6 on a board edge'), 'Set at 12 and 6: a 6-in-12 slope']]);
};

FIG.comboSquare = () => {
  const a = fig(26);
  boardFace(a, -3, 7);
  a.poly([[-2.2, -1.4], [2.2, -1.4], [2.2, 0], [-2.2, 0]], 'tool-d');
  a.poly([[0, -1.4], [1, -1.4], [1, 7.5], [0, 7.5]], 'tool-t');
  for (let i = 0; i < 9; i++) a.line([1, i - 0.9], [0.7, i - 0.9], 'tick');
  a.line([1.14, 0.05], [1.14, 5.5], 'pencil');
  a.note([1.14, 3.5], [26, -8], 'mark along the blade');
  a.note([-1.4, -1.4], [-6, 22], 'head: 90° face on the edge', { anchor: 'middle' });
  const b = fig(26), P = [3.5, 0], e = 6;
  boardFace(b, -1, 8);
  b.line(P, K.add(P, K.mul(K.dir(90 + e), 5.5)), 'pencil');
  b.line(P, K.add(P, K.mul(K.dir(90 - e), 5.5)), 'pencil');
  b.text(K.add(P, K.mul(K.dir(90 + e), 5.3)), '1st line', { size: 11, cls: 'lbl-b halo', anchor: 'end', dx: -6 });
  b.text(K.add(P, K.mul(K.dir(90 - e), 5.3)), 'after flipping', { size: 11, cls: 'lbl-b halo', anchor: 'start', dx: 6 });
  b.dim(K.add(P, K.mul(K.dir(90 + e), 3.6)), K.add(P, K.mul(K.dir(90 - e), 3.6)), -0.2, 'gap = 2 × error', { size: 11, lo: 14 });
  b.line([P[0], 0], [P[0], 5.2], 'sq');
  return panels([[a.svg('Combination square marking a square line'), 'Marking a square line'], [b.svg('Flip test for a square'), 'Flip test (exaggerated)']]);
};

/* ---------- Angle tools ---------- */
const protractorAt = (f, O, R, o = {}) => {
  const semi = []; for (let t = 0; t <= 180; t += 6) semi.push(K.add(O, K.mul(K.dir(t), R)));
  f.poly(semi, 'tool-t');
  for (let t = 0; t <= 180; t += 10) f.line(K.add(O, K.mul(K.dir(t), R)), K.add(O, K.mul(K.dir(t), R - (t % 30 ? 0.3 : 0.6))), 'tick');
  [0, 30, 60, 90, 120, 150, 180].forEach(t => {
    f.text(K.add(O, K.mul(K.dir(t), R - 1.05)), String(t), { size: 9, cls: 'lbl' });
    if (o.inner) f.text(K.add(O, K.mul(K.dir(t), R - 1.75)), String(180 - t), { size: 9, cls: 'angtext' });
  });
  f.circle(O, 3, 'dot');
};
FIG.protractorRead = () => {
  const d = fig(24), O = [4, 0], R = 3.6;
  boardFace(d, -1.5, 9.5);
  protractorAt(d, O, R);
  d.line(O, K.add(O, K.mul(K.dir(60), 5.4)), 'pencil');
  d.note(K.add(O, K.mul(K.dir(60), R)), [22, -10], 'reads 60°');
  d.note(O, [0, 24], 'center mark on your point', { anchor: 'middle', dot: false });
  const e = fig(34), O2 = [0, 0], R2 = 4.4;
  protractorAt(e, O2, R2, { inner: true });
  e.line([-5, 0], [5, 0], 'thin');
  e.line(O2, K.mul(K.dir(60), 5.4), 'pencil');
  e.angle(O2, 1.3, 0, 60, '60°', { lr: 14 });
  e.note(K.mul(K.dir(60), R2 - 1.05), [34, -30], 'outer scale: 60 (0 on the right)');
  e.note(K.mul(K.dir(60), R2 - 1.75), [38, 6], 'inner scale: 120 (0 on the left)', { cls: 'angtext' });
  return panels([[d.svg('Protractor on a board'), 'On the board'], [e.svg('Two protractor scales'), 'Two scales, opposite directions']]);
};

FIG.angleFinder = () => {
  const f = fig(28), C = 135;
  const { u1, u2, n1, n2 } = walls(f, C, 9, 1);
  armsTool(f, [0, 0], u1, u2, 7, '135°', { n1, n2, labelAt: 3.2 });
  f.angle([0, 0], 4.3, 180 - C, 180, '', {});
  f.text(K.mul(u1, 8), 'wall', { cls: 'lbl-s', dy: 16 });
  return f.svg('Two arm angle finder in a 135 degree corner');
};

FIG.bevelTool = () => {
  const c = fig(24);
  boardFace(c, -3, 9);
  c.poly([[-2.5, -1.1], [3.2, -1.1], [3.2, 0], [-2.5, 0]], 'tool-d');
  const bu = K.dir(60), bn = [-bu[1], bu[0]], piv = [0, -0.5];
  c.poly([K.add(piv, K.mul(bn, -0.35)), K.add(K.add(piv, K.mul(bu, 7.5)), K.mul(bn, -0.35)), K.add(K.add(piv, K.mul(bu, 7.5)), K.mul(bn, 0.35)), K.add(piv, K.mul(bn, 0.35))], 'tool-t');
  c.circle(piv, 6, 'tool');
  c.line([0.62, 0.02], K.add([0.62, 0], K.mul(bu, 6.3)), 'pencil');
  c.angle([0.3, 0], 2.2, 0, 60, '60°', { lr: 16 });
  c.note(piv, [-24, 22], 'wing nut locks it');
  const s = fig(22), a = 30;
  s.rect(-9, 0, 18, 0.9, 'fence');
  s.rect(-9, -8, 18, 8, 'table');
  const bd = K.dir(-90 + a);
  s.poly([K.add([0, 0.3], K.mul([-bd[1], bd[0]], 0.12)), K.add(K.mul(bd, 7), K.mul([-bd[1], bd[0]], 0.12)), K.add(K.mul(bd, 7), K.mul([-bd[1], bd[0]], -0.12)), K.add([0, 0.3], K.mul([-bd[1], bd[0]], -0.12))], 'blade');
  s.poly([[-6.5, -1], [-0.6, -1], [-0.6, 0], [-6.5, 0]], 'tool-d');
  const p0 = [-0.45, -0.55], nb = [bd[1], -bd[0]];
  s.poly([p0, K.add(p0, K.mul(bd, 5.5)), K.add(K.add(p0, K.mul(bd, 5.5)), K.mul(nb, 0.35)), K.add(p0, K.mul(nb, 0.35))], 'tool-t');
  s.circle(p0, 5, 'tool');
  s.text([-5, 1.5], 'FENCE', { cls: 'tagt', size: 10 });
  s.note(K.add(p0, K.mul(bd, 4)), [-40, 10], 'bevel blade flat on the saw blade', { anchor: 'end' });
  s.note([-3.5, -1], [-10, 22], 'handle on the fence', { anchor: 'end' });
  return panels([[c.svg('Sliding bevel marking a board'), 'Marking the wood'], [s.svg('Sliding bevel setting a miter saw'), 'Setting the saw (top view, unplugged)']]);
};

FIG.digitalTools = () => {
  const a = fig(26), C = 91.4;
  const wa = walls(a, C, 7, 0.9);
  armsTool(a, [0, 0], wa.u1, wa.u2, 6, `${C}°`, { lcd: true, lcdAt: 2.8, n1: wa.n1, n2: wa.n2 });
  const b = fig(40), tilt = 45;
  b.rect(-4, -0.5, 8, 0.5, 'table');
  const up = K.dir(90 + tilt), side = K.dir(tilt);
  const base = [0.2, 0];
  b.poly([K.add(base, K.mul(side, -0.06)), K.add(K.add(base, K.mul(up, 3.2)), K.mul(side, -0.06)), K.add(K.add(base, K.mul(up, 3.2)), K.mul(side, 0.06)), K.add(base, K.mul(side, 0.06))], 'blade');
  const cube = (c, a, txt, cls) => { const pts = [[-0.5, 0], [0.5, 0], [0.5, 1], [-0.5, 1]].map(p => K.add(c, K.rot(p, a))); b.poly(pts, cls); b.text(K.add(c, K.rot([0, 0.5], a)), txt, { cls: 'lcd', size: 11 }); };
  cube([2.6, 0], 0, '0.0', 'screen');
  cube(K.add(base, K.add(K.mul(up, 1.4), K.mul(side, 0.07))), -tilt, '45.0', 'screen');
  b.angle(base, 1.2, 90, 90 + tilt, '45°', { lr: 14 });
  b.line(base, K.add(base, [0, 3]), 'sq');
  b.note([2.6, 1], [14, -14], '1. zero on the table');
  b.note(K.add(base, K.mul(up, 2)), [-20, -20], '2. stick on the blade', { anchor: 'end' });
  return panels([[a.svg('Digital angle finder in a corner'), 'Digital angle finder'], [b.svg('Magnetic angle gauge on a tilted blade'), 'Magnetic angle gauge (front view)']]);
};

/* ---------- Level, plumb and lines ---------- */
FIG.levelFlip = () => {
  const one = (flip) => {
    const f = fig(22), L = 24, tilt = 0;
    f.rect(-1, -1.2, L + 2, 1.2, 'wall');
    f.rect(0, 0, L, 1.3, 'tool');
    const vx = L / 2, off = flip ? -0.45 : 0.45;
    f.rect(vx - 1.3, 0.3, 2.6, 0.7, 'glass');
    f.line([vx - 0.45, 0.3], [vx - 0.45, 1], 'thin'); f.line([vx + 0.45, 0.3], [vx + 0.45, 1], 'thin');
    f.rect(vx + off - 0.3, 0.42, 0.6, 0.46, 'bubble');
    f.text([1, 0.65], flip ? 'B' : 'A', { cls: 'lbl-b', size: 12 });
    f.text([L - 1, 0.65], flip ? 'A' : 'B', { cls: 'lbl-b', size: 12 });
    f.text([L / 2, -0.6], 'surface that is actually level', { cls: 'lbl-s', size: 10 });
    return f.svg(flip ? 'Level flipped end for end' : 'Level in first position');
  };
  return panels([[one(false), 'First reading: bubble right'], [one(true), 'Turned end for end: bubble left, so the level is out']]);
};

FIG.plumbLaser = () => {
  const a = fig(9);
  a.rect(-6, 30, 16, 3.5, 'wall'); a.text([2, 31.75], 'ceiling joists', { cls: 'lbl-s', size: 10 });
  a.plank(-2, 28.5, 8, 1.5, { seed: 3 }); a.text([2, 29.25], 'top plate', { cls: 'onwood', size: 10 });
  a.line([-2, 28.5], [-2, 1.2], 'pencil');
  a.poly([[-2.5, 1.9], [-1.5, 1.9], [-2, 0.2]], 'tool');
  a.rect(-6, -1, 16, 1, 'wall'); a.text([6, -0.5], 'floor', { cls: 'lbl-s', size: 10 });
  a.pline([[-2.6, 0.02], [-2, 0.02], [-1.4, 0.02]], 'pencil'); a.circle([-2, 0.02], 2.5, 'dot');
  a.note([-2, 14], [18, 0], 'string hangs plumb');
  a.note([-2, 0.02], [30, -14], 'mark the floor here');
  const b = fig(7);
  b.rect(0, 0, 60, 40, 'glass');
  b.line([0, 36], [60, 36], 'laser');
  b.poly([[52, 0], [53, 0], [54, 34.5], [51, 34.5]], 'tool-o'); b.rect(51, 34.5, 3.4, 3, 'tool');
  b.plank(8, 34.5, 30, 3, { seed: 4, sp: 5 });
  b.text([23, 36], 'chair rail at the laser line', { cls: 'onwood', size: 11 });
  b.dim([0, 0], [0, 36], 1.8, '36″', { size: 11, flat: true });
  b.text([30, 20], 'wall', { cls: 'lbl-s', size: 11 });
  return panels([[a.svg('Plumb bob from top plate to floor'), 'Plumb bob'], [b.svg('Laser level line on a wall'), 'Laser level']]);
};

FIG.chalkLine = () => {
  const f = fig(5.5), W = 96, H = 48, y = 23.5;
  f.plank(0, 0, W, H, { seed: 8, sp: 7 });
  f.pline([[0, y], [W / 2, y + 4], [W, y]], 'chalk');
  f.line([0, y], [W, y], 'pencil-d');
  f.circle([0, y], 3, 'dot'); f.circle([W, y], 3, 'dot');
  f.rect(-5, y - 1.5, 4, 3, 'tool');
  f.hand([W / 2, y + 7.4], 90, 5.5);
  f.arrow([W / 2 + 6, y + 1], [W / 2 + 6, y + 6]); f.text([W / 2 + 7, y + 3.5], 'lift straight up, then let go', { anchor: 'start', size: 11, cls: 'lbl' });
  f.dim([W + 3, 0], [W + 3, y], -1, '23½″', { size: 11, flat: true });
  f.text([W / 2, 6], '4 × 8 sheet', { cls: 'onwood', size: 12 });
  return f.svg('Snapping a chalk line across a sheet');
};

/* ---------- Scribing ---------- */
const baseProfile = y => y < 3.2 ? 0.75 : y < 3.6 ? 0.75 - (y - 3.2) * 0.4 : y < 4.4 ? 0.59 - 0.3 * Math.sin((y - 3.6) / 0.8 * Math.PI / 2) : 0.29;
FIG.contour = () => {
  const f = fig(40), top = 4.6;
  f.rect(-1.2, -0.2, 1.2, 5.6, 'wall');
  const prof = []; for (let y = 0; y <= top; y += 0.05) prof.push([baseProfile(y), y]);
  f.board([[0, 0]].concat(prof, [[0, top]]), { grain: 90, seed: 3, sp: 6 });
  for (let y = 0.1; y < 5.3; y += 0.12) { const x = y <= top ? baseProfile(y) : 0; f.line([x + 0.02, y], [x + 2.6, y], 'tick'); }
  f.rect(1.9, -0.2, 0.35, 5.6, 'tool');
  f.text([-0.6, 2.6], 'wall', { cls: 'lbl-s', size: 10, rot: -90 });
  f.note([0.4, 1.5], [-30, 30], 'baseboard (side view)', { anchor: 'end' });
  f.note([2.6, 5], [16, -10], 'pins take the shape');
  return f.svg('Contour gauge copying a baseboard profile');
};

FIG.scribe = () => {
  const f = fig(28), L = 20, W = 4, G = 0.8;
  const g = x => G * (0.5 - 0.5 * Math.cos(2 * Math.PI * (x - 3) / 14)) + 0.18 * Math.sin(x * 1.3);
  const gmin = Math.min(...Array.from({ length: 201 }, (_, i) => g(i / 10)));
  const wall = x => W + g(x) - gmin, Gmax = Math.max(...Array.from({ length: 201 }, (_, i) => wall(i / 10) - W));
  const pts = Array.from({ length: 81 }, (_, i) => [L * i / 80, wall(L * i / 80)]);
  f.poly(pts.concat([[L, W + 3], [0, W + 3]]), 'wall');
  f.plank(0, 0, L, W, { seed: 6 });
  const scribe = pts.map(([x, y]) => [x, y - Gmax]);
  f.poly(scribe.concat([[L, W], [0, W]]), 'waste');
  f.pline(scribe, 'pencil');
  const xm = pts.reduce((m, p) => (p[1] > m[1] ? p : m));
  f.dim([xm[0], W], [xm[0], xm[1]], -1.6, '¼″ widest gap', { size: 11, flat: true });
  const cx = 12, cy = wall(cx);
  f.line([cx, cy], [cx + 0.9, cy + 1.6], 'tool-o'); f.line([cx, cy - Gmax], [cx + 0.9, cy + 1.6], 'tool-o');
  f.circle([cx, cy - Gmax], 2.5, 'dot');
  f.note([cx, cy - Gmax], [20, 26], 'compass pencil draws the scribe line');
  f.text([L / 2, 1.5], 'shelf (top view)', { cls: 'onwood', size: 12 });
  f.text([L / 2, W + 2.2], 'uneven wall', { cls: 'lbl-s', size: 11 });
  return f.svg('Scribing a shelf to a wavy wall');
};

/* ---------- Measuring what you need to cut ---------- */
function insideCorner(f, C) { const { u1, u2, n1, n2 } = walls(f, C, 8, 0.9); armsTool(f, [0, 0], u1, u2, 5.5, C + '°', { labelAt: 3, n1, n2 }); }
function outsideCorner(f, C) {
  const { u1, u2, n1, n2 } = wallsOutside(f, C, 8, 0.9);
  armsTool(f, [0, 0], u1, u2, 5.5, '', { n1, n2 });
  f.angle([0, 0], 1.6, 90 - C / 2, 90 + C / 2, C + '°', { lr: 16 });
}
FIG.whichTool = () => {
  const a = fig(16); insideCorner(a, 135);
  const b = fig(16); outsideCorner(b, 90);
  const c = fig(14), ph = K.atan(3.5 / 12);
  c.board([[0, 0], [20, 20 * K.tan(ph)], [20, 20 * K.tan(ph) + 5.5 / K.cos(ph)], [0, 5.5 / K.cos(ph)]], { grain: ph, seed: 2, sp: 6 });
  const y0 = 5.5 / K.cos(ph), xc = 18;
  const top = x => x * K.tan(ph) + y0;
  c.rect(xc - 14, top(xc), 14, 1, 'tool');
  c.dim([xc - 12, top(xc - 12)], [xc - 12, top(xc)], -1.2, '3½″', { size: 11, flat: true });
  const d = fig(40), t = 45, base = [0, 0];
  d.rect(-2.5, -0.4, 5, 0.4, 'table');
  d.poly([[0.06, 0], K.add([0.06, 0], K.mul(K.dir(90 + t), 2.6)), K.add([-0.06, 0], K.mul(K.dir(90 + t), 2.6)), [-0.06, 0]], 'blade');
  const cube = K.add(base, K.add(K.mul(K.dir(90 + t), 1.2), K.mul(K.dir(t), 0.07)));
  d.poly([[-0.4, 0], [0.4, 0], [0.4, 0.8], [-0.4, 0.8]].map(p => K.add(cube, K.rot(p, -t))), 'screen');
  d.text(K.add(cube, K.rot([0, 0.4], -t)), '45.0', { cls: 'lcd', size: 10 });
  return panels([[a.svg('Inside corner'), '<b>Inside corner</b>: angle finder'], [b.svg('Outside corner'), '<b>Outside corner</b>: arms wrapped around'], [c.svg('Slope'), '<b>Slope</b>: level and tape'], [d.svg('Blade tilt'), '<b>Blade tilt</b>: digital gauge']]);
};

FIG.insideOutside = () => {
  const a = fig(22); insideCorner(a, 91);
  a.text([-4, 3.4], 'room', { cls: 'lbl-s', size: 11 });
  const b = fig(22); outsideCorner(b, 88);
  b.text([0, -2.6], 'room', { cls: 'lbl-s', size: 11 });
  return panels([[a.svg('Measuring an inside corner'), '<b>Inside corner</b>: 91°'], [b.svg('Measuring an outside corner'), '<b>Outside corner</b>: 88°']]);
};

FIG.slopeMeasure = () => {
  const f = fig(20), ph = K.atan(3.5 / 12), W = 5.5, y0 = W / K.cos(ph);
  const top = x => x * K.tan(ph) + y0;
  f.board([[0, 0], [26, 26 * K.tan(ph)], [26, top(26)], [0, y0]], { grain: ph, seed: 4 });
  const xc = 25, yc = top(xc), xm = xc - 12;
  f.rect(xc - 24, yc, 24, 1.3, 'tool');
  f.rect(xc - 13.3, yc + 0.35, 2.6, 0.6, 'glass'); f.rect(xc - 12.3, yc + 0.42, 0.6, 0.46, 'bubble');
  f.dim([xm, yc + 1.3], [xc, yc + 1.3], 1, '12″', { size: 11 });
  f.line([xm, yc], [xm, top(xm)], 'tape');
  f.dim([xm, top(xm)], [xm, yc], -1.3, '3½″ drop', { size: 11, flat: true });
  f.angle([xc, yc], 6, 180, 180 + ph, '16.26°', { lr: 26 });
  f.note([xc, yc], [16, -10], 'level touches the high point');
  f.text([14, 5], 'rafter', { cls: 'onwood', size: 12 });
  return f.svg('Measuring the rise per 12 of a sloped board');
};

/* ---------- Checking square ---------- */
FIG.diagonals = () => {
  const frame = (shift, cap) => {
    const f = fig(5), w = 48, h = 30, t = 2.5;
    const O = [[0, 0], [w, 0], [w + shift, h], [shift, h]];
    f.poly(O, 'wood'); f.poly(O, 'edge');
    f.poly([[t + shift * t / h, t], [w - t + shift * t / h, t], [w - t + shift * (h - t) / h, h - t], [t + shift * (h - t) / h, h - t]], 'glass');
    const d1 = Math.hypot(w + shift, h), d2 = Math.hypot(w - shift, h);
    f.line(O[0], O[2], 'dimline'); f.line(O[1], O[3], 'dimline');
    f.text(K.lerp(O[0], O[2], 0.3), K.frac(d1), { cls: 'dimtext halo', size: 12 });
    f.text(K.lerp(O[1], O[3], 0.3), K.frac(d2), { cls: 'dimtext halo', size: 12 });
    f.dim([0, 0], [w, 0], -2.5, '48″', { size: 11 }); f.dim([w, 0], [w + shift, h], -3, '30″', { size: 11, flat: true });
    return f.svg(cap);
  };
  return panels([[frame(0, 'Square frame'), '<b>Square</b>: diagonals equal'], [frame(4, 'Racked frame'), '<b>Racked</b> (exaggerated): diagonals differ']]);
};

FIG.threeFourFive = () => {
  const f = fig(3.2), a = 72, b = 96;
  f.rect(-20, -8, 110, 8, 'wall'); f.text([35, -4], 'house wall', { cls: 'lbl-s', size: 11 });
  f.line([0, 0], [a + 18, 0], 'plan-line'); f.line([0, 0], [0, b + 18], 'plan-line');
  f.right([0, 0], 0, 12);
  f.circle([a, 0], 3, 'dot'); f.circle([0, b], 3, 'dot');
  f.line([a, 0], [0, b], 'tape');
  f.dim([0, 0], [a, 0], -9, '6 ft', { size: 12 });
  f.dim([0, 0], [0, b], 9, '8 ft', { size: 12, flat: true });
  f.text(K.lerp([a, 0], [0, b], 0.5), '10 ft', { cls: 'dimtext halo', size: 13, dx: 16, dy: 10 });
  f.text([40, 70], 'deck', { cls: 'lbl-s', size: 12 });
  return f.svg('3-4-5 triangle scaled to 6-8-10 feet');
};

/* ---------- Kept from the original handbook ---------- */
FIG.transfer = () => {
  const C = 135;
  const a = fig(22);
  const { u1, u2, n1, n2 } = walls(a, C, 9, 1);
  // bevel: handle along wall 1, blade along wall 2
  const hw = 0.55;
  a.poly([[0, 0.06], [-5.5, 0.06], [-5.5, 0.06 + hw * 1.6], [0, 0.06 + hw * 1.6]], 'tool-d');
  const bb = K.add([0, 0], K.mul(n2, 0.06));
  a.poly([bb, K.add(bb, K.mul(u2, 7)), K.add(K.add(bb, K.mul(u2, 7)), K.mul(n2, hw)), K.add(bb, K.mul(n2, hw))], 'tool-t');
  a.circle([-0.35, 0.5], 5, 'tool');
  a.angle([0, 0], 3.2, 180 - C, 180, '135°', { lr: 18 });
  a.text(K.mul(u1, 7.5), 'wall', { cls: 'lbl-s', dy: 16 });
  a.note([-3.5, 0.9], [-4, -30], 'handle', { anchor: 'middle' });
  a.note(K.add(K.mul(u2, 5), K.mul(n2, 0.3)), [18, -4], 'blade');
  // compass bisection
  const b = fig(22);
  const V = [0, 0], r1 = 3, r2 = 3.4;
  const d1 = K.dir(180), d2 = K.dir(180 - C);
  b.line(V, K.mul(d1, 8), 'pencil'); b.line(V, K.mul(d2, 8), 'pencil');
  const A = K.mul(d1, r1), B = K.mul(d2, r1);
  b.arc(V, r1, 180 - C - 10, 190, 'pencil-d');
  const bis = K.dir(180 - C / 2);
  // intersection of two circles of radius r2 about A and B (on the bisector)
  const m = K.lerp(A, B, 0.5), half = K.len(K.sub(B, A)) / 2, hgt = Math.sqrt(r2 * r2 - half * half);
  const X = K.add(m, K.mul(bis, hgt));
  const aX = K.angOf(A, X), bX = K.angOf(B, X);
  b.arc(A, r2, aX - 14, aX + 14, 'pencil-d'); b.arc(B, r2, bX - 14, bX + 14, 'pencil-d');
  b.circle(A, 2.6, 'dot'); b.circle(B, 2.6, 'dot'); b.circle(X, 2.6, 'dot');
  b.line(V, K.add(V, K.mul(bis, 7.5)), 'cut');
  b.text(K.add(V, K.mul(K.dir(180 - C - 14), r1 + 0.1)), '①', { size: 13, cls: 'lbl-b' });
  b.text(K.add(A, K.mul(K.dir(aX + 24), r2)), '②', { size: 13, cls: 'lbl-b' });
  b.text(K.add(B, K.mul(K.dir(bX - 24), r2)), '③', { size: 13, cls: 'lbl-b' });
  b.note(K.add(V, K.mul(bis, 6.5)), [16, -6], 'cut line (bisector)', { cls: 'cuttext' });
  return panels([[a.svg('Sliding bevel copying a wall corner'), 'Copy the corner'], [b.svg('Bisecting an angle with a compass'), 'Halve it with a compass']]);
};

FIG.markCut = () => {
  const f = fig(18), W = 3.5, L = 31, end = 38, k = 0.125;
  const kx = k / K.cos(45);
  // stock: left end already mitered (LP at origin on the bottom edge)
  f.board([[0, 0], [L, 0], [L - W, W], [W, W]], { seed: 21 });
  f.board([[L + kx, 0], [end, 0], [end, W], [L - W + kx, W]], { cls: 'wood2', seed: 22 });
  f.poly([[L + kx, 0], [end, 0], [end, W], [L - W + kx, W]], 'waste');
  f.poly([[L, 0], [L + kx, 0], [L - W + kx, W], [L - W, W]], 'kerf');
  f.line([0, 0], [W, W], 'cutline');
  // X on the waste
  const xc = [34.8, W / 2];
  f.line(K.add(xc, [-0.7, -0.7]), K.add(xc, [0.7, 0.7]), 'pencil'); f.line(K.add(xc, [-0.7, 0.7]), K.add(xc, [0.7, -0.7]), 'pencil');
  // crow's foot
  f.pline([[L - 0.5, 0.9], [L, 0.02], [L + 0.5, 0.9]], 'pencil');
  // tape
  f.poly([[0, -0.25], [33.5, -0.25], [33.5, -1.35], [0, -1.35]], 'tape');
  for (let i = 1; i <= 33; i++) f.line([i, -0.25], [i, i % 6 ? -0.6 : -0.85], 'tapetick');
  for (let i = 6; i <= 24; i += 6) f.text([i, -1.05], String(i), { cls: 'tapetext', size: 9 });
  f.text([L, -1.05], '31', { cls: 'tapetext', size: 9 });
  f.poly([[-0.25, -0.25], [0, -0.25], [0, 0.9], [-0.25, 0.9]], 'tool-d');
  f.note([-0.12, 0.6], [-10, -26], 'tape hooked on the long point');
  f.note([L, 0.02], [20, 46], 'crow’s foot: tip on 31″');
  f.note(K.lerp([L + kx / 2, 0], [L - W + kx / 2, W], 0.75), [-40, -30], 'kerf on the waste side', { cls: 'cuttext' });
  f.note(K.add(xc, [0.7, 0.7]), [22, -26], 'X marks the waste');
  return `<div class="panel">${f.svg('Measuring and marking a mitered piece')}</div>`;
};

