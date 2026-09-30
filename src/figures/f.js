/* Guide F · Joining Angled Work */

FIG.glueMiter = () => {
  const mk = (sized) => {
    const f = fig(40), W = 2.5, L = 5;
    f.board([[-L, 0], [0, 0], [W, W], [-L, W]], { seed: sized ? 2 : 1, sp: 6 });
    f.line([0, 0], [W, W], 'cutline');
    for (let i = 1; i < 8; i++) { const p = K.lerp([0, 0], [W, W], i / 8); f.line(p, K.add(p, [-0.5, 0]), 'thin'); }
    const gl = [[0, 0], [W, W], [W - 0.12, W], [-0.12, 0]];
    f.poly(gl, 'glue');
    if (!sized) { for (let i = 1; i < 8; i += 2) { const p = K.lerp([0, 0], [W, W], i / 8); f.arrow(K.add(p, [-0.2, 0]), K.add(p, [-1.3, 0]), 'dimline', 'arrow'); } f.note([W / 2 - 1.2, W / 2], [-16, -40], 'glue wicks into the end grain', { anchor: 'end' }); }
    else { const g2 = [[0.1, 0], [W + 0.1, W], [W - 0.02, W], [-0.02, 0]]; f.poly(g2, 'glue'); f.note([W / 2, W / 2], [26, 20], 'sized pores: glue stays in the joint'); }
    return f.svg(sized ? 'Sized miter face' : 'Unsized miter face');
  };
  return panels([[mk(false), 'One coat: starved joint'], [mk(true), 'Sizing coat, then glue']]);
};

FIG.reinforce = () => {
  const corner = (draw, name) => {
    const f = fig(18), W = 2.5, L = 6;
    f.board([[0, 0], [L, 0], [L, W], [W, W]], { seed: 1, sp: 7 });
    f.board([[0, 0], [W, W], [W, L], [0, L]], { grain: 90, seed: 2, cls: 'wood2', sp: 7 });
    f.line([0, 0], [W, W], 'cutline');
    draw(f, W);
    return [f.svg(name), '<b>' + name + '</b>'];
  };
  const u = K.norm([1, 1]), n = [-u[1], u[0]];
  return panels([
    corner((f, W) => { const a = K.lerp([0, 0], [W, W], 0.15), b = K.lerp([0, 0], [W, W], 0.8); f.poly([K.add(a, K.mul(n, 0.5)), K.add(b, K.mul(n, 0.5)), K.add(b, K.mul(n, -0.5)), K.add(a, K.mul(n, -0.5))], 'hidden-l'); }, 'Spline'),
    corner((f, W) => { f.poly([[0, 0], [1.1, 0], [0, 1.1]], 'hidden-l'); f.line([0.3, -0.1], [0.8, -0.1], 'cutline'); f.line([-0.1, 0.3], [-0.1, 0.8], 'cutline'); }, 'Key'),
    corner((f, W) => { const c = K.lerp([0, 0], [W, W], 0.5), pts = []; for (let t = 0; t < 360; t += 15) pts.push(K.add(c, K.add(K.mul(u, 0.9 * K.cos(t)), K.mul(n, 0.4 * K.sin(t))))); f.poly(pts, 'hidden-l'); }, 'Biscuit'),
    corner((f, W) => { [0.3, 0.7].forEach(s => { const c = K.lerp([0, 0], [W, W], s); f.poly([K.add(c, K.add(K.mul(n, 0.9), K.mul(u, 0.12))), K.add(c, K.add(K.mul(n, -0.9), K.mul(u, 0.12))), K.add(c, K.add(K.mul(n, -0.9), K.mul(u, -0.12))), K.add(c, K.add(K.mul(n, 0.9), K.mul(u, -0.12)))], 'hidden-l'); }); }, 'Dowels'),
    corner((f, W) => { f.pline([[W + 2.2, W / 2], [W * 0.62, W / 2]], 'hidden-l'); f.circle([W + 2.2, W / 2], 3, 'dot'); f.text([W + 2.2, W / 2 + 0.6], 'from the back', { size: 10, cls: 'lbl-s' }); }, 'Pocket screw')
  ]);
};

FIG.nailing = () => {
  const f = fig(34), L = 5, t = 0.75;
  f.rect(-L - 0.5, 0, L + 0.5, L + 0.5, 'wall');
  f.board([[-L, 0], [0, 0], [t, -t], [-L, -t]], { seed: 1 });
  f.board([[0, 0], [0, L], [t, L], [t, -t]], { grain: 90, seed: 2, cls: 'wood2' });
  f.line([0, 0], [t, -t], 'cutline');
  f.line([-0.9, -t - 0.15], [0.35, -0.2], 'pencil'); f.circle([-0.9, -t - 0.15], 2.5, 'dot');
  f.line([t + 0.15, 0.9], [0.2, -0.35], 'pencil'); f.circle([t + 0.15, 0.9], 2.5, 'dot');
  f.note([-0.9, -t - 0.15], [-10, 20], 'brad from the front face', { anchor: 'end' });
  f.note([t + 0.15, 0.9], [18, -8], 'brad from the side face');
  f.text([-L / 2, L / 2], 'wall', { cls: 'lbl-s', size: 11 });
  return f.svg('Brads crossing an outside corner miter');
};

FIG.clamping = () => {
  const a = fig(9);
  polyFrame(a, 4, 7.5, 2.5, { sp: 6 });
  const r = 7.5 * Math.SQRT2;
  const band = [[-8.3, -8.3], [8.3, -8.3], [8.3, 8.3], [-8.3, 8.3], [-8.3, -8.3]];
  a.pline(band, 'plan-line');
  [[-7.5, -7.5], [7.5, -7.5], [7.5, 7.5], [-7.5, 7.5]].forEach(([x, y]) => a.poly([[x, y], [x + Math.sign(-x) * -1.6, y], [x + Math.sign(-x) * -1.6, y + Math.sign(-y) * -0.8], [x + Math.sign(-x) * -0.8, y + Math.sign(-y) * -0.8], [x + Math.sign(-x) * -0.8, y + Math.sign(-y) * -1.6], [x, y + Math.sign(-y) * -1.6]], 'tool'));
  a.rect(-1.5, -9.3, 3, 1.4, 'tool-d');
  a.note([0, -9.3], [0, 20], 'band clamp ratchet', { anchor: 'middle' });
  const b = fig(18), W = 3, T = 0.75;
  let x = 0;
  for (let i = 0; i < 4; i++) {
    const p = [[x, 0], [x + W, 0], [x + W - T, T], [x + T, T]];
    b.board(p, { seed: i, cls: i % 2 ? 'wood2' : 'wood' });
    if (i < 3) b.rect(x + W - 0.4, -0.1, 0.8, 0.12, 'tape');
    x += W;
  }
  b.text([x / 2, -0.7], 'faces down, tape across each joint, glue in the V’s, then fold', { size: 11, cls: 'lbl' });
  const bx = x + 3; b.poly([[bx, 0], [bx + 2, 0], [bx + 2, 2], [bx, 2]], 'edge');
  b.arrow([x + 0.4, 1], [bx - 0.4, 1]);
  return panels([[a.svg('Band clamp around a frame'), 'Band clamp'], [b.svg('Tape trick for a small box'), 'Tape trick']]);
};

FIG.movementMiter = () => {
  const f = fig(30), W = 7.25, d = 0.8, Wp = W - d, L = 12;
  f.poly([[0, 0], [L, 0], [L, W], [W, W]], 'hidden-l'); f.poly([[0, 0], [W, W], [W, L], [0, L]], 'hidden-l');
  f.board([[0, 0], [L, 0], [L, Wp], [W, Wp]], { seed: 1, sp: 9 });
  f.board([[0, 0], [Wp, W], [Wp, L], [0, L]], { grain: 90, seed: 2, cls: 'wood2', sp: 9 });
  f.poly([[0, 0], [W, Wp], [Wp, W]], 'gap');
  f.note([W * 0.8, W * 0.8], [30, 20], 'heel opens as the wood shrinks');
  f.note([0, 0], [-14, 18], 'outside tips stay closed', { anchor: 'end' });
  f.text([L - 2, Wp + 0.6], 'dashed: before shrinking', { cls: 'lbl-s', size: 11 });
  return f.svg('Wide miter opening at the heel as boards shrink');
};
