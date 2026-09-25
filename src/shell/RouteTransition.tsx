import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { gsap, motionAllowed, ScrollTrigger } from '../lib/motion';

/**
 * Route continuity: the leaving view fades and lifts 12px (160ms), then the entering view rises 16px
 * into place (200ms). Navigation is never blocked; reduced motion swaps instantly.
 */
export default function RouteTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const latest = useRef(outlet);
  latest.current = outlet;
  const view = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState({ key: location.key, element: outlet });

  const stale = shown.key !== location.key;
  const current = stale ? shown.element : outlet;

  useLayoutEffect(() => {
    if (!stale) return;
    const swap = () => {
      setShown({ key: location.key, element: latest.current });
      window.scrollTo(0, 0);
    };
    if (!motionAllowed() || !view.current) return swap();
    const out = gsap.to(view.current, { autoAlpha: 0, y: -12, duration: 0.16, ease: 'power2.in', onComplete: swap });
    return () => {
      out.kill();
    };
  }, [stale, location.key]);

  useLayoutEffect(() => {
    if (!view.current) return;
    if (motionAllowed()) {
      gsap.fromTo(view.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power2.out', clearProps: 'transform' });
    } else {
      gsap.set(view.current, { autoAlpha: 1, clearProps: 'transform' });
    }
    ScrollTrigger.refresh();
  }, [shown.key]);

  return <div ref={view}>{current}</div>;
}
