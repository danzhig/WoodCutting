#!/usr/bin/env node
// Checks the numbers quoted in worked examples against src/formulas.js.
// Usage: node tools/test-formulas.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { Math, console };
vm.createContext(ctx);
for (const f of ['src/kit.js', 'src/formulas.js', 'src/tables.js', 'src/species.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8') + '\nthis.K = typeof K !== "undefined" ? K : this.K; this.F = typeof F !== "undefined" ? F : this.F; this.WOODS = typeof WOODS !== "undefined" ? WOODS : this.WOODS; this.WOODUTIL = typeof WOODUTIL !== "undefined" ? WOODUTIL : this.WOODUTIL;', ctx);
const { K, F, WOODS, WOODUTIL } = ctx;

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

// ---- Guide B ----
near('slope 3.5 in 12', F.pitchDeg(3.5), 16.26, 0.005);
near('diagonal 48×30', F.diagonal(48, 30), 56.60, 0.005);
same('diagonal 48×30 frac', K.frac(F.diagonal(48, 30)), '56⅝″');
near('combo flip error angle', K.atan((1 / 64) / 6), 0.149, 0.002);
near('protractor 62 → saw', F.sawToGeo(62), 28);
near('bay 131 → saw', F.sawFromCorner(131), 24.5);
near('inside 91 → saw', F.sawFromCorner(91), 44.5);
near('outside 88 → saw', F.sawFromCorner(88), 46);

// ---- Guide D ----
near('capacity at 45', F.capacityAtMiter(5.5, 45), 3.89, 0.01);
near('capacity at 22.5', F.capacityAtMiter(5.5, 22.5), 5.08, 0.01);
near('miter saw flip error', K.atan((1 / 64) / 5.5), 0.163, 0.002);
near('octagon from 0.163°', 16 * 0.163, 2.6, 0.02);
near('5-cut error per cut', F.fiveCutError(0.012, 18), 0.0095, 0.0002);
near('5-cut fence shift', F.fenceShift(0.012, 18, 24), 0.004, 0.0002);
near('taper jig gap at 12', F.jigOpening(F.taperAngle(0.375, 24), 12), 0.1875, 0.0005);
near('rip 2×6 in half', (5.5 - 0.125) / 2, 2.6875);
near('bevel 22.5 through 3/4', F.offset(0.75, 22.5), 0.311, 0.001);

// ---- Guide E ----
near('coping: 93° corner gap', 3.5 * K.tan(3), 0.183, 0.002);
near('casing head SP', 30 + 2 * 3 / 16, 30.375);
near('casing head LP', 30.375 + 2 * 2.5, 35.375);
near('crown from framing square', K.atan(2.75 / 3.5), 38.16, 0.01);
near('scarf overlap 45 on 5/8', F.offset(0.625, 45), 0.625);
near('crown nested 135', F.crownNested(135), 22.5);
near('crown 52/38 flat miter', F.compoundA(38, F.sawFromCorner(90)).miter, 31.62, 0.005);

// ---- Guide F ----
near('1×8 width change', F.movement(7.25, 0.003, 4), 0.087, 0.001);
near('1×8 heel gap', Math.SQRT2 * F.movement(7.25, 0.003, 4), 0.123, 0.002);

// ---- Guide G ----
same('first layout mark', F.layoutMarks(144, 16)[0], 15.25);
near('stud count 12 ft at 16', F.studCount(144, 16), 10);
near('wall height 92 5/8', F.wallHeight(92.625), 97.125);
near('wall height 104 5/8', F.wallHeight(104.625), 109.125);
near('header 34 RO', F.headerLen(34), 37);
near('wall diagonal', F.diagonal(144, 97.125), 173.69, 0.01);
const R = F.rafter(288, 6, 1.5, 12);
near('rafter run', R.run, 143.25);
near('rafter line length', R.length, 160.16, 0.01);
same('rafter length frac', K.frac(R.length), '160³⁄₁₆″');
near('rafter tail', R.tail, 13.42, 0.01);
near('birdsmouth heel', 3.5 * 6 / 12, 1.75);
near('birdsmouth depth removed', 1.75 * K.cos(F.pitchDeg(6)), 1.565, 0.002);
near('hip slope 6/12', F.hipRise(6).angle, 19.47, 0.01);
near('hip per foot', Math.hypot(16.97, 6), 18.0, 0.01);
const S = F.stairs(42);
near('stairs 42 risers', S.risers, 6); near('stairs 42 riser', S.riser, 7); near('stairs 42 run', S.totalRun, 52.5); near('stairs comfort', S.comfort, 24.5);
near('stringer diagonal', Math.hypot(42, 52.5), 67.2, 0.05);
near('block 16 OC', F.blockLen(16), 14.5);
near('deck diagonal', F.diagonal(16, 12), 20);

// ---- Guide H ----
near('swing', 2 * 6, 12);
near('3" square diagonal', 3 * Math.SQRT2, 4.24, 0.01);
near('rpm low 4.25', F.latheRPM(4.25).low, 1412, 1);
near('rpm high 4.25', F.latheRPM(4.25).high, 2118, 1);
near('octagon corner on 2"', 2 * (1 - 1 / Math.SQRT2), 0.586, 0.001);
same('octagon corner frac', K.frac(2 * (1 - 1 / Math.SQRT2)), '⁹⁄₁₆″');
near('rest distance', 4.25 / 2 + 0.25, 2.375);
near('sizing depth', (1.75 - 1.25) / 2, 0.25);
near('round taper half-angle', K.atan((1.75 - 1) / (2 * 20)), 1.074, 0.002);
same('taper at 5', K.frac(1.75 - 0.75 * 5 / 20), '1⁹⁄₁₆″');
same('taper at 15', K.frac(1.75 - 0.75 * 15 / 20), '1³⁄₁₆″');
near('tenon length', 1.25 - 0.125, 1.125);

// ---- Alberta code conversions (Calgary) ----
same('max rise 200 mm', K.frac(F.CODE.riserMax), '7⅞″');
near('min run 255 mm in inches', F.CODE.runMin, 10.039, 0.001);
near('10 1/16 is at least 255 mm', 10.0625 * 25.4, 255.6, 0.1);
near('headroom 6′4⅞″ ≥ 1950 mm', (76 + 7 / 8) * 25.4, 1952.6, 0.1);
near('guard 35½″ ≥ 900 mm', 35.5 * 25.4, 901.7, 0.1);
near('guard 42¼″ ≥ 1070 mm', 42.25 * 25.4, 1073.2, 0.1);
near('width 33⅞″ ≥ 860 mm', 33.875 * 25.4, 860.4, 0.1);
same('42″ deck stair passes', F.stairs(42).riserOK && F.stairs(42).runOK, true);
near('7″ riser in mm', 7 * 25.4, 177.8, 0.1);
near('10½″ run in mm', 10.5 * 25.4, 266.7, 0.1);

// ---- Guides I and J: wood species ----
const W = WOODS;
near('Doug fir hardness meter', WOODUTIL.score('hardness', W.dfir), 2);
near('Doug fir strength meter', WOODUTIL.score('strength', W.dfir), 3);
near('Doug fir stiffness meter', WOODUTIL.score('stiffness', W.dfir), 4);
near('Doug fir stability meter', WOODUTIL.score('stability', W.dfir), 3);
near('Doug fir rot meter', WOODUTIL.score('rot', W.dfir), 3);
near('pine vs maple sag', F.sagRatio(W.wpine.moe, W.hmaple.moe), 1.48, 0.005);
near('3/4 to 1 inch sag', F.sagThick(1, 0.75), 0.42, 0.005);
near('1 in pine vs 3/4 maple', F.sagRatio(W.wpine.moe, W.hmaple.moe) * F.sagThick(1, 0.75), 0.62, 0.005);
near('fir vs red oak stiffness', W.dfir.moe, 1.77); near('red oak stiffness', W.roak.moe, 1.82);
near('fir vs red oak weight', W.dfir.wt / W.roak.wt, 0.73, 0.01);
near('fir vs red oak hardness', W.roak.janka / W.dfir.janka, 2.08, 0.01);
const flat = F.movement(7.25, F.shrinkCoef(W.roak.sh[1]), 4), quart = F.movement(7.25, F.shrinkCoef(W.roak.sh[0]), 4);
near('red oak flatsawn movement', flat, 0.089, 0.001); same('flatsawn frac', K.frac(flat, 32), '³⁄₃₂″');
near('red oak quartersawn movement', quart, 0.041, 0.001); same('quartersawn frac', K.frac(quart, 32), '¹⁄₃₂″');
near('birch T/R', WOODUTIL.tr(W.ybirch), 1.3, 0.05); near('walnut T/R', WOODUTIL.tr(W.walnut), 1.4, 0.05);
near('mahogany T/R', WOODUTIL.tr(W.mahogany), 1.4, 0.05); near('white pine T/R', WOODUTIL.tr(W.wpine), 2.9, 0.05);
near('beech V', W.beech.sh[2], 17.2); near('cedar V', W.wrc.sh[2], 6.8);
near('hickory hardest', Math.max(...Object.values(W).map(w => w.janka)), W.hickory.janka);
near('cedar most stable', Math.min(...Object.values(W).map(w => w.sh[2])), W.wrc.sh[2]);
near('birch stiffest after hickory', Object.values(W).map(w => w.moe).sort((a, b) => b - a)[1], W.ybirch.moe);
near('25 species', Object.keys(W).length, 25);
Object.entries(W).forEach(([k, w]) => { if (w.work.length !== 8 || !(w.rot >= 0 && w.rot <= 4) || !(w.sh[1] > w.sh[0])) { n++; fails++; console.log('FAIL species record ' + k); } });

console.log(`${n - fails}/${n} checks passed`);
process.exit(fails ? 1 : 0);
