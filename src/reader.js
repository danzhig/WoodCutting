/* =====================================================================
   READER
   Turns the guide files into a flip-able book: one page on screen at a time.
   Structure comes from the markup:
     <section class="guide" data-letter data-title data-sub>
       <div class="guide-intro">…</div>
       <div class="gsection" data-title>
         <article class="topic" id data-title>…</article>
   Numbers (C2.1), headers, pagers, covers, the contents drawer and search
   are all generated here, so adding a topic is just adding an <article>.
   ===================================================================== */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const STORE = 'plumbsquare:last';
  const store = { get() { try { return localStorage.getItem(STORE); } catch (e) { return null; } }, set(v) { try { localStorage.setItem(STORE, v); } catch (e) { } } };

  // ---------- 1. build the index ----------
  const pages = [];            // reading order: home, cover A, topics A…, cover B, …
  const byId = {};
  const guides = $$('section.guide').map(g => {
    const letter = g.dataset.letter, G = { el: g, letter, title: g.dataset.title, sub: g.dataset.sub || '', id: 'guide-' + letter.toLowerCase(), sections: [], topics: [] };
    $$('.gsection', g).forEach((s, si) => {
      const S = { num: letter + (si + 1), title: s.dataset.title, topics: [] };
      $$('article.topic', s).forEach((t, ti) => {
        const T = { el: t, id: t.id, num: S.num + '.' + (ti + 1), title: t.dataset.title, guide: G, section: S, kind: 'topic' };
        S.topics.push(T); G.topics.push(T);
      });
      G.sections.push(S);
    });
    return G;
  });

  const home = { el: $('#home'), id: 'home', kind: 'home', title: 'Plumb & Square' };
  pages.push(home); byId.home = home;
  guides.forEach(G => {
    const C = { id: G.id, kind: 'cover', guide: G, title: G.title, num: G.letter };
    G.cover = C; pages.push(C); byId[C.id] = C;
    G.topics.forEach(T => { pages.push(T); byId[T.id] = T; });
  });
  pages.forEach((p, i) => { p.index = i; });

  // ---------- 2. guide covers ----------
  guides.forEach(G => {
    const intro = $('.guide-intro', G.el);
    const el = document.createElement('div');
    el.className = 'page cover-page'; el.id = G.id;
    el.innerHTML = `<div class="page-inner">
      <header class="cover-head"><div class="gl">${G.letter}</div><div class="ct"><p class="kicker">Guide ${G.letter} · ${G.topics.length} topics</p><h2 tabindex="-1">${esc(G.title)}</h2><p>${esc(G.sub)}</p></div></header>
      <div class="cover-body"></div>
      <div class="cover-actions">${G.topics[0] ? `<a class="btn" href="#${G.topics[0].id}">Start reading: ${esc(G.topics[0].num)} ${esc(G.topics[0].title)}</a>` : ''}
        <button type="button" class="btn ghost" data-print="guide">Print this guide</button></div>
      <nav class="pager" aria-label="Page"></nav></div>`;
    const body = $('.cover-body', el);
    if (intro) body.appendChild(intro);
    G.sections.forEach(S => {
      body.insertAdjacentHTML('beforeend', `<section class="toc-sec"><h3><span class="n">${S.num}</span>${esc(S.title)}</h3><ol>${S.topics.map(T => `<li><a href="#${T.id}"><span class="tn">${T.num}</span><span>${esc(T.title)}</span></a></li>`).join('')}</ol></section>`);
    });
    G.el.insertBefore(el, G.el.firstChild);
    G.cover.el = el;
  });

  // ---------- 3. topic pages: header + body + see-also + pager ----------
  guides.forEach(G => G.topics.forEach(T => {
    const t = T.el;
    t.classList.add('page');
    const body = document.createElement('div'); body.className = 'topic-body';
    while (t.firstChild) body.appendChild(t.firstChild);
    const inner = document.createElement('div'); inner.className = 'page-inner';
    inner.innerHTML = `<header class="topic-head"><div class="th-no">${esc('ref' in G.el.dataset ? 'Ref' : 'Topic')}<b>${T.num}</b>${G.letter}·${G.topics.indexOf(T) + 1}/${G.topics.length}</div><div class="th-main"><p class="eyebrow">Guide ${G.letter} · ${esc(G.title)} › ${esc(T.section.num)} ${esc(T.section.title)}</p><h2 tabindex="-1">${esc(T.title)}</h2></div></header>`;
    inner.appendChild(body);
    inner.insertAdjacentHTML('beforeend', '<nav class="pager" aria-label="Page"></nav>');
    t.appendChild(inner);
  }));

  // species stat cards (Guide J), filled before cross-references so their links get titles too
  $$('[data-spec]').forEach(el => {
    try { el.innerHTML = WOODUTIL.card(el.dataset.spec); } catch (e) { el.innerHTML = `<p class="figerr">Species “${esc(el.dataset.spec)}” failed: ${esc(e.message)}</p>`; console.error(e); }
  });

  // cross-references: <a class="ref" href="#id"></a> gets "C2.1 Title"
  $$('a.ref').forEach(a => {
    const p = byId[(a.getAttribute('href') || '').slice(1)];
    if (!p) { console.warn('Broken reference', a.getAttribute('href')); a.remove(); return; }
    if (!a.textContent.trim()) a.textContent = p.kind === 'cover' ? `Guide ${p.num}: ${p.title}` : `${p.num} ${p.title}`;
  });
  $$('.seealso').forEach(s => { if (!s.querySelector('a')) s.remove(); });

  // pagers
  const label = p => p.kind === 'home' ? 'Handbook home' : p.kind === 'cover' ? `Guide ${p.num}: ${p.title}` : `${p.num} ${p.title}`;
  pages.forEach(p => {
    const nav = p.el && $('.pager', p.el); if (!nav) return;
    const prev = pages[p.index - 1], next = pages[p.index + 1];
    const G = p.guide, count = p.kind === 'topic' ? `<p class="count">${G.letter}: topic ${G.topics.indexOf(p) + 1} of ${G.topics.length}</p>` : '';
    nav.innerHTML = count + (prev ? `<a class="prev" href="#${prev.id}" rel="prev"><small>← Previous</small><span>${esc(label(prev))}</span></a>` : '') +
      (next ? `<a class="next" href="#${next.id}" rel="next"><small>Next →</small><span>${esc(label(next))}</span></a>` : '');
  });

  // ---------- 4. figures, tables, figure numbers ----------
  $$('[data-fig]').forEach(el => {
    try {
      el.innerHTML = FIG[el.dataset.fig]();
      if (!el.querySelector('.panel') && !el.classList.contains('mini')) el.classList.add('one');
    } catch (e) { el.innerHTML = `<p class="figerr">Figure “${esc(el.dataset.fig)}” failed: ${esc(e.message)}</p>`; console.error(e); }
  });
  $$('[data-table]').forEach(el => {
    const cap = el.querySelector('caption');
    try { el.innerHTML = (cap ? cap.outerHTML : '') + TABLES[el.dataset.table](); } catch (e) { console.error('Table', el.dataset.table, e); }
  });
  guides.forEach(G => G.topics.forEach(T => {
    $$('figure figcaption', T.el).forEach((cap, i) => cap.insertAdjacentHTML('afterbegin', `<span class="fignum">Fig ${T.num}${String.fromCharCode(97 + i)}</span>`));
  }));

  // ---------- 5. home shelf ----------
  const shelf = $('#shelf');
  if (shelf) shelf.innerHTML = guides.map(G => `<a class="gcard" href="#${G.id}"><span class="gl">${G.letter}</span><span class="gt"><h3>${esc(G.title)}</h3><p>${esc(G.sub)}</p><span class="n">${G.topics.length} topics</span></span></a>`).join('');

  // ---------- 6. glossary from every <dfn> ----------
  const terms = [];
  guides.forEach(G => G.topics.forEach(T => $$('dfn', T.el).forEach(d => {
    const term = d.textContent.trim();
    if (terms.some(x => x.term.toLowerCase() === term.toLowerCase())) return;
    let sentence = (d.closest('p,li,td') || d).textContent.replace(/\s+/g, ' ').trim();
    if (sentence.length > 260) sentence = sentence.slice(0, 257) + '…';
    terms.push({ term, sentence, T });
  })));
  terms.sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));
  const gl = $('#glossary');
  if (gl) {
    let last = '';
    gl.innerHTML = terms.map(x => {
      const L = x.term[0].toUpperCase(), head = L !== last ? `<dt class="letter">${esc(L)}</dt>` : ''; last = L;
      return head + `<div><dt>${esc(x.term)}</dt><dd>${esc(x.sentence)} <a href="#${x.T.id}">${x.T.num}</a></dd></div>`;
    }).join('');
  }

  // ---------- 7. contents drawer + search ----------
  const drawer = $('#drawer'), drawerBg = $('#drawer-bg'), list = $('#drawer-list'), search = $('#drawer-q');
  const tree = guides.map(G => `<details data-g="${G.letter}"><summary><span class="gl">${G.letter}</span><span>${esc(G.title)}</span></summary>
    <ol><li><a href="#${G.id}" class="cover-link"><span class="tn">${G.letter}</span><span>Guide cover &amp; contents</span></a></li></ol>
    ${G.sections.map(S => `<p class="dsec">${S.num} ${esc(S.title)}</p><ol>${S.topics.map(T => `<li><a href="#${T.id}"><span class="tn">${T.num}</span><span>${esc(T.title)}</span></a></li>`).join('')}</ol>`).join('')}</details>`).join('');
  const searchIndex = guides.flatMap(G => G.topics.map(T => ({ T, title: T.title.toLowerCase(), terms: $$('dfn', T.el).map(d => d.textContent.toLowerCase()), text: T.el.textContent.toLowerCase().replace(/\s+/g, ' ') })));
  const renderTree = () => { list.innerHTML = tree; highlightDrawer(); };
  const renderSearch = q => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = searchIndex.map(e => {
      let s = 0;
      for (const w of words) {
        if (e.title.includes(w)) s += 10; else if (e.terms.some(t => t.includes(w))) s += 5; else if (e.text.includes(w)) s += 1; else return null;
      }
      return { e, s };
    }).filter(Boolean).sort((a, b) => b.s - a.s || a.e.T.index - b.e.T.index).slice(0, 40);
    const mark = s => { let out = esc(s); words.forEach(w => { out = out.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); }); return out; };
    list.scrollTop = 0;
    list.innerHTML = scored.length ? `<div class="results">${scored.map(({ e }) => `<a href="#${e.T.id}">${e.T.num} ${mark(e.T.title)}<small>Guide ${e.T.guide.letter} · ${esc(e.T.guide.title)} › ${esc(e.T.section.title)}</small></a>`).join('')}</div>` : `<p class="empty">Nothing matches “${esc(q)}”. Try a tool name, a cut, or a term such as “kerf”.</p>`;
  };
  const openDrawer = () => { drawer.hidden = false; drawerBg.hidden = false; renderTree(); search.value = ''; setTimeout(() => search.focus(), 0); };
  const closeDrawer = () => { drawer.hidden = true; drawerBg.hidden = true; };
  $('#open-drawer').addEventListener('click', openDrawer);
  $('#close-drawer').addEventListener('click', closeDrawer);
  drawerBg.addEventListener('click', closeDrawer);
  search.addEventListener('input', () => search.value.trim() ? renderSearch(search.value.trim()) : renderTree());
  list.addEventListener('click', e => { if (e.target.closest('a')) closeDrawer(); });

  function highlightDrawer() {
    const cur = current; if (!cur) return;
    $$('a.here', list).forEach(a => a.classList.remove('here'));
    const a = $(`a[href="#${cur.id}"]`, list); if (a) a.classList.add('here');
    const g = cur.guide && $(`details[data-g="${cur.guide.letter}"]`, list); if (g) g.open = true;
    if (a) a.scrollIntoView({ block: 'center' });
  }

  // ---------- 8. routing ----------
  let current = null;
  const crumbs = $('#crumbs'), bar = $('#progress i');
  function show(id, fromNav) {
    const p = byId[id] || home;
    if (current === p) return;
    const dir = current && p.index < current.index ? 'turn-prev' : 'turn-next';
    if (current) current.el.classList.remove('current', 'turn-next', 'turn-prev');
    p.el.classList.add('current');
    if (current) { p.el.classList.remove('turn-next', 'turn-prev'); void p.el.offsetWidth; p.el.classList.add(dir); }
    current = p;
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
    const h = $('h1, h2', p.el); if (h && fromNav) h.focus({ preventScroll: true });
    // breadcrumb
    const G = p.guide, parts = ['<a href="#home">Handbook</a>'];
    if (G) parts.push(`<span class="sep">›</span><a href="#${G.id}">${G.letter} ${esc(G.title)}</a>`);
    if (p.kind === 'topic') parts.push(`<span class="sep c-sep2">›</span><span class="c-sec">${esc(p.section.num)} ${esc(p.section.title)}</span><span class="sep">›</span><span>${esc(p.num)}</span>`);
    crumbs.innerHTML = parts.join('');
    bar.style.width = p.kind === 'topic' ? ((G.topics.indexOf(p) + 1) / G.topics.length * 100) + '%' : '0';
    document.title = (p.kind === 'home' ? 'Plumb & Square' : `${label(p)} · Plumb & Square`);
    if (p.kind === 'topic') store.set(p.id);
    updateContinue();
  }
  function updateContinue() {
    const c = $('#continue'); if (!c) return;
    const last = byId[store.get()];
    c.innerHTML = last && last.kind === 'topic'
      ? `<a class="btn" href="#${last.id}">Continue: ${esc(last.num)} ${esc(last.title)}</a><a class="btn ghost" href="#${guides[0].id}">Start from Guide A</a>`
      : `<a class="btn" href="#${guides[0].id}">Start reading</a><button type="button" class="btn ghost" id="home-contents">Open the contents</button>`;
    const hc = $('#home-contents'); if (hc) hc.addEventListener('click', openDrawer);
  }
  const go = step => { const p = pages[current.index + step]; if (p) location.hash = p.id; };
  window.addEventListener('hashchange', () => show(location.hash.slice(1) || 'home', true));

  // keys: ← → turn pages, Esc closes the drawer
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !drawer.hidden) { closeDrawer(); return; }
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (!drawer.hidden || e.target.closest('input,textarea,select,[contenteditable]')) return;
    if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
  });
  // swipe on phones (ignored on figures and tables, which may scroll sideways)
  let sx = 0, sy = 0, st = 0, ok = false;
  const book = $('#book');
  book.addEventListener('touchstart', e => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); ok = e.touches.length === 1 && !e.target.closest('.art,.tablewrap,input,select,.calc'); }, { passive: true });
  book.addEventListener('touchend', e => {
    if (!ok) return; const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Date.now() - st < 700 && Math.abs(dx) > 70 && Math.abs(dy) < Math.abs(dx) * 0.5) go(dx < 0 ? 1 : -1);
  }, { passive: true });

  // ---------- 9. printing ----------
  const printMenu = $('#printmenu');
  function markPrint(mode) {
    $$('.page.print-in').forEach(el => el.classList.remove('print-in', 'print-first'));
    let list = [current];
    if (mode === 'guide' && current.guide) list = [current.guide.cover, ...current.guide.topics];
    if (mode === 'all') list = pages;
    list.forEach(p => p.el.classList.add('print-in'));
    list[0].el.classList.add('print-first');   // no page break before the first printed page
    document.body.dataset.print = mode;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-print]'); if (!b) return;
    let mode = b.dataset.print; if (mode === 'guide' && !current.guide) mode = 'all';
    markPrint(mode); printMenu.open = false; window.print();
  });
  window.addEventListener('beforeprint', () => { if (!document.body.dataset.print) markPrint('page'); });
  window.addEventListener('afterprint', () => { delete document.body.dataset.print; $$('.page.print-in').forEach(el => el.classList.remove('print-in', 'print-first')); });
  document.addEventListener('click', e => { if (printMenu.open && !e.target.closest('#printmenu')) printMenu.open = false; });

  // ---------- 10. calculators and start ----------
  if (window.CALC) window.CALC.init();
  // every page opens at its top: stop the browser jumping to the #id anchor on load
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  show(location.hash.slice(1) || 'home', false);
  window.addEventListener('load', () => requestAnimationFrame(() => window.scrollTo(0, 0)));
  window.READER = { pages, guides, byId, show };
})();
