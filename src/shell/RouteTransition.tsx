import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType, useOutlet } from 'react-router-dom';
import { gsap, motionAllowed, ScrollTrigger } from '../lib/motion';
import { primeShownPath, setShownPath } from './shownRoute';
import { snapWorld } from './world/worldState';

/** Where each history entry was scrolled to when the visitor left it, so Back returns to the same place. */
const scrollOf = new Map<string, number>();

/**
 * Opacity only, never visibility, so a demo can take focus while its view fades in.
 * Route continuity: the leaving view fades and lifts 12px (160ms), then the entering view rises 16px
 * into place (200ms). Navigation is never blocked; reduced motion swaps instantly. A new page opens at the
 * top; Back and Forward return to where that page was left (the index's tiles, not its hero), with the scene
 * snapped to that scroll rather than flying the whole dive again.
 */
export default function RouteTransition() {
  const location = useLocation();
  const pop = useNavigationType() === 'POP';
  const outlet = useOutlet();
  const latest = useRef(outlet);
  latest.current = outlet;
  const view = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(() => {
    primeShownPath(location.pathname);
    return { key: location.key, element: outlet };
  });

  const stale = shown.key !== location.key;
  const current = stale ? shown.element : outlet;
  // The entry whose scroll is being recorded: none while a view is leaving, so no restore or swap overwrites it.
  const recording = useRef('');
  recording.current = stale ? '' : shown.key;

  useEffect(() => {
    const save = () => {
      if (recording.current) scrollOf.set(recording.current, window.scrollY);
    };
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, []);

  useLayoutEffect(() => {
    if (!stale) return;
    const swap = () => {
      setShown({ key: location.key, element: latest.current });
      setShownPath(location.pathname);
    };
    if (!motionAllowed() || !view.current) return swap();
    const out = gsap.to(view.current, { opacity: 0, y: -12, duration: 0.16, ease: 'power2.in', onComplete: swap });
    return () => {
      out.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pathname changes only with location.key, which is listed.
  }, [stale, location.key]);

  const lastShown = useRef(shown.key);
  useLayoutEffect(() => {
    if (!view.current) return;
    if (motionAllowed()) {
      gsap.fromTo(view.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out', clearProps: 'transform' });
    } else {
      gsap.set(view.current, { opacity: 1, clearProps: 'transform' });
    }
    ScrollTrigger.refresh();
    // The first view keeps the browser's own landing (a #hash); every later one opens at the top or where it was left.
    const arrived = lastShown.current !== shown.key;
    lastShown.current = shown.key;
    const back = arrived && pop ? (scrollOf.get(shown.key) ?? 0) : 0;
    if (arrived) window.scrollTo(0, back);
    if (back) {
      ScrollTrigger.update();
      snapWorld();
    }
    // `pop` is read for the entry being shown; it changes with the location, which changes shown.key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown.key]);

  return <div ref={view}>{current}</div>;
}
