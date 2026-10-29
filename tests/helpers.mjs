// Small helpers shared by the tests.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const walk = (dir, ext) => {
  const out = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...walk(p, ext));
    else if (!ext || p.endsWith(ext)) out.push(p);
  }
  return out;
};
