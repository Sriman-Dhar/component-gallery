import type { MutableRefObject, RefObject } from 'react';
import { gsap } from '../../lib/motion';
import { RINGS } from './tiltMath';

interface SwayParts {
  root: RefObject<HTMLElement>;
  rings: MutableRefObject<(HTMLElement | null)[]>;
  specs: MutableRefObject<(HTMLElement | null)[]>;
}

/** Ring drift along Z and the specular swing of the idle sway. */
const DRIFT = 10;
const SWING = 36;

/**
 * Touch with motion allowed: no tilt (the case never moves under a thumb), but the rings breathe apart and the
 * specular arcs slide slowly around them, so a phone still reads depth. Transform only; paused while the card is
 * off screen. Returns the cleanup for the matchMedia context it runs in.
 */
export function idleSway({ root, rings, specs }: SwayParts): () => void {
  const card = root.current;
  const [outer, , inner] = rings.current;
  if (!card || !outer || !inner) return () => undefined;
  const sway = gsap
    .timeline({ repeat: -1, yoyo: true, defaults: { duration: 3.6, ease: 'sine.inOut' } })
    .to(outer, { z: RINGS[0].z + DRIFT }, 0)
    .to(inner, { z: RINGS[2].z - DRIFT }, 0)
    .to(
      specs.current.filter((el): el is HTMLElement => el !== null),
      { rotation: (i: number) => RINGS[i].spec + SWING },
      0,
    );
  if (typeof IntersectionObserver === 'undefined') return () => sway.kill();
  const watch = new IntersectionObserver(([entry]) => sway.paused(!entry.isIntersecting));
  watch.observe(card);
  return () => {
    watch.disconnect();
    sway.kill();
  };
}
