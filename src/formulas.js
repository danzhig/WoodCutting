/* =====================================================================
   FORMULAS
   Every calculation in the handbook lives here once. Figures, tables,
   calculators and the formula tests (tools/test-formulas.js) all call these.
   Angles are in degrees, lengths in inches unless a name says otherwise.
   ===================================================================== */
const F = (() => {
  const { tan, sin, cos, atan, asin } = K;
  const RAD = Math.PI / 180;

  // --- joint angles (Guide C) ---
  const sawFromCorner = C => 90 - C / 2;          // both pieces cut, corner angle C
  const edgeFromCorner = C => C / 2;              // angle between cut and board edge
  const polySaw = n => 180 / n;
  const polyCorner = n => 180 - 360 / n;
  const sawToGeo = s => 90 - s;
  const braceEnds = a => ({ horizontal: 90 - a, vertical: a });

  // --- lengths ---
  const offset = (W, saw) => W * tan(saw);
  const outsideLen = (inside, W, s1, s2 = s1) => inside + offset(W, s1) + offset(W, s2);
  const insideLen = (outside, W, s1, s2 = s1) => outside - offset(W, s1) - offset(W, s2);
  const stockUsed = (lengths, kerf = 0.125) => lengths.reduce((a, b) => a + b, 0) + lengths.length * kerf;

  // --- slopes ---
  const pitchDeg = rise => atan(rise / 12);
  const pitchFromDeg = d => 12 * tan(d);
  const slopeFactor = rise => Math.sqrt(1 + (rise / 12) ** 2);

  // --- compound cuts: S = tilt from vertical, A = flat-frame saw setting (180/n or 90 − C/2) ---
  const compoundA = (S, A) => ({ miter: atan(sin(S) * tan(A)), bevel: asin(cos(S) * sin(A)) });
  const compound = (S, n) => compoundA(S, 180 / n);
  const crownNested = C => 90 - C / 2;            // crown upside down & backwards: miter only

  // --- tapers ---
  // `removed` = material taken off one face at the narrow end, over `len`
  const taperAngle = (removed, len) => atan(removed / len);
  const taperPerFoot = (removed, len) => removed / len * 12;
  const jigOpening = (angle, dist) => dist * tan(angle);   // taper-jig gap `dist` from the hinge

  // --- accuracy ---
  const errorGap = (W, ends, errPerCut) => W * tan(ends * errPerCut);
  const fiveCutError = (d, L) => atan(d / (4 * L));         // degrees per cut from the 5-cut strip
  const fenceShift = (d, L, fenceLen) => d / (4 * L) * fenceLen;
  const diagonal = (w, h) => Math.hypot(w, h);

  // --- saws ---
  const capacityAtMiter = (cap0, m) => cap0 * cos(m);      // rough width capacity at miter m

  // --- wood movement: coefficient per 1% moisture change (tangential ≈ 0.0025–0.0035 for many species) ---
  const movement = (W, coef, dMC) => W * coef * dMC;
  // coefficient from a species' shrinkage: it shrinks S% over the ~28 points from fibre saturation to oven-dry
  const FSP = 28;
  const shrinkCoef = S => S / 100 / FSP;

  // --- species (Guide I): same size, span and load → sag scales with 1/MOE and 1/thickness³ ---
  const sagRatio = (moeA, moeB) => moeB / moeA;             // how many times A sags compared with B
  const sagThick = (t, tRef) => (tRef / t) ** 3;            // sag at thickness t relative to tRef

  // --- framing: code limits from the National Building Code – 2023 Alberta Edition (Calgary), converted to inches ---
  const MM = 25.4;
  const CODE = { riserMax: 200 / MM, riserMin: 125 / MM, runMin: 255 / MM, runMax: 355 / MM, guardDrop: 600 / MM, guardLow: 900 / MM, guardHigh: 1070 / MM, headroom: 1950 / MM, stairWidth: 860 / MM };
  const wallHeight = (stud, plates = 3) => stud + 1.5 * plates;
  const headerLen = ro => ro + 3;                           // two 1½″ jack studs
  const blockLen = oc => oc - 1.5;
  const studCount = (wallLen, oc) => Math.ceil(wallLen / oc) + 1;
  const layoutMarks = (wallLen, oc) => { const m = []; for (let x = oc - 0.75; x < wallLen - 0.75; x += oc) m.push(x); return m; };
  const rafter = (span, rise, ridgeT = 1.5, overhangRun = 0) => {
    const run = span / 2 - ridgeT / 2, f = slopeFactor(rise);
    return { run, factor: f, length: run * f, tail: overhangRun * f, angle: pitchDeg(rise), plumbOffset: rise / 12 };
  };
  const hipRise = rise => ({ perRun: 16.97, factor: Math.hypot(rise, 16.97) / 16.97, angle: atan(rise / 16.97) });
  const stairs = (totalRise, target = 7.5, maxRiser = CODE.riserMax, tread = 10.5) => {
    let n = Math.ceil(totalRise / target - 1e-9);
    while (totalRise / n > maxRiser) n++;
    const riser = totalRise / n, treads = n - 1;
    return { risers: n, riser, treads, tread, totalRun: treads * tread, comfort: 2 * riser + tread, angle: atan(riser / tread), stringer: Math.hypot(treads * tread, (n - 1) * riser),
      riserOK: riser <= CODE.riserMax + 1e-9 && riser >= CODE.riserMin, runOK: tread >= CODE.runMin && tread <= CODE.runMax };
  };

  // --- lathe ---
  const latheRPM = d => ({ low: 6000 / d, high: 9000 / d });

  return { CODE, sawFromCorner, edgeFromCorner, polySaw, polyCorner, sawToGeo, braceEnds, offset, outsideLen, insideLen, stockUsed,
    pitchDeg, pitchFromDeg, slopeFactor, compoundA, compound, crownNested, taperAngle, taperPerFoot, jigOpening,
    errorGap, fiveCutError, fenceShift, diagonal, capacityAtMiter, movement, FSP, shrinkCoef, sagRatio, sagThick, wallHeight, headerLen, blockLen, studCount,
    layoutMarks, rafter, hipRise, stairs, latheRPM, RAD };
})();
