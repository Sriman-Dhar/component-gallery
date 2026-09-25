import { readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const COMPONENTS_DIR = join(ROOT, 'src', 'components');
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** 'data-table' -> 'DataTable' */
export function pascal(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/** Folder names directly under src/components. */
export function componentFolders() {
  return readdirSync(COMPONENTS_DIR).filter((name) =>
    statSync(join(COMPONENTS_DIR, name)).isDirectory(),
  );
}
