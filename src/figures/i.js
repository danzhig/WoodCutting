/* Guide I · Wood Species */

// small deterministic noise (same idea as the kit's grain)
const wnoise = x => { const s = Math.sin(x * 12.9898 + 4.1) * 43758.5453; return s - Math.floor(s); };
let WUID = 0;
// drawing inside a clip region: map points without growing the figure's frame
const rawLine = (f, pts, cls) => f.add(`<polyline class="${cls}" points="${pts.map(p => f.P(p).map(v => v.toFixed(1)).join(',')).join(' ')}"/>`);
const rawPoly = (f, pts, cls) => f.add(`<polygon class="${cls}" points="${pts.map(p => f.P(p).map(v => v.toFixed(1)).join(',')).join(' ')}"/>`);
const rawDisc = (f, c, r, cls) => { const q = f.P(c); f.add(`<circle class="${cls}" cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${(r * f.S).toFixed(1)}"/>`); };
const woodStyle = w => `--sw:${w.sw};--sw2:${w.sap || w.sw}`;

// flatsawn face of a board: x0..x0+L, y0..y0+H, drawn in the species' colour and grain pattern
function woodFace(f, w, x0, y0, L, H, seed = 1) {
  const id = 'wf' + (++WUID);
  const box = [[x0, y0], [x0 + L, y0], [x0 + L, y0 + H], [x0, y0 + H]];
  f.add(`<g style="${woodStyle(w)}"><clipPath id="${id}">`); f.poly(box, ''); f.add(`</clipPath><g clip-path="url(#${id})">`);
  rawPoly(f, box, 'sw');
  if (w.sap) rawPoly(f, [[x0, y0], [x0 + L, y0], [x0 + L, y0 + H * 0.2], [x0, y0 + H * 0.24]], 'sw2');
  if (w.blue) [0.35, 0.62, 0.8].forEach((t, i) => rawPoly(f, [[x0, y0 + H * t], [x0 + L, y0 + H * (t + 0.05)], [x0 + L, y0 + H * (t + 0.1)], [x0, y0 + H * (t + 0.07 + 0.04 * i)]], 'swblue'));
  if (w.pat === 'streak') [0.3, 0.55, 0.78].forEach((t, i) => rawPoly(f, [[x0, y0 + H * t], [x0 + L, y0 + H * (t - 0.04)], [x0 + L, y0 + H * (t + 0.03 + 0.03 * i)], [x0, y0 + H * (t + 0.08)]], 'swdark'));
  if (w.pat === 'ribbon') for (let x = x0 - 1; x < x0 + L; x += 0.9) rawPoly(f, [[x, y0], [x + 0.42, y0], [x + 0.62, y0 + H], [x + 0.2, y0 + H]], 'swdark');
  const cls = { bold: 'sgl-b', ring: 'sgl-p', soft: 'sgl', streak: 'sgl', fine: 'sgl-f', ribbon: 'sgl-f' }[w.pat];
  const yc = y0 + H * 0.55;
  if (w.pat === 'fine' || w.pat === 'ribbon') {
    // diffuse-porous woods: gentle, nearly straight lines
    for (let b = y0 + 0.18, k = seed; b < y0 + H; b += 0.28 + 0.2 * wnoise(++k)) {
      const pts = []; const ph = wnoise(k * 3) * 6.3, amp = 0.03 + 0.05 * wnoise(k * 7);
      for (let i = 0; i <= 18; i++) pts.push([x0 + L * i / 18, b + amp * Math.sin(ph + i * 0.7)]);
      rawLine(f, pts, cls);
    }
  } else {
    // flatsawn cathedrals: nested arches that open toward the left end
    for (let i = 0; i < 9; i++) {
      const h = 0.18 + 0.3 * i, tip = x0 + L * 0.42 + 0.55 * i + 0.3 * wnoise(seed + i), s = 0.5 + 0.35 * i;
      const half = sgn => { const pts = []; for (let x = tip; x >= x0 - 0.1; x -= 0.15) pts.push([x, yc + sgn * h * Math.sqrt(1 - Math.exp(-(tip - x) / s)) + 0.03 * Math.sin(x * 2.3 + i)]); return pts; };
      const arch = half(1).reverse().concat(half(-1));
      rawLine(f, arch, cls);
      if (w.pat === 'bold') rawLine(f, arch.map(([x, y]) => [x - 0.1, y + (y > yc ? 0.07 : -0.07)]), 'sgl-f');
    }
  }
  if (w.rays) for (let k = 0; k < 26 * w.rays; k++) {
    const x = x0 + L * wnoise(seed * 5 + k), y = y0 + H * wnoise(seed * 9 + k * 1.7), l = 0.08 + 0.1 * w.rays * wnoise(k * 2.1);
    rawLine(f, [[x, y], [x + l, y]], 'sray');
  }
  f.add('</g></g>');
  f.poly(box, 'edge');
}

// end grain block: rings around a pith below the block
function woodEnd(f, w, x0, y0, B, H, seed = 2) {
  const id = 'we' + (++WUID), c = [x0 + B * 0.45, y0 - 2.6];
  const box = [[x0, y0], [x0 + B, y0], [x0 + B, y0 + H], [x0, y0 + H]];
  f.add(`<g style="${woodStyle(w)}"><clipPath id="${id}">`); f.poly(box, ''); f.add(`</clipPath><g clip-path="url(#${id})">`);
  rawPoly(f, box, w.sap ? 'sw2' : 'sw');
  if (w.sap) rawDisc(f, c, 2.6 + H * 0.78, 'sw');
  const ringR = w.pat === 'fine' || w.pat === 'ribbon' ? 0.42 : 0.3;
  for (let r = 2.75, k = 0; r < 2.6 + H * 1.5; r += ringR * (0.8 + 0.4 * wnoise(seed + ++k))) {
    const pts = []; for (let a = 40; a <= 140; a += 3) pts.push([c[0] + r * Math.cos(a * Math.PI / 180), c[1] + r * Math.sin(a * Math.PI / 180)]);
    rawLine(f, pts, w.pat === 'bold' ? 'sgl-b' : w.pores === 'conifer' ? 'sgl' : 'sgl-f');
    if (w.pores === 'ring-porous' || w.pores === 'semi-ring-porous') {
      const n = w.pores === 'ring-porous' ? 16 : 10;
      for (let j = 0; j < n; j++) {
        const a = (48 + 84 * (j + wnoise(k * 13 + j)) / n) * Math.PI / 180, rr = r + 0.06 + 0.05 * wnoise(k + j * 3);
        rawDisc(f, [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)], w.pores === 'ring-porous' ? 0.028 : 0.022, 'spore');
      }
    }
  }
  if (w.pores === 'diffuse-porous') for (let j = 0; j < 70; j++) rawDisc(f, [x0 + B * wnoise(seed * 3 + j), y0 + H * wnoise(seed * 7 + j * 1.3)], 0.012, 'spore');
  if (w.rays) for (let j = 0; j < 9 * w.rays; j++) {
    const a = (50 + 80 * wnoise(j * 5.3)) * Math.PI / 180, r1 = 2.6 + H * 1.3 * wnoise(j * 2.9), l = 0.2 + 0.35 * w.rays * wnoise(j);
    rawLine(f, [[c[0] + r1 * Math.cos(a), c[1] + r1 * Math.sin(a)], [c[0] + (r1 + l) * Math.cos(a), c[1] + (r1 + l) * Math.sin(a)]], 'sray');
  }
  f.add('</g></g>');
  f.poly(box, 'edge');
}

// the sample at the top of every species page
FIG.woodSwatch = key => {
  const w = WOODS[key], f = fig(34);
  woodFace(f, w, 0, 0, 8, 2.6, key.length);
  woodEnd(f, w, 8.8, 0, 2.6, 2.6, key.length + 3);
  f.text([4, -0.45], 'face (flatsawn)', { cls: 'lbl-s', size: 11 });
  f.text([10.1, -0.45], 'end grain, enlarged', { cls: 'lbl-s', size: 11 });
  if (w.sap) f.text([0.15, 0.3], 'sapwood', { cls: 'onwood', size: 10, anchor: 'start' });
  return f.svg(`${w.name}: face grain and end grain sample`, 6);
};

/* ---------- Reading a species page ---------- */
FIG.jankaTest = () => {
  const f = fig(150), r = 0.222;
  const dent = []; for (let a = 180; a <= 360; a += 10) dent.push([r * Math.cos(a * Math.PI / 180), r * Math.sin(a * Math.PI / 180)]);
  f.board([[-1.1, -0.55], [1.1, -0.55], [1.1, 0]].concat(dent.reverse().map(p => [p[0], p[1]])).concat([[-1.1, 0]]), { grain: 0, sp: 9 });
  f.disc([0, 0], r, 'tool');
  f.arrow([0, 0.9], [0, r + 0.04], 'feed', 'feedhead');
  f.text([0.1, 0.8], 'force needed = Janka hardness (lbf)', { anchor: 'start', size: 12, cls: 'lbl-b' });
  f.note([-r * 0.7, r * 0.7], [-34, -26], '0.444″ steel ball', { anchor: 'end' });
  f.dim([r + 0.02, 0], [r + 0.02, -r], 0.45, 'pressed in 0.222″', { size: 11, flat: true });
  f.note([-0.8, -0.3], [-18, 22], 'test board', { anchor: 'end' });
  return f.svg('Janka test: a steel ball pressed half its diameter into the wood');
};

FIG.bendTest = () => {
  const f = fig(16), L = 30, T = 1.5;
  f.plank(0, 0, L, T, { grain: 0, sp: 7 });
  const sag = []; for (let i = 0; i <= 30; i++) { const x = L * i / 30; sag.push([x, -1.4 * Math.sin(Math.PI * x / L)]); }
  f.pline(sag, 'pencil-d'); f.pline(sag.map(([x, y]) => [x, y + T]), 'pencil-d');
  [[1, 0], [L - 1, 0]].forEach(([x]) => f.poly([[x, 0], [x - 0.9, -1.6], [x + 0.9, -1.6]], 'tool'));
  f.arrow([L / 2, T + 3.2], [L / 2, T + 0.1], 'feed', 'feedhead');
  f.text([L / 2 + 0.5, T + 2.6], 'load', { anchor: 'start', size: 12, cls: 'lbl-b' });
  f.dim([L / 2 + 3.2, 0], [L / 2 + 3.2, -1.4], -0.5, 'sag', { size: 11, flat: true });
  f.note([L * 0.3, -1.2], [-10, 30], 'stiffness (MOE) sets how far it sags', { anchor: 'end' });
  f.note([L * 0.78, T * 0.5], [34, -40], 'strength (MOR) sets the load that breaks it', { anchor: 'start' });
  return f.svg('A board loaded in the middle between two supports, sagging');
};

FIG.shrinkDirs = () => {
  const f = fig(15), c = [0, 0], R = 8;
  f.disc(c, R + 0.35, 'w-b'); f.disc(c, R, 'wood');
  for (let r = 0.8; r < R; r += 0.8) f.add(`<circle class="grain" cx="0" cy="0" r="${(r * 15).toFixed(1)}"/>`);
  f.disc(c, 0.15, 'dot');
  // flatsawn board near the top: cups away from the pith (dashed = after drying, exaggerated)
  f.rect(-4, 4.6, 8, 1.6, 'w-top');
  f.pline([[-3.6, 4.95], [0, 4.55], [3.6, 4.95], [3.6, 6.0], [0, 5.65], [-3.6, 6.0], [-3.6, 4.95]], 'ghost');
  f.note([4, 5.4], [26, -10], 'flatsawn: cups, shrinks most in width', { anchor: 'start' });
  // quartersawn board on the right: stays flat
  f.rect(4.8, -0.9, 3, 1.8, 'w-top');
  f.pline([[4.9, -0.75], [7.7, -0.75], [7.7, 0.75], [4.9, 0.75], [4.9, -0.75]], 'ghost');
  f.note([7.8, 0], [24, 0], 'quartersawn: stays flat', { anchor: 'start' });
  // direction arrows
  f.arrow([-5.2, -3.27], [-6.08, -0.83], 'dimline', 'arrow'); f.text([-6.9, -2.2], 'T', { cls: 'dimtext halo', size: 14 });
  f.arrow([-1.4, -1.4], [-3.4, -3.4], 'dimline', 'arrow'); f.text([-1.9, -3.1], 'R', { cls: 'dimtext halo', size: 14 });
  f.note([0, 0], [-36, -30], 'pith', { anchor: 'end' });
  f.text([0, -R - 1.3], 'T = tangential (along the rings) · R = radial (across them)', { cls: 'lbl-s', size: 12 });
  return f.svg('End of a log: tangential and radial shrinkage, and how flatsawn and quartersawn boards change shape');
};

FIG.heartSap = () => {
  const f = fig(15), c = [0, 0];
  f.disc(c, 7.6, 'w-b'); f.disc(c, 7.2, 'wood');
  f.disc(c, 5.0, 'heartw');
  for (let r = 0.7; r < 7.2; r += 0.7) f.add(`<circle class="grain" cx="0" cy="0" r="${(r * 15).toFixed(1)}"/>`);
  f.disc(c, 0.15, 'dot');
  f.note([0, 7.4], [30, -24], 'bark', { anchor: 'start' });
  f.note([5.2, 4.2], [34, -6], 'sapwood: living, pale, rots quickly', { anchor: 'start' });
  f.note([2.2, 1.6], [120, 30], 'heartwood: dead, often darker, holds the rot-resisting chemicals', { anchor: 'start' });
  f.note([0, 0], [-40, 30], 'pith', { anchor: 'end' });
  return f.svg('Log cross-section: bark, sapwood, heartwood and pith');
};

FIG.evenUneven = () => {
  const a = fig(44), b = fig(44);
  woodEnd(a, WOODS.basswood, 0, 0, 3, 2.4, 5); woodEnd(b, WOODS.dfir, 0, 0, 3, 2.4, 6);
  return panels([[a.svg('Basswood end grain: even'), '<b>Basswood</b>: even rings. A gouge cuts the same everywhere.'],
    [b.svg('Douglas fir end grain: uneven'), '<b>Douglas fir</b>: soft earlywood, hard latewood. Tools dive, then skip.']]);
};

/* ---------- comparison charts (one series each: one colour, labels at the bar ends) ---------- */
function woodBars(key, label, unit, max, fmtv, asc) {
  const f = fig(26), list = Object.keys(WOODS).sort((p, q) => asc ? key(WOODS[p]) - key(WOODS[q]) : key(WOODS[q]) - key(WOODS[p]));
  const W = 12, pitch = 0.62, bh = 0.4, n = list.length;
  for (let t = 0; t <= max; t += max / 4) {
    const x = W * t / max; f.line([x, 0.3], [x, -n * pitch], 'wgrid');
    f.text([x, 0.62], fmtv(t), { cls: 'lbl-s', size: 10 });
  }
  list.forEach((k, i) => {
    const w = WOODS[k], v = key(w), y = -i * pitch - bh, x = W * v / max;
    f.add(`<g class="wbar"><title>${w.name}: ${fmtv(v)} ${unit}</title>`);
    f.rect(0, y, x, bh, 'bar');
    f.add('</g>');
    f.text([-0.2, y + bh / 2], w.name, { anchor: 'end', size: 11, cls: 'lbl' });
    f.text([x + 0.15, y + bh / 2], fmtv(v), { anchor: 'start', size: 10, cls: 'lbl-s' });
  });
  f.line([0, 0.3], [0, -n * pitch], 'leader');
  f.text([W / 2, 1.3], label, { cls: 'lbl-b', size: 12 });
  return f.svg(label);
}
FIG.jankaChart = () => woodBars(w => w.janka, 'Janka hardness, lbf (higher = harder)', 'lbf', 2000, v => WOODUTIL.fmt(Math.round(v)));
FIG.shrinkChart = () => woodBars(w => w.sh[2], 'Volumetric shrinkage, % (lower = more stable)', '%', 20, v => String(+v.toFixed(1)), true);
