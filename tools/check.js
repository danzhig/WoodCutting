#!/usr/bin/env node
// Opens the built handbook in Chromium and checks every page.
// Usage: node tools/check.js [--shots DIR] [--only a-,b-tape] [--width 1100] [--dark] [--pdf FILE]
// Needs Playwright (NODE_PATH pointing at a global install is fine).
const path = require('path');
const { chromium } = require('playwright');
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const has = k => args.includes(k);

(async () => {
  const file = 'file://' + path.join(__dirname, '..', 'plumb-and-square.html');
  const width = +(opt('--width') || 1100), shots = opt('--shots'), only = (opt('--only') || '').split(',').filter(Boolean);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: has('--dark') ? 'dark' : 'light' });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(file);
  await page.waitForTimeout(300);
  const ids = await page.evaluate(() => window.READER.pages.map(p => p.id));
  const problems = [];
  for (const id of ids) {
    if (only.length && !only.some(o => id.startsWith(o))) continue;
    await page.evaluate(i => { location.hash = i; }, id);
    await page.waitForTimeout(40);
    const r = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth, iw: innerWidth,
      figerr: [...document.querySelectorAll('.page.current .figerr')].map(e => e.textContent),
      nan: [...document.querySelectorAll('.page.current svg')].some(s => /NaN/.test(s.outerHTML)),
      empty: [...document.querySelectorAll('.page.current [data-fig]')].filter(e => !e.innerHTML.trim()).length
    }));
    if (r.sw > r.iw + 1) problems.push(`${id}: page scrolls sideways (${r.sw} > ${r.iw})`);
    if (r.figerr.length) problems.push(`${id}: ${r.figerr.join('; ')}`);
    if (r.nan) problems.push(`${id}: NaN in a figure`);
    if (r.empty) problems.push(`${id}: ${r.empty} empty figure(s)`);
    if (shots) await page.screenshot({ path: path.join(shots, `${id}.png`), fullPage: true });
  }
  if (opt('--pdf')) {
    await page.evaluate(() => { location.hash = 'home'; document.querySelectorAll('.page').forEach(p => p.classList.add('print-in')); document.body.dataset.print = 'all'; });
    await page.pdf({ path: opt('--pdf'), format: 'Letter' });
  }
  console.log(`pages: ${ids.length}`);
  console.log(errors.length ? 'console:\n  ' + [...new Set(errors)].join('\n  ') : 'console: clean');
  console.log(problems.length ? 'problems:\n  ' + problems.join('\n  ') : 'problems: none');
  await browser.close();
})();
