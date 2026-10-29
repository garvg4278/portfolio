// Verifies every internal link, asset reference and #anchor in the built site (dist/).
// External URLs are listed, not fetched. Exit code 1 on any broken internal reference.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const DIST = resolve(process.argv[2] || 'dist');
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p);
  }
})(DIST);

const toPath = (url, from) => {
  let u = url.split('?')[0];
  if (u.startsWith('/')) u = join(DIST, u);
  else u = resolve(dirname(from), u);
  if (existsSync(u) && statSync(u).isDirectory()) u = join(u, 'index.html');
  return u;
};
const ids = new Map();
const idsOf = (file) => {
  if (!ids.has(file)) ids.set(file, new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(file);
};

let bad = 0, checked = 0;
const external = new Set();
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(mailto:|tel:|javascript:|data:)/.test(ref)) continue;
    if (/^https?:\/\//.test(ref)) { external.add(ref); continue; }
    checked++;
    const [pathPart, hash] = ref.split('#');
    const target = pathPart ? toPath(pathPart, file) : file;
    if (!existsSync(target)) { console.error(`BROKEN  ${file.replace(DIST, '')}  ->  ${ref}`); bad++; continue; }
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) { console.error(`NO ANCHOR  ${file.replace(DIST, '')}  ->  ${ref}`); bad++; }
  }
}
console.log(`Checked ${checked} internal references in ${files.length} pages. Broken: ${bad}.`);
console.log(`External links (not fetched): ${external.size}`);
process.exit(bad ? 1 : 0);
