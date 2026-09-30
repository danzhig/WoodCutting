/* Guide E · Trim & Finish */

/* ---------- Corners ---------- */
FIG.inOutCorners = () => {
  const L = 7, t = 1;
  const a = fig(26);
  walls(a, 90, L + 1, 1);
  const p1 = [[-L, 0], [0, 0], [-t, t], [-L, t]], p2 = [[0, 0], [0, L], [-t, L], [-t, t]];
  a.board(p1, { seed: 1 }); a.board(p2, { grain: 90, seed: 2, cls: 'wood2' });
  a.line([0, 0], [-t, t], 'cutline');
  a.note([0, 0], [22, 18], 'long points at the back (wall side)');
  a.text([-L / 2, 2.6], 'room', { cls: 'lbl-s', size: 11 });
  const b = fig(26);
  b.rect(-L - 1, 0, L + 1, L + 1, 'wall');
  const q1 = [[-L, 0], [0, 0], [t, -t], [-L, -t]], q2 = [[0, 0], [0, L], [t, L], [t, -t]];
  b.board(q1, { seed: 3 }); b.board(q2, { grain: 90, seed: 4, cls: 'wood2' });
  b.line([0, 0], [t, -t], 'cutline');
  b.note([t, -t], [22, 18], 'long points at the front (room side)');
  b.text([-L / 2, L / 2], 'wall', { cls: 'lbl-s', size: 11 });
  b.text([3, -2.6], 'room', { cls: 'lbl-s', size: 11 });
  return panels([[a.svg('Inside corner of baseboard'), '<b>Inside corner</b>'], [b.svg('Outside corner of baseboard'), '<b>Outside corner</b>']]);
};

FIG.measureTrim = () => {
  const f = fig(6), L = 96, t = 3;
  f.rect(-8, 0, L + 8, 8, 'wall'); f.rect(-8, -26, 8, 26, 'wall');
  f.board([[0, 0], [L, 0], [L + t, -t], [t, -t]], { seed: 5, sp: 5 });
  f.board([[L, 0], [L, 8], [L + t, 8], [L + t, -t]], { grain: 90, seed: 6, cls: 'wood2', sp: 5 });
  f.line([0, 0], [t, -t], 'cutline'); f.line([L, 0], [L + t, -t], 'cutline');
  f.dim([0, 0], [L, 0], 3.2, 'back: 96″ (measure this)', { size: 12 });
  f.dim([t, -t], [L + t, -t], -3.5, 'front: from ⅝″ in to ⅝″ past', { size: 12 });
  f.text([-4, -12], 'inside corner', { cls: 'lbl-s', size: 11, rot: -90 });
  f.note([L, 0], [16, -26], 'outside corner of the wall');
  f.text([L / 2, 4], 'wall', { cls: 'lbl-s', size: 11 });
  f.text([L / 2, -10], 'baseboard thickness drawn about 5× so the ends show', { cls: 'lbl-s', size: 11 });
  return f.svg('Measuring baseboard from an inside to an outside corner');
};

/* ---------- Coping ---------- */
FIG.copeWhy = () => {
  const C = 100, L = 7, t = 1.4;
  const mk = (coped) => {
    const f = fig(26);
    const { u1, u2, n1, n2 } = walls(f, C, L + 1, 1);
    if (!coped) {
      const p1 = [K.mul(u1, L), [0, 0], K.add(K.mul(n1, t), K.mul(u1, t)), K.add(K.mul(u1, L), K.mul(n1, t))];
      const sp2 = K.add(K.mul(n2, t), K.mul(u2, t));
      const p2 = [[0, 0], K.mul(u2, L), K.add(K.mul(u2, L), K.mul(n2, t)), sp2];
      f.board(p1, { seed: 1 }); f.board(p2, { grain: 180 - C, seed: 2, cls: 'wood2' });
      f.poly([[0, 0], p1[2], sp2], 'gap');
      f.note(K.lerp(p1[2], sp2, 0.5), [26, 16], 'gap at the front');
    } else {
      const k = K.cos(C) / K.sin(C);
      const P = [t * k, t], Q = K.meet(K.mul(n2, t), u2, [0, t], [1, 0]);
      f.board([K.mul(u1, L), [0, 0], P, K.add(K.mul(u1, L), K.mul(n1, t))], { seed: 1 });
      f.board([P, K.mul(u2, L), K.add(K.mul(u2, L), K.mul(n2, t)), Q], { grain: 180 - C, seed: 2, cls: 'wood2' });
      f.line(P, Q, 'cutline');
      f.note(K.lerp(P, Q, 0.5), [26, 16], 'coped end rides on the face');
    }
    f.angle([0, 0], 2.8, 180 - C, 180, 'not 90°', { lr: 22 });
    return f.svg(coped ? 'Coped inside corner' : 'Mitered inside corner opening');
  };
  return panels([[mk(false), '<b>Mitered</b>: opens at the front'], [mk(true), '<b>Coped</b>: still tight']]);
};

FIG.copeHow = () => {
  const H = 4.6, xe = 6;
  const a = fig(42);
  const prof = []; for (let y = 0; y <= H; y += 0.05) prof.push([xe - baseProfile(y), y]);
  const top = []; for (let y = 3.2; y <= H; y += 0.05) top.push([0, y]);
  a.board([[0, 0]].concat(prof, [[0, H]]), { seed: 3 });
  a.poly(prof.concat([[xe, H], [xe, 0]].slice(0, 0)).concat(Array.from({ length: prof.length }, (_, i) => [xe - 0.02, prof[prof.length - 1 - i][1]])), 'endface');
  a.pline(prof, 'pencil');
  a.note(prof[70], [30, -10], 'profile line (pencil it)');
  a.text([2.6, 1.5], 'face of the baseboard', { cls: 'onwood', size: 11 });
  const b = fig(80), t = 0.75, x0 = 3.5;
  b.plank(0, 0, 4.5, t, { seed: 4 });
  b.poly([[x0, 0], [4.5, 0], [4.5, t], [x0 - t * K.tan(30), t]], 'waste');
  b.line([x0, 0], [x0 - t * K.tan(30), t], 'cutline');
  b.circle([x0, 0], 3, 'dot');
  b.note([x0, 0], [20, 18], 'front edge stays on the profile line');
  b.angle([x0, 0], 0.5, 90, 90 + 30, '30°', { lr: 12, arrows: false });
  b.line([x0, 0], [x0, t + 0.2], 'sq');
  b.text([1.7, t / 2], 'section at mid-height', { cls: 'onwood', size: 10 });
  b.text([2.2, -0.35], 'room side', { cls: 'lbl-s', size: 10 }); b.text([2.2, t + 0.3], 'wall side', { cls: 'lbl-s', size: 10 });
  const c = fig(26), L = 6, tt = 1;
  walls(c, 90, L + 1, 1);
  c.board([[-L, 0], [0, 0], [0, tt], [-L, tt]], { seed: 1 });
  c.board([[0, tt], [0, L], [-tt, L], [-tt, tt]], { grain: 90, seed: 2, cls: 'wood2' });
  c.line([0, tt], [-tt, tt], 'cutline');
  c.note([-tt / 2, tt], [-20, 30], 'coped end on the first piece’s face', { anchor: 'end' });
  c.text([-L / 2, tt / 2], 'first piece: square cut', { cls: 'onwood', size: 10 });
  return panels([[a.svg('Profile line after the 45 degree reveal cut'), '1. Reveal cut'], [b.svg('Back-cut with a coping saw'), '2. Back-cut'], [c.svg('Coped joint fitted'), '3. Fitted (top view)']]);
};

/* ---------- Baseboard and casing ---------- */
FIG.roomOrder = () => {
  const f = fig(2.4), W = 144, H = 120, t = 4, d0 = 64, d1 = 96;
  f.rect(-6, -6, W + 12, H + 12, 'wall'); f.rect(0, 0, W, H, 'glass');
  f.rect(d0, -6, d1 - d0, 6, 'glass'); f.text([(d0 + d1) / 2, -12], 'door', { cls: 'lbl-s', size: 11 });
  const piece = (pts, n, lbl, g) => { f.board(pts, { grain: g, seed: n, sp: 5 }); const c = pts.reduce((s, p) => K.add(s, p), [0, 0]).map(v => v / pts.length); f.text(c, String(n), { cls: 'lbl-b halo', size: 13 }); f.text(c, lbl, { cls: 'cuttext halo', size: 11, dy: n === 1 || n >= 4 ? (n === 1 ? 16 : -16) : 0, dx: n === 2 ? -30 : n === 3 ? 30 : 0 }); };
  piece([[0, H - t], [W, H - t], [W, H], [0, H]], 1, 'S–S', 0);
  piece([[W - t, 0], [W, 0], [W, H - t], [W - t, H - t]], 2, 'C–S', 90);
  piece([[0, 0], [t, 0], [t, H - t], [0, H - t]], 3, 'C–S', 90);
  piece([[d1, 0], [W - t, 0], [W - t, t], [d1, t]], 4, 'C–S', 0);
  piece([[t, 0], [d0, 0], [d0, t], [t, t]], 5, 'C–S', 0);
  f.text([W / 2, H / 2], 'room (plan view)', { cls: 'lbl-s', size: 12 });
  return f.svg('Installation order of baseboard around a room');
};

FIG.scarf = () => {
  const a = fig(40), t = 0.625, L = 5;
  a.rect(-6, 0, 12, 0.6, 'wall'); a.rect(-0.75, 0.6, 1.5, 3.5, 'hidden-l'); a.text([0, 2.4], 'stud', { cls: 'lbl-s', size: 10 });
  a.board([[-L, 0], [-t / 2, 0], [t / 2, -t], [-L, -t]], { seed: 1 });
  a.board([[-t / 2, 0], [L, 0], [L, -t], [t / 2, -t]], { seed: 2, cls: 'wood2' });
  a.line([-t / 2, 0], [t / 2, -t], 'cutline');
  a.line([-0.5, -t - 0.3], [-0.5, 1.4], 'pencil'); a.line([0.5, -t - 0.3], [0.5, 1.4], 'pencil');
  a.dim([-t / 2, -t], [t / 2, -t], -0.5, '⅝″ overlap', { size: 11 });
  a.text([-3, -1.4], 'room side', { cls: 'lbl-s', size: 10 });
  a.note([0.3, -0.45], [30, -20], 'front piece laps over the back one');
  const b = fig(9), H = 3.5;
  b.rect(-24, 0, 48, 24, 'glass');
  b.rect(-0.75, 0, 1.5, 24, 'hidden-l');
  b.plank(-24, 0, 24.3, H, { seed: 3, sp: 5 }); b.plank(0.3, 0, 23.7, H, { seed: 4, cls: 'wood2', sp: 5 });
  b.line([0.3, 0], [0.3, H], 'cutline');
  b.note([0.3, H], [20, -20], 'seam lands on a stud');
  b.text([12, 14], 'wall (from the room)', { cls: 'lbl-s', size: 11 });
  return panels([[a.svg('Scarf joint top view'), 'Top view'], [b.svg('Scarf joint from the room'), 'From the room']]);
};

FIG.returns = () => {
  const a = fig(70), t = 0.625, L = 4;
  a.rect(-L - 0.5, 0, L + 1.5, 0.6, 'wall');
  a.board([[-L, 0], [-t, 0], [0, -t], [-L, -t]], { seed: 1 });
  a.board([[-t, 0], [0, 0], [0, -t]], { grain: 90, seed: 2, cls: 'wood2' });
  a.line([-t, 0], [0, -t], 'cutline');
  a.note([-t / 3, -t / 3], [30, 16], 'return piece turns the profile to the wall');
  a.text([-L / 2, -t / 2], 'baseboard', { cls: 'onwood', size: 10 });
  a.text([-L / 2, 0.3], 'wall', { cls: 'lbl-s', size: 10 });
  const b = fig(44), W = 0.625, Lb = 8;
  b.board([[0, 0], [Lb, 0], [Lb, W], [W, W]], { seed: 3 });
  b.line([0, 0], [W, W], 'cutline');
  b.line([W, -0.3], [W, W + 0.3], 'cut');
  b.dim([0, 0], [W, 0], -0.5, '⅝″', { size: 11 });
  b.note([W, W + 0.3], [16, -16], 'square cut ⅝″ from the long point');
  b.text([Lb / 2 + 1, W / 2], 'long scrap: your hand stays here', { cls: 'onwood', size: 10 });
  return panels([[a.svg('Mitered return at the end of baseboard'), 'Top view'], [b.svg('Cutting a small return from a long scrap'), 'Cut it from a long piece']]);
};

FIG.casing = () => {
  const f = fig(5), w = 30, h = 80, j = 0.75, rv = 0.9, cw = 2.5;
  f.rect(0, 0, w, h, 'glass');
  f.rect(-j, 0, j, h + j, 'tool'); f.rect(w, 0, j, h + j, 'tool'); f.rect(-j, h, w + 2 * j, j, 'tool');
  const xl = -rv, xr = w + rv, yt = h + rv;
  f.board([[xl - cw, 0], [xl, 0], [xl, yt], [xl - cw, yt + cw]], { grain: 90, seed: 1, sp: 5 });
  f.board([[xr, 0], [xr + cw, 0], [xr + cw, yt + cw], [xr, yt]], { grain: 90, seed: 2, sp: 5 });
  f.board([[xl, yt], [xr, yt], [xr + cw, yt + cw], [xl - cw, yt + cw]], { seed: 3, cls: 'wood2', sp: 5 });
  f.line([xl, yt], [xl - cw, yt + cw], 'cutline'); f.line([xr, yt], [xr + cw, yt + cw], 'cutline');
  f.dim([0, h / 2], [w, h / 2], 0, '30″ opening', { size: 11, noext: true });
  f.dim([xl, yt], [xr, yt], -3, 'SP–SP 30⅜″', { size: 11 });
  f.dim([xl - cw, yt + cw], [xr + cw, yt + cw], 2.5, 'LP–LP 35⅜″', { size: 11 });
  f.note([-rv / 2, h - 10], [-30, 0], '³⁄₁₆″ reveal (drawn wider)', { anchor: 'end' });
  f.text([w / 2, 20], 'door opening', { cls: 'lbl-s', size: 11 });
  return f.svg('Door casing with reveals');
};

/* ---------- Crown molding ---------- */
function crownSection(f, flip) {
  // wall along x = 0 (material x < 0), ceiling along y = 0 (material y > 0); flip mirrors top/bottom for the saw
  const s = flip ? -1 : 1, a = 3.47, b = 2.71;
  const W = [0, -a * s], C = [b, 0];
  const v = K.norm(K.sub(C, W)), n = [v[1] * s, -v[0] * s];
  const face = []; for (let i = 0; i <= 20; i++) { const u = i / 20, d = 0.55 + 0.28 * Math.sin(2 * Math.PI * u) + 0.15; face.push(K.add(K.lerp(W, C, u), K.mul(n, d))); }
  const poly = [W, [0, -a * s - 0.45 * s], ...face.reverse(), [b + 0.45, 0], C];
  f.poly(poly, 'endface'); f.poly(poly, 'edge');
  return { W, C, a, b };
}
FIG.crownSpring = () => {
  const f = fig(40);
  f.rect(-1, -5, 1, 6, 'wall'); f.rect(-1, 0, 6, 1, 'wall');
  const { W, C } = crownSection(f, false);
  f.line(W, C, 'hidden-l');
  f.angle(W, 1.2, 52.03, 90, '38°', { lr: 14 });
  f.angle(C, 1.2, 180, 232.03, '52°', { lr: 14 });
  f.text([-0.5, -2.5], 'wall', { cls: 'lbl-s', size: 11, rot: -90 });
  f.text([3, 0.5], 'ceiling', { cls: 'lbl-s', size: 11 });
  f.note(K.lerp(W, C, 0.5), [-60, 14], 'hollow behind the crown', { anchor: 'end', dot: false });
  f.note(W, [24, 16], 'flat on the wall'); f.note(C, [14, 22], 'flat on the ceiling');
  return f.svg('Section of crown molding at its spring angle');
};

FIG.crownNested = () => {
  const a = fig(40);
  a.rect(-1, -0.6, 1, 5, 'fence'); a.rect(-1, -0.6, 6, 0.6, 'table');
  crownSection(a, true);
  a.rect(2.71 + 0.45, 0, 0.6, 0.7, 'tool-d');
  a.text([-1.6, 2.2], 'fence = wall', { cls: 'lbl-s', size: 11, rot: -90 });
  a.text([3.8, -1.2], 'table = ceiling', { cls: 'lbl-s', size: 11 });
  a.note([3.45, 0.7], [16, -16], 'crown stop');
  const b = fig(16);
  msTop(b, 45, { W: 2.7 });
  b.note([-6, -1.35], [-10, -30], 'crown, upside down, against the fence', { anchor: 'end' });
  return panels([[a.svg('Crown nested against the fence'), 'Side view'], [b.svg('Nested crown on the saw at 45 degrees'), 'Top view: miter 45°, bevel 0°']]);
};

FIG.crownFlat = () => {
  const f = fig(26), W = 4.4, c = F.compound(38, 4);
  endCut(f, W, c.miter, { x1: 12, alabel: 'miter ' + deg(c.miter, 1), ar: 2.4, labels: false });
  f.text([4.5, W / 2 + 0.5], 'crown lying flat, face up', { cls: 'onwood', size: 11 });
  f.text([4.5, W / 2 - 0.5], `blade also tilted: bevel ${deg(c.bevel, 1)}`, { cls: 'onwood', size: 11 });
  return f.svg('Crown cut flat with a compound miter');
};
