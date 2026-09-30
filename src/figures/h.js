/* Guide H · Spindle Turning */

// lathe from the front: bed along y = 0, centers at height hc above the bed; work from x = a to x = b
function lathe(f, a, b, hc = 6, o = {}) {
  f.rect(-6, -1.2, b + 12, 1.2, 'metal');
  f.rect(-6, 0, 5.2, hc + 3.2, 'metal');
  f.poly([[-0.8, hc - 0.55], [a - 0.35, hc - 0.35], [a, hc], [a - 0.35, hc + 0.35], [-0.8, hc + 0.55]], 'metal');
  const tx = b + 0.4;
  f.poly([[tx, hc], [tx + 0.5, hc - 0.4], [tx + 0.5, hc + 0.4]], 'metal');
  f.rect(tx + 0.5, hc - 0.45, 2.2, 0.9, 'metal');
  f.rect(tx + 2.7, 0, 3.6, hc + 1.3, 'metal');
  f.disc([tx + 7.3, hc], 1.1, 'tool-o');
  if (o.rest !== false) { const rx = o.restX ?? (a + b) / 2 - 4; f.rect(rx, 0, 2.2, 1.2, 'tool-d'); f.rect(rx + 0.8, 1.2, 0.5, hc - 2.3, 'tool-d'); f.rect(rx - 2.5, hc - 1.1, 7.2, 0.4, 'tool-d'); }
  return { tx, hc };
}

/* ---------- The lathe ---------- */
FIG.latheAnatomy = () => {
  const f = fig(16), a = 0.3, b = 20, hc = 6;
  const { tx } = lathe(f, a, b, hc, { restX: 7 });
  // blank at centre height
  f.board([[a, hc - 0.9], [b, hc - 0.9], [b, hc + 0.9], [a, hc + 0.9]], { seed: 3, sp: 6 });
  f.line([-1, hc], [tx + 3, hc], 'axis');
  f.note([-3, hc + 2.5], [-10, -20], 'headstock', { anchor: 'end' });
  f.note([a - 0.2, hc], [-4, 34], 'drive center (spurs)', { anchor: 'end' });
  f.note([tx + 0.2, hc], [10, 34], 'live center');
  f.note([tx + 1.6, hc + 0.45], [20, -30], 'quill');
  f.note([tx + 4.5, hc + 1.3], [20, -16], 'tailstock');
  f.note([tx + 7.3, hc], [22, 12], 'handwheel');
  f.note([8, 0.6], [-20, 26], 'banjo', { anchor: 'end' });
  f.note([6, hc - 0.9], [-26, 30], 'tool rest', { anchor: 'end' });
  f.note([14, -0.6], [20, 22], 'bed (ways)');
  f.dim([b + 11, 0], [b + 11, hc], -1, 'center height', { size: 10, flat: true });
  f.dim([a, hc + 2.3], [b, hc + 2.3], 0.6, 'distance between centers', { size: 10 });
  return f.svg('Parts of a wood lathe');
};

FIG.latheSafety = () => {
  const a = fig(14), L = 18;
  a.rect(-3, -4, L + 8, 8, 'metal');
  a.board([[0, -0.9], [L, -0.9], [L, 0.9], [0, 0.9]], { seed: 2 });
  a.danger([[0, -0.9], [L, -0.9], [L, -12], [0, -12]], '');
  a.text([L / 2, -8], 'line of fire', { cls: 'cuttext halo', size: 12 });
  a.disc([L + 6, -10], 1.3, 'hand'); a.text([L + 6, -12.6], 'stand here to start', { size: 11, cls: 'lbl-b' });
  a.spin([L / 2, 0], 1.6, 60, 300, { cw: false });
  a.text([L / 2, 5.5], 'lathe from above', { cls: 'lbl-s', size: 11 });
  const b = fig(40), R = 1.2;
  b.disc([0, 0], R, 'endface');
  b.circle([0, 0], 2, 'dot');
  b.rect(-2.2, -R - 0.35, 1.8, 0.25, 'tool-d');
  b.dim([-1.3, -R - 0.1], [-1.3, -R], -0.8, '⅛–¼″', { size: 10, flat: true });
  b.spin([0, 0], R + 0.4, 100, 200);
  b.hand([1.9, 0.3], 140, 1.6);
  b.note([1.3, 1.3], [20, -16], 'turn it one full turn by hand');
  b.text([0, -2.2], 'end view', { cls: 'lbl-s', size: 11 });
  return panels([[a.svg('Line of fire at the lathe'), 'Stand out of the line of fire'], [b.svg('Spin the work by hand before starting'), 'Spin by hand first']]);
};

FIG.latheSpeed = () => {
  // a small chart drawn to scale: x = diameter (in), y = RPM
  const f = fig(1), X = d => d * 90, Y = r => r * 0.06, maxR = 3500;
  const px = (d, r) => [X(d), Y(r)];
  const band = [];
  for (let d = 0.5; d <= 6.001; d += 0.1) band.push(px(d, Math.min(maxR, 9000 / d)));
  for (let d = 6; d >= 0.499; d -= 0.1) band.push(px(d, Math.min(maxR, 6000 / d)));
  f.poly(band, 'glue');
  [0, 1000, 2000, 3000, 4000].forEach(r => { f.line(px(0, r), px(6.2, r), 'thin'); f.text(px(0, r), String(r), { anchor: 'end', dx: -6, size: 11, cls: 'lbl-s' }); });
  [1, 2, 3, 4, 5, 6].forEach(d => { f.line(px(d, 0), px(d, -60), 'thin'); f.text(px(d, 0), d + '″', { dy: 14, size: 11, cls: 'lbl-s' }); });
  f.line(px(0, maxR), px(6.2, maxR), 'laser'); f.text(px(6.2, maxR), 'typical lathe maximum', { anchor: 'end', dy: -10, size: 11, cls: 'cuttext' });
  const l1 = [], l2 = []; for (let d = 0.5; d <= 6.001; d += 0.1) { l1.push(px(d, Math.min(maxR, 6000 / d))); l2.push(px(d, Math.min(maxR, 9000 / d))); }
  f.pline(l1, 'dimline'); f.pline(l2, 'dimline');
  f.text(px(3.3, 9000 / 3.3), '9,000 ÷ D', { cls: 'dimtext halo', size: 11, dx: 30, dy: -6 });
  f.text(px(3.3, 6000 / 3.3), '6,000 ÷ D', { cls: 'dimtext halo', size: 11, dx: -30, dy: 14 });
  f.circle(px(2, 3000), 3, 'dot'); f.text(px(2, 3000), '2″: 3,000–3,500', { anchor: 'start', dx: 8, dy: -8, size: 11, cls: 'lbl-b halo' });
  f.text(px(3, -600), 'diameter', { size: 11, cls: 'lbl-s' });
  f.text(px(-0.75, 2000), 'RPM', { size: 11, cls: 'lbl-s', rot: -90 });
  return f.svg('Lathe speed by diameter');
};

/* ---------- Preparing and mounting ---------- */
FIG.blankPrep = () => {
  const a = fig(50), s = 2;
  a.poly([[0, 0], [s, 0], [s, s], [0, s]], 'endface');
  a.line([0, 0], [s, s], 'pencil'); a.line([s, 0], [0, s], 'pencil');
  a.circle([s / 2, s / 2], 3, 'dot');
  a.note([s / 2, s / 2], [30, -26], 'center: where the diagonals cross');
  const b = fig(50), c = s * (1 - 1 / Math.SQRT2);
  b.poly([[0, 0], [s, 0], [s, s], [0, s]], 'hidden-l');
  const oct = [[c, 0], [s - c, 0], [s, c], [s, s - c], [s - c, s], [c, s], [0, s - c], [0, c]];
  b.poly(oct, 'endface'); b.poly(oct, 'edge');
  [[[0, 0], [c, 0], [0, c]], [[s, 0], [s, c], [s - c, 0]], [[s, s], [s - c, s], [s, s - c]], [[0, s], [0, s - c], [c, s]]].forEach(t => b.poly(t, 'waste'));
  b.dim([0, 0], [c, 0], -0.25, '⁹⁄₁₆″', { size: 10 });
  b.dim([0, s], [s, s], 0.25, '2″', { size: 10 });
  return panels([[a.svg('Finding the center of a blank'), 'Find the center'], [b.svg('Octagon from a 2 inch square'), 'Knock off the corners']]);
};

FIG.mounting = () => {
  const a = fig(26), L = 8, r = 0.9;
  a.board([[0, -r], [L, -r], [L, r], [0, r]], { seed: 4 });
  a.poly([[-1.6, -0.5], [-0.25, -0.35], [0, -0.35], [0, 0.35], [-0.25, 0.35], [-1.6, 0.5]], 'metal');
  [-0.25, 0.25].forEach(y => a.poly([[0, y - 0.07], [0.22, y], [0, y + 0.07]], 'metal'));
  a.poly([[0.15, 0], [-0.1, -0.08], [-0.1, 0.08]], 'metal');
  a.poly([[L - 0.25, 0], [L + 0.3, -0.35], [L + 1.8, -0.35], [L + 1.8, 0.35], [L + 0.3, 0.35]], 'metal');
  a.line([-2, 0], [L + 2.5, 0], 'axis');
  a.note([0, 0.3], [-10, -30], 'spur drive', { anchor: 'end' });
  a.note([L + 0.3, 0.2], [10, -30], 'live center');
  const b = fig(40), D = 2, t = 0.45, R = 1.35;
  b.board([[t, -R], [3.5, -R], [3.5, R], [t, R]], { seed: 5 });
  b.board([[0, -D / 2], [t, -D / 2], [t, D / 2], [0, D / 2]], { seed: 6, cls: 'wood2' });
  const jaw = (s) => b.poly([[-0.9, s * (D / 2)], [0.45, s * (D / 2)], [0.45, s * (D / 2 + 0.05)], [-0.1, s * (D / 2 + 0.7)], [-0.9, s * (D / 2 + 0.7)]], 'metal');
  jaw(1); jaw(-1);
  b.rect(-2, -2, 1.1, 4, 'metal');
  b.dim([0, -D / 2], [0, D / 2], 1.3, '≈ 2″ tenon', { size: 10, flat: true });
  b.note([t, R], [14, -16], 'square shoulder seats on the jaws');
  b.line([-2.3, 0], [3.8, 0], 'axis');
  return panels([[a.svg('Blank between centers'), 'Between centers'], [b.svg('Tenon in a four jaw chuck'), 'In a chuck (section)']]);
};

/* ---------- Tools and cuts ---------- */
FIG.latheTools = () => {
  const tool = (name, tip) => {
    const f = fig(26), L = 7;
    f.rect(-4, -0.35, 3.4, 0.7, 'wood2');
    tip(f);
    return [f.svg(name), '<b>' + name + '</b>'];
  };
  const shaft = (f, w, len = 3.6) => f.rect(-0.6, -w / 2, len, w, 'metal');
  return panels([
    tool('Spindle roughing gouge', f => { shaft(f, 1.1); f.poly([[3, -0.55], [3.35, -0.55], [3.35, 0.55], [3, 0.55]], 'metal'); f.line([3.35, -0.55], [3.35, 0.55], 'cutline'); }),
    tool('Spindle gouge', f => { shaft(f, 0.55); const pts = [[3, -0.28]]; for (let t = -80; t <= 80; t += 10) pts.push([3 + 0.55 * K.cos(t), 0.28 * K.sin(t)]); pts.push([3, 0.28]); f.poly(pts, 'metal'); f.pline(pts.slice(1, -1), 'cutline'); }),
    tool('Skew chisel', f => { f.poly([[-0.6, -0.5], [3, -0.5], [3.4, 0.5], [-0.6, 0.5]], 'metal'); f.line([3, -0.5], [3.4, 0.5], 'cutline'); f.text([3.5, 0.6], 'long point', { size: 9, cls: 'lbl-s', anchor: 'start' }); f.text([3.1, -0.65], 'short point', { size: 9, cls: 'lbl-s', anchor: 'start' }); }),
    tool('Parting tool', f => { f.rect(-0.6, -0.12, 3.6, 0.24, 'metal'); f.poly([[3, -0.12], [3.4, 0], [3, 0.12]], 'metal'); f.circle([3.4, 0], 2, 'dot'); }),
    tool('Scraper', f => { shaft(f, 0.9); f.poly([[3, -0.45], [3.25, -0.45], [3.35, 0], [3.25, 0.45], [3, 0.45]], 'metal'); f.pline([[3.25, -0.45], [3.35, 0], [3.25, 0.45]], 'cutline'); })
  ]);
};

FIG.latheRest = () => {
  const f = fig(40), R = 1.4;
  f.disc([0, 0], R, 'endface');
  f.line([-3.5, 0], [2, 0], 'axis');
  f.rect(-3.2, -R - 0.55, 1.8, 0.4, 'tool-d');
  const tipAt = [-R * K.cos(10), R * K.sin(10)];
  const u = K.norm(K.sub(tipAt, [-3.6, -R - 0.15]));
  band2(f, [-4.8, -R - 0.15 - 1.2 * u[1] / u[0] * 0], tipAt, 0.3);
  f.dim([-1.4, -R - 0.15], [-1.4, -R + 0.02], -0.6, '⅛–¼″', { size: 10, flat: true });
  f.note(tipAt, [26, -18], 'edge meets the wood at or just above center');
  f.spin([0, 0], R + 0.35, 100, 190);
  f.text([-2.3, -R - 0.9], 'tool rest', { size: 11, cls: 'lbl-s' });
  return f.svg('Tool rest height and gap');
};
function band2(f, a, b, w) { const u = K.norm(K.sub(b, a)), n = K.mul([-u[1], u[0]], w / 2); return f.poly([K.add(a, n), K.add(b, n), K.sub(b, n), K.sub(a, n)], 'metal'); }

FIG.latheBevel = () => {
  const a = fig(44), R = 1.3;
  a.disc([0, 0], R, 'endface');
  a.rect(-3, -R - 0.5, 1.4, 0.35, 'tool-d');
  const cut = [-R * K.cos(20), R * K.sin(20)];
  const dir = K.dir(20 - 90 + 180 + 55);
  const heel = K.add(cut, K.mul(K.dir(200), 0.001));
  band2(a, K.add(cut, K.mul(K.dir(215), 3)), cut, 0.35);
  a.note(cut, [22, -26], 'edge cutting');
  a.note(K.add(cut, K.mul(K.dir(215), 0.35)), [-26, 26], 'bevel rubbing', { anchor: 'end' });
  a.spin([0, 0], R + 0.35, 90, 200);
  a.text([-1, -2.4], 'end view', { cls: 'lbl-s', size: 11 });
  const b = fig(34), prof = [];
  for (let x = 0; x <= 6.01; x += 0.1) { let r = 0.9; if (x > 0.5 && x < 2.5) r = 0.9 + 0.45 * Math.sin(Math.PI * (x - 0.5) / 2); if (x > 3.5 && x < 5.5) r = 0.9 - 0.4 * Math.sin(Math.PI * (x - 3.5) / 2); prof.push([x, r]); }
  b.spindle(prof, { seed: 3 });
  [[1.5, 1.35, 0.8, 1.05], [1.5, 1.35, 2.2, 1.05], [4.5, 0.5, 3.8, 0.8], [4.5, 0.5, 5.2, 0.8]].forEach(([x1, y1, x2, y2], i) => {
    const from = i < 2 ? [x1, y1 + 0.2] : [x2, y2 + 0.25], to = i < 2 ? [x2, y2 + 0.25] : [x1, y1 + 0.2];
    b.arrow(from, to, 'dimline', 'arrow');
  });
  b.lines([1.5, -1.9], ['bead: from the top', 'down each side'], { size: 10, cls: 'lbl' });
  b.lines([4.5, -1.9], ['cove: from each rim', 'down to the bottom'], { size: 10, cls: 'lbl' });
  return panels([[a.svg('Gouge riding its bevel'), 'Riding the bevel'], [b.svg('Downhill cutting on a bead and a cove'), 'Always cut downhill']]);
};

FIG.beadsCoves = () => {
  const f = fig(40), prof = [];
  const r0 = 0.75;
  for (let x = 0; x <= 7.01; x += 0.05) {
    let r = r0;
    if (x >= 0.6 && x <= 1.6) r = r0 + 0.3 * Math.sqrt(Math.max(0, 1 - ((x - 1.1) / 0.5) ** 2));
    else if (x > 1.6 && x < 1.9) r = r0 + 0.02;
    else if (x >= 1.9 && x <= 3.4) r = r0 - 0.3 * Math.sin(Math.PI * (x - 1.9) / 1.5);
    else if (x >= 3.9 && x <= 4.3) r = r0 - 0.25 * (1 - Math.abs(x - 4.1) / 0.2);
    else if (x >= 4.8 && x <= 5.2) r = r0 + 0.12;
    prof.push([x, r]);
  }
  f.spindle(prof, { seed: 4 });
  f.note([1.1, r0 + 0.3], [0, -24], 'bead', { anchor: 'middle' });
  f.note([2.65, r0 - 0.3], [0, -30], 'cove', { anchor: 'middle' });
  f.note([4.1, r0 - 0.25], [0, -34], 'V-cut', { anchor: 'middle' });
  f.note([5, r0 + 0.12], [0, -24], 'fillet', { anchor: 'middle' });
  return f.svg('Bead, cove, V cut and fillet on a spindle');
};

/* ---------- Measuring and shaping ---------- */
FIG.calipers = () => {
  const a = fig(40), R = 0.875, r = 0.625, x0 = 2;
  const prof = [[0, R], [x0 - 0.06, R], [x0 - 0.06, r], [x0 + 0.06, r], [x0 + 0.06, R], [4.5, R]];
  a.spindle(prof, { seed: 2 });
  band2(a, [x0, -R - 2.2], [x0, -r], 0.12);
  const leg = (s) => { const pts = []; for (let t = 0; t <= 180; t += 10) pts.push([x0 + 0.25 + 1.2 * K.sin(t) * 0.7, s * (r + 0.02) + s * (1 - K.cos(t)) * 0.9]); a.pline(pts, 'tool-o'); };
  a.pline([[x0, r], [x0 + 0.9, r + 0.7], [x0 + 1.6, 1.8], [x0 + 2.4, 2.4]], 'tool-o');
  a.pline([[x0, -r], [x0 + 0.9, -r - 0.7], [x0 + 1.6, -1.8], [x0 + 2.4, -2.4]], 'tool-o');
  a.disc([x0 + 2.4, 0], 0.12, 'tool');
  a.pline([[x0 + 2.4, 2.4], [x0 + 2.8, 1.2], [x0 + 2.4, 0]], 'tool-o'); a.pline([[x0 + 2.4, -2.4], [x0 + 2.8, -1.2], [x0 + 2.4, 0]], 'tool-o');
  a.dim([x0 - 0.4, -r], [x0 - 0.4, r], 0.5, '1¼″', { size: 10, flat: true });
  a.note([x0, -R - 1.8], [-20, 10], 'parting tool from below', { anchor: 'end' });
  const b = fig(60), rr = 0.3125;
  b.spindle([[0, 0.6], [1.2, 0.6], [1.2, rr], [2.4, rr]], { seed: 3 });
  b.poly([[2.1, rr], [2.9, rr], [2.9, rr + 0.25], [3.3, rr + 0.25], [3.3, -rr - 0.25], [2.9, -rr - 0.25], [2.9, -rr], [2.1, -rr], [2.1, -rr - 0.12], [2.75, -rr - 0.12], [2.75, rr + 0.12], [2.1, rr + 0.12]], 'metal');
  b.rect(3.3, -0.2, 2.2, 0.4, 'metal');
  b.note([2.5, rr + 0.12], [0, -24], '⅝″ wrench slides on: done', { anchor: 'middle' });
  return panels([[a.svg('Sizing cut with a parting tool and calipers'), 'Sizing cut'], [b.svg('Open end wrench as a tenon gauge'), 'Wrench as a gauge']]);
};

FIG.latheStory = () => {
  const f = fig(22), prof = [[0, 0.875], [4.5, 0.875], [4.8, 0.7], [5.4, 0.95], [6, 0.7], [6.3, 0.75], [24, 0.5]];
  f.spindle(prof, { seed: 5, sp: 5 });
  f.plank(0, 2, 24, 0.9, { seed: 6, cls: 'wood2', sp: 4 });
  [[0, 'TOP'], [4.5, '1¾'], [5.4, '1⅞'], [6.3, '1½'], [24, '1']].forEach(([x, t]) => {
    f.poly([[x - 0.15, 2], [x + 0.15, 2], [x, 2.3]].map(p => p), 'glass');
    f.line([x, 2], [x, 1.1], 'pencil-d');
    f.text([x, 3.3], t, { size: 10, cls: 'lbl-b' });
  });
  f.text([15, 2.45], 'story stick: notches at transitions, diameters written above', { cls: 'onwood', size: 10 });
  return f.svg('Story stick for a turned leg');
};

FIG.latheTaper = () => {
  const f = fig(28), L = 20, D1 = 1.75, D2 = 1, X = 1.8;
  const prof = [[0, D1 / 2 * X], [L, D2 / 2 * X]];
  f.spindle(prof, { seed: 6, sp: 5 });
  [0, 5, 10, 15, 20].forEach(x => {
    const d = D1 - (D1 - D2) * x / L, r = d / 2 * X;
    f.line([x, r], [x, r + 0.35], 'dimline'); f.line([x, -r], [x, -r - 0.35], 'dimline');
    f.text([x, r + 0.75], K.frac(d), { cls: 'dimtext halo', size: 11 });
  });
  f.dim([0, -D1 / 2 * X - 0.9], [L, -D1 / 2 * X - 0.9], 0, '20″', { size: 11 });
  f.text([L / 2, -2.6], 'diameters drawn 1.8× so the taper shows', { cls: 'lbl-s', size: 10 });
  return f.svg('Turned taper with sizing cuts');
};

FIG.latheTenon = () => {
  const f = fig(44), d = 0.625, len = 1.125, depth = 1.25;
  f.spindle([[0, 0.5], [2.2, 0.5], [2.2, d / 2], [2.2 + len, d / 2]], { seed: 2, axis: false });
  const hx = 4.3;
  f.board([[hx, -1.2], [hx + 2.4, -1.2], [hx + 2.4, 1.2], [hx, 1.2]], { grain: 90, seed: 3, cls: 'wood2' });
  f.rect(hx, -d / 2, depth, d, 'glass');
  f.dim([2.2, -d / 2], [2.2 + len, -d / 2], -0.5, '1⅛″', { size: 10 });
  f.dim([hx, d / 2], [hx + depth, d / 2], 0.5, '1¼″ deep', { size: 10 });
  f.dim([2.2 + len, -d / 2], [2.2 + len, d / 2], -0.35, '⅝″', { size: 10, flat: true });
  f.arrow([3.6, 0], [4.15, 0]);
  f.note([2.2, 0.5], [-10, -18], 'square shoulder', { anchor: 'end' });
  return f.svg('Turned tenon and drilled hole');
};

/* ---------- Sharpening and finishing ---------- */
FIG.latheSharpen = () => {
  const edge = (name, angle, twoSided) => {
    const f = fig(40), L = 2.2, t = 0.4;
    if (twoSided) { const h = L * K.tan(angle / 2); f.poly([[0, -t], [L, -t], [L + t / K.tan(angle / 2) * 0 + 0.001, -t], [L + t / (2 * K.tan(angle / 2)), 0], [L, t], [0, t]], 'metal'); f.angle([L + t / (2 * K.tan(angle / 2)), 0], 0.55, 180 - angle / 2, 180 + angle / 2, angle + '°', { lr: 14 }); }
    else { const run = 2 * t / K.tan(angle); f.poly([[0, -t], [L + run, -t], [L, t], [0, t]], 'metal'); f.angle([L + run, -t], 0.55, 180 - angle, 180, angle + '°', { lr: 14 }); }
    return [f.svg(name), `<b>${name}</b>`];
  };
  return panels([edge('Roughing gouge', 45), edge('Spindle gouge', 35), edge('Skew (included)', 45, true), edge('Scraper', 75)]);
};

FIG.latheFinish = () => {
  const f = fig(24), L = 10;
  const { tx } = lathe(f, 0.3, L, 5, { rest: false });
  f.board([[0.3, 4.2], [L, 4.2], [L, 5.8], [0.3, 5.8]], { seed: 7 });
  f.rect(L / 2 - 1, 3.95, 2, 0.25, 'tape');
  f.hand([L / 2, 3.1], 90, 1.6);
  f.rect(-4, 0, 2.4, 1.2, 'hidden-l'); f.text([-2.8, 2], 'rest swung clear', { size: 10, cls: 'lbl-s' });
  f.note([L / 2 + 1, 4.05], [30, 22], 'paper underneath, keep it moving');
  f.text([L / 2, 7.2], 'speed: about half', { size: 11, cls: 'lbl-b' });
  return f.svg('Sanding a spindle on the lathe');
};
