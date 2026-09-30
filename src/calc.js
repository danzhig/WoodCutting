/* =====================================================================
   CALCULATORS (Guide I). Each block wires itself only if its form exists.
   ===================================================================== */
window.CALC = {
  init() {
    const $ = id => document.getElementById(id);
    const num = id => { const el = $(id); return el ? parseFloat(el.value) : NaN; };
    const fr = K.frac, dg = (x, dp = 2) => parseFloat(x.toFixed(dp)) + '°';
    const wire = (formId, fn) => { const f = $(formId); if (!f) return; f.addEventListener('input', fn); f.addEventListener('submit', e => e.preventDefault()); fn(); };
    // parse "23 5/8", "23-5/8", "23.625" or "1' 11 5/8" into inches
    const parseIn = s => {
      s = String(s).trim().replace(/″|"|in/g, '');
      let ft = 0; const m = s.match(/^(-?\d+(?:\.\d+)?)\s*(?:'|′|ft)\s*(.*)$/);
      if (m) { ft = parseFloat(m[1]) * 12; s = m[2]; }
      if (!s) return ft;
      const p = s.match(/^(\d+(?:\.\d+)?)?(?:[\s-]+)?(?:(\d+)\/(\d+))?$/);
      if (!p || (!p[1] && !p[2])) return NaN;
      return ft + (p[1] ? parseFloat(p[1]) : 0) + (p[2] ? p[2] / p[3] : 0);
    };

    wire('calc-offset', () => {
      const W = num('c-w'), t = num('c-t'), inside = num('c-in');
      $('o-off').innerHTML = [W, t, inside].every(isFinite) && t >= 0 && t < 90
        ? `offset ${F.offset(W, t).toFixed(3)}″ (${fr(F.offset(W, t))})<br>LP–LP ${F.outsideLen(inside, W, t).toFixed(3)}″ (${fr(F.outsideLen(inside, W, t))})`
        : 'Enter a width, an angle from 0° to 89°, and a length.';
    });
    wire('calc-corner', () => {
      const C = num('c-c'), n = num('c-n'), out = [];
      if (isFinite(C) && C > 0 && C < 360) out.push(`corner ${C}° → saw ${dg(F.sawFromCorner(C))} (${dg(F.edgeFromCorner(C))} to edge)`);
      if (isFinite(n) && n >= 3) out.push(`${n} sides → saw ${dg(F.polySaw(n))}`);
      $('o-corner').innerHTML = out.join('<br>') || 'Enter a corner angle or a number of sides.';
    });
    wire('calc-pitch', () => {
      const p = num('c-p');
      $('o-pitch').textContent = isFinite(p) && p >= 0 ? `${p}-in-12 = ${dg(F.pitchDeg(p))} · slope factor ${F.slopeFactor(p).toFixed(3)}` : 'Enter a rise.';
    });
    wire('calc-comp', () => {
      const S = num('c-s'), n = num('c-sn');
      if (isFinite(S) && isFinite(n) && n >= 3 && S >= 0 && S <= 90) { const c = F.compound(S, n); $('o-comp').textContent = `miter ${dg(c.miter)} · bevel ${dg(c.bevel)}`; }
      else $('o-comp').textContent = 'Enter a tilt from 0° to 90° and at least 3 sides.';
    });
    wire('calc-frac', () => {
      const v = parseIn($('c-frac').value), den = num('c-den') || 16;
      $('o-frac').innerHTML = isFinite(v)
        ? `${v.toFixed(4)}″ = ${fr(v, den)} (nearest 1/${den})<br>${Math.floor(v / 12)}′ ${fr(v - 12 * Math.floor(v / 12), den)} · half: ${fr(v / 2, 32)}`
        : 'Type a length such as 23 5/8, 23-5/8, 23.625 or 1\' 11 5/8.';
    });
    wire('calc-stairs', () => {
      const r = parseIn($('c-rise').value), tr = num('c-tread');
      if (!(isFinite(r) && r > 4 && isFinite(tr) && tr > 6)) { $('o-stairs').textContent = 'Enter the total rise in inches and a tread depth.'; return; }
      const s = F.stairs(r, 7.5, 7.75, tr);
      $('o-stairs').innerHTML = `${s.risers} risers at ${s.riser.toFixed(3)}″ (${fr(s.riser)})<br>${s.treads} treads at ${fr(tr)} · total run ${fr(s.totalRun)}<br>2R + T = ${s.comfort.toFixed(2)}″ ${s.comfort >= 24 && s.comfort <= 25.5 ? '(comfortable)' : '(outside the 24–25″ comfort range)'}`;
    });
    wire('calc-rafter', () => {
      const span = parseIn($('c-span').value), rise = num('c-rrise'), ridge = num('c-ridge'), oh = parseIn($('c-oh').value || '0');
      if (!(isFinite(span) && span > 0 && isFinite(rise) && rise > 0 && isFinite(ridge) && isFinite(oh))) { $('o-rafter').textContent = 'Enter the building span, the rise per 12 and the ridge thickness.'; return; }
      const R = F.rafter(span, rise, ridge, oh);
      $('o-rafter').innerHTML = `run ${fr(R.run)} · slope ${dg(R.angle)}<br>rafter (ridge to wall) ${fr(R.length)} · tail ${fr(R.tail)}<br>plumb cut: saw ${dg(R.angle, 1)} · seat cut: ${dg(90 - R.angle, 1)} from square`;
    });
    wire('calc-taper', () => {
      const wide = parseIn($('c-wide').value), narrow = parseIn($('c-narrow').value), len = parseIn($('c-tlen').value), faces = num('c-faces');
      if (![wide, narrow, len].every(isFinite) || len <= 0 || narrow > wide) { $('o-taper').textContent = 'Enter the wide and narrow sizes and the taper length.'; return; }
      const removed = (wide - narrow) / (faces === 2 ? 2 : 1);
      $('o-taper').innerHTML = `remove ${fr(removed)} per tapered face<br>taper angle ${dg(F.taperAngle(removed, len))} · ${F.taperPerFoot(removed, len).toFixed(3)}″ per foot<br>taper-jig gap 12″ from the hinge: ${fr(F.jigOpening(F.taperAngle(removed, len), 12), 32)}`;
    });
    wire('calc-lathe', () => {
      const d = parseIn($('c-dia').value);
      if (!(isFinite(d) && d > 0)) { $('o-lathe').textContent = 'Enter the largest diameter of the blank.'; return; }
      const s = F.latheRPM(d);
      $('o-lathe').textContent = `about ${Math.round(s.low / 50) * 50}–${Math.round(s.high / 50) * 50} RPM (start lower for rough or unbalanced blanks; never above your lathe’s maximum)`;
    });
  }
};
