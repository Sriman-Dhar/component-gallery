import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from '../../lib/motion';
import { snapWorld } from '../world/worldState';

/** Navigation state that asks the index to open on its tiles (the /components address redirects with it). */
export const TILES_STATE = { land: 'tiles' } as const;

/**
 * The index opened from /components (a trimmed breadcrumb URL): it lands on "Shipped so far" with focus on
 * the heading, and the scene snaps to that scroll instead of flying the whole dive.
 */
export function useLandOnTiles(headingId: string): void {
  const { state } = useLocation();
  const land = (state as typeof TILES_STATE | null)?.land === 'tiles';
  useEffect(() => {
    if (!land) return;
    const heading = document.getElementById(headingId);
    if (!heading) return;
    // The heading's own scroll margin keeps it clear of the sticky header.
    const margin = parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;
    window.scrollTo(0, heading.getBoundingClientRect().top + window.scrollY - margin);
    heading.focus({ preventScroll: true });
    ScrollTrigger.update();
    snapWorld();
  }, [land, headingId]);
}
