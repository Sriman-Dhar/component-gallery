import { useRef } from 'react';
import { gsap, POINTER_MOTION, useGSAP } from '../lib/motion';

/**
 * The studio lighting: a warm key light top-left, a cool rim bottom-right, and a soft light that
 * follows the pointer (gsap.quickTo, no React state). Fixed, below content, never takes input.
 */
export default function LightField() {
  const light = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(POINTER_MOTION, () => {
      const el = light.current;
      if (!el) return;
      gsap.set(el, { x: window.innerWidth * 0.3, y: window.innerHeight * 0.2, autoAlpha: 1 });
      const toX = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const toY = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      const move = (event: PointerEvent) => {
        toX(event.clientX);
        toY(event.clientY);
      };
      window.addEventListener('pointermove', move, { passive: true });
      return () => window.removeEventListener('pointermove', move);
    });
    return () => mm.revert();
  });

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="light-key absolute inset-0" />
      <div className="light-rim absolute inset-0" />
      <div ref={light} className="light-pointer invisible absolute left-0 top-0 rounded-full" />
    </div>
  );
}
