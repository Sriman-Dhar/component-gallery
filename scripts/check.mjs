// npm run check: validates every src/components/<slug>/meta.ts. Exit 1 on any problem.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { COMPONENT_TYPES } from '../src/lib/types.ts';
import { COMPONENTS_DIR, SLUG_RE, componentFolders, pascal } from './lib.mjs';

const problems = [];
const metas = [];

for (const folder of componentFolders()) {
  const where = `src/components/${folder}`;
  const metaPath = join(COMPONENTS_DIR, folder, 'meta.ts');
  if (!existsSync(metaPath)) {
    problems.push(`${where}: missing meta.ts`);
    continue;
  }
  let meta;
  try {
    ({ meta } = await import(pathToFileURL(metaPath).href));
  } catch (error) {
    problems.push(`${where}/meta.ts: failed to load (${error.message})`);
    continue;
  }
  if (!meta || typeof meta !== 'object') {
    problems.push(`${where}/meta.ts: no "meta" export`);
    continue;
  }
  metas.push(meta);

  if (!SLUG_RE.test(meta.slug ?? '')) problems.push(`${where}: slug "${meta.slug}" is not kebab-case`);
  if (meta.slug !== folder) problems.push(`${where}: slug "${meta.slug}" does not match folder "${folder}"`);
  if (!meta.name?.trim()) problems.push(`${where}: name is empty`);
  if (!COMPONENT_TYPES.includes(meta.type)) {
    problems.push(`${where}: type "${meta.type}" is not one of ${COMPONENT_TYPES.join(', ')}`);
  }
  if (!Number.isInteger(meta.week) || meta.week < 0 || meta.week > 13) {
    problems.push(`${where}: week "${meta.week}" must be 0 to 13 (0 = scaffold placeholder)`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date ?? '')) problems.push(`${where}: date must be YYYY-MM-DD`);
  if (!meta.summary?.trim() || /TODO/.test(meta.summary)) problems.push(`${where}: summary is empty or TODO`);
  if (!meta.prompt?.trim() || /TODO/.test(meta.prompt)) problems.push(`${where}: prompt is empty or TODO`);
  if (!existsSync(join(COMPONENTS_DIR, folder, `${pascal(folder)}.tsx`))) {
    problems.push(`${where}: missing component file ${pascal(folder)}.tsx`);
  }
}

const seen = new Map();
for (const meta of metas) {
  if (seen.has(meta.slug)) problems.push(`duplicate slug "${meta.slug}"`);
  seen.set(meta.slug, true);
}

const counts = Object.fromEntries(COMPONENT_TYPES.map((type) => [type, 0]));
for (const meta of metas) if (meta.week > 0 && meta.type in counts) counts[meta.type] += 1;

console.log('Type counts (challenge components, week 1+):');
console.table(counts);
console.log(`${metas.length} component folder(s) checked.`);

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log('OK');
