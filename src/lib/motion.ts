import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const MOTION_REDUCED = '(prefers-reduced-motion: reduce)';
/** Tilt and pointer lights only run for a fine pointer that allows motion. */
export const POINTER_MOTION = `${MOTION_OK} and (pointer: fine)`;

/**
 * Run `animate` when motion is allowed and `settle` (final state, no tween) when the viewer
 * prefers reduced motion. Returns the revert, so it can be the cleanup of a useGSAP callback.
 */
export function withMotion(animate: () => void, settle: () => void = () => undefined): () => void {
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, animate);
  mm.add(MOTION_REDUCED, settle);
  return () => mm.revert();
}

/** True only when the viewer explicitly allows motion. False where matchMedia is missing (tests). */
export function motionAllowed(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(MOTION_OK).matches
    : false;
}

/** True when the app mounted over the static shell's already visible hero words (a slow load, see main.tsx). */
export function bootLate(): boolean {
  return typeof document !== 'undefined' && document.documentElement.dataset.bootLate === 'true';
}

export { gsap, ScrollTrigger, useGSAP };
