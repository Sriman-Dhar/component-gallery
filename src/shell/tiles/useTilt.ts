import type { RefObject } from 'react';
import { gsap, POINTER_MOTION, useGSAP } from '../../lib/motion';

const MAX_DEG = 6;

/**
 * Pointer tilt (max 6deg, damped through quickTo), a sheen that follows the pointer angle, and the
 * stage spotlight (--spot-x on the card) leaning after the pointer.
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
      // The stage spotlight leans toward the pointer, damped, from its resting center.
      const spot = { x: 50 };
      const spotTo = gsap.quickTo(spot, 'x', {
        duration: 0.7,
        ease: 'power3.out',
        onUpdate: () => face.style.setProperty('--spot-x', `${spot.x.toFixed(2)}%`),
      });

      const move = (event: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        rotY(nx * 2 * MAX_DEG);
        rotX(-ny * 2 * MAX_DEG);
        setX((nx + 0.5) * 100);
        setY((ny + 0.5) * 100);
        setAngle((Math.atan2(ny, nx) * 180) / Math.PI + 90);
        spotTo(50 + nx * 50);
      };
      const leave = () => {
        rotX(0);
        rotY(0);
        spotTo(50);
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
