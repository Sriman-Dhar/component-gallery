import { useSyncExternalStore } from 'react';

export type ThemeName = 'light' | 'dark';

const STORAGE_KEY = 'gallery-frame-theme';
const listeners = new Set<() => void>();

/** The frame theme is the data-theme attribute on <html>; index.html sets it before first paint. */
export function getTheme(): ThemeName {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

export function setTheme(next: ThemeName): void {
  document.documentElement.setAttribute('data-theme', next);
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage blocked: the choice lasts for this visit only */
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void): () => void {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

/** Subscribes a component to the frame theme without owning it. */
export function useFrameTheme(): ThemeName {
  return useSyncExternalStore(subscribe, getTheme, () => 'dark');
}
