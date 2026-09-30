/* Guide D · The Saw Guide */

// ---------- shared machine drawings ----------
// thin rectangle along a segment a→b, width w (inches)
function band(f, a, b, w, cls) { const u = K.norm(K.sub(b, a)), n = K.mul([-u[1], u[0]], w / 2); return f.poly([K.add(a, n), K.add(b, n), K.sub(b, n), K.sub(a, n)], cls); }
// arc of a circle above y = 0 as a polygon (a saw blade poking up through a table)
function bladeAbove(f, c, R, cut = 0) {
  const pts = []; for (let t = 0; t <= 360; t += 4) { const p = K.add(c, K.mul(K.dir(t), R)); if (p[1] >= cut) pts.push(p); }
  const h = c[1] - cut, half = Math.sqrt(Math.max(R * R - h * h, 0));
  pts.sort((p, q) => Math.atan2(q[1] - c[1], q[0] - c[0]) - Math.atan2(p[1] - c[1], p[0] - c[0]));
  return f.poly([[c[0] + half, cut]].concat(pts, [[c[0] - half, cut]]), 'bladebody');
}

// Miter saw from above: fence along y = 0, operator below. m = miter (deg, + swings the front to the right)
function msTop(f, m, o = {}) {
  f.rect(-11, -8.5, 22, 8.5, 'table');
  const arc = []; for (let t = 180; t <= 360; t += 6) arc.push(K.mul(K.dir(t), 6.8));
  f.poly(arc, 'tool-o');
  f.rect(-11, 0, 10.6, 0.9, 'fence'); f.rect(0.4, 0, 10.6, 0.9, 'fence');
  if (o.board !== false) f.plank(-11, -(o.W || 3.5), 22, o.W || 3.5, { seed: 3 });
  if (o.scale !== false) {
    f.arc([0, 0], 7.6, -140, -40, 'dimline');
    [-45, -30, -22.5, -15, 0, 15, 22.5, 30, 45].forEach(d => {
      const a = -90 + d; f.line(K.mul(K.dir(a), 7.6), K.mul(K.dir(a), 7.1), 'tick');
      if (Math.abs(d) !== 22.5 && Math.abs(d) !== 15) f.text(K.mul(K.dir(a), 8.3), Math.abs(d) + '°', { size: 9, cls: 'lbl' });
    });
  }
  const bd = K.dir(-90 + m);
  band(f, K.mul(bd, -0.6), K.mul(bd, 7), 0.16, 'blade');
  return bd;
}

// Table saw from above. Operator at the bottom (y < 0). fence: x of the fence's blade-side face (null = none)
function tsTop(f, o = {}) {
  const fx = o.fence === undefined ? 4 : o.fence;
  f.rect(-15, 0, 30, 27, 'table');
  f.rect(-6.4, 0, 0.75, 27, 'slot'); f.rect(5.65, 0, 0.75, 27, 'slot');
  f.rect(-1.6, 8.5, 3.2, 12, 'tool-o');
  band(f, [0, 10.3], [0, 16.7], 0.14, 'blade');
  band(f, [0, 16.9], [0, 19.4], 0.1, 'tool-d');
  if (fx !== null) f.rect(fx, -1.5, 1.6, 30, 'fence');
  if (o.spin !== false) f.arrow([0.9, 15.8], [0.9, 11.2], 'spin', 'spinhead');
  return fx;
}
// Table-saw blade from the side: table along y = 0, operator on the left, blade height h above the table
function tsSide(f, h, o = {}) {
  const R = 5, c = [0, h - R];
  f.rect(-11, -0.9, 22, 0.9, 'table');
  bladeAbove(f, c, R, 0);
  f.spin(c, R + 0.8, 60, 120, { cw: false });
  return { c, R };
}

/* ---------- D1 Miter saw ---------- */
FIG.msAnatomy = () => {
  const a = fig(18);
  msTop(a, 30);
  a.text([7, 1.5], 'FENCE', { cls: 'tagt', size: 10 });
  a.note([3, -5.2], [40, 10], 'blade swung to 30°');
  a.note([0, -7.6], [-30, 22], 'miter scale: 0° = square', { anchor: 'end' });
  a.note([-7, -1.75], [-10, -34], 'board tight to the fence', { anchor: 'end' });
  const b = fig(26), bv = 45;
  b.rect(-7, -0.6, 14, 0.6, 'table');
  b.plank(-7, 0, 14, 1.5, { seed: 5 });
  b.rect(-7, 1.5, 14, 0.15, 'hidden-l');
  const up = K.dir(90 + bv);
  band(b, [0.6, -0.3], K.add([0.6, -0.3], K.mul(up, 5.2)), 0.14, 'blade');
  b.line([0.6, -0.3], [0.6, 4.6], 'sq');
  b.angle([0.6, -0.3], 3.2, 90, 90 + bv, '45° bevel', { lr: 30 });
  b.text([-4, 0.75], 'board (front view)', { cls: 'onwood', size: 11 });
  return panels([[a.svg('Miter saw from above'), '<b>Miter</b>: turntable swings left and right'], [b.svg('Miter saw blade tilted for a bevel'), '<b>Bevel</b>: the blade tilts over']]);
};

FIG.msSafety = () => {
  const f = fig(18);
  msTop(f, 0, { scale: false });
  f.danger([[-6, -8.5], [6, -8.5], [6, 0], [-6, 0]], '');
  f.text([0, -8], 'no-hands zone', { cls: 'cuttext halo', size: 12 });
  f.hand([-8.5, -1.9], 90, 3);
  f.note([-8.5, -3], [-8, 26], 'hold here, outside the zone', { anchor: 'end' });
  f.rect(7.2, -3.9, 1.2, 4.8, 'tool-d');
  f.note([7.8, -3.9], [10, 24], 'or clamp it');
  f.dim([0, -8.5], [6, -8.5], -1, '6″', { size: 11 });
  return f.svg('No hands zone around a miter saw blade');
};

FIG.msCapacity = () => {
  const one = (m) => {
    const f = fig(20), C0 = 5.5, bd = K.dir(-90 + m);
    f.rect(-8, -8, 16, 8, 'table');
    f.rect(-8, 0, 7.6, 0.9, 'fence'); f.rect(0.4, 0, 7.6, 0.9, 'fence');
    const reach = C0 / K.cos(m) > 0 ? C0 : C0;
    const end = K.mul(bd, C0);
    const depth = -end[1];
    f.plank(-8, -depth, 16, depth, { seed: m });
    band(f, [0, 0], end, 0.16, 'blade');
    f.dim([0, 0], end, 0.6 * Math.sign(m || 1), 'blade reach 5½″', { size: 11 });
    f.dim([7.4, 0], [7.4, -depth], 0.9, K.dec(depth, 1) + '″ board', { size: 11, flat: true });
    return f.svg(`Capacity at ${m} degrees`);
  };
  return panels([[one(0), '<b>0°</b>: cuts a 5½″ board'], [one(45), '<b>45°</b>: same reach, only 3.9″ deep']]);
};

FIG.msPairs = () => {
  const f = fig(16), L = 24, W = 3.5;
  const p = [[0, 0], [L, 0], [L - W, -W], [W, -W]];
  f.rect(-4, 0, L + 8, 0.8, 'fence');
  f.board(p, { seed: 4 });
  f.line(p[0], p[3], 'cutline'); f.line(p[1], p[2], 'cutline');
  const blade = (a, b, lbl, off) => { band(f, K.add(a, K.mul(K.norm(K.sub(a, b)), 1.2)), K.add(b, K.mul(K.norm(K.sub(b, a)), 1.2)), 0.12, 'blade-g'); f.text(K.lerp(a, b, 0.5), lbl, { cls: 'cuttext halo', size: 12, dx: off, dy: 20 }); };
  blade(p[0], p[3], 'saw 45° right', -46);
  blade(p[1], p[2], 'saw 45° left', 46);
  f.text([L / 2, -W / 2], 'face up, same edge on the fence for both cuts', { cls: 'onwood', size: 11 });
  f.text([L / 2, 1.5], 'FENCE', { cls: 'tagt', size: 10 });
  f.note(p[0], [-10, -18], 'long point'); f.note(p[1], [10, -18], 'long point');
  return f.svg('Cutting mirror image ends by swinging the saw');
};

FIG.msStop = () => {
  const f = fig(12), L = 31, W = 3.5;
  f.rect(-8, 0, L + 14, 0.8, 'fence');
  f.rect(-8, -6, 12, 6, 'table');
  band(f, [0, 0.2], [W, -W - 0.8], 0.14, 'blade');
  const p = [[0, 0], [L, 0], [L - W, -W], [W, -W]].map(q => [q[0] + 0.1, q[1]]);
  f.board([[L + 0.1, 0], [L - W + 0.1, -W], [W + 0.1, -W], [0.1, 0]], { seed: 2 });
  f.line(p[0], p[3], 'cutline'); f.line(p[1], p[2], 'cutline');
  f.rect(L + 0.1, -2.2, 1.5, 3, 'tool-d');
  f.note([L + 0.85, -2.2], [16, 18], 'stop block, clamped');
  f.dim([0.1, 0], [L + 0.1, 0], 1.6, '31″ from blade to stop', { size: 11 });
  f.text([L / 2, -W / 2], 'keeper', { cls: 'onwood', size: 11 });
  return f.svg('Stop block on a miter saw fence');
};

FIG.msCalibrate = () => {
  const a = fig(24);
  a.rect(-6, 0, 12, 0.8, 'fence'); a.rect(-6, -6, 12, 6, 'table');
  band(a, [0, 0.2], [0, -5.5], 0.14, 'blade');
  a.poly([[0.12, 0], [3.6, 0], [3.6, -0.5], [0.62, -0.5], [0.62, -5], [0.12, -5]], 'tool');
  a.note([2, 0], [20, -16], 'square on the fence');
  a.note([0.37, -4], [30, 12], '…and flat on the blade body');
  const b = fig(24), W = 5.5, e = 2.5;
  b.plank(-6, 0, 6, W, { seed: 1 });
  b.board([[0, 0], [6, 0], [6, W], [W * K.tan(2 * e), W]], { seed: 2, cls: 'wood2' });
  b.poly([[0, 0], [W * K.tan(2 * e), W], [0, W]], 'gap');
  b.note([0.12, W * 0.8], [22, -18], 'gap = 2 × saw error');
  b.text([-3, W / 2], 'piece A', { cls: 'onwood', size: 11 }); b.text([3.4, W / 2], 'piece B, flipped', { cls: 'onwood', size: 11 });
  return panels([[a.svg('Checking a miter saw blade with a square'), 'Check with a square (unplugged)'], [b.svg('Flip test for a miter saw'), 'Flip test (exaggerated)']]);
};

/* ---------- D2 Table saw ---------- */
FIG.tsAnatomy = () => {
  const f = fig(14);
  tsTop(f, { fence: 6.5 });
  f.rect(-5.9, 4, 1, 1, 'tool');
  f.poly([[-9.5, 4.3], [-3.6, 4.3], [-3.6, 5.3], [-9.5, 5.3]], 'tool-d');
  f.note([0, 13.5], [-36, -40], 'blade', { anchor: 'end' });
  f.note([0, 18], [-40, -20], 'riving knife', { anchor: 'end' });
  f.note([-6, 24], [-18, -10], 'miter slot', { anchor: 'end' });
  f.note([-6.5, 4.8], [-18, 18], 'miter gauge', { anchor: 'end' });
  f.note([7.3, 24], [16, -10], 'rip fence');
  f.note([1.6, 9], [34, 14], 'throat plate');
  f.note([0.9, 13.5], [42, -34], 'teeth come toward you');
  f.text([0, -3.3], 'OPERATOR', { cls: 'tagt', size: 10 });
  return f.svg('Table saw from above with its parts');
};

FIG.tsKickback = () => {
  const a = fig(20);
  const { c, R } = tsSide(a, 2.25);
  a.plank(-10, 0, 9.2, 1.5, { seed: 2 });
  a.plank(-0.8, 0, 9, 1.5, { seed: 3, cls: 'wood2' });
  a.danger([[1.5, 0], [4.8, 0], [4.8, 2.6], [1.5, 2.6]], '');
  a.arrow([-2.5, 2.8], [-2.5, 1.6]); a.text([-2.5, 3.3], 'front teeth push down', { size: 11, cls: 'lbl' });
  a.arrow([3.2, 1.8], [3.2, 3.6]); a.text([3.2, 4.1], 'rear teeth rise', { size: 11, cls: 'cuttext halo' });
  a.feed([-9.5, 2.6], [-6, 2.6], 'feed');
  a.text([-6, -1.8], 'operator side', { size: 10, cls: 'lbl-s' });
  const b = fig(11);
  tsTop(b, { fence: 4 });
  b.danger([[-1.8, -9], [1.8, -9], [1.8, 10], [-1.8, 10]], '');
  b.text([0, -5], 'kickback line', { cls: 'cuttext halo', size: 12, rot: -90 });
  b.plank(0.07, 2, 3.93, 20, { seed: 4, grain: 90 });
  b.disc([-5.5, -6.5], 1.6, 'hand'); b.text([-5.5, -9.2], 'stand here', { size: 11, cls: 'lbl-b' });
  b.feed([2, -2], [2, 4]);
  return panels([[a.svg('Side view of rising rear teeth'), 'Side view'], [b.svg('Kickback line on a table saw'), 'Top view']]);
};

FIG.tsPush = () => {
  const a = fig(26);
  tsSide(a, 1);
  a.plank(-10, 0, 20, 0.75, { seed: 3 });
  a.dim([7, 0.75], [7, 1], -0.6, '¼″ above the wood', { size: 11, flat: true });
  a.dim([-8, 0], [-8, 0.75], 0.6, '¾″', { size: 11, flat: true });
  const b = fig(11);
  tsTop(b, { fence: 2.5 });
  b.plank(0.07, 0.5, 2.43, 22, { grain: 90, seed: 5 });
  b.poly([[-4, 6.2], [-0.02, 6.2], [-0.02, 7], [-4, 7]], 'tool');
  for (let i = 0; i < 7; i++) b.line([-0.3 - i * 0.45, 7], [-0.1 - i * 0.45, 8.6], 'tool-o');
  b.rect(-5, 6.2, 1, 3, 'tool-d');
  b.note([-2, 7.4], [-30, -10], 'featherboard: ahead of the blade', { anchor: 'end' });
  const ps = [[0.9, -3], [1.6, -3], [1.6, 0.5], [1.25, 0.9], [0.9, 0.5]];
  b.poly(ps, 'tool-d');
  b.note([1.25, -2], [30, 12], 'push stick');
  b.feed([1.25, -6], [1.25, -3.4]);
  return panels([[a.svg('Blade height above the wood'), 'Blade height (side view)'], [b.svg('Featherboard and push stick'), 'Featherboard and push stick (top view)']]);
};

FIG.tsSetup = () => {
  const a = fig(14);
  tsTop(a, { fence: null, spin: false });
  a.circle([0.05, 10.4], 3, 'dot'); a.circle([0.05, 16.6], 3, 'dot');
  a.dim([-5.65, 10.4], [0, 10.4], -1, 'front', { size: 11 });
  a.dim([-5.65, 16.6], [0, 16.6], 1, 'back', { size: 11 });
  a.text([0, -2.5], 'same tooth, front and back', { size: 11, cls: 'lbl-s' });
  const b = fig(40);
  b.rect(-2.5, -0.4, 5, 0.4, 'table');
  band(b, [0, 0], [0, 2.6], 0.12, 'blade');
  b.poly([[0.07, 1], [0.87, 1], [0.87, 1.8], [0.07, 1.8]], 'screen'); b.text([0.47, 1.4], '0.0', { cls: 'lcd', size: 10 });
  b.poly([[1.4, 0], [2.2, 0], [2.2, 0.8], [1.4, 0.8]], 'hidden-l'); b.text([1.8, 0.4], 'zero', { size: 9, cls: 'lbl-s' });
  b.right([0, 0], 0, 10);
  b.note([0.87, 1.4], [16, -12], 'reads 0.0° = blade square');
  return panels([[a.svg('Checking the blade is parallel to the miter slot'), 'Blade parallel to the slot'], [b.svg('Squaring the blade with a digital gauge'), 'Blade square to the table (front view)']]);
};

FIG.tsRip = () => {
  const a = fig(10);
  tsTop(a, { fence: 3.5 });
  a.plank(-2.5, 1, 6, 24, { grain: 90, seed: 2 });
  a.rect(-0.06, 1, 0.12, 24, 'cut');
  a.text([1.75, 22], 'keeper', { cls: 'onwood', size: 11, rot: -90 });
  a.text([-1.3, 22], 'offcut', { cls: 'onwood', size: 11, rot: -90 });
  a.feed([0.8, -4], [0.8, 0.5]);
  const b = fig(10);
  tsTop(b, { fence: 6.8 });
  b.plank(-2.6, 1, 9.4, 24, { grain: 90, seed: 3 });
  b.rect(-2.6, 1, 2.54, 24, 'waste');
  b.poly([[-7.3, 6], [-6.5, 6], [-6.5, 7.2], [-3.2, 7.2], [-3.2, 8], [-7.3, 8]], 'tool-d');
  b.note([-3.2, 7.6], [-26, -30], 'thin-rip jig sets the strip width', { anchor: 'end' });
  b.text([-1.3, 20], 'thin strip falls free', { cls: 'cuttext halo', size: 10, rot: -90 });
  b.feed([3, -4], [3, 0.5]);
  return panels([[a.svg('Standard rip on a table saw'), 'Standard rip'], [b.svg('Cutting thin strips on the far side of the blade'), 'Thin strips: cut on the far side']]);
};

FIG.tsBevel = () => {
  const one = (away) => {
    const f = fig(30), t = 0.75, bv = 45, fx = away ? 3.2 : -3.2;
    f.rect(-4.6, -0.5, 9.2, 0.5, 'table');
    f.rect(away ? fx : fx - 1, 0, 1, 2.4, 'fence');
    const x0 = away ? -2.4 : fx, x1 = away ? fx : 2.4;
    f.plank(x0, 0, x1 - x0, t, { seed: away ? 1 : 2 });
    const u = K.dir(90 + bv);
    band(f, [0, 0], K.mul(u, 2.6), 0.1, 'blade');
    if (away) f.note([-1.4, 0.35], [-10, -30], 'free side: nothing boxes it in', { anchor: 'end' });
    else { f.danger([[fx, 0], [0, 0], [-t, t], [fx, t]], ''); f.note([-1.9, 0.4], [-10, -34], 'piece trapped between blade and fence', { anchor: 'end' }); }
    f.text([away ? fx + 0.5 : fx - 0.5, 2.8], 'FENCE', { cls: 'tagt', size: 10 });
    return f.svg(away ? 'Blade tilting away from the fence' : 'Blade tilting toward the fence');
  };
  return panels([[one(true), '<b>Do</b>: blade tilts away from the fence'], [one(false), '<b>Don’t</b>: blade tilts toward the fence']]);
};

FIG.tsMiterGauge = () => {
  const a = fig(10);
  tsTop(a, { fence: 6.5, spin: false });
  a.rect(6.5 - 2.4, 1, 2.4, 2, 'tool-d');
  a.note([5.3, 2], [30, 14], 'stop block before the blade');
  a.plank(-4, 3, 10.5 - 2.4 - 0.1 + 0.001 - 0.001, 3.5, { seed: 2 });
  a.poly([[-6.4, 2], [-5.65, 2], [-5.65, 6.6], [-6.4, 6.6]], 'tool-d');
  a.rect(-9, 2.2, 8.8, 0.8, 'tool');
  a.feed([-3, -3], [-3, 1.6]);
  a.note([-8, 2.6], [-14, 18], 'miter gauge + face', { anchor: 'end' });
  const dial = (square) => {
    const f = fig(26), R = 3;
    const pts = []; for (let t = 0; t <= 180; t += 6) pts.push(K.mul(K.dir(t), R)); f.poly(pts, 'tool-t');
    for (let t = 0; t <= 180; t += 15) f.line(K.mul(K.dir(t), R), K.mul(K.dir(t), R - (t % 45 ? 0.3 : 0.55)), 'tick');
    [0, 45, 90, 135, 180].forEach(t => f.text(K.mul(K.dir(t), R - 1), String(square === 0 ? Math.abs(90 - t) : (t <= 90 ? t : 180 - t) === 90 ? 90 : Math.abs(t <= 90 ? t : 180 - t)), { size: 10, cls: 'lbl' }));
    band(f, [0, 0], [0, R + 0.6], 0.1, 'cutline');
    f.text([0, R + 1.1], square === 0 ? 'square cut reads 0' : 'square cut reads 90', { size: 11, cls: 'lbl-b' });
    return f.svg('Miter gauge scale');
  };
  return panels([[a.svg('Crosscut with the miter gauge'), 'Crosscut: miter gauge, stop block ahead of the blade'], [dial(0) + dial(90), 'Two gauge conventions: check yours with a square']]);
};

FIG.tsSled = () => {
  const a = fig(9);
  tsTop(a, { fence: null });
  a.rect(-12, 4, 24, 20, 'tool-t');
  a.rect(-12, 21, 24, 2, 'fence');
  a.rect(-1.5, 23, 3, 2.5, 'tool-d');
  a.rect(-12, 4, 24, 1.2, 'tool-d');
  a.plank(-9, 12, 18, 9, { seed: 4 });
  a.note([0, 24], [24, -14], 'blade guard block at the back');
  a.note([-10, 22], [-10, -18], 'fence square to the blade', { anchor: 'end' });
  const b = fig(14), L = 12;
  b.plank(0, 0, L, L, { seed: 6 });
  const e = 0.35;
  b.poly([[0, L], [L, L], [L, L - 0.9], [0, L - 0.9 + e]], 'waste');
  [['1', [L / 2, -0.5]], ['2', [L + 0.5, L / 2]], ['3', [L / 2, L + 1.4]], ['4', [-0.5, L / 2]]].forEach(([t, p]) => b.text(p, t, { cls: 'lbl-b', size: 13 }));
  b.text([L / 2, L - 0.45], '5: strip', { cls: 'cuttext halo', size: 11 });
  b.dim([L, L - 0.9], [L, L], -0.8, 'A', { size: 11, flat: true });
  b.dim([0, L - 0.9 + e], [0, L], 0.8, 'B', { size: 11, flat: true });
  b.lines([L / 2, L / 2 - 1], ['turn the panel the same way', 'after each cut'], { cls: 'onwood', size: 11 });
  return panels([[a.svg('Crosscut sled'), 'Crosscut sled'], [b.svg('Five cut test panel'), 'The 5-cut test']]);
};

FIG.tsMiterSled = () => {
  const f = fig(10);
  tsTop(f, { fence: null });
  f.rect(-12, 3, 24, 21, 'tool-t');
  const apex = [0, 20];
  band(f, apex, K.add(apex, K.mul(K.dir(225), 14)), 0.9, 'fence');
  band(f, apex, K.add(apex, K.mul(K.dir(315), 14)), 0.9, 'fence');
  f.angle(apex, 3, 225, 315, '90°', { lr: 16 });
  const u = K.dir(225), n = [-u[1], u[0]];
  const p0 = K.add(apex, K.add(K.mul(u, 3), K.mul(n, 0.45)));
  f.board([p0, K.add(p0, K.mul(u, 10)), K.add(K.add(p0, K.mul(u, 10)), K.mul(n, 2.5)), K.add(K.add(p0, K.mul(u, 0.2)), K.mul(n, 2.5))].map(q => q), { grain: 225, seed: 3 });
  f.note([-7, 12], [-26, 10], 'left fence: one end', { anchor: 'end' });
  f.note([7, 12], [26, 10], 'right fence: the mating end');
  return f.svg('Miter sled with two fences at 90 degrees');
};

FIG.tsTaperJig = () => {
  const f = fig(16), ang = F.taperAngle(0.375, 24);
  const fx = 9;
  f.rect(-4, -2, 18, 32, 'table');
  f.rect(fx, -2, 1.6, 32, 'fence');
  const jig = [[fx - 3, 0], [fx, 0], [fx, 28], [fx - 3, 28]];
  f.poly(jig, 'tool-t');
  const hinge = [fx - 3, 28], u = K.dir(-90 - ang * 6), n = [-u[1], u[0]];
  const arm = [hinge, K.add(hinge, K.mul(u, 28)), K.add(K.add(hinge, K.mul(u, 28)), K.mul(n, -1.5)), K.add(hinge, K.mul(n, -1.5))];
  f.poly(arm, 'tool');
  f.circle(hinge, 3, 'dot'); f.note(hinge, [-10, -16], 'hinge', { anchor: 'end' });
  const legEdge = K.add(hinge, K.mul(n, -1.5));
  f.board([legEdge, K.add(legEdge, K.mul(u, 26)), K.add(K.add(legEdge, K.mul(u, 26)), K.mul(n, -1.75)), K.add(legEdge, K.mul(n, -1.75))], { grain: -90 - ang * 6, seed: 5 });
  // the blade stands where the leg's outer edge passes y = 9, so everything left of it is taper waste
  const outer = K.add(legEdge, K.mul(n, -1.75)), bx = K.meet(outer, u, [0, 9], [1, 0])[0] + 0.45;
  band(f, [bx, 6], [bx, 12], 0.14, 'blade');
  f.note([bx, 9], [-26, 10], 'blade', { anchor: 'end' });
  const at = K.add(hinge, K.mul(u, 12));
  f.dim([fx - 3, 28 - 12], at, -0.8, '³⁄₁₆″ gap at 12″', { size: 11, flat: true });
  f.feed([fx - 4, -6], [fx - 4, -2.4]);
  f.text([fx - 1.5, 3], 'jig rides the fence', { size: 10, cls: 'lbl', rot: -90 });
  f.text([4, 24], 'angle drawn 6× larger', { size: 10, cls: 'lbl-s' });
  return f.svg('Hinged taper jig against the fence');
};

FIG.tsDado = () => {
  const end = (kind) => {
    const f = fig(34), W = 3.5, T = 0.75;
    let pts;
    if (kind === 'rabbet') pts = [[0, 0], [W, 0], [W, T], [0.5, T], [0.5, T - 0.375], [0, T - 0.375]];
    else pts = [[0, 0], [W, 0], [W, T], [2, T], [2, T - 0.25], [1.25, T - 0.25], [1.25, T], [0, T]];
    f.poly(pts, kind === 'dado' ? 'wood' : 'endface'); f.poly(pts, 'edge');
    if (kind === 'dado') for (let x = 0.2; x < W; x += 0.35) f.line([x, 0.05], [x, x > 1.2 && x < 2.05 ? T - 0.3 : T - 0.05], 'grain');
    f.text([W / 2, -0.4], kind === 'groove' ? 'groove: along the grain' : kind === 'dado' ? 'dado: across the grain' : 'rabbet: a step on an edge', { size: 11, cls: 'lbl' });
    return f.svg(kind);
  };
  return panels([[end('groove'), '<b>Groove</b>'], [end('dado'), '<b>Dado</b>'], [end('rabbet'), '<b>Rabbet</b>']]);
};

FIG.tsSheet = () => {
  const f = fig(4);
  f.rect(-15, 0, 30, 27, 'table');
  band(f, [0, 10], [0, 17], 0.3, 'blade');
  f.rect(4, -3, 1.6, 33, 'fence');
  f.rect(-15, 27, 30, 36, 'tool-t'); f.text([0, 55], 'outfeed support', { size: 11, cls: 'lbl' });
  f.rect(-50, 0, 30, 27, 'tool-t'); f.text([-35, 3], 'side support', { size: 11, cls: 'lbl' });
  f.plank(-44, -30, 48, 96 / 2 + 30, { grain: 90, seed: 7, sp: 6 });
  f.feed([-20, -34], [-20, -24]);
  f.text([-20, -10], 'half sheet 48″ × 48″', { cls: 'onwood', size: 11 });
  return f.svg('Ripping a sheet with outfeed and side support');
};

FIG.tsBlades = () => {
  const row = (atb) => {
    const f = fig(60), w = 0.4;
    for (let i = 0; i < 5; i++) {
      const x = i * 0.7, l = i % 2 ? 0.14 : -0.14;
      const top = atb ? [[x, 0.9 + (i % 2 ? 0 : 0.12)], [x + w, 0.9 + (i % 2 ? 0.12 : 0)]] : [[x, 1], [x + w, 1]];
      f.poly([[x, 0], [x + w, 0]].concat([top[1], top[0]]), 'metal');
    }
    f.text([1.55, -0.25], atb ? 'ATB: alternating bevel, slices fibres' : 'FTG: flat top, chisels along the grain', { size: 11, cls: 'lbl' });
    return f.svg(atb ? 'Alternating bevel teeth' : 'Flat top teeth');
  };
  return panels([[row(false), '<b>Rip</b> · about 24 teeth'], [row(true), '<b>Crosscut</b> · 60–80 teeth']]);
};

/* ---------- D3 Circular saw ---------- */
FIG.csSetup = () => {
  const a = fig(24), R = 3.625, c = [1, -0.25 + R];
  a.plank(-7, 0, 14, 1.5, { seed: 2 });
  a.disc(c, R, 'bladebody');
  a.rect(-3.5, 1.5, 9, 0.3, 'tool-d');
  const guard = []; for (let t = 0; t <= 180; t += 10) guard.push(K.add(c, K.mul(K.dir(t), R + 0.5))); a.pline(guard, 'tool-o');
  a.spin(c, R + 0.9, 200, 250);
  a.dim([6.2, 0], [6.2, -0.25], -0.6, '¼″ below', { size: 11, flat: true });
  a.feed([-6, 3.2], [-2.5, 3.2], 'saw moves this way', { dy: -12 });
  a.note([c[0] + 2.2, -0.15], [30, 18], 'teeth come up through the wood: good face down');
  const b = fig(34), bv = 45;
  b.plank(-3, 0, 6, 1.5, { seed: 3 });
  b.poly([[-3.4, 1.5], [3.4, 1.5], [3.4, 1.72], [-3.4, 1.72]], 'tool-d');
  band(b, [1.0, -0.3], K.add([1.0, -0.3], K.mul(K.dir(90 + bv), 3.2)), 0.1, 'blade');
  b.angle([1, -0.3], 1.8, 90, 90 + bv, '45°', { lr: 14 });
  b.line([1, -0.3], [1, 2.4], 'sq');
  b.text([0, 2.4], 'base plate flat on the board', { size: 11, cls: 'lbl', dy: -8 });
  return panels([[a.svg('Circular saw depth setting'), 'Depth (side view)'], [b.svg('Circular saw bevel'), 'Bevel (front view)']]);
};

FIG.csSquare = () => {
  const f = fig(22), W = 5.5, xs = 4;
  f.plank(-3, 0, 17, W, { seed: 4 });
  f.line([xs + 1.5, -0.4], [xs + 1.5, W + 0.4], 'pencil');
  speedSquareAt(f, [xs, W], 180);
  f.rect(xs, -1, 6.5, 8.2, 'tool-t');
  band(f, [xs + 1.55, -1.6], [xs + 1.55, 7.6], 0.1, 'blade-g');
  f.rect(xs + 1.55, 0, 8.45, W, 'waste');
  f.note([xs, 3], [-24, 0], 'square guides the base plate', { anchor: 'end' });
  f.note([xs + 1.55, 6.8], [26, -14], 'blade on the waste side of the line');
  f.feed([xs + 4, -4], [xs + 4, -1.4], 'push');
  return f.svg('Speed square as a circular saw guide');
};

FIG.csSupport = () => {
  const horse = (f, x) => { f.poly([[x - 1.5, -6], [x - 0.3, 0], [x + 0.3, 0], [x + 1.5, -6]], 'tool-o'); f.rect(x - 1.8, -0.5, 3.6, 0.5, 'tool'); };
  const a = fig(12);
  horse(a, -14); horse(a, 14);
  const sag = 1.2;
  a.board([[-18, 0], [-0.2, -sag], [-0.2, 1.5 - sag], [-18, 1.5]], { seed: 1 });
  a.board([[0.2, -sag], [18, 0], [18, 1.5], [0.2, 1.5 - sag]], { seed: 2 });
  a.poly([[-0.25, 1.5 - sag], [0.25, 1.5 - sag], [0.05, -sag + 0.2]], 'gap');
  a.note([0, 1.5 - sag], [0, -30], 'kerf closes: pinch', { cls: 'cuttext', anchor: 'middle' });
  const b = fig(12);
  horse(b, -14); horse(b, 2);
  b.plank(-18, 0, 22, 1.5, { seed: 3 });
  b.board([[4.2, 0], [14, -2.4], [14, -0.9], [4.2, 1.5]], { seed: 4, cls: 'wood2', grain: -14 });
  b.line([4.1, -0.3], [4.1, 1.9], 'cut');
  b.note([9, -0.8], [16, 20], 'offcut drops away: kerf opens');
  return panels([[a.svg('Cutting between supports pinches the blade'), '<b>Don’t</b>: cut between supports'], [b.svg('Support next to the cut'), '<b>Do</b>: support beside the cut, let the offcut fall']]);
};

FIG.csRip = () => {
  const f = fig(5), W = 96, H = 48, y = 23.5, off = 1.5;
  f.plank(0, 0, W, H, { seed: 9, sp: 7 });
  f.line([0, y], [W, y], 'pencil');
  f.rect(4, y + off, 88, 1.2, 'tool');
  f.rect(10, y + off - 0.4, 3, 2, 'tool-d'); f.rect(80, y + off - 0.4, 3, 2, 'tool-d');
  f.rect(40, y - 4, 7, 5.5, 'tool-t');
  band(f, [38, y], [49, y], 0.3, 'blade');
  f.dim([60, y], [60, y + off], -2, '1½″ base offset', { size: 11, flat: true });
  f.feed([30, y - 6], [38, y - 6], 'saw moves this way', { dy: 14 });
  f.text([W / 2, 8], 'offcut side', { cls: 'onwood', size: 11 }); f.text([W / 2, 38], 'keeper side', { cls: 'onwood', size: 11 });
  return f.svg('Straightedge guide for a circular saw rip');
};

/* ---------- D4 Hand saws ---------- */
FIG.hsSaws = () => {
  const saw = (pull) => {
    const f = fig(28), L = 10;
    const teeth = []; for (let i = 0; i <= 40; i++) { const x = i * L / 40; teeth.push([x, 0]); if (i < 40) teeth.push([x + (pull ? 0.07 : 0.18), -0.22]); }
    f.poly([[0, 0.9]].concat(teeth.map(p => p), [[L, 0.9]]), 'metal');
    f.rect(pull ? L : -2.4, 0.1, 2.4, 0.9, pull ? 'wood2' : 'wood');
    f.arrow(pull ? [7, -0.9] : [3, -0.9], pull ? [3, -0.9] : [7, -0.9]);
    f.text([5, -1.4], pull ? 'cuts on the pull (Japanese)' : 'cuts on the push (Western)', { size: 11, cls: 'lbl' });
    return f.svg(pull ? 'Pull saw' : 'Push saw');
  };
  const b = fig(24);
  b.plank(-2, -2, 12, 2, { seed: 2 });
  b.line([5, -2.2], [5, 0.3], 'pencil');
  band(b, [5.08, 0], K.add([5.08, 0], K.mul(K.dir(160), 7)), 0.12, 'metal');
  b.hand([4.4, 1.1], 200, 2);
  b.note([5.1, 0], [30, -16], 'start on the waste side, low angle');
  return panels([[saw(false) + saw(true), 'Tooth direction'], [b.svg('Starting a hand saw cut'), 'Starting the cut']]);
};

FIG.hsMiterbox = () => {
  const f = fig(22), L = 14, W = 4;
  f.rect(0, 0, L, W, 'tool-t');
  f.rect(0, -0.7, L, 0.7, 'tool'); f.rect(0, W, L, 0.7, 'tool');
  const slot = (x, a, lbl, below) => {
    const u = K.dir(90 + a);
    f.line(K.add([x, W / 2], K.mul(u, -(W / 2 + 0.7) / u[1])), K.add([x, W / 2], K.mul(u, (W / 2 + 0.7) / u[1])), 'cut');
    f.text(K.add([x, W / 2], K.mul(u, (below ? -1 : 1) * (W / 2 + 1.5) / u[1])), lbl, { size: 11, cls: 'lbl-b' });
  };
  slot(3.3, 45, '45°'); slot(7, 0, '90°'); slot(10.7, -45, '45°'); slot(11.6, -22.5, '22.5°', true);
  f.plank(0.3, W - 1.6, L - 0.6, 1.5, { seed: 3 });
  f.note([2, W - 0.1], [-16, -28], 'work tight to the back wall', { anchor: 'end' });
  return f.svg('Miter box with angle slots');
};

/* ---------- D5 Jigsaw and coping saw ---------- */
FIG.jsJigsaw = () => {
  const a = fig(26), W = 6, r = 3;
  const pts = [[0, 0], [8, 0]]; for (let t = 0; t <= 90; t += 6) pts.push([8 - r + r * Math.cos(t * Math.PI / 180), W - r + r * Math.sin(t * Math.PI / 180)]);
  pts.push([0, W]);
  a.board(pts, { seed: 3 });
  a.poly([[8 - r, W], [8, W], [8, W - r]].concat(Array.from({ length: 16 }, (_, i) => { const t = i * 6; return [8 - r + r * Math.cos(t * Math.PI / 180), W - r + r * Math.sin(t * Math.PI / 180)]; })), 'waste');
  [15, 45, 75].forEach(t => { const p = [8 - r + (r + 0.05) * Math.cos(t * Math.PI / 180), W - r + (r + 0.05) * Math.sin(t * Math.PI / 180)]; const q = t < 30 ? [8, p[1]] : t > 60 ? [p[0], W] : [8, W]; a.line(q, p, 'cutline'); });
  a.note([7.6, W - 0.4], [24, -16], 'relief cuts first');
  const b = fig(34), bv = 45;
  b.plank(-2.5, 0, 5, 0.75, { seed: 4 });
  b.poly([[-1.2, 0.75], [2.2, 0.75], [2.2, 0.95], [-1.2, 0.95]], 'tool-d');
  band(b, [0.2, -0.8], K.add([0.2, -0.8], K.mul(K.dir(90 - bv), 2.2)), 0.08, 'blade');
  b.angle([0.2, -0.8], 1.1, 90 - bv, 90, '45°', { lr: 12 });
  b.line([0.2, -0.8], [0.2, 1.4], 'sq');
  return panels([[a.svg('Relief cuts for a tight curve'), 'Relief cuts (top view)'], [b.svg('Jigsaw base tilted for a bevel'), 'Bevel (front view)']]);
};

FIG.jsCoping = () => {
  const f = fig(26);
  band(f, [0, 0], [0, 4.5], 0.25, 'metal'); band(f, [0, 4.5], [5.2, 4.5], 0.25, 'metal'); band(f, [5.2, 4.5], [5.2, 0], 0.25, 'metal');
  f.line([0, 0], [5.2, 0], 'cutline');
  for (let x = 0.2; x < 5.1; x += 0.25) f.line([x, 0], [x - 0.08, -0.12], 'blade-g');
  f.rect(5.05, -2.8, 0.3, 2.8, 'tool-d');
  f.poly([[4.8, -2.8], [5.6, -2.8], [5.6, -6], [4.8, -6]], 'wood2');
  f.arrow([3.6, -0.7], [1.2, -0.7]);
  f.text([2.4, -1.2], 'teeth point toward the handle: cuts on the pull', { size: 11, cls: 'lbl' });
  f.note([2.6, 4.5], [0, -20], 'frame keeps the blade in tension', { anchor: 'middle' });
  f.note([5.2, -4.4], [18, 0], 'handle: turn to tighten');
  return f.svg('Coping saw');
};
