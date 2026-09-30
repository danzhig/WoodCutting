#!/usr/bin/env node
// Builds the single offline file from src/.
// Usage: node build.js   → plumb-and-square.html
// Markers in src/shell.html:
//   /*@include path*/             inline one file (inside <style> or <script>)
//   <!--@include-dir glob-->      inline every matching .html file, sorted by name
//   <!--@include-scripts glob-->  each matching .js file in its own <script> block
const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const list = glob => {
  const dir = path.dirname(glob), ext = path.extname(glob);
  return fs.readdirSync(path.join(root, dir)).filter(f => f.endsWith(ext)).sort().map(f => path.join(dir, f));
};

let html = read('src/shell.html');
html = html.replace(/\/\*@include (\S+?)\*\//g, (_, p) => read(p).replace(/<\/script/gi, '<\\/script'));
html = html.replace(/<!--@include-dir (\S+?)-->/g, (_, g) => list(g).map(p => `<!-- ${p} -->\n` + read(p)).join('\n'));
html = html.replace(/<!--@include-scripts (\S+?)-->/g, (_, g) => list(g).map(p => `<script>\n/* ${p} */\n${read(p).replace(/<\/script/gi, '<\\/script')}\n</script>`).join('\n'));

const out = path.join(root, 'plumb-and-square.html');
fs.writeFileSync(out, html);
console.log(`Wrote ${path.relative(root, out)} (${(html.length / 1024).toFixed(0)} KB)`);
