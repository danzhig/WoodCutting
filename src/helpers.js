const LUMBER = { '2x4': { W: 3.5, T: 1.5 }, '2x6': { W: 5.5, T: 1.5 }, '1x4': { W: 3.5, T: 0.75 } };

// Board of width W running left from a right end cut at saw setting θ.
// Long point is the top-right corner at (x1, W); bottom edge is y = 0.
// Returns key points. o: {x0, len, grain, waste, square, angle, alabel, labels, offsetDim}
function endCut(f, W, sawDeg, o = {}) {
  const x1 = o.x1 ?? 10, x0 = o.x0 ?? 0, off = W * K.tan(sawDeg);
  const LP = [x1, W], SP = [x1 - off, 0], foot = [x1, 0];
  const body = [[x0, 0], SP, LP, [x0, W]];
  f.board(body, { grain: 0, seed: o.seed });
  if (sawDeg > 0 && o.waste !== false) f.poly([LP, foot, SP], 'waste');
  f.line(LP, SP, 'cutline');
  if (sawDeg > 0 && o.square !== false) { f.line(LP, foot, 'sq'); f.right(foot, 90, 7); }
  if (sawDeg > 0 && o.angle !== false) f.angle(LP, o.ar ?? Math.min(W * 0.55, 2.2), -90 - sawDeg, -90, o.alabel ?? K.deg(sawDeg), { lr: o.alr });
  if (o.labels !== false) {
    f.note(LP, o.lpOff || [12, -14], 'long point');
    f.note(SP, o.spOff || [-12, 16], 'short point');
  }
  if (o.offsetDim) f.dim(SP, foot, -(o.dimOff ?? 0.9) , o.offsetLabel ?? K.frac(off));
  return { LP, SP, foot, off };
}

// Regular n-sided frame, flat side at the bottom. Returns outer (V) and inner (I) vertex functions.
function polyFrame(f, n, apothem, W, o = {}) {
  const Rout = apothem / K.cos(180 / n), Rin = (apothem - W) / K.cos(180 / n);
  const start = -90 - 180 / n;
  const V = k => K.mul(K.dir(start + (((k % n) + n) % n) * 360 / n), Rout);
  const I = k => K.mul(K.dir(start + (((k % n) + n) % n) * 360 / n), Rin);
  for (let k = 0; k < n; k++) f.board([V(k), V(k + 1), I(k + 1), I(k)], { cls: k % 2 ? 'wood2' : 'wood', grain: K.angOf(V(k), V(k + 1)), seed: k, sp: o.sp });
  return { V, I, Rout, Rin };
}

// Two walls meeting at corner angle C (room side), corner at origin; wall 1 runs left.
function walls(f, C, L, thick) {
  const u1 = [-1, 0], u2 = K.dir(180 - C);
  const n1 = [0, 1], n2 = [-u2[1], u2[0]];              // room-side normals
  const outer = K.meet(K.mul(n1, -thick), u1, K.mul(n2, -thick), u2);
  f.poly([K.mul(u1, L), [0, 0], K.mul(u2, L), K.add(K.mul(u2, L), K.mul(n2, -thick)), outer, K.add(K.mul(u1, L), K.mul(n1, -thick))], 'wall');
  return { u1, u2, n1, n2 };
}
