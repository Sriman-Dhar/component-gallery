import type { ComponentType } from 'react';
import type { ComponentMeta, GalleryEntry, SourceFile } from './types';

type MetaModule = { meta: ComponentMeta };
type ViewModule = { default: ComponentType };

const metaModules = import.meta.glob<MetaModule>('../components/*/meta.ts', { eager: true });
const viewModules = import.meta.glob<ViewModule>('../components/*/*.tsx');
const rawModules = import.meta.glob<string>('../components/*/*.tsx', {
  query: '?raw',
  import: 'default',
});

/** '../components/example-button/meta.ts' -> 'example-button' */
export function folderOf(path: string): string {
  return path.split('/').at(-2) ?? '';
}

function fileOf(path: string): string {
  return path.split('/').at(-1) ?? '';
}

function pascal(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function pathsIn<T>(modules: Record<string, T>, folder: string): string[] {
  return Object.keys(modules).filter((p) => folderOf(p) === folder);
}

function demoLoader(folder: string): GalleryEntry['loadDemo'] {
  const paths = pathsIn(viewModules, folder);
  const demo = paths.find((p) => fileOf(p) === 'demo.tsx');
  const main = paths.find((p) => fileOf(p) === `${pascal(folder)}.tsx`);
  const pick = demo ?? main;
  if (!pick) {
    return () => Promise.reject(new Error(`No component file in components/${folder}`));
  }
  return viewModules[pick];
}

function sourcesLoader(folder: string): GalleryEntry['loadSources'] {
  const paths = pathsIn(rawModules, folder).sort((a, b) =>
    fileOf(a) === 'demo.tsx' ? 1 : fileOf(b) === 'demo.tsx' ? -1 : a.localeCompare(b),
  );
  return async () =>
    Promise.all(
      paths.map(async (p): Promise<SourceFile> => ({ fileName: fileOf(p), code: await rawModules[p]() })),
    );
}

/** Every folder under src/components that has a meta.ts, newest week first. */
export const registry: GalleryEntry[] = Object.entries(metaModules)
  .map(([path, mod]) => {
    const folder = folderOf(path);
    return { meta: mod.meta, loadDemo: demoLoader(folder), loadSources: sourcesLoader(folder) };
  })
  .sort((a, b) => b.meta.week - a.meta.week || a.meta.name.localeCompare(b.meta.name));

/** Folder name for each registered meta, used by tests to prove slug === folder. */
export const metaFolders: Record<string, string> = Object.fromEntries(
  Object.entries(metaModules).map(([path, mod]) => [mod.meta.slug, folderOf(path)]),
);

export function findEntry(slug: string): GalleryEntry | undefined {
  return registry.find((entry) => entry.meta.slug === slug);
}
