import { useEffect, useState } from 'react';

/** True once the page is scrolled past `threshold` px. Re-renders only when the answer flips. */
export function useScrolled(threshold = 0): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);

  return scrolled;
}
