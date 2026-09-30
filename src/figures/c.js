/* Guide C · The Angle Book */
/* ---------- Angles ---------- */
FIG.halfRule = () => {
  const W = 3.5, L = 12;
  const draw = (f, sh) => {
    const A = [[0, 0], [L, 0], [L, W], [W, W]].map(p => [p[0] + sh, p[1] - sh]);
    const B = [[0, 0], [W, W], [W, L], [0, L]].map(p => [p[0] - sh, p[1] + sh]);
    f.board(A, { grain: 0, seed: 1 }); f.board(B, { grain: 90, cls: 'wood2', seed: 2 });
    f.line(A[0], A[3], 'cutline'); f.line(B[0], B[1], 'cutline');
    return { A, B };
  };
  const a = fig(20);
  const { A, B } = draw(a, 0);
  a.angle([W, W], 1.6, 0, 90, '90° corner', { lr: 34 });
  a.angle([0, 0], 2.3, 0, 45, '45°', { dx: 4 });
  a.angle([0, 0], 2.3, 45, 90, '45°', { dy: -2 });
  a.note([W / 2, W / 2], [40, 60], 'joint line = bisector');
  const b = fig(20);
  const r = draw(b, 1.1);
  b.angle3(r.A[0], r.A[1], r.A[3], 2.3, '45°');
  b.angle3(r.B[0], r.B[3], r.B[1], 2.3, '45°');
  return panels([[a.svg('Two boards meeting at a 90 degree corner'), 'Assembled'], [b.svg('The same corner pulled apart'), 'Exploded']]);
};

FIG.polys = () => {
  const mk = (n, ap, label) => {
    const f = fig(11);
    const { V, I } = polyFrame(f, n, ap, 3.5);
    const C = 180 - 360 / n, half = C / 2;
    f.angle3(I(1), I(0), I(2), 2.6, deg(C));
    f.angle3(V(2), V(3), I(2), 3.2, deg(half));
    f.line(V(2), K.add(I(2), K.mul(K.norm(K.sub(I(2), V(2))), 2)), 'sq');
    f.text([0, 0.6], label, { cls: 'lbl-b', size: 13 });
    f.text([0, -0.9], 'saw at ' + deg(180 / n), { cls: 'lbl', size: 12 });
    return f.svg(label + ' frame');
  };
  return panels([[mk(6, 13, 'Hexagon'), '<b>n = 6</b> · corner 120° · saw 30°'], [mk(8, 14, 'Octagon'), '<b>n = 8</b> · corner 135° · saw 22.5°']]);
};

FIG.oddCorner = () => {
  const C = 135, t = 0.75, L = 9;
  const a = fig(24);
  const { u1, u2, n1, n2 } = walls(a, C, L + 1.2, 1.1);
  const Q = K.meet(K.mul(n1, t), u1, K.mul(n2, t), u2);
  const p1 = [K.mul(u1, L), [0, 0], Q, K.add(K.mul(u1, L), K.mul(n1, t))];
  const p2 = [[0, 0], K.mul(u2, L), K.add(K.mul(u2, L), K.mul(n2, t)), Q];
  a.board(p1, { grain: 0, seed: 3 }); a.board(p2, { grain: 180 - C, cls: 'wood2', seed: 4 });
  a.line([0, 0], Q, 'cutline');
  const bis = 180 - C / 2;
  a.line([0, 0], K.mul(K.dir(bis), 5.2), 'ang');
  a.angle([0, 0], 3.6, 180 - C, 180, '135° corner', { lr: 16 });
  a.angle([0, 0], 2.1, bis, 180, '67.5°', { lr: 24, arrows: false });
  a.text(K.mul(u1, L - 1), 'wall', { cls: 'lbl-s', dy: 18 });
  a.note(K.lerp(p1[0], p1[3], 0.4), [0, -26], 'baseboard', { anchor: 'middle', dot: false });
  // what the saw sees
  const b = fig(64);
  const e = endCut(b, 0.75, 22.5, { x1: 5.5, alabel: '22.5°', ar: 0.6, lpOff: [14, -12], spOff: [-6, 26] });
  b.angle3(e.SP, [0, 0], e.LP, 0.55, '67.5°');
  b.text([2.1, 0.375], '¾″ baseboard, seen from above', { cls: 'onwood', size: 11 });
  return panels([[a.svg('Baseboard at a 135 degree corner'), 'In the room'], [b.svg('Baseboard end on the saw'), 'On the saw: <b>22.5°</b> from square, 67.5° to the edge']]);
};

FIG.brace = () => {
  const a = 50, w = 3.5;
  const f = fig(10);
  const postW = 3.5, beamY = 24, beamT = 3.5;
  f.board([[0, 0], [postW, 0], [postW, beamY], [0, beamY]], { grain: 90, cls: 'wood2', seed: 1 });
  f.board([[0, beamY], [27, beamY], [27, beamY + beamT], [0, beamY + beamT]], { grain: 0, cls: 'wood2', seed: 2 });
  const u = K.dir(a), n = [-u[1], u[0]];
  const p0 = [postW, 10], q0 = K.add(p0, K.mul(n, w));
  const lowBeam = K.meet(p0, u, [0, beamY], [1, 0]);
  const upPost = K.meet(q0, u, [postW, 0], [0, 1]);
  const upBeam = K.meet(q0, u, [0, beamY], [1, 0]);
  const brace = [p0, lowBeam, upBeam, upPost];
  f.board(brace, { grain: a, seed: 3 });
  f.line(p0, upPost, 'cutline'); f.line(lowBeam, upBeam, 'cutline');
  f.line(p0, K.add(p0, [6.5, 0]), 'sq');
  f.angle(p0, 5, 0, a, '50°');
  f.text([1.75, 5], 'POST', { cls: 'tagt', rot: -90, size: 10 });
  f.text([20, beamY + beamT / 2], 'BEAM', { cls: 'tagt', size: 10 });
  f.note(K.lerp(lowBeam, upBeam, 0.5), [20, -40], 'saw 40°', { cls: 'cuttext' });
  f.note(K.lerp(p0, upPost, 0.5), [34, 30], 'saw 50°', { cls: 'cuttext' });
  // the brace alone, rotated flat
  const g = fig(20);
  const loc = brace.map(p => K.rot(K.sub(p, p0), -a));
  g.board(loc, { grain: 0, seed: 3 });
  g.line(loc[0], loc[3], 'cutline'); g.line(loc[1], loc[2], 'cutline');
  // left end (post): long point is loc[0] on the bottom edge
  g.line(loc[0], [loc[0][0], w], 'sq');
  g.angle3(loc[0], [loc[0][0], w], loc[3], 2.6, '50°', { lr: 18 });
  g.text([loc[0][0] + 1, -1.2], 'post end', { cls: 'lbl-s', anchor: 'start' });
  // right end (beam): long point is loc[1] on the bottom edge
  g.line(loc[1], [loc[1][0], w], 'sq');
  g.angle3(loc[1], [loc[1][0], w], loc[2], 2.6, '40°', { lr: 18 });
  g.text([loc[1][0] - 1, -1.2], 'beam end', { cls: 'lbl-s', anchor: 'end' });
  return panels([[f.svg('A knee brace between a post and a beam'), 'Installed'], [g.svg('The brace laid flat with both end settings'), 'On the saw']]);
};

FIG.sawVsGeo = () => {
  const f = fig(20);
  const R = 7.5;
  f.poly([[-9, -9.5], [9, -9.5], [9, 0], [-9, 0]], 'table');
  f.poly([[-9, 0], [-0.4, 0], [-0.4, 0.9], [-9, 0.9]], 'fence');
  f.poly([[0.4, 0], [9, 0], [9, 0.9], [0.4, 0.9]], 'fence');
  f.text([-5, 1.6], 'FENCE', { cls: 'tagt', size: 10 });
  f.arc([0, 0], R, -140, -40, 'dimline');
  for (let d = -50; d <= 50; d += 5) {
    const big = [0, 15, 22.5, 30, 45].includes(Math.abs(d));
    const a0 = -90 + d;
    f.line(K.mul(K.dir(a0), R), K.mul(K.dir(a0), R - (big ? 0.9 : 0.45)), 'tick');
  }
  [[-22.5, '22.5'], [22.5, '22.5']].forEach(() => {});
  [0, 15, 22.5, 30, 45].forEach(d => [d, -d].forEach((dd, i) => { if (i && !d) return; f.text(K.mul(K.dir(-90 + dd), R + 0.8), (d ? d : '0') + '°', { size: 10, cls: 'lbl' }); }));
  f.poly([[-0.12, 0.3], [0.12, 0.3], [0.12, -R + 0.9], [-0.12, -R + 0.9]], 'blade');
  const g1 = K.dir(-60);
  f.line(K.mul(g1, -0.3), K.mul(g1, R - 0.9), 'blade-g');
  f.angle([0, 0], 4.2, -90, -60, '30°');
  f.note([0, -2.2], [-36, -22], 'blade at 0° = square cut');
  const b = fig(30), W = 3.5;
  const { LP, SP } = endCut(b, W, 30, { x1: 9, alabel: 'saw 30°', ar: 1.9, labels: false });
  b.angle3(SP, [0, 0], LP, 1.3, 'geometry 60°');
  b.text([4.5, -1], '30° + 60° = 90°', { cls: 'lbl-b', size: 12 });
  return panels([[f.svg('Miter saw table scale'), 'The saw scale: 0° is square'], [b.svg('A 30 degree saw cut is 60 degrees geometrically'), 'The same cut, two names']]);
};

/* ---------- Lengths ---------- */
FIG.offsetAnatomy = () => {
  const f = fig(46), W = 3.5, th = 30;
  const { LP, SP, foot, off } = endCut(f, W, th, { x1: 11, alabel: 'θ = 30°', ar: 1.6, alr: 34, lpOff: [16, -16], spOff: [-16, 20] });
  f.dim(SP, foot, -0.8, 'offset = ' + K.dec(off) + '″ ≈ ' + frac(off), { size: 12 });
  f.dim(foot, LP, -0.9, 'W = 3½″', { size: 12 });
  f.text([4, W / 2], '2×4 face', { cls: 'onwood' });
  return `<div class="panel">${f.svg('Anatomy of the offset between long and short point')}</div>`;
};

FIG.offsetFour = () => panels([22.5, 30, 45, 60].map((a, i) => {
  const f = fig(19), W = 3.5, off = W * tan(a);
  endCut(f, W, a, { x0: 0, x1: 9, labels: false, ar: 1.5, seed: i });
  f.dim([9 - off, 0], [9, 0], -0.9, frac(off), { size: 11 });
  return [f.svg(a + ' degree offset'), `<b>${a}°</b> · ${K.dec(off)}″`];
}));

FIG.frame = () => {
  const a = fig(8);
  const { V, I } = polyFrame(a, 4, 15.5, 3.5, { sp: 7 });
  a.dim(I(0), I(1), 3.2, '24″ inside', { size: 11 });
  a.dim(I(1), I(2), 3.2, '24″', { size: 11 });
  a.dim(V(3), V(2), 1.6, '31″ outside', { size: 11 });
  a.dim(V(1), V(2), -1.6, '31″', { size: 11 });
  const b = fig(15), W = 3.5, L = 31;
  const p = [[0, 0], [L, 0], [L - W, W], [W, W]];
  b.board(p, { seed: 8 });
  b.line(p[1], p[2], 'cutline'); b.line(p[0], p[3], 'cutline');
  b.dim(p[0], p[1], -1.1, 'LP–LP 31″ (outside)', { size: 11 });
  b.dim(p[3], p[2], 2.6, 'SP–SP 24″ (inside)', { size: 11 });
  b.line(p[1], [L, W], 'sq');
  b.dim(p[2], [L, W], 1.1, '3½″', { size: 11 });
  b.angle3(p[0], p[1], p[3], 2.4, '45°');
  return panels([[a.svg('Square frame with 24 inch opening'), 'Assembled frame'], [b.svg('One frame piece with its two lengths'), 'One piece: 24 + 3½ + 3½ = 31']]);
};

FIG.bevelLen = () => {
  const T = 1.5, H = 3.5, L = 20;
  const a = fig(14);
  // board lying with its 1½″ thickness along y, standing 3½″ tall (z)
  const R = p => rz(p, -25), out = [[0, 0], [L, 0], [L - T, T], [T, T]];
  a.solid(out.map(p => R([...p, H])), out.map(p => R([...p, 0])), { cut: [1, 3] });
  a.noteI(R([L, 0, H]), [14, -16], 'long point (outside face)');
  a.noteI(R([L - T, T, 0]), [-8, 24], 'short point (inside face)', { anchor: 'end' });
  const b = fig(20);
  const p = [[0, 0], [L, 0], [L - T, T], [T, T]];
  b.board(p, { seed: 9 });
  b.line(p[1], p[2], 'cutline'); b.line(p[0], p[3], 'cutline');
  b.dim(p[0], p[1], -0.9, 'outside face 20″', { size: 11 });
  b.dim(p[3], p[2], 2.1, 'inside face 17″', { size: 11 });
  b.line(p[1], [L, T], 'sq');
  b.dim(p[2], [L, T], 0.8, '1½″', { size: 11 });
  b.angle3(p[1], [L, T], p[2], 1.1, '45°', { lr: 14 });
  b.text([L / 2, T / 2], 'edge view, 1½″ thick', { cls: 'onwood', size: 11 });
  return panels([[a.svg('Isometric view of a beveled 2×4 box side'), 'Isometric'], [b.svg('Edge view of a beveled 2×4 with inside and outside lengths'), 'Edge view: 20 − 1½ − 1½ = 17']]);
};

FIG.thumbFan = () => {
  const f = fig(58), W = 3.5;
  const LP = [0, W];
  f.board([[-7.4, 0], [1.2, 0], [1.2, W], [-7.4, W]], { seed: 11 });
  f.line(LP, [0, 0], 'sq');
  const rays = [[15, '×0.27'], [22.5, '×0.41'], [30, '×0.58'], [45, '×1'], [60, '×1.73']];
  rays.forEach(([a, m], i) => {
    const hit = [-W * tan(a), 0];
    f.line(LP, hit, 'cut');
    f.circle(hit, 2.6, 'dot');
    const dy = [18, 42, 66][i % 3];
    if (i % 3) f.line(hit, [hit[0], -(dy - 8) / f.S], 'leader');
    f.text(hit, a + '°', { cls: 'angtext halo', dy, dx: -4, anchor: 'end', size: 12 });
    f.text(hit, m, { cls: 'dimtext halo', dy, dx: 4, anchor: 'start', size: 12 });
  });
  f.note(LP, [14, -14], 'long point');
  f.text([-7.1, W / 2], 'saw angle · offset as a multiple of W', { anchor: 'start', cls: 'onwood', size: 12, dy: -30 });
  return `<div class="panel">${f.svg('Fan of common angles and their offsets as multiples of width')}</div>`;
};

/* ---------- Slopes ---------- */
FIG.pitch = () => {
  const f = fig(28);
  const A = [0, 0], B = [12, 0], C = [12, 6];
  f.board([A, B, C], { grain: K.angOf(A, C), seed: 12 });
  f.right(B, 90, 10);
  f.dim(A, B, -0.9, 'run 12″');
  f.dim(B, C, -0.9, 'rise 6″', { flat: true });
  f.dim(A, C, 0.9, 'slope ' + K.dec(Math.hypot(12, 6)) + '″');
  f.angle(A, 3.4, 0, K.atan(0.5), '26.57°', { lr: 30, at: 0.4 });
  // roof-drawing pitch symbol
  const o = [15.5, 4];
  f.line(o, [o[0] + 3, o[1] + 1.5], 'pencil');
  f.pline([[o[0] + 1, o[1] + 0.5], [o[0] + 3, o[1] + 0.5], [o[0] + 3, o[1] + 1.5]], 'leader');
  f.text([o[0] + 2, o[1] + 0.1], '12', { size: 11, dy: 4 });
  f.text([o[0] + 3.3, o[1] + 1], '6', { size: 11, anchor: 'start' });
  f.text([o[0] + 1.6, o[1] - 1], 'on a drawing', { cls: 'lbl-s', size: 10 });
  return `<div class="panel">${f.svg('Right triangle for a 6 in 12 pitch')}</div>`;
};

FIG.rafter = () => {
  const phi = K.atan(0.5), W = 5.5, u = K.dir(phi), n = [-u[1], u[0]];
  const topY = x => x * tan(phi) + W / K.cos(phi);
  const botY = x => x * tan(phi);
  const X = 18;
  // (a) plumb-cut tail
  const a = fig(17);
  const pa = [[0, 0], [X, botY(X)], [X, topY(X)], [0, topY(0)]];
  a.board(pa, { grain: phi, seed: 13 });
  a.line(pa[0], pa[3], 'cutline');
  a.line([0, 0], [9, 0], 'sq');
  a.angle([0, 0], 6, 0, phi, 'slope 26.57°', { lr: 44 });
  const sqEnd = K.mul(n, W);
  a.line([0, 0], sqEnd, 'sq');
  a.angle3([0, 0], pa[3], sqEnd, 3.4, 'saw 26.6°', { lr: 40, dy: -4 });
  a.dim(sqEnd, pa[3], 0.8, '2¾″', { size: 11 });
  a.note([0, 1.2], [-16, 12], 'plumb cut', { cls: 'cuttext' });
  a.note([0, 0], [16, 22], 'long point');
  // (b) plumb + level cut
  const b = fig(14);
  const h = 3.5, yl = topY(0) - h, xl = yl / tan(phi);
  const pb = [[0, yl], [xl, yl], [X, botY(X)], [X, topY(X)], [0, topY(0)]];
  b.board(pb, { grain: phi, seed: 14 });
  b.line(pb[4], pb[0], 'cutline'); b.line(pb[0], pb[1], 'cutline');
  b.right(pb[0], 0, 9);
  b.note([0, (yl + topY(0)) / 2], [-18, 0], 'plumb cut · saw 26.6°', { cls: 'cuttext' });
  b.note([xl / 2, yl], [0, 34], 'level cut · 63.4° from square', { cls: 'cuttext', anchor: 'middle' });
  return panels([[a.svg('Rafter tail with a plumb cut'), 'Plumb cut'], [b.svg('Rafter tail with plumb and level cuts'), 'Plumb + level cut']]);
};

/* ---------- Compound ---------- */
function splayPanels(f, tilt, gap) {
  const b0 = 5.5, H = 8, d = 0.75, tt = tan(tilt), sh = d / K.cos(tilt);
  const s = z => b0 + z * tt, si = z => s(z) - sh;
  // panel on the +x side, then rotate copies
  const base = [[s(0), -s(0), 0], [s(0), s(0), 0], [s(H), s(H), H], [s(H), -s(H), H]];
  const inner = [[si(0), -si(0), 0], [si(0), si(0), 0], [si(H), si(H), H], [si(H), -si(H), H]];
  const rotZ = (p, k) => { const c = [1, 0, -1, 0][k], sn = [0, 1, 0, -1][k]; return [p[0] * c - p[1] * sn, p[0] * sn + p[1] * c, p[2]]; };
  const order = [2, 3, 0, 1]; // back panels first
  order.forEach(k => {
    const mv = rotZ([gap, 0, 0], k);
    const A = base.map(p => rotZ(p, k)).map(p => [p[0] + mv[0], p[1] + mv[1], p[2]]);
    const B = inner.map(p => rotZ(p, k)).map(p => [p[0] + mv[0], p[1] + mv[1], p[2]]);
    f.solid(A, B, { cut: gap ? [1, 3] : [] });
  });
}
FIG.splay = () => {
  const a = fig(13); splayPanels(a, 15, 0);
  a.noteI([7.6, 7.6, 8], [16, -14], 'sides lean out 15°');
  const b = fig(13); splayPanels(b, 15, 2.6);
  b.noteI([8.1, 3, 4], [30, 26], 'compound cut face');
  return panels([[a.svg('Splayed planter assembled'), 'Assembled'], [b.svg('Splayed planter exploded'), 'Exploded']]);
};

FIG.compoundSaw = () => {
  const S = 15, n = 4, A = 180 / n, M = K.atan(K.sin(S) * tan(A)), B = K.asin(K.cos(S) * K.sin(A));
  const a = fig(20);
  endCut(a, 5.5, M, { x1: 11, alabel: 'miter ' + deg(M, 1), ar: 2.6, labels: false });
  a.text([4.5, 2.75], 'face of the side piece', { cls: 'onwood', size: 11 });
  const b = fig(60);
  endCut(b, 0.75, B, { x1: 4, alabel: 'bevel ' + deg(B, 1), ar: 0.55, labels: false });
  b.text([1.7, 0.375], 'edge of the side, ¾″ thick', { cls: 'onwood', size: 11 });
  return panels([[a.svg('Miter setting seen from above'), `From above: <b>${deg(M, 1)}</b> miter`], [b.svg('Bevel setting seen from the front'), `From the front: <b>${deg(B, 1)}</b> bevel`]]);
};

FIG.errors = () => {
  // octagon chain: each cut 0.5° shy, 8 pieces, every joint glued tight except the last
  const th = 22, W = 3.5, L = 9, n = 8;
  const f = fig(12);
  let O = [0, 0];
  for (let k = 0; k < n; k++) {
    const d = k * 2 * th, u = K.dir(d), nl = [-u[1], u[0]];
    const O2 = K.add(O, K.mul(u, L));
    const p = [O, O2, K.add(K.add(O2, K.mul(nl, W)), K.mul(u, -W * tan(th))), K.add(K.add(O, K.mul(nl, W)), K.mul(u, W * tan(th)))];
    f.board(p, { cls: k % 2 ? 'wood2' : 'wood', grain: d, seed: k, sp: 7 });
    if (k === 0) f.line(p[0], p[3], 'cutline');
    if (k === n - 1) { f.line(p[1], p[2], 'cutline'); f.note(K.lerp(p[1], p[2], 0.2), [40, 34], '8° short: last joint won’t close', { cls: 'cuttext' }); }
    O = O2;
  }
  f.text([L / 2, 7], 'every cut 22°', { cls: 'lbl-b', size: 12 });
  f.text([L / 2, 5.6], 'instead of 22.5°', { cls: 'lbl-s', size: 11 });
  // single corner with too-small angle
  const g = fig(22), s = 42, Lp = 9;
  const tip = W - W * tan(s);
  const A = [[tip, 0], [Lp, 0], [Lp, W], [W, W]];
  const B = [[0, tip], [W, W], [W, Lp], [0, Lp]];
  g.board(A, { seed: 3 }); g.board(B, { cls: 'wood2', grain: 90, seed: 4 });
  g.poly([[W, W], [tip, 0], [0, 0], [0, tip]], 'gap');
  g.line([0, 0], [Lp + 1, 0], 'sq'); g.line([0, 0], [0, Lp + 1], 'sq');
  g.note([tip * 0.45, tip * 0.45], [-26, 26], 'gap at the outside', { cls: 'cuttext' });
  g.note([W, W], [30, 22], 'heel touches');
  g.text([Lp / 2 + 2, -1.2], 'cuts at 42° instead of 45°', { cls: 'lbl-s', size: 11 });
  return panels([[f.svg('Octagon dry fit with accumulated error'), 'Errors pile into one joint'], [g.svg('A single corner with a too-small miter'), 'Too small an angle: open at the tips']]);
};

/* ---------- Irregular shapes ---------- */
// offset a CCW polygon inward by d (each edge moves to its left)
function insetPoly(V, d) {
  const n = V.length, lines = V.map((p, i) => { const q = V[(i + 1) % n], u = K.norm(K.sub(q, p)), nl = [-u[1], u[0]]; return [K.add(p, K.mul(nl, d)), u]; });
  return V.map((_, i) => { const a = lines[(i - 1 + n) % n], b = lines[i]; return K.meet(a[0], a[1], b[0], b[1]); });
}
FIG.irregular = () => {
  const f = fig(12), W = 3.5;
  const corners = [80, 100, 95, 85];
  let d = 0; const P0 = [0, 0], P1 = K.add(P0, K.mul(K.dir(0), 24)), d1 = 180 - corners[1], P2 = K.add(P1, K.mul(K.dir(d1), 17));
  const d2 = d1 + 180 - corners[2], P3 = K.meet(P2, K.dir(d2), P0, K.dir(corners[0]));
  const V = [P0, P1, P2, P3], I = insetPoly(V, W);
  for (let k = 0; k < 4; k++) f.board([V[k], V[(k + 1) % 4], I[(k + 1) % 4], I[k]], { cls: k % 2 ? 'wood2' : 'wood', grain: K.angOf(V[k], V[(k + 1) % 4]), seed: k, sp: 8 });
  for (let k = 0; k < 4; k++) {
    f.line(V[k], I[k], 'cutline');
    f.angle3(I[k], I[(k + 3) % 4], I[(k + 1) % 4], 2.2, corners[k] + '°');
    const out = K.norm(K.sub(V[k], I[k]));
    f.text(K.add(V[k], K.mul(out, 1.6)), `J${k + 1} · saw ${F.sawFromCorner(corners[k])}°`, { cls: 'cuttext halo', size: 12 });
  }
  return f.svg('Irregular four sided frame with a different saw setting at each joint');
};

/* ---------- Tapers ---------- */
// Tapers are under 1°, invisible at true scale, so widths are drawn 4× (X) while lengths stay true.
FIG.taperLeg = () => {
  const a = fig(17), L = 29, X = 4, W = 1.75 * X, s = 5, r = 0.375 * X;
  a.board([[0, 0], [s, 0], [L, r], [L, W], [0, W]], { seed: 4, sp: 7 });
  a.poly([[s, 0], [L, 0], [L, r]], 'waste');
  a.line([s, 0], [L, r], 'cutline');
  a.line([s, -0.3], [s, W + 0.3], 'pencil-d');
  a.dim([0, W], [s, W], 1.1, '5″ apron', { size: 11 });
  a.dim([s, W], [L, W], 1.1, '24″ taper', { size: 11 });
  a.dim([L, 0], [L, r], -1.2, '⅜″', { size: 11, flat: true });
  a.dim([0, 0], [0, W], 1.2, '1¾″', { size: 11, flat: true });
  a.text([s / 2, W / 2], 'top', { cls: 'onwood', size: 11 });
  a.text([L / 2, -1.2], 'width drawn 4× larger than length so the taper shows', { cls: 'lbl-s', size: 11 });
  const b = fig(60), q = 1.75, rr = 0.375;
  b.poly([[0, 0], [q, 0], [q, q], [0, q]], 'endface');
  b.poly([[0, 0], [q, 0], [q, rr], [0, rr]], 'waste');
  b.poly([[q - rr, rr], [q, rr], [q, q], [q - rr, q]], 'waste');
  b.poly([[0, rr], [q - rr, rr], [q - rr, q], [0, q]], 'edge');
  b.dim([0, q], [q - rr, q], 0.35, '1⅜″', { size: 11 });
  b.dim([q, 0], [q, q], -0.35, '1¾″', { size: 11, flat: true });
  b.text([q / 2, rr / 2], 'inside faces', { cls: 'cuttext halo', size: 10 });
  return panels([[a.svg('Side view of a tapered table leg'), 'Side view'], [b.svg('The foot of the leg from below'), 'The foot (true scale)']]);
};

FIG.taperLayout = () => {
  const f = fig(22), L = 29, X = 4, W = 1.75 * X, s = 5, r = 0.375 * X;
  f.plank(0, 0, L, W, { seed: 6, sp: 7 });
  f.poly([[s, 0], [L, 0], [L, r]], 'waste');
  f.line([s, -0.4], [s, W + 0.4], 'pencil');
  f.line([s, 0], [L, r], 'pencil');
  f.pline([[L - 0.6, r + 0.5], [L - 0.02, r], [L - 0.6, r - 0.5]], 'pencil');
  f.note([s, W + 0.4], [-10, -16], '1. start mark (square line)');
  f.note([L, r], [16, 18], '2. ⅜″ in at the foot');
  f.note([(s + L) / 2, r / 2 + 0.05], [0, 38], '3. join with a straightedge', { anchor: 'middle' });
  f.dim([0, W], [s, W], 1.2, '5″', { size: 11 });
  f.text([L / 2, W / 2], 'width drawn 4× so the taper shows', { cls: 'onwood', size: 11 });
  return f.svg('Laying out a taper on a leg');
};
