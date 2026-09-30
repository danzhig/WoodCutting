/* =====================================================================
   WOOD SPECIES (Guides I and J)
   One record per wood. The species pages, meters, comparison charts and
   tables are all drawn from WOODS, so a number lives in one place.
   Numbers are averages at 12% moisture content (US Forest Products
   Laboratory / Wood Database figures): janka in lbf, wt in lb/ft³,
   mor in psi, moe in millions of psi, sh = shrinkage green → oven-dry
   in % [radial, tangential, volumetric].
   rot: heartwood decay resistance, 0 perishable … 4 very durable.
   work: 1–5 ratings (handbook judgement from the sources) for
   [hand tools, machining, carving, turning, nails & screws, gluing, finishing, steam bending].
   price: 1–4 relative cost in Calgary.
   ===================================================================== */
const WOODS = {
  // ---------- softwoods ----------
  spruce: { name: 'Spruce (SPF)', bot: 'Picea glauca', alt: 'white spruce, Canadian spruce, the “S” in SPF', kind: 'Softwood', pores: 'conifer',
    janka: 480, wt: 27, mor: 9400, moe: 1.43, sh: [4.7, 8.2, 13.7], rot: 1, work: [4, 4, 3, 2, 4, 4, 3, 2], price: 1,
    color: 'Creamy white to pale yellow; heartwood and sapwood look alike', grain: 'Straight and even, with soft latewood lines; medium texture',
    figure: 'Small tight knots; occasional “bear-scratch” marks', age: 'Yellows slightly',
    avail: 'Everywhere. Most Alberta framing lumber stamped SPF is white spruce, lodgepole pine or alpine fir.',
    dust: 'Low. Resin can irritate skin.', sw: '#eadbb8', sap: null, pat: 'soft' },
  lodgepole: { name: 'Lodgepole pine', bot: 'Pinus contorta', alt: 'Alberta’s provincial tree; beetle-killed boards sell as “blue pine” or “denim pine”', kind: 'Softwood', pores: 'conifer',
    janka: 480, wt: 29, mor: 9400, moe: 1.34, sh: [4.3, 6.7, 11.1], rot: 1, work: [4, 4, 3, 2, 4, 4, 3, 1], price: 1,
    color: 'Pale yellow to light tan; beetle-killed wood streaked blue-grey', grain: 'Straight and fairly even; fine to medium texture',
    figure: 'Small knots; blue stain from the mountain pine beetle’s fungus', age: 'Ambers',
    avail: 'Mixed into SPF at every yard; blue-stained panelling and boards from Alberta and BC mills.',
    dust: 'Low. Resin can irritate skin.', sw: '#e5cd9c', sap: null, pat: 'soft', blue: true },
  dfir: { name: 'Douglas fir', bot: 'Pseudotsuga menziesii', alt: 'Doug fir, fir, Oregon pine', kind: 'Softwood', pores: 'conifer',
    janka: 620, wt: 32, mor: 12500, moe: 1.77, sh: [4.5, 7.3, 11.6], rot: 2, work: [3, 3, 2, 2, 3, 4, 3, 1], price: 2,
    color: 'Orange-tan to reddish heartwood; paler sapwood', grain: 'Straight, with hard dark latewood bands; uneven texture (soft earlywood, hard latewood)',
    figure: 'Bold cathedrals on flatsawn faces; tight straight lines on vertical-grain stock', age: 'Darkens to deep orange-brown',
    avail: 'Lumber yards: beams, timbers, clear vertical-grain trim, flooring and stair parts from BC.',
    dust: 'Irritant. Splinters tend to get infected; pull them out promptly.', sw: '#d9a577', sap: '#ebd3a6', pat: 'bold' },
  wpine: { name: 'Eastern white pine', bot: 'Pinus strobus', alt: 'white pine, Weymouth pine, knotty pine (lower grades)', kind: 'Softwood', pores: 'conifer',
    janka: 380, wt: 25, mor: 8600, moe: 1.24, sh: [2.1, 6.1, 8.2], rot: 2, work: [5, 5, 5, 3, 4, 5, 3, 1], price: 2,
    color: 'Light straw heartwood darkening to warm tan; nearly white sapwood', grain: 'Straight and even; fine, uniform texture',
    figure: 'Knots in the common grades; tiny brown resin-canal flecks', age: 'Ambers noticeably',
    avail: 'Pine boards, trim and knotty panelling at big-box stores; clear eastern white pine from hardwood dealers.',
    dust: 'Low. Occasional skin irritation.', sw: '#e3c692', sap: '#efe1c0', pat: 'soft' },
  wrc: { name: 'Western red cedar', bot: 'Thuja plicata', alt: 'red cedar, cedar, giant arborvitae', kind: 'Softwood', pores: 'conifer',
    janka: 350, wt: 23, mor: 7500, moe: 1.11, sh: [2.4, 5.0, 6.8], rot: 3, work: [4, 4, 3, 2, 3, 4, 3, 1], price: 3,
    color: 'Pinkish to deep reddish-brown heartwood, often streaked; thin pale sapwood', grain: 'Straight; medium to coarse, very soft texture',
    figure: 'Colour streaks; strong spicy scent', age: 'Weathers silver-grey outdoors; darkens indoors',
    avail: 'Everywhere: fencing, decking, siding, timbers and dimension lumber from BC.',
    dust: 'Strong sensitizer: cedar dust is a known cause of occupational asthma. Wear a respirator.', sw: '#b5724b', sap: '#ead8b9', pat: 'streak' },
  ycedar: { name: 'Yellow cedar', bot: 'Cupressus nootkatensis', alt: 'Alaska yellow cedar, Nootka cypress', kind: 'Softwood', pores: 'conifer',
    janka: 580, wt: 31, mor: 11100, moe: 1.42, sh: [2.8, 6.0, 9.2], rot: 4, work: [5, 5, 5, 4, 4, 4, 4, 2], price: 3,
    color: 'Uniform pale yellow', grain: 'Straight, with very tight growth rings; fine, even texture',
    figure: 'Plain; clean and knot-free in the good grades', age: 'Silver-grey outdoors; deepens to gold indoors',
    avail: 'Specialty lumber and boat-building suppliers; order ahead.',
    dust: 'Can irritate skin and airways.', sw: '#e8d49b', sap: null, pat: 'fine' },
  hemlock: { name: 'Western hemlock', bot: 'Tsuga heterophylla', alt: 'hem-fir (sold mixed with amabilis fir), Pacific hemlock', kind: 'Softwood', pores: 'conifer',
    janka: 540, wt: 29, mor: 11300, moe: 1.63, sh: [4.2, 7.8, 12.4], rot: 1, work: [3, 4, 3, 2, 3, 4, 4, 1], price: 1,
    color: 'Pale tan with a reddish or purplish cast; little sapwood contrast', grain: 'Straight and even; medium texture',
    figure: 'Occasional dark streaks; clear grades are knot-free', age: 'Darkens slightly',
    avail: 'Hem-fir framing lumber, clear hemlock trim and timbers from BC.',
    dust: 'Low.', sw: '#d7bb96', sap: null, pat: 'soft' },
  larch: { name: 'Western larch', bot: 'Larix occidentalis', alt: 'larch, tamarack (its cousin Larix laricina grows in Alberta)', kind: 'Softwood', pores: 'conifer',
    janka: 830, wt: 36, mor: 13000, moe: 1.87, sh: [4.5, 9.1, 14.0], rot: 2, work: [3, 3, 2, 2, 2, 3, 3, 1], price: 2,
    color: 'Reddish-brown heartwood; narrow pale sapwood', grain: 'Straight, with bold latewood like Douglas fir; medium, resinous texture',
    figure: 'Cathedrals on flatsawn faces', age: 'Silver-grey outdoors',
    avail: 'Less common: some lumber yards and small BC and Alberta sawmills, often as decking or timbers.',
    dust: 'Low. Some skin irritation reported.', sw: '#c98c58', sap: '#e6d3ad', pat: 'bold' },

  // ---------- hardwoods for building and furniture ----------
  hmaple: { name: 'Hard maple', bot: 'Acer saccharum', alt: 'sugar maple, rock maple', kind: 'Hardwood', pores: 'diffuse-porous',
    janka: 1450, wt: 44, mor: 15800, moe: 1.83, sh: [4.8, 9.9, 14.7], rot: 1, work: [2, 3, 2, 5, 3, 4, 3, 3], price: 3,
    color: 'Creamy white sapwood (the prized part), sometimes pinkish; darker brown heartwood', grain: 'Straight, sometimes wavy; fine, even texture with closed pores',
    figure: 'Curly, quilted, birdseye and spalted', age: 'Yellows to amber',
    avail: 'Hardwood dealers; butcher-block and flooring stock is common.',
    dust: 'Low. Spalted maple dust can carry mould spores.', sw: '#ecdcbe', sap: null, pat: 'fine' },
  smaple: { name: 'Soft maple', bot: 'Acer rubrum', alt: 'red maple (also silver and bigleaf maple)', kind: 'Hardwood', pores: 'diffuse-porous',
    janka: 950, wt: 38, mor: 13400, moe: 1.64, sh: [4.0, 8.2, 12.6], rot: 1, work: [3, 4, 3, 4, 4, 4, 3, 3], price: 2,
    color: 'Light cream to greyish tan; grey mineral streaks common', grain: 'Straight, occasionally curly; fine, even texture',
    figure: 'Curly, spalted, mineral streaks', age: 'Ambers',
    avail: 'Hardwood dealers; often cheaper than hard maple and fine for painted work.',
    dust: 'Low.', sw: '#e2cda9', sap: null, pat: 'fine' },
  roak: { name: 'Red oak', bot: 'Quercus rubra', alt: 'northern red oak', kind: 'Hardwood', pores: 'ring-porous',
    janka: 1290, wt: 44, mor: 14300, moe: 1.82, sh: [4.0, 8.6, 13.7], rot: 1, work: [3, 4, 2, 3, 4, 4, 5, 4], price: 2,
    color: 'Light to medium brown with a pinkish-red cast', grain: 'Straight; coarse texture with large open pores',
    figure: 'Bold flatsawn cathedrals; small ray fleck when quartersawn', age: 'Ambers',
    avail: 'Big-box stores (boards, stair treads, trim) and every hardwood dealer.',
    dust: 'Oak dust is linked to nasal cancer after long exposure. Collect it.', sw: '#c99c77', sap: null, pat: 'ring', rays: 1 },
  woak: { name: 'White oak', bot: 'Quercus alba', alt: 'American white oak', kind: 'Hardwood', pores: 'ring-porous',
    janka: 1350, wt: 47, mor: 14830, moe: 1.76, sh: [5.6, 10.5, 16.3], rot: 3, work: [3, 4, 2, 3, 4, 4, 4, 5], price: 3,
    color: 'Light to medium brown with an olive cast', grain: 'Straight; coarse texture, but its pores are plugged (tyloses)',
    figure: 'Striking ray fleck (tiger stripes) when quartersawn', age: 'Deepens to golden brown',
    avail: 'Hardwood dealers; quartersawn stock costs more.',
    dust: 'Oak dust is linked to nasal cancer after long exposure. Collect it.', sw: '#c2a279', sap: null, pat: 'ring', rays: 2 },
  ash: { name: 'White ash', bot: 'Fraxinus americana', alt: 'ash, American ash', kind: 'Hardwood', pores: 'ring-porous',
    janka: 1320, wt: 42, mor: 15000, moe: 1.74, sh: [4.9, 7.8, 13.3], rot: 1, work: [3, 4, 2, 4, 4, 4, 4, 5], price: 2,
    color: 'Light tan heartwood; nearly white sapwood', grain: 'Straight; coarse texture with open pores, like oak without the rays',
    figure: 'Bold cathedrals; occasional curl', age: 'Ambers',
    avail: 'Hardwood dealers; supply shifts as the emerald ash borer kills eastern ash.',
    dust: 'Can irritate eyes and airways.', sw: '#dcc6a0', sap: null, pat: 'ring' },
  ybirch: { name: 'Yellow birch', bot: 'Betula alleghaniensis', alt: 'birch, Quebec birch; the face veneer of most birch plywood', kind: 'Hardwood', pores: 'diffuse-porous',
    janka: 1260, wt: 43, mor: 16600, moe: 2.01, sh: [7.3, 9.5, 16.8], rot: 1, work: [3, 3, 2, 4, 4, 4, 3, 3], price: 2,
    color: 'Light golden-brown heartwood; creamy sapwood', grain: 'Straight to slightly wavy; fine, even texture',
    figure: 'Curly (flame) figure is common', age: 'Ambers',
    avail: 'Hardwood dealers; birch plywood everywhere.',
    dust: 'Low. Irritant for some.', sw: '#dcc199', sap: null, pat: 'fine' },
  cherry: { name: 'Black cherry', bot: 'Prunus serotina', alt: 'cherry, American cherry', kind: 'Hardwood', pores: 'diffuse-porous',
    janka: 950, wt: 35, mor: 12300, moe: 1.49, sh: [3.7, 7.1, 11.5], rot: 3, work: [4, 4, 4, 5, 4, 5, 3, 3], price: 3,
    color: 'Pinkish-brown when fresh, deepening to rich red-brown; pale sapwood', grain: 'Straight; fine, satiny texture',
    figure: 'Occasional curl; small dark gum pockets', age: 'Darkens dramatically within months of light',
    avail: 'Hardwood dealers.',
    dust: 'Low. Can irritate airways.', sw: '#bb7852', sap: '#e3c8a4', pat: 'fine' },
  walnut: { name: 'Black walnut', bot: 'Juglans nigra', alt: 'walnut, American walnut', kind: 'Hardwood', pores: 'semi-ring-porous',
    janka: 1010, wt: 38, mor: 14600, moe: 1.68, sh: [5.5, 7.8, 12.8], rot: 4, work: [4, 5, 4, 5, 4, 5, 5, 4], price: 4,
    color: 'Chocolate to purplish-brown heartwood; creamy sapwood', grain: 'Straight to irregular; medium texture',
    figure: 'Crotch, burl and curl', age: 'Lightens toward a warmer, softer brown in sunlight',
    avail: 'Hardwood dealers; the priciest common domestic wood. Slabs from specialty dealers.',
    dust: 'Sensitizer: can cause skin and airway reactions.', sw: '#5f4331', sap: '#e0cba6', pat: 'ring' },
  hickory: { name: 'Hickory', bot: 'Carya ovata', alt: 'shagbark hickory (pecan is similar)', kind: 'Hardwood', pores: 'ring-porous',
    janka: 1880, wt: 50, mor: 20200, moe: 2.16, sh: [7.0, 10.5, 16.7], rot: 1, work: [2, 2, 1, 3, 2, 3, 3, 5], price: 3,
    color: 'Tan to reddish-brown heartwood; wide pale sapwood with strong contrast', grain: 'Straight, sometimes wavy; medium to coarse texture',
    figure: 'Mixed light and dark boards (“calico”)', age: 'Ambers',
    avail: 'Some hardwood dealers; common as flooring and cabinet stock.',
    dust: 'Low. Splinters.', sw: '#b98f69', sap: '#e6d6b9', pat: 'ring' },
  beech: { name: 'American beech', bot: 'Fagus grandifolia', alt: 'beech', kind: 'Hardwood', pores: 'diffuse-porous',
    janka: 1300, wt: 45, mor: 14900, moe: 1.72, sh: [5.5, 11.9, 17.2], rot: 1, work: [3, 4, 3, 5, 4, 4, 4, 5], price: 2,
    color: 'Pale cream to pinkish-brown', grain: 'Straight; fine, even texture',
    figure: 'Small dark ray flecks on every face', age: 'Ambers; steamed beech is pinkish',
    avail: 'Rarely stocked; special order from hardwood dealers. European beech is easier to find.',
    dust: 'Beech dust is linked to nasal cancer after long exposure. Collect it.', sw: '#d8b48d', sap: null, pat: 'fine', rays: 1 },

  // ---------- light hardwoods and carving woods ----------
  ypoplar: { name: 'Yellow poplar', bot: 'Liriodendron tulipifera', alt: 'poplar, tulip poplar, tulipwood', kind: 'Hardwood', pores: 'diffuse-porous',
    janka: 540, wt: 29, mor: 10100, moe: 1.58, sh: [4.6, 8.2, 12.7], rot: 1, work: [4, 5, 3, 3, 4, 5, 4, 2], price: 2,
    color: 'Creamy sapwood; light olive-green heartwood with purple or grey streaks', grain: 'Straight; medium, even texture',
    figure: 'Colour streaks', age: 'Green turns brown in light',
    avail: 'Big-box stores (“poplar” boards and trim) and hardwood dealers.',
    dust: 'Low.', sw: '#cfc59c', sap: '#ecdfc3', pat: 'fine' },
  aspen: { name: 'Trembling aspen', bot: 'Populus tremuloides', alt: 'quaking aspen, poplar, popple', kind: 'Hardwood', pores: 'diffuse-porous',
    janka: 350, wt: 26, mor: 8400, moe: 1.18, sh: [3.5, 6.7, 11.5], rot: 1, work: [4, 3, 3, 2, 4, 4, 3, 2], price: 1,
    color: 'Very pale cream to light tan; little contrast', grain: 'Straight; fine, even texture that can cut fuzzy',
    figure: 'Plain', age: 'Yellows slightly',
    avail: 'Alberta’s most common tree: local sawmills, sauna and panelling stock, and the wood in most Alberta OSB.',
    dust: 'Low.', sw: '#eadfc5', sap: null, pat: 'fine' },
  basswood: { name: 'Basswood', bot: 'Tilia americana', alt: 'American linden, lime (in Europe)', kind: 'Hardwood', pores: 'diffuse-porous',
    janka: 410, wt: 26, mor: 8700, moe: 1.46, sh: [6.6, 9.3, 15.8], rot: 0, work: [5, 4, 5, 3, 3, 5, 2, 2], price: 2,
    color: 'Pale cream to white', grain: 'Straight; fine, very even texture',
    figure: 'Plain', age: 'Yellows slightly',
    avail: 'Hardwood dealers; carving blanks from carving and craft suppliers.',
    dust: 'Low.', sw: '#ede0c3', sap: null, pat: 'fine' },
  butternut: { name: 'Butternut', bot: 'Juglans cinerea', alt: 'white walnut', kind: 'Hardwood', pores: 'semi-ring-porous',
    janka: 490, wt: 27, mor: 8100, moe: 1.18, sh: [3.4, 6.4, 10.6], rot: 1, work: [5, 5, 5, 4, 4, 5, 4, 2], price: 4,
    color: 'Light to medium tan, like pale walnut', grain: 'Straight; medium to coarse, soft texture',
    figure: 'Walnut-like cathedrals; “wormy” boards', age: 'Ambers',
    avail: 'Scarce: butternut is an endangered species in Canada (butternut canker). Buy salvaged or reclaimed stock.',
    dust: 'Low. Irritant for some.', sw: '#b58e66', sap: null, pat: 'ring' },

  // ---------- imported woods ----------
  mahogany: { name: 'Genuine mahogany', bot: 'Swietenia macrophylla', alt: 'Honduran or big-leaf mahogany', kind: 'Hardwood', pores: 'diffuse-porous',
    janka: 800, wt: 37, mor: 11500, moe: 1.46, sh: [3.0, 4.1, 7.5], rot: 3, work: [5, 5, 5, 5, 4, 5, 5, 2], price: 4,
    color: 'Reddish-brown, deepening with age', grain: 'Straight to interlocked; medium texture with open pores',
    figure: 'Ribbon, curl and crotch; a deep shimmer (chatoyance)', age: 'Darkens to deep red-brown',
    avail: 'Specialty dealers, mostly plantation-grown; trade is controlled under CITES. Much wood sold as “mahogany” is another species.',
    dust: 'Sensitizer for some people.', sw: '#a65b3b', sap: null, pat: 'fine' },
  sapele: { name: 'Sapele', bot: 'Entandrophragma cylindricum', alt: 'sapelli', kind: 'Hardwood', pores: 'diffuse-porous',
    janka: 1410, wt: 42, mor: 15930, moe: 1.76, sh: [4.8, 7.2, 12.8], rot: 2, work: [3, 3, 3, 4, 3, 4, 4, 2], price: 3,
    color: 'Golden to dark reddish-brown', grain: 'Interlocked; fine to medium texture',
    figure: 'Ribbon stripe when quartersawn; pommele and quilted', age: 'Darkens',
    avail: 'Hardwood dealers; the usual mahogany substitute.',
    dust: 'Sensitizer: can irritate skin and airways.', sw: '#8f4b33', sap: null, pat: 'ribbon' },
  teak: { name: 'Teak', bot: 'Tectona grandis', alt: 'Burmese teak (old-growth), plantation teak', kind: 'Hardwood', pores: 'semi-ring-porous',
    janka: 1070, wt: 41, mor: 14080, moe: 1.78, sh: [2.6, 5.3, 7.2], rot: 4, work: [3, 2, 3, 4, 3, 2, 4, 2], price: 4,
    color: 'Golden to medium brown', grain: 'Straight, sometimes wavy; coarse, oily texture',
    figure: 'Plain to mottled', age: 'Silver-grey outdoors; deep brown indoors',
    avail: 'Specialty dealers; expensive. Plantation teak is lighter and less oily than old-growth.',
    dust: 'Sensitizer: can cause rashes. Its silica dulls tools quickly.', sw: '#b1874f', sap: null, pat: 'ring' },
};

/* scales: how a number becomes a 1–5 meter. The Guide I tables print these same cut-offs. */
const WOOD_SCALE = {
  hardness: { label: 'Hardness', unit: 'Janka, lbf', cuts: [500, 800, 1100, 1400], of: w => w.janka },
  strength: { label: 'Bending strength', unit: 'MOR, psi', cuts: [8000, 10500, 13000, 15500], of: w => w.mor },
  stiffness: { label: 'Stiffness', unit: 'MOE, million psi', cuts: [1.2, 1.45, 1.7, 1.9], of: w => w.moe },
  stability: { label: 'Stability', unit: 'volumetric shrinkage, % (less is better)', cuts: [14.5, 12.5, 10.5, 8], of: w => w.sh[2], lowGood: true },
  rot: { label: 'Rot resistance', unit: 'heartwood durability class', of: w => w.rot + 1 },
};
const WORK_LABELS = ['Hand tools', 'Machining', 'Carving', 'Turning', 'Nails & screws', 'Gluing', 'Finishing', 'Steam bending'];
const ROT_NAMES = ['Perishable', 'Low', 'Moderate', 'Durable', 'Very durable'];

const WOODUTIL = (() => {
  const score = (key, w) => {
    const s = WOOD_SCALE[key], v = s.of(w);
    if (!s.cuts) return v;
    return 1 + s.cuts.filter(c => s.lowGood ? v <= c : v >= c).length;
  };
  const tr = w => w.sh[1] / w.sh[0];
  const fmt = n => n.toLocaleString('en-US');
  const dots = (n, label) => `<span class="meter" role="img" aria-label="${label}: ${n} of 5">${[1, 2, 3, 4, 5].map(i => `<i${i <= n ? ' class="on"' : ''}></i>`).join('')}</span>`;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // the stat card at the top of every species page
  const card = key => {
    const w = WOODS[key];
    if (!w) throw new Error('No species ' + key);
    const facts = [
      ['Botanical name', `<i>${esc(w.bot)}</i>`], ['Also called', esc(w.alt)],
      ['Type', `${w.kind} · ${w.pores === 'conifer' ? 'conifer, no pores' : w.pores}`],
      ['Colour', esc(w.color)], ['Grain &amp; texture', esc(w.grain)], ['Figure', esc(w.figure)], ['With age', esc(w.age)],
      ['In Calgary', esc(w.avail) + ` <span class="price" aria-label="price ${w.price} of 4">${'$'.repeat(w.price)}<span>${'$'.repeat(4 - w.price)}</span></span>`],
      ['Dust', esc(w.dust)],
    ];
    const nums = [
      ['Janka hardness', `${fmt(w.janka)} lbf`], ['Weight (dry)', `${w.wt} lb/ft³`],
      ['Bending strength', `${fmt(w.mor)} psi`], ['Stiffness', `${w.moe.toFixed(2)} M psi`],
      ['Shrinkage R / T / V', `${w.sh[0]} / ${w.sh[1]} / ${w.sh[2]} %`], ['T/R ratio', tr(w).toFixed(1)],
      ['Rot resistance', ROT_NAMES[w.rot]],
    ];
    const meters = Object.keys(WOOD_SCALE).map(k => `<li><span>${WOOD_SCALE[k].label}</span>${dots(score(k, w), WOOD_SCALE[k].label)}</li>`).join('');
    const work = WORK_LABELS.map((l, i) => `<li><span>${l}</span>${dots(w.work[i], l)}</li>`).join('');
    return `<p class="prereq"><b>Read first</b> <a class="ref" href="#i-reading"></a> explains every number, meter and rating on this page.</p>
      <div class="spec-top">
        <figure class="spec-swatch"><div class="art one">${FIG.woodSwatch(key)}</div></figure>
        <dl class="spec-facts">${facts.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
      </div>
      <div class="spec-grid">
        <div class="spec-box"><h3>Numbers</h3><table class="spec-num"><tbody>${nums.map(([t, d]) => `<tr><th scope="row">${t}</th><td>${d}</td></tr>`).join('')}</tbody></table></div>
        <div class="spec-box"><h3>Properties</h3><ul class="meters">${meters}</ul></div>
        <div class="spec-box"><h3>Working it</h3><ul class="meters">${work}</ul></div>
      </div>`;
  };
  return { score, tr, card, fmt, dots };
})();

/* ---------- Guide I tables ---------- */
TABLES.woodScale = () => {
  const band = k => {
    const s = WOOD_SCALE[k], c = s.cuts, f = v => k === 'stiffness' ? v.toFixed(2) : WOODUTIL.fmt(v);
    return s.lowGood
      ? [`over ${f(c[0])}`, `${f(c[1])}–${f(c[0])}`, `${f(c[2])}–${f(c[1])}`, `${f(c[3])}–${f(c[2])}`, `${f(c[3])} or less`]
      : [`under ${f(c[0])}`, `${f(c[0])}–${f(c[1])}`, `${f(c[1])}–${f(c[2])}`, `${f(c[2])}–${f(c[3])}`, `${f(c[3])} and up`];
  };
  const rows = ['hardness', 'strength', 'stiffness', 'stability'].map(k => row([`${WOOD_SCALE[k].label} <span class="f">(${WOOD_SCALE[k].unit})</span>`].concat(band(k))));
  rows.push(row(['Rot resistance <span class="f">(heartwood)</span>'].concat(ROT_NAMES.map(n => n.toLowerCase()))));
  return head(['Meter', '1', '2', '3', '4', '5']) + body(rows);
};
TABLES.woods = () => head(['Species', 'Type', 'Janka lbf', 'lb/ft³', 'MOR psi', 'MOE M psi', 'Shrink T %', 'Shrink V %', 'T/R', 'Rot', 'Price']) + body(
  Object.keys(WOODS).map(k => {
    const w = WOODS[k];
    return row([`<a href="#${woodId(k)}">${w.name}</a>`, w.kind === 'Softwood' ? 'soft' : 'hard', WOODUTIL.fmt(w.janka), w.wt, WOODUTIL.fmt(w.mor), w.moe.toFixed(2), w.sh[1], w.sh[2], WOODUTIL.tr(w).toFixed(1), ROT_NAMES[w.rot].toLowerCase(), '$'.repeat(w.price)]);
  }));
TABLES.woodWork = () => head(['Species'].concat(WORK_LABELS)) + body(
  Object.keys(WOODS).map(k => row([`<a href="#${woodId(k)}">${WOODS[k].name}</a>`].concat(WOODS[k].work.map(String)))));
TABLES.woodDust = () => head(['Species', 'Dust and skin']) + body(
  Object.keys(WOODS).filter(k => !/^Low/.test(WOODS[k].dust)).map(k => row([WOODS[k].name, WOODS[k].dust]))).replace(/<td class="mono">/g, '<td class="txt">');

// species page ids: WOODS key → article id
function woodId(k) { return 'j-' + k; }
