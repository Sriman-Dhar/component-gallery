import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { StageTheme } from './StageControls';

/** The stage theme picked on each history entry (location key), so Back and Forward return to the slab chosen there. */
const pickOf = new Map<string, { slug: string; theme: StageTheme }>();

/**
 * The stage follows the frame's theme until the visitor picks one; the pick holds for that page and is kept
 * per history entry, so Back and Forward restore it while a fresh visit (a new entry) starts from the frame.
 * While the page is leaving, the location already names the next route: the entry being shown is kept instead.
 */
export function useStagePick(slug: string, frameTheme: StageTheme): [StageTheme, (next: StageTheme) => void] {
  const { key, pathname } = useLocation();
  const here = pathname.endsWith(`/${slug}`);
  const [entry, setEntry] = useState(key);
  const [, setVersion] = useState(0);
  if (here && entry !== key) setEntry(key);
  const shownKey = here ? key : entry;
  const pick = pickOf.get(shownKey);
  const choose = (theme: StageTheme) => {
    pickOf.set(shownKey, { slug, theme });
    setVersion((n) => n + 1);
  };
  return [pick?.slug === slug ? pick.theme : frameTheme, choose];
}
