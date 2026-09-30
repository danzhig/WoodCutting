#!/usr/bin/env node
// Checks the numbers quoted in worked examples against src/formulas.js.
// Usage: node tools/test-formulas.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { Math, console };
vm.createContext(ctx);
for (const f of ['src/kit.js', 'src/formulas.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8') + '\nthis.K = typeof K !== "undefined" ? K : this.K; this.F = typeof F !== "undefined" ? F : this.F;', ctx);
const { K, F } = ctx;

let fails = 0, n = 0;
const near = (name, got, want, tol = 0.01) => { n++; if (Math.abs(got - want) > tol) { fails++; console.log(`FAIL ${name}: got ${got}, expected ${want}`); } };
const same = (name, got, want) => { n++; if (got !== want) { fails++; console.log(`FAIL ${name}: got ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`); } };

// ---- Guide A ----
same('frac 2.28', K.frac(2.28), '2¼″');
same('frac 6.06', K.frac(6.0622), '6¹⁄₁₆″');
same('frac 16.04', K.frac(16.041), '16¹⁄₁₆″');
same('half of 23 5/8', K.frac(23.625 / 2), '11¹³⁄₁₆″');
near('movement 5.5″', F.movement(5.5, 0.003, 4), 0.066, 0.001);
near('3 frame pieces on 96″', 0.5 + 3 * 31 + 3 * 0.125, 93.875);
near('11.18 ft inches part', (F.slopeFactor(6) * 10 % 1) * 12, 2.164, 0.01);

// ---- Guide C ----
near('saw from 135° corner', F.sawFromCorner(135), 22.5);
near('saw from 92° corner', F.sawFromCorner(92), 44);
near('octagon saw', F.polySaw(8), 22.5);
near('offset 22.5 on 2×4', F.offset(3.5, 22.5), 1.4497, 0.001);
near('offset 30 on 2×4', F.offset(3.5, 30), 2.0207, 0.001);
near('offset 60 on 2×4', F.offset(3.5, 60), 6.0622, 0.001);
near('frame 24 inside → 31', F.outsideLen(24, 3.5, 45), 31);
near('hexagon 12 inside', F.outsideLen(12, 3.5, 30), 16.041, 0.001);
near('bevel 22.5 on 1½″', F.offset(1.5, 22.5), 0.621, 0.001);
near('pitch 6/12', F.pitchDeg(6), 26.565, 0.001);
near('30° → pitch', F.pitchFromDeg(30), 6.93, 0.005);
near('compound 15° miter', F.compound(15, 4).miter, 14.51, 0.005);
near('compound 15° bevel', F.compound(15, 4).bevel, 43.08, 0.005);
near('compound 45° miter', F.compound(45, 4).miter, 35.26, 0.005);
near('compound 45° bevel', F.compound(45, 4).bevel, 30, 0.005);
near('crown 52/38 miter', F.compound(38, 4).miter, 31.62, 0.005);
near('crown 52/38 bevel', F.compound(38, 4).bevel, 33.86, 0.005);
near('octagon error gap', F.errorGap(3.5, 16, 0.5), 0.492, 0.002);
near('square error gap', F.errorGap(3.5, 8, 0.5), 0.245, 0.002);
near('irregular corners sum', 80 + 100 + 95 + 85, 360);
near('taper angle 3/8 over 24', F.taperAngle(0.375, 24), 0.895, 0.002);
near('taper per foot', F.taperPerFoot(0.375, 24), 0.1875, 0.0001);

console.log(`${n - fails}/${n} checks passed`);
process.exit(fails ? 1 : 0);
