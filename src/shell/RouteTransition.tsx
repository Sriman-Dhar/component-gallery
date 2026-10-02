import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType, useOutlet } from 'react-router-dom';
import { gsap, motionAllowed, ScrollTrigger } from '../lib/motion';
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
  const [shown, setShown] = useState({ key: location.key, element: outlet });

  const stale = shown.key !== location.key;
  const current = stale ? shown.element : outlet;

  useLayoutEffect(() => {
    if (!stale) return;
    scrollOf.set(shown.key, window.scrollY);
    const swap = () => {
      setShown({ key: location.key, element: latest.current });
      window.scrollTo(0, 0);
    };
    if (!motionAllowed() || !view.current) return swap();
    const out = gsap.to(view.current, { opacity: 0, y: -12, duration: 0.16, ease: 'power2.in', onComplete: swap });
    return () => {
      out.kill();
    };
  }, [stale, location.key]);

  useLayoutEffect(() => {
    if (!view.current) return;
    if (motionAllowed()) {
      gsap.fromTo(view.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out', clearProps: 'transform' });
    } else {
      gsap.set(view.current, { opacity: 1, clearProps: 'transform' });
    }
    ScrollTrigger.refresh();
    const back = pop ? scrollOf.get(shown.key) : undefined;
    if (back) {
      window.scrollTo(0, back);
      ScrollTrigger.update();
      snapWorld();
    }
    // `pop` is read for the entry being shown; it changes with the location, which changes shown.key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown.key]);

  return <div ref={view}>{current}</div>;
}
