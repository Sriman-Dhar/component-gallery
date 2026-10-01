import type { RefObject } from 'react';
import { gsap, POINTER_MOTION, useGSAP, withMotion } from '../../lib/motion';

/** How far (px) the pointer light reaches a letter, and how hot the nearest letter gets. */
const REACH = 280;
const PEAK = 0.9;

/**
 * The name carries the key light. On load a light sweeps the letters left to right once (after the
 * rise); then, for a fine pointer, each letter warms by its distance to the pointer, damped through
 * quickTo on its own --heat. Reads every rect first, writes on GSAP's tick, so nothing thrashes layout.
 * Reduced motion: no sweep, no tracking, the plain name.
 */
export function useLetterLight(root: RefObject<HTMLElement>, delay: number) {
  useGSAP(
    () =>
      withMotion(() => {
        const letters = gsap.utils.toArray<HTMLElement>('.letter', root.current);
        gsap.set(letters, { '--heat': 0 });
        gsap
          .timeline({ delay })
          .to(letters, { '--heat': 1, duration: 0.28, ease: 'power2.out', stagger: 0.045 })
          .to(letters, { '--heat': 0, duration: 0.7, ease: 'power2.inOut', stagger: 0.045 }, 0.22);
      }),
    { scope: root },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(POINTER_MOTION, () => {
        const letters = gsap.utils.toArray<HTMLElement>('.letter', root.current);
        const heat = letters.map((el) => gsap.quickTo(el, '--heat', { duration: 0.5, ease: 'power3.out' }));
        const move = (event: PointerEvent) => {
          const rects = letters.map((el) => el.getBoundingClientRect());
          rects.forEach((rect, i) => {
            const dx = event.clientX - (rect.left + rect.width / 2);
            const dy = event.clientY - (rect.top + rect.height / 2);
            const near = Math.max(0, 1 - Math.hypot(dx, dy) / REACH);
            heat[i](near * near * PEAK);
          });
        };
        const leave = () => heat.forEach((to) => to(0));
        window.addEventListener('pointermove', move, { passive: true });
        document.documentElement.addEventListener('pointerleave', leave);
        return () => {
          window.removeEventListener('pointermove', move);
          document.documentElement.removeEventListener('pointerleave', leave);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
}
