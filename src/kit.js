/* =====================================================================
   DRAWING KIT
   A tiny SVG builder. World units are inches, y points up.
   K.fig(S) draws at S pixels per inch and sizes its own viewBox.
   ===================================================================== */
const K = (() => {
  const RAD = Math.PI / 180;
  const r1 = v => Math.round(v * 10) / 10;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const mul = (a, k) => [a[0] * k, a[1] * k];
  const len = a => Math.hypot(a[0], a[1]);
  const norm = a => mul(a, 1 / len(a));
  const dir = deg => [Math.cos(deg * RAD), Math.sin(deg * RAD)];
  const angOf = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) / RAD;
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const rot = (p, deg, c = [0, 0]) => { const [cs, sn] = dir(deg); const d = sub(p, c); return [c[0] + d[0] * cs - d[1] * sn, c[1] + d[0] * sn + d[1] * cs]; };
  // intersection of lines p + t·d and q + s·e
  const meet = (p, d, q, e) => { const den = d[0] * e[1] - d[1] * e[0]; const t = ((q[0] - p[0]) * e[1] - (q[1] - p[1]) * e[0]) / den; return add(p, mul(d, t)); };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const hash = x => { const s = Math.sin(x * 12.9898 + 1.7) * 43758.5453; return s - Math.floor(s); };
  const tan = d => Math.tan(d * RAD), sin = d => Math.sin(d * RAD), cos = d => Math.cos(d * RAD);
  const atan = x => Math.atan(x) / RAD, asin = x => Math.asin(x) / RAD;
  // isometric projection of a 3D point (x, y, z) → 2D world; viewer sits toward (+1, +1, +1)
  const C30 = Math.cos(30 * RAD);
  const iso = ([x, y, z]) => [(x - y) * C30, z - (x + y) * 0.5];
  // turn a 3D point about the vertical axis (used to keep 45° faces from lining up edge-on in isometric)
  const rz = ([x, y, z], d) => { const c = Math.cos(d * RAD), s = Math.sin(d * RAD); return [x * c - y * s, x * s + y * c, z]; };
  let uid = 0;

  // number formatting
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
  const nice = { '1/2': '½', '1/4': '¼', '3/4': '¾', '1/8': '⅛', '3/8': '⅜', '5/8': '⅝', '7/8': '⅞' };
  function frac(x, den = 16) { // nearest 1/den inch, tape-measure style
    const neg = x < 0; let n = Math.round(Math.abs(x) * den); const w = Math.floor(n / den); let r = n % den, d = den;
    while (r && r % 2 === 0) { r /= 2; d /= 2; }
    let f = '';
    if (r) { const k = r + '/' + d; f = nice[k] || [...String(r)].map(c => SUP[c]).join('') + '⁄' + [...String(d)].map(c => SUB[c]).join(''); }
    return (neg ? '−' : '') + (w ? w : (r ? '' : '0')) + f + '″';
  }
  const deg = (x, dp = 2) => parseFloat(x.toFixed(dp)) + '°';
  const dec = (x, dp = 2) => x.toFixed(dp);

  function fig(S = 36) {
    const els = [];
    const bb = [1e9, 1e9, -1e9, -1e9];
    const grow = (x, y) => { if (x < bb[0]) bb[0] = x; if (y < bb[1]) bb[1] = y; if (x > bb[2]) bb[2] = x; if (y > bb[3]) bb[3] = y; };
    const P = p => [p[0] * S, -p[1] * S];
    const Wd = q => [q[0] / S, -q[1] / S];
    const fmt = q => r1(q[0]) + ',' + r1(q[1]);
    const ptsStr = (arr, g = true) => arr.map(p => { const q = P(p); if (g) grow(q[0], q[1]); return fmt(q); }).join(' ');
    const f = { S, P };
    f.add = s => (els.push(s), f);
    f.poly = (arr, cls) => f.add(`<polygon class="${cls}" points="${ptsStr(arr)}"/>`);
    f.pline = (arr, cls) => f.add(`<polyline class="${cls}" points="${ptsStr(arr)}"/>`);
    f.line = (a, b, cls) => f.pline([a, b], cls);
    f.circle = (c, rpx, cls) => { const q = P(c); grow(q[0] - rpx, q[1] - rpx); grow(q[0] + rpx, q[1] + rpx); return f.add(`<circle class="${cls}" cx="${r1(q[0])}" cy="${r1(q[1])}" r="${rpx}"/>`); };
    f.path = (d, cls, pts) => { pts.forEach(p => { const q = P(p); grow(q[0], q[1]); }); return f.add(`<path class="${cls}" d="${d}"/>`); };

    // text centered vertically on p. o: {cls, anchor, dx, dy (px), rot (deg, screen), size}
    f.text = (p, s, o = {}) => {
      const q = P(p), size = o.size || 12;
      const x = q[0] + (o.dx || 0), y = q[1] + (o.dy || 0);
      const anchor = o.anchor || 'middle';
      const w = [...String(s)].length * size * (o.wf || (/tagt/.test(o.cls || '') ? 0.78 : 0.58));
      const x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
      if (o.rot) { const m = Math.max(w / 2, size * 0.7); grow(x - m, y - m); grow(x + m, y + m); }
      else { grow(x0, y - size * 0.72); grow(x0 + w, y + size * 0.72); }
      const tf = o.rot ? ` transform="rotate(${r1(o.rot)} ${r1(x)} ${r1(y)})"` : '';
      return f.add(`<text class="${o.cls || 'lbl'}" x="${r1(x)}" y="${r1(y + size * 0.35)}" text-anchor="${anchor}" font-size="${size}"${tf}>${esc(s)}</text>`);
    };

    // arrowhead in screen space: tip q, unit direction u (pointing toward the tip)
    const arrowS = (q, u, cls, L = 8, H = 3) => {
      const b = [q[0] - u[0] * L, q[1] - u[1] * L], n = [-u[1], u[0]];
      const pts = [q, [b[0] + n[0] * H, b[1] + n[1] * H], [b[0] - n[0] * H, b[1] - n[1] * H]];
      pts.forEach(p => grow(p[0], p[1]));
      f.add(`<polygon class="${cls}" points="${pts.map(fmt).join(' ')}"/>`);
    };
    f.arrow = (a, b, cls = 'leader', acls = 'inkarrow') => {
      f.line(a, b, cls); const u = norm(sub(P(b), P(a))); arrowS(P(b), u, acls, 8, 3);
      return f;
    };

    // linear dimension a→b, offset `off` (inches) to the left of a→b (negative = right)
    f.dim = (a, b, off, label, o = {}) => {
      const u = norm(sub(b, a)), n = [-u[1], u[0]], s = Math.sign(off) || 1;
      const A = add(a, mul(n, off)), B = add(b, mul(n, off));
      const g = (o.gap ?? 4) / S, ov = 6 / S;
      if (!o.noext) {
        f.line(add(a, mul(n, g * s)), add(A, mul(n, ov * s)), 'ext');
        f.line(add(b, mul(n, g * s)), add(B, mul(n, ov * s)), 'ext');
      }
      const As = P(A), Bs = P(B), us = norm(sub(Bs, As)), Ls = len(sub(Bs, As));
      if (Ls < 22) { // too short for inside arrows: put them outside pointing in
        f.line(add(A, mul(u, -14 / S)), add(B, mul(u, 14 / S)), 'dimline');
        arrowS(As, us, 'arrow', 7, 2.8); arrowS(Bs, [-us[0], -us[1]], 'arrow', 7, 2.8);
      } else {
        f.line(A, B, 'dimline');
        arrowS(As, [-us[0], -us[1]], 'arrow'); arrowS(Bs, us, 'arrow');
      }
      const mid = lerp(A, B, o.at ?? 0.5);
      let d = Math.atan2(us[1], us[0]) / RAD; if (d > 90.01) d -= 180; if (d <= -90) d += 180;
      const side = [n[0] * s, -n[1] * s], size = o.size || 12;
      let lo = o.lo ?? 9, rotv = o.flat ? 0 : d;
      if (o.flat) { const w = [...String(label)].length * size * 0.58; lo = o.lo ?? (Math.abs(side[0]) * (w / 2 + 6) + Math.abs(side[1]) * 10); }
      f.text(mid, label, { cls: 'dimtext halo', dx: side[0] * lo, dy: side[1] * lo, rot: Math.abs(rotv) < 0.01 ? 0 : rotv, size });
      return f;
    };

    // arc CCW from a1 to a2 (world degrees), radius rw inches
    f.arc = (c, rw, a1, a2, cls = 'ang') => {
      while (a2 < a1) a2 += 360;
      const q1 = P(add(c, mul(dir(a1), rw))), q2 = P(add(c, mul(dir(a2), rw)));
      for (let t = a1; t <= a2; t += 4) { const q = P(add(c, mul(dir(t), rw))); grow(q[0], q[1]); }
      grow(q2[0], q2[1]);
      const R = rw * S;
      f.add(`<path class="${cls}" d="M${fmt(q1)} A${r1(R)} ${r1(R)} 0 ${(a2 - a1) > 180 ? 1 : 0} 0 ${fmt(q2)}"/>`);
      return [a1, a2];
    };
    // angle marker with label. o: {lr (px), arrows, size, dx, dy, cls}
    f.angle = (c, rw, a1, a2, label, o = {}) => {
      [a1, a2] = f.arc(c, rw, a1, a2, o.cls || 'ang');
      const arcPx = rw * S * (a2 - a1) * RAD;
      if (o.arrows !== false && arcPx > 26) {
        const t2 = dir(a2 + 90), t1 = dir(a1 - 90);
        arrowS(P(add(c, mul(dir(a2), rw))), [t2[0], -t2[1]], 'angarrow', 6.5, 2.6);
        arrowS(P(add(c, mul(dir(a1), rw))), [t1[0], -t1[1]], 'angarrow', 6.5, 2.6);
      }
      if (label) {
        const m = (o.at ?? 0.5) * (a2 - a1) + a1, size = o.size || 12;
        const w = [...String(label)].length * size * 0.58;
        const lr = o.lr ?? (6 + Math.abs(cos(m)) * w / 2 + Math.abs(sin(m)) * size * 0.6);
        f.text(add(c, mul(dir(m), rw + lr / S)), label, { cls: (o.tcls || 'angtext') + ' halo', size, dx: o.dx, dy: o.dy });
      }
      return f;
    };
    // angle between rays c→p1 and c→p2 (the smaller one)
    f.angle3 = (c, p1, p2, rw, label, o) => {
      let a1 = angOf(c, p1), a2 = angOf(c, p2);
      if ((((a2 - a1) % 360) + 360) % 360 > 180) [a1, a2] = [a2, a1];
      return f.angle(c, rw, a1, a2, label, o);
    };
    // small right-angle box at c, legs along directions a and a+90
    f.right = (c, a, px = 8, cls = 'sqmark') => {
      const u = mul(dir(a), px / S), v = mul(dir(a + 90), px / S);
      return f.pline([add(c, u), add(add(c, u), v), add(c, v)], cls);
    };
    // callout: dot at p, leader to a label offset by off = [dx, dy] px
    f.note = (p, off, label, o = {}) => {
      const q = P(p), t = [q[0] + off[0], q[1] + off[1]];
      if (o.dot !== false) f.circle(p, 2.4, 'dot');
      f.line(p, Wd(t), 'leader');
      const anchor = o.anchor || (off[0] >= 0 ? 'start' : 'end');
      f.text(Wd(t), label, { cls: (o.cls || 'lbl') + ' halo', anchor, dx: anchor === 'start' ? 4 : anchor === 'end' ? -4 : 0, dy: o.dy ?? 0, size: o.size });
      return f;
    };

    // a board seen from above/side: wood fill, wavy grain along `grain` degrees, edge outline
    f.board = (arr, o = {}) => {
      f.poly(arr, o.cls || 'wood');
      if (o.grain !== false) {
        const g = o.grain || 0, u = dir(g), n = [-u[1], u[0]];
        let umin = 1e9, umax = -1e9, nmin = 1e9, nmax = -1e9;
        arr.forEach(p => { const a = p[0] * u[0] + p[1] * u[1], b = p[0] * n[0] + p[1] * n[1]; umin = Math.min(umin, a); umax = Math.max(umax, a); nmin = Math.min(nmin, b); nmax = Math.max(nmax, b); });
        const id = 'cp' + (++uid), sp = (o.sp || 10) / S;
        let s = `<clipPath id="${id}"><polygon points="${ptsStr(arr, false)}"/></clipPath><g clip-path="url(#${id})">`;
        let k = (o.seed || 0) * 17;
        for (let b = nmin + sp * 0.6; b < nmax; b += sp * (0.65 + 0.7 * hash(++k))) {
          const steps = Math.max(2, Math.ceil((umax - umin) * S / 26));
          const ph = hash(k * 3.1) * 6.28, amp = (0.6 + 1.6 * hash(k * 7.7)) / S;
          const pts = [];
          for (let i = 0; i <= steps; i++) { const a = umin + (umax - umin) * i / steps; pts.push(add(mul(u, a), mul(n, b + amp * Math.sin(ph + i * 0.8)))); }
          s += `<polyline class="grain" points="${pts.map(p => fmt(P(p))).join(' ')}"/>`;
        }
        f.add(s + '</g>');
      }
      return f.poly(arr, 'edge');
    };

    // an isometric solid between two matching polygons A and B (3D points).
    // o: {cut:[side idx], end:[side idx], waste, ghost, cutA, cutB}. Side i joins vertex i and i+1.
    f.solid = (A, B, o = {}) => {
      const n = A.length, V = [1, 1, 1];
      const faces = [{ p: A, k: 'A' }, { p: B, k: 'B' }];
      for (let i = 0; i < n; i++) faces.push({ p: [A[i], A[(i + 1) % n], B[(i + 1) % n], B[i]], k: i });
      const all = A.concat(B), G = [0, 1, 2].map(j => all.reduce((s, p) => s + p[j], 0) / all.length);
      faces.forEach(F => {
        const N = [0, 0, 0], m = F.p.length;
        for (let i = 0; i < m; i++) { const a = F.p[i], b = F.p[(i + 1) % m]; N[0] += (a[1] - b[1]) * (a[2] + b[2]); N[1] += (a[2] - b[2]) * (a[0] + b[0]); N[2] += (a[0] - b[0]) * (a[1] + b[1]); }
        const c = [0, 1, 2].map(j => F.p.reduce((s, p) => s + p[j], 0) / m);
        if ((c[0] - G[0]) * N[0] + (c[1] - G[1]) * N[1] + (c[2] - G[2]) * N[2] < 0) { N[0] = -N[0]; N[1] = -N[1]; N[2] = -N[2]; }
        const L = Math.hypot(...N) || 1; F.N = N.map(v => v / L);
      });
      faces.filter(F => F.N[0] * V[0] + F.N[1] * V[1] + F.N[2] * V[2] > 1e-6).forEach(F => {
        let cls;
        if (o.ghost) cls = 'ghost';
        else if (o.waste) cls = 'wastef';
        else if ((o.cut || []).includes(F.k) || (o.cutA && F.k === 'A') || (o.cutB && F.k === 'B')) cls = 'cutface';
        else if ((o.end || []).includes(F.k)) cls = 'endface';
        else { const [x, y, z] = F.N; cls = z > 0.55 ? 'w-top' : (Math.abs(x) >= Math.abs(y) ? 'w-a' : 'w-b'); }
        f.poly(F.p.map(iso), cls);
      });
      return f;
    };
    // convenience: extrude a flat outline (x, y) between z0 and z1
    f.prism = (outline, z0, z1, o) => f.solid(outline.map(p => [p[0], p[1], z1]), outline.map(p => [p[0], p[1], z0]), o);
    f.noteI = (p3, off, label, o) => f.note(iso(p3), off, label, o);

    // ---- shapes added for machines, framing and turning ----
    // axis-aligned rectangle from its lower-left corner (x, y), width w, height h
    f.rect = (x, y, w, h, cls) => f.poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], cls);
    f.plank = (x, y, w, h, o = {}) => f.board([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], o);
    // circle with a radius in inches
    f.disc = (c, rw, cls) => { const q = P(c), R = rw * S; grow(q[0] - R, q[1] - R); grow(q[0] + R, q[1] + R); return f.add(`<circle class="${cls}" cx="${r1(q[0])}" cy="${r1(q[1])}" r="${r1(R)}"/>`); };
    // bold ink arrow showing which way the wood is fed
    f.feed = (a, b, label, o = {}) => {
      f.line(a, b, 'feed'); const u = norm(sub(P(b), P(a))); arrowS(P(b), u, 'feedhead', 13, 6);
      if (label) f.text(lerp(a, b, 0.5), label, { cls: 'lbl-b halo', dy: o.dy ?? -12, dx: o.dx ?? 0, size: o.size || 12 });
      return f;
    };
    // curved arrow for spinning blades and lathe work: arc CCW from a1 to a2 (deg); cw flips the head
    f.spin = (c, rw, a1, a2, o = {}) => {
      f.arc(c, rw, a1, a2, 'spin');
      const end = o.cw ? a1 : a2, t = dir(o.cw ? a1 - 90 : a2 + 90);
      arrowS(P(add(c, mul(dir(end), rw))), [t[0], -t[1]], 'spinhead', 9, 4);
      return f;
    };
    // danger zone: red cross-hatch with a label
    f.danger = (arr, label, o = {}) => {
      f.poly(arr, 'danger');
      if (label) { const c = arr.reduce((s, p) => add(s, p), [0, 0]).map(v => v / arr.length); f.text(o.at || c, label, { cls: 'cuttext halo', size: o.size || 11 }); }
      return f;
    };
    // simple mitten-shaped hand outline, palm centred at c, fingers pointing along `a` degrees, `s` inches long
    f.hand = (c, a = 90, s = 3.2, o = {}) => {
      const pts = [];
      for (let t = 0; t <= 360; t += 12) {
        const th = t * RAD; let x = Math.cos(th) * 0.36, y = Math.sin(th) * 0.5;
        if (y > 0) y *= 1.25;
        pts.push([x, y]);
      }
      const side = o.left ? -1 : 1;
      const thumb = [[0.3 * side, -0.05], [0.62 * side, 0.18], [0.66 * side, 0.3], [0.5 * side, 0.32], [0.28 * side, 0.18]];
      const place = q => add(c, rot(mul(q, s), a - 90));
      f.poly(pts.map(place), 'hand');
      f.poly(thumb.map(place), 'hand');
      return f;
    };
    // a turned spindle seen from the side: profile = [[x, radius], ...] along the lathe axis (y = 0)
    f.spindle = (profile, o = {}) => {
      const top = profile.map(([x, r]) => [x, r]), bot = profile.slice().reverse().map(([x, r]) => [x, -r]);
      f.board(top.concat(bot), { grain: 0, seed: o.seed, sp: o.sp || 7, cls: o.cls });
      if (o.axis !== false) f.line([profile[0][0] - 0.8, 0], [profile[profile.length - 1][0] + 0.8, 0], 'axis');
      return f;
    };
    // text over several lines, centred on p
    f.lines = (p, arr, o = {}) => {
      const size = o.size || 12, lh = size * 1.25, off = (arr.length - 1) * lh / 2;
      arr.forEach((s, i) => f.text(p, s, Object.assign({}, o, { dy: (o.dy || 0) - off + i * lh })));
      return f;
    };

    f.svg = (alt = '', pad = 12) => {
      const x = bb[0] - pad, y = bb[1] - pad, w = bb[2] - bb[0] + 2 * pad, h = bb[3] - bb[1] + 2 * pad;
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r1(x)} ${r1(y)} ${r1(w)} ${r1(h)}" width="${Math.round(w)}" height="${Math.round(h)}" role="img" aria-label="${esc(alt)}">${els.join('')}</svg>`;
    };
    return f;
  }

  const panels = list => list.map(([svg, cap]) => `<div class="panel">${svg}${cap ? `<p class="pcap">${cap}</p>` : ''}</div>`).join('');

  return { fig, panels, iso, rz, frac, deg, dec, dir, add, sub, mul, lerp, rot, meet, angOf, norm, len, tan, sin, cos, atan, asin, RAD };
})();
