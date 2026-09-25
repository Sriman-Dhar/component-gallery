import type { RefObject } from 'react';
import { gsap, POINTER_MOTION, useGSAP } from '../../lib/motion';

const MAX_DEG = 6;

/**
 * Pointer tilt (max 6deg, damped through quickTo) plus a sheen that follows the pointer angle.
 * Only for a fine pointer with motion allowed; otherwise the tile stays flat and still.
 */
export function useTilt(tile: RefObject<HTMLElement>, card: RefObject<HTMLElement>, sheen: RefObject<HTMLElement>) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(POINTER_MOTION, () => {
      const host = tile.current;
      const face = card.current;
      const light = sheen.current;
      if (!host || !face || !light) return;
      const rotX = gsap.quickTo(face, 'rotationX', { duration: 0.4, ease: 'power2.out' });
      const rotY = gsap.quickTo(face, 'rotationY', { duration: 0.4, ease: 'power2.out' });
      const setX = gsap.quickSetter(light, '--sheen-x', '%');
      const setY = gsap.quickSetter(light, '--sheen-y', '%');
      const setAngle = gsap.quickSetter(light, '--sheen-angle', 'deg');

      const move = (event: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        rotY(nx * 2 * MAX_DEG);
        rotX(-ny * 2 * MAX_DEG);
        setX((nx + 0.5) * 100);
        setY((ny + 0.5) * 100);
        setAngle((Math.atan2(ny, nx) * 180) / Math.PI + 90);
      };
      const leave = () => {
        rotX(0);
        rotY(0);
      };
      host.addEventListener('pointermove', move);
      host.addEventListener('pointerleave', leave);
      return () => {
        host.removeEventListener('pointermove', move);
        host.removeEventListener('pointerleave', leave);
      };
    });
    return () => mm.revert();
  });
}
