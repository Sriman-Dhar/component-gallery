// Usage: npm run new -- <slug> --type <label> --week <n> --name "<Name>"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { COMPONENT_TYPES } from '../src/lib/types.ts';
import { COMPONENTS_DIR, ROOT, SLUG_RE, pascal } from './lib.mjs';

function fail(message) {
  console.error(`new-component: ${message}`);
  process.exit(1);
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    type: { type: 'string' },
    week: { type: 'string' },
    name: { type: 'string' },
  },
});

const slug = positionals[0];
if (!slug || !SLUG_RE.test(slug)) fail(`slug must be kebab-case, got "${slug ?? ''}"`);
if (!COMPONENT_TYPES.includes(values.type)) {
  fail(`--type must be one of: ${COMPONENT_TYPES.join(', ')} (got "${values.type ?? ''}")`);
}
const week = Number(values.week);
if (!Number.isInteger(week) || week < 1 || week > 13) fail('--week must be a whole number from 1 to 13');
const name = values.name?.trim();
if (!name) fail('--name is required, for example --name "Pricing Card"');

const folder = join(COMPONENTS_DIR, slug);
if (existsSync(folder)) fail(`src/components/${slug} already exists`);

const fill = (template) =>
  template
    .replaceAll('__SLUG__', slug)
    .replaceAll('__NAME__', name.replaceAll("'", "\\'"))
    .replaceAll('__PASCAL__', pascal(slug))
    .replaceAll('__TYPE__', values.type)
    .replaceAll('__WEEK__', String(week))
    .replaceAll('__DATE__', new Date().toISOString().slice(0, 10));

const templates = join(ROOT, 'scripts', 'templates');
mkdirSync(folder);
writeFileSync(join(folder, 'meta.ts'), fill(readFileSync(join(templates, 'meta.ts.tpl'), 'utf8')));
writeFileSync(
  join(folder, `${pascal(slug)}.tsx`),
  fill(readFileSync(join(templates, 'Component.tsx.tpl'), 'utf8')),
);

console.log(`Created src/components/${slug}/meta.ts and ${pascal(slug)}.tsx`);
console.log('Next: build the component, paste the final prompt into meta.ts, then npm run check.');
