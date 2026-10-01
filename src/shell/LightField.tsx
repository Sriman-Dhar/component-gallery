import { useRef } from 'react';
import { gsap, POINTER_MOTION, useGSAP } from '../lib/motion';

/**
 * The studio lighting: a warm key light top-left and a cool rim at the bottom of the page, both on a
 * page-height layer so their falloff is never cut at the viewport edge (or at 900px in a full-page
 * capture), plus a soft light that follows the pointer (gsap.quickTo, no React state) on a fixed layer.
 * Below content, never takes input, clipped so nothing bleeds past either side.
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
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="light-key absolute inset-x-0 top-0 h-[900px]" />
        <div className="light-rim absolute inset-x-0 bottom-0 h-[900px]" />
      </div>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div ref={light} className="light-pointer invisible absolute left-0 top-0 rounded-full" />
      </div>
    </>
  );
}
