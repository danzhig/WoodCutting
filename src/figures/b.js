/* Guide B · Measure & Mark */
FIG.tools = () => {
  const boardAt = (f, x0, x1, W) => f.board([[x0, 0], [x1, 0], [x1, W], [x0, W]], { seed: x0 + 20 });
  // speed square
  const a = fig(24);
  boardAt(a, -2, 9, 5.5);
  a.poly([[0, 0], [7, 0], [0, 7]], 'tool-t');
  a.poly([[0, 0], [7, 0], [7, -0.45], [0, -0.45]], 'tool-d');
  for (let i = 1; i < 7; i++) a.line([0.02, i], [0.35, i], 'tick');
  for (let i = 1; i < 14; i++) { const p = K.lerp([7, 0], [0, 7], i / 14); a.line(p, K.add(p, [-0.22, -0.22]), 'tick'); }
  a.line([-0.12, 0.05], [-0.12, 5.5], 'pencil');
  a.line([7.1, 0.12], [1.62, 5.6], 'pencil');
  a.note([-0.12, 4.5], [-16, -6], '90° line');
  a.note([3.1, 4.07], [26, -18], '45° line');
  a.note([3.5, -0.45], [0, 22], 'lip hooks the edge', { anchor: 'middle' });
  // combination square
  const b = fig(24);
  boardAt(b, -3, 7, 5.5);
  b.poly([[-2.2, -1.4], [2.2, -1.4], [2.2, 0], [-2.2, 0]], 'tool-d');
  b.poly([[0, -1.4], [1, -1.4], [1, 7.5], [0, 7.5]], 'tool-t');
  for (let i = 0; i < 9; i++) b.line([1, i - 0.9], [0.7, i - 0.9], 'tick');
  b.line([1.14, 0.05], [1.14, 5.5], 'pencil');
  b.note([1.14, 3.5], [26, -8], 'mark along the blade');
  b.note([-1.4, -1.4], [-6, 22], 'head: 90° face on the edge', { anchor: 'middle' });
  // sliding bevel
  const c = fig(24);
  boardAt(c, -3, 9, 5.5);
  c.poly([[-2.5, -1.1], [3.2, -1.1], [3.2, 0], [-2.5, 0]], 'tool-d');
  const bu = K.dir(60), bn = [-bu[1], bu[0]], piv = [0, -0.5];
  c.poly([K.add(piv, K.mul(bn, -0.35)), K.add(K.add(piv, K.mul(bu, 7.5)), K.mul(bn, -0.35)), K.add(K.add(piv, K.mul(bu, 7.5)), K.mul(bn, 0.35)), K.add(piv, K.mul(bn, 0.35))], 'tool-t');
  c.circle(piv, 6, 'tool');
  c.line(K.add([0.62, 0.02], [0, 0]), K.add([0.62, 0], K.mul(bu, 6.3)), 'pencil');
  c.angle([0.3, 0], 2.2, 0, 60, 'any angle', { lr: 40 });
  c.note(piv, [-24, 22], 'wing nut locks it');
  // protractor
  const d = fig(24);
  boardAt(d, -1.5, 9.5, 5.5);
  const O = [4, 0], R = 3.6;
  const semi = []; for (let t = 0; t <= 180; t += 6) semi.push(K.add(O, K.mul(K.dir(t), R)));
  d.poly(semi, 'tool-t');
  for (let t = 0; t <= 180; t += 10) d.line(K.add(O, K.mul(K.dir(t), R)), K.add(O, K.mul(K.dir(t), R - (t % 30 ? 0.3 : 0.6))), 'tick');
  [0, 30, 60, 90, 120, 150, 180].forEach(t => d.text(K.add(O, K.mul(K.dir(t), R - 1.05)), String(t), { size: 9, cls: 'lbl' }));
  d.line(O, K.add(O, K.mul(K.dir(60), 5.4)), 'pencil');
  d.circle(O, 3, 'dot');
  d.note(K.add(O, K.mul(K.dir(60), R)), [22, -10], 'reads 60°');
  d.note(O, [0, 24], 'center mark on your point', { anchor: 'middle', dot: false });
  return panels([[a.svg('Speed square'), '<b>Speed square</b>'], [b.svg('Combination square'), '<b>Combination square</b>'], [c.svg('Sliding bevel'), '<b>Sliding bevel</b>'], [d.svg('Protractor'), '<b>Protractor</b>']]);
};

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

