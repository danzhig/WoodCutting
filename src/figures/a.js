/* Guide A · Lumber & Numbers (and the home-page hero) */
/* ---------- Hero ---------- */
FIG.twoByFour = () => {
  const f = fig(20);
  f.board([[0, 0], [3.5, 0], [3.5, 1.5], [0, 1.5]], { cls: 'wood', grain: false });
  // end-grain rings, clipped
  const s = [];
  for (let r = 0.5; r < 5; r += 0.42) s.push([2.1 + 0.2, -2.2 - 0.0, r]);
  f.add(`<clipPath id="eg"><rect x="0" y="-30" width="70" height="30"/></clipPath><g clip-path="url(#eg)">` + s.map(([cx, cy, r]) => `<circle class="grain" cx="${cx * 20}" cy="${-cy * 20}" r="${r * 20}" fill="none"/>`).join('') + '</g>');
  f.poly([[0, 0], [3.5, 0], [3.5, 1.5], [0, 1.5]], 'edge');
  f.dim([0, 1.5], [3.5, 1.5], 0.55, '3½″ face', { size: 11 });
  f.dim([3.5, 0], [3.5, 1.5], -0.5, '1½″', { size: 11, flat: true });
  return f.svg('End view of a 2×4: 3½ inches by 1½ inches', 6);
};

FIG.hero = () => {
  const f = fig(27), L = 15, W = 3.5, T = 1.5, o = W;
  const top = [[0, 0], [L, 0], [L - o, W], [0, W]];
  f.prism(top, 0, T, { cut: [1], end: [3] });
  const sh = [1.3, 1.3];
  const wedge = [[L, 0], [L, W], [L - o, W]].map(p => [p[0] + sh[0], p[1] + sh[1]]);
  f.prism(wedge, 0, T, { waste: true });
  f.noteI([L, 0, T], [18, -26], 'long point');
  f.noteI([L - o, W, T], [-30, 34], 'short point');
  f.noteI([L - o / 2, W / 2, T], [-36, -40], '45° miter', { cls: 'lbl-b' });
  f.noteI([L + sh[0], W + sh[1], T / 2], [28, 24], 'waste', { cls: 'cuttext', dot: false });
  f.dim(iso([0, W, 0]), iso([0, W, T]), 0.7, '1½″', { flat: true, size: 11 });
  f.dim(iso([0, 0, T]), iso([0, W, T]), -0.7, '3½″', { size: 11 });
  return f.svg('Isometric view of a 2×4 with a 45 degree miter and the waste wedge pulled away');
};

/* ---------- Vocabulary ---------- */
FIG.crossRip = () => {
  const L = 24;
  // crosscut
  const a = fig(15), W = 3.5, y2 = -6.5;
  a.board([[0, 0], [L, 0], [L, W], [0, W]], { seed: 1 });
  a.line([14, -0.7], [14, W + 0.7], 'cut');
  a.text([-0.6, W / 2], 'BEFORE', { anchor: 'end', cls: 'tagt', size: 10 });
  a.board([[0, y2], [14, y2], [14, y2 + W], [0, y2 + W]], { seed: 1 });
  a.board([[15, y2], [L + 1, y2], [L + 1, y2 + W], [15, y2 + W]], { seed: 2 });
  a.line([14, y2], [14, y2 + W], 'cutline'); a.line([15, y2], [15, y2 + W], 'cutline');
  a.text([-0.6, y2 + W / 2], 'AFTER', { anchor: 'end', cls: 'tagt', size: 10 });
  a.arrow([1, W + 1.4], [6, W + 1.4]); a.text([6.5, W + 1.4], 'grain', { anchor: 'start', cls: 'lbl-s' });
  a.dim([0, y2], [14, y2], -1, '14″', { size: 11 });
  // rip
  const b = fig(15), W2 = 5.5;
  b.board([[0, 0], [L, 0], [L, W2], [0, W2]], { seed: 3 });
  b.line([-0.7, 2.75], [L + 0.7, 2.75], 'cut');
  b.text([-0.9, W2 / 2], 'BEFORE', { anchor: 'end', cls: 'tagt', size: 10 });
  const s1 = -4, s2 = -8;
  b.board([[0, s1], [L, s1], [L, s1 + 2.7], [0, s1 + 2.7]], { seed: 4 });
  b.board([[0, s2], [L, s2], [L, s2 + 2.7], [0, s2 + 2.7]], { seed: 5 });
  b.line([0, s1], [L, s1], 'cutline'); b.line([0, s2 + 2.7], [L, s2 + 2.7], 'cutline');
  b.text([-0.9, (s1 + s2 + 2.7) / 2], 'AFTER', { anchor: 'end', cls: 'tagt', size: 10 });
  b.arrow([1, W2 + 1.4], [6, W2 + 1.4]); b.text([6.5, W2 + 1.4], 'grain', { anchor: 'start', cls: 'lbl-s' });
  return panels([
    [a.svg('Crosscut diagram'), '<b>Crosscut:</b> across the grain. The board gets shorter.'],
    [b.svg('Rip cut diagram'), '<b>Rip cut:</b> along the grain. The board gets narrower.']
  ]);
};

FIG.mbc = () => {
  const L = 9, W = 3.5, T = 1.5, m = W * tan(30), b = T * tan(45);
  const P3 = (pts, z) => pts.map(p => [...p, z]);
  const make = (top, bot, ghost, note) => {
    const f = fig(22);
    f.solid(P3(top, T), P3(bot, 0), { cut: [1], end: [3] });
    if (ghost) f.solid(ghost[0], ghost[1], { ghost: true });
    note(f);
    return f.svg();
  };
  const miter = make([[0, 0], [L, 0], [L - m, W], [0, W]], [[0, 0], [L, 0], [L - m, W], [0, W]],
    [P3([[L, 0], [L, W], [L - m, W]], T), P3([[L, 0], [L, W], [L - m, W]], 0)],
    f => f.noteI([L - m / 2, W / 2, T], [-24, -42], 'slanted across the face'));
  // bevel: top face is shorter, so the sloped end faces up toward the viewer
  const bevel = make([[0, 0], [L - b, 0], [L - b, W], [0, W]], [[0, 0], [L, 0], [L, W], [0, W]],
    [[[L - b, 0, T], [L, 0, T], [L, 0, 0]], [[L - b, W, T], [L, W, T], [L, W, 0]]],
    f => f.noteI([L - b / 2, W / 2, T / 2], [-4, 40], 'sloped through the thickness', { anchor: 'end' }));
  const comp = make([[0, 0], [L - b, 0], [L - m - b, W], [0, W]], [[0, 0], [L, 0], [L - m, W], [0, W]],
    null,
    f => f.noteI([L - m / 2 - b / 2, W / 2, T / 2], [10, -44], 'both at once'));
  return panels([[miter, '<b>Miter</b> · 30° across the face'], [bevel, '<b>Bevel</b> · 45° through the thickness'], [comp, '<b>Compound</b> · 30° miter + 45° bevel']]);
};

FIG.mbcFlat = () => {
  const a = fig(26);
  endCut(a, 3.5, 30, { x1: 10, alabel: '30°', lpOff: [14, -14], spOff: [-14, 18] });
  a.dim([0, 0], [0, 3.5], 0.6, '3½″ face', { size: 11 });
  a.text([4, -1.3], 'TOP VIEW (looking down on the face)', { cls: 'tagt', size: 10 });
  const b = fig(26);
  endCut(b, 1.5, 45, { x1: 10, alabel: '45°', ar: 1.1, lpOff: [14, -14], spOff: [-14, 18] });
  b.dim([0, 0], [0, 1.5], 0.6, '1½″', { size: 11, flat: true });
  b.text([4, -1.3], 'SIDE VIEW (looking at the edge)', { cls: 'tagt', size: 10 });
  return panels([[a.svg('Top view of a 30 degree miter'), '<b>Miter:</b> the angle shows on the face.'], [b.svg('Side view of a 45 degree bevel'), '<b>Bevel:</b> the angle shows on the edge.']]);
};

FIG.points = () => {
  const W = 3.5, L = 16;
  const a = fig(22);
  const pts = [[0, 0], [L, 0], [L - W, W], [W, W]];
  a.board(pts, { seed: 6 });
  a.line(pts[1], pts[2], 'cutline'); a.line(pts[0], pts[3], 'cutline');
  a.note(pts[0], [-14, 18], 'long point'); a.note(pts[1], [14, 18], 'long point');
  a.note(pts[3], [-14, -16], 'short point'); a.note(pts[2], [14, -16], 'short point');
  a.text([L / 2, 0.55], 'outside edge (long)', { cls: 'onwood', size: 11 });
  a.text([L / 2, W - 0.55], 'inside edge (short)', { cls: 'onwood', size: 11 });
  a.angle3(pts[1], pts[0], pts[2], 1.5, '45°');
  const b = fig(20), T = 1.5, R = p => rz(p, -25);
  const out = [[0, 0], [L, 0], [L - W, W], [W, W]];
  b.solid(out.map(p => R([...p, T])), out.map(p => R([...p, 0])), { cut: [1, 3] });
  b.noteI(R([0, 0, T]), [-10, -20], 'long point'); b.noteI(R([L, 0, T]), [14, -16], 'long point');
  b.noteI(R([W, W, T]), [-16, 24], 'short point'); b.noteI(R([L - W, W, T]), [-10, 34], 'short point');
  return panels([[a.svg('Top view of a frame piece'), 'Top view'], [b.svg('Isometric view of a frame piece'), 'Isometric view']]);
};

FIG.kerf = () => {
  const k = 0.125, W = 3.5, mark = 6;
  const f = fig(44);
  const row = (y, x0, label, desc) => {
    // keeper
    f.board([[0, y], [x0, y], [x0, y + W], [0, y + W]], { seed: y });
    f.poly([[x0, y], [x0 + k, y], [x0 + k, y + W], [x0, y + W]], 'kerf');
    f.board([[x0 + k, y], [10, y], [10, y + W], [x0 + k, y + W]], { cls: 'wood2', seed: y + 1 });
    f.poly([[x0 + k, y], [10, y], [10, y + W], [x0 + k, y + W]], 'waste');
    f.line([mark, y - 0.35], [mark, y + W + 0.35], 'pencil');
    f.text([3, y + W / 2], 'keeper', { cls: 'onwood' });
    f.text([8.2, y + W / 2], 'waste', { cls: 'cuttext halo' });
    f.dim([0, y], [x0, y], -0.75, label, { size: 11 });
    f.text([-0.4, y + W / 2], desc, { anchor: 'end', cls: 'tagt', size: 10 });
  };
  row(5.2, mark - k / 2, '5¹⁵⁄₁₆″ (short)', 'ON THE LINE');
  row(0, mark, '6″ exactly', 'WASTE SIDE');
  f.note([mark, 5.2 + W + 0.35], [10, -14], 'pencil mark at 6″');
  f.note([mark + k / 2, W * 0.8], [22, -8], 'kerf ⅛″', { cls: 'cuttext', dot: false });
  return `<div class="panel">${f.svg('Kerf placement: on the line versus on the waste side')}</div>`;
};


/* ---------- Lumber basics ---------- */
FIG.lumberSizes = () => {
  const f = fig(15);
  const list = [['1×4', 0.75, 3.5, 1, 4], ['1×6', 0.75, 5.5, 1, 6], ['2×4', 1.5, 3.5, 2, 4], ['2×6', 1.5, 5.5, 2, 6], ['2×8', 1.5, 7.25, 2, 8], ['4×4', 3.5, 3.5, 4, 4], ['6×6', 5.5, 5.5, 6, 6]];
  let x = 0;
  list.forEach(([name, t, w, nt, nw], i) => {
    f.rect(x, 0, nt, nw, 'hidden-l');
    f.poly([[x, 0], [x + t, 0], [x + t, w], [x, w]], 'endface');
    f.text([x + nt / 2, -0.9], name, { cls: 'lbl-b', size: 12 });
    f.text([x + nt / 2, -1.9], `${K.frac(t)}×${K.frac(w)}`, { cls: 'dimtext', size: 10 });
    x += nt + 1.6;
  });
  return f.svg('End views of common lumber sizes, actual inside nominal');
};

FIG.facesEdges = () => {
  const a = fig(22), L = 12, W = 3.5, T = 1.5;
  a.prism([[0, 0], [L, 0], [L, W], [0, W]], 0, T, { end: [1] });
  a.noteI([L / 2, W / 2, T], [-10, -40], 'face (wide)', { cls: 'lbl-b' });
  a.noteI([L / 2, W, T / 2], [-20, 34], 'edge (narrow)', { cls: 'lbl-b' });
  a.noteI([L, W / 2, T / 2], [30, 20], 'end (end grain)', { cls: 'lbl-b' });
  a.noteI([L * 0.3, W / 2, T], [10, -46], 'grain runs along the length', { dot: false });
  const ends = (quarter) => {
    const f = fig(26), w = 5.5, t = 1.5;
    const id = 'eg' + (quarter ? 'q' : 'f') + Math.random().toString(36).slice(2, 6);
    f.poly([[0, 0], [w, 0], [w, t], [0, t]], 'endface');
    const S = f.S; let s = `<clipPath id="${id}"><rect x="0" y="${-t * S}" width="${w * S}" height="${t * S}"/></clipPath><g clip-path="url(#${id})">`;
    if (!quarter) for (let r = 0.6; r < 9; r += 0.42) s += `<circle class="grain" cx="${w / 2 * S}" cy="${3.2 * S}" r="${(r + 2.6) * S}" fill="none"/>`;
    else for (let x = 0.25; x < w; x += 0.32) s += `<line class="grain" x1="${x * S}" y1="0" x2="${(x + 0.12) * S}" y2="${-t * S}"/>`;
    f.add(s + '</g>'); f.poly([[0, 0], [w, 0], [w, t], [0, t]], 'edge');
    f.text([w / 2, -0.55], quarter ? 'quartersawn: rings run through the thickness' : 'flatsawn: rings arc across the end', { cls: 'lbl-s', size: 11 });
    return f.svg(quarter ? 'Quartersawn end grain' : 'Flatsawn end grain');
  };
  return panels([[a.svg('Faces, edges and ends of a board'), 'Names of the surfaces'], [ends(false) + '<div style="height:10px"></div>' + ends(true), 'End-grain patterns']]);
};

FIG.defects = () => {
  const L = 16, W = 3.5, T = 1.5, n = 24, bend = 1.1;
  const curve = (k, amp) => Array.from({ length: n + 1 }, (_, i) => [L * i / n, amp * Math.sin(Math.PI * i / n) + k]);
  const strip = (lo, hi) => lo.concat(hi.slice().reverse());
  // crown: seen from the side (looking at the edge)
  const a = fig(14);
  a.rect(0, 0, L, T, 'hidden-l');
  a.board(strip(curve(0, bend), curve(T, bend)), { seed: 1, sp: 6 });
  a.note([L / 2, T + bend], [14, -16], 'crown: install this side up');
  a.text([L / 2, -0.9], 'looking at the edge', { cls: 'lbl-s', size: 11 });
  // bow: seen from above (looking at the face)
  const b = fig(14);
  b.rect(0, 0, L, W, 'hidden-l');
  b.board(strip(curve(0, bend), curve(W, bend)), { seed: 2, sp: 6 });
  b.text([L / 2, -0.9], 'looking at the face', { cls: 'lbl-s', size: 11 });
  // cup: the end of the board
  const c = fig(34), m = 12;
  const arc = (dz) => Array.from({ length: m + 1 }, (_, i) => { const y = W * i / m; return [y, dz + 0.5 * (2 * i / m - 1) ** 2]; });
  c.rect(0, 0, W, T, 'hidden-l');
  c.poly(strip(arc(0), arc(T)), 'endface');
  c.text([W / 2, -0.55], 'looking at the end', { cls: 'lbl-s', size: 11 });
  // twist: isometric, corners out of plane
  const d = fig(15);
  d.prism([[0, 0], [L, 0], [L, W], [0, W]], 0, T, { ghost: true });
  for (let i = 0; i < n; i++) {
    const x0 = L * i / n, x1 = L * (i + 1) / n, t0 = 1.6 * (i / n - 0.5), t1 = 1.6 * ((i + 1) / n - 0.5);
    d.solid([[x0, 0, T - t0], [x1, 0, T - t1], [x1, W, T + t1], [x0, W, T + t0]], [[x0, 0, -t0], [x1, 0, -t1], [x1, W, t1], [x0, W, t0]], {});
  }
  d.noteI([L, W, T + 0.8], [14, -10], 'corner lifts');
  d.noteI([L, 0, T - 0.8], [16, 14], 'corner drops');
  return panels([
    [a.svg('Crown'), '<b>Crown</b> · curve along the edge'], [b.svg('Bow'), '<b>Bow</b> · curve along the face'],
    [c.svg('Cup'), '<b>Cup</b> · curve across the width'], [d.svg('Twist'), '<b>Twist</b> · corners out of plane']
  ]);
};

FIG.movement = () => {
  const f = fig(30), L = 16, W = 5.5, dW = 0.5;
  f.plank(0, 0, L, W, { seed: 3 });
  f.poly([[0, -dW / 2], [L, -dW / 2], [L, W + dW / 2], [0, W + dW / 2]], 'hidden-l');
  f.dim([L, 0], [L, W], -1.1, '5½″ in winter', { size: 11 });
  f.dim([L + 0.1, -dW / 2], [L + 0.1, W + dW / 2], -3.2, 'wider in summer', { size: 11 });
  f.dim([0, 0], [L, 0], -1.6, 'length: no real change', { size: 11 });
  f.arrow([L / 2, W / 2 + 0.4], [L / 2, W + 0.9]); f.arrow([L / 2, W / 2 - 0.4], [L / 2, -0.9]);
  f.text([L / 2 + 0.4, W / 2], 'moves across the grain', { anchor: 'start', cls: 'onwood', size: 12 });
  return f.svg('A board moves across its width with moisture but not along its length');
};

/* ---------- Numbers at the bench ---------- */
FIG.tapeRead = () => {
  const f = fig(120), x0 = 0.3, len = 3.1, h = 0.75;
  f.poly([[0, 0], [len + 0.3, 0], [len + 0.3, h], [0, h]], 'tape');
  f.poly([[0, -0.05], [0.08, -0.05], [0.08, h + 0.12], [0, h + 0.12]], 'tool-d');
  const tick = i => i % 16 === 0 ? 0.5 : i % 8 === 0 ? 0.36 : i % 4 === 0 ? 0.27 : i % 2 === 0 ? 0.2 : 0.13;
  for (let i = 0; i <= 48; i++) {
    const x = x0 + i / 16; if (x > len + 0.25) break;
    f.line([x, h], [x, h - tick(i)], 'tapetick');
    if (i % 16 === 0 && i) f.text([x - 0.07, h - 0.62], String(i / 16), { cls: 'tapetext', size: 16, anchor: 'end' });
  }
  const tgt = x0 + 2 + 5 / 16;
  f.arrow([tgt, h + 0.55], [tgt, h + 0.04], 'leader', 'inkarrow');
  f.text([tgt, h + 0.72], '2⁵⁄₁₆″', { cls: 'lbl-b', size: 14 });
  // label one tick of each length in the first inch, with a leader down past the tape
  [[8, '½″', 0], [4, '¼″', 1], [12, '¾″', 1], [2, '⅛″', 2], [6, '⅜″', 2], [1, '¹⁄₁₆″', 3]].forEach(([i, t, row]) => {
    const x = x0 + i / 16, y = -0.18 - row * 0.2;
    f.line([x, h - tick(i)], [x, y + 0.08], 'thin');
    f.text([x, y], t, { cls: 'dimtext halo', size: 11 });
  });
  f.text([x0 + 1.25, -0.4], '← longer tick = bigger fraction', { cls: 'lbl-s', size: 11, anchor: 'start' });
  return f.svg('Close-up of a tape measure reading 2 and 5/16 inches');
};

FIG.fracZoom = () => {
  const f = fig(900), a = 2.125, b = 2.4375, h = 0.12;
  f.poly([[a - 0.02, 0], [b + 0.02, 0], [b + 0.02, h], [a - 0.02, h]], 'tape');
  for (let i = 0; a + i / 32 <= b + 1e-9; i++) {
    const x = a + i / 32, sixteenth = i % 2 === 0;
    f.line([x, h], [x, h - (sixteenth ? 0.065 : 0.035)], 'tapetick');
    if (sixteenth) f.text([x, -0.03], K.frac(x).replace('″', ''), { cls: 'dimtext', size: 12 });
  }
  f.arrow([2.28, h + 0.07], [2.28, h + 0.004], 'leader', 'inkarrow');
  f.text([2.28, h + 0.095], '2.28″', { cls: 'lbl-b', size: 13 });
  f.text([2.125, -0.075], '2.28 − 2.25 = 0.03 but 2.3125 − 2.28 = 0.0325, so 2¼″ is closer', { cls: 'lbl-s', size: 11, anchor: 'start' });
  f.text([2.125, -0.105], 'short ticks are ¹⁄₃₂″; labelled ticks are sixteenths', { cls: 'lbl-s', size: 11, anchor: 'start' });
  return f.svg('2.28 inches sits just past 2 and 1/4');
};

FIG.halfMark = () => {
  const f = fig(22), L = 23.625, W = 3.5;
  f.plank(0, 0, L, W, { seed: 7 });
  const c = L / 2;
  f.pline([[c - 0.35, W + 0.5], [c, W - 0.02], [c + 0.35, W + 0.5]], 'pencil');
  f.line([c, 0.3], [c, W - 0.3], 'pencil-d');
  f.dim([0, 0], [L, 0], -1.4, '23⅝″', { size: 12 });
  f.dim([0, W], [c, W], 1.3, '11¹³⁄₁₆″', { size: 12 });
  f.dim([c, W], [L, W], 1.3, '11¹³⁄₁₆″', { size: 12 });
  f.text([c, W / 2], 'center', { cls: 'onwood', size: 11, dx: 28 });
  return f.svg('Center mark on a 23 5/8 inch board');
};

FIG.stockLayout = () => {
  const f = fig(7), L = 96, W = 3.5, k = 0.125, trim = 0.5, P = 31;
  f.plank(0, 0, L, W, { seed: 9, sp: 6 });
  f.rect(0, 0, trim, W, 'waste');
  let x = trim;
  for (let i = 0; i < 3; i++) {
    const even = i % 2 === 0;
    // alternate the miter direction so pieces nest; long points on the bottom edge
    const p = [[x, 0], [x + P, 0], [x + P - W, W], [x + W, W]];
    f.poly([[x, W], [x + W, W], [x, 0]], 'waste');
    f.poly([[x + P, 0], [x + P, W], [x + P - W, W]], 'waste');
    f.line(p[0], p[3], 'cut'); f.line(p[1], p[2], 'cut');
    f.text([x + P / 2, W / 2], `piece ${i + 1}`, { cls: 'onwood', size: 11 });
    f.dim(p[0], p[1], -1.2, '31″ LP', { size: 10 });
    x += P + k;
  }
  f.rect(x, 0, L - x, W, 'waste');
  f.dim([x, W], [L, W], 1.2, K.frac(L - x) + ' left', { size: 10 });
  f.dim([0, W], [trim, W], 1.2, '½″ trim', { size: 10 });
  return f.svg('Three mitered frame pieces laid out on an 8 foot board');
};
