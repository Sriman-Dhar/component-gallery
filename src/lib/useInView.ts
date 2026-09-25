import { useEffect, useState, type RefObject } from 'react';

/**
 * Tracks whether an element is near the viewport and the tab is visible. `near` latches true once
 * (for lazy mounting); `active` follows the element in and out (for pausing work offscreen).
 */
export function useInView(ref: RefObject<Element>, enabled: boolean, rootMargin = '0px') {
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof IntersectionObserver === 'undefined') return;
    let intersecting = false;
    const update = () => setActive(intersecting && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        if (intersecting) setNear(true);
        update();
      },
      { rootMargin },
    );
    observer.observe(el);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, [ref, enabled, rootMargin]);

  return { near, active };
}
