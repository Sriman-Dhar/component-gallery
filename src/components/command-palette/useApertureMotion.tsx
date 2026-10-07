import { useRef, type RefObject } from 'react';
import { gsap, motionAllowed, useGSAP } from '../../lib/motion';

export interface Point {
  x: number;
  y: number;
}

/** The iris: 180ms open, 120ms close. The light: one glide, never a blink. */
const OPEN_S = 0.18;
const CLOSE_S = 0.12;
const GLIDE_S = 0.22;

/** Radius that covers the whole panel from `origin` (panel coordinates): the distance to its farthest corner. */
export function irisRadius(origin: Point, width: number, height: number): number {
  const dx = Math.max(origin.x, width - origin.x);
  const dy = Math.max(origin.y, height - origin.y);
  return Math.ceil(Math.hypot(dx, dy));
}

interface Refs {
  scope: RefObject<HTMLElement>;
  panel: RefObject<HTMLElement>;
  scrim: RefObject<HTMLElement>;
  light: RefObject<HTMLElement>;
}

/**
 * Aperture motion. Open: the panel's clip-path circle dilates from `origin` (the trigger's centre, or the panel's top
 * centre for a hotkey) while the scrim fades in; close runs it back. The selection light glides on y and scaleY through
 * quickTo. Under reduced motion nothing tweens: the panel is simply there and the light snaps.
 */
export function useApertureMotion({ scope, panel, scrim, light }: Refs) {
  const glide = useRef<{ y: gsap.QuickToFunc; scaleY: gsap.QuickToFunc } | null>(null);
  const placed = useRef(false);
  const pending = useRef<gsap.core.Tween | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (!light.current) return;
      gsap.set(light.current, { transformOrigin: '50% 0%', autoAlpha: 0 });
      // A fresh context (mount, or StrictMode's second run) starts hidden, so the next placement snaps in.
      placed.current = false;
      glide.current = {
        y: gsap.quickTo(light.current, 'y', { duration: GLIDE_S, ease: 'power3.out' }),
        scaleY: gsap.quickTo(light.current, 'scaleY', { duration: GLIDE_S, ease: 'power3.out' }),
      };
    },
    { scope },
  );

  const iris = (origin: Point | null) => {
    const el = panel.current!;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const at = origin ?? { x: w / 2, y: 0 };
    return { at: `${Math.round(at.x)}px ${Math.round(at.y)}px`, r: irisRadius(at, w, h) };
  };

  const open = contextSafe((origin: Point | null) => {
    if (!panel.current || !scrim.current) return;
    if (!motionAllowed()) {
      gsap.set(scrim.current, { opacity: 1 });
      return;
    }
    const { at, r } = iris(origin);
    const [p, s] = [panel.current, scrim.current];
    // Closed now, dilating from the next tick: the mount's own work must not eat the first frames of a 180ms open.
    gsap.set(p, { clipPath: `circle(0px at ${at})` });
    gsap.set(s, { opacity: 0 });
    pending.current = gsap.delayedCall(0, () => {
      gsap.to(s, { opacity: 1, duration: OPEN_S, ease: 'power2.out' });
      gsap.to(p, { clipPath: `circle(${r}px at ${at})`, duration: OPEN_S, ease: 'power3.out', clearProps: 'clipPath' });
    });
  });

  const close = contextSafe((origin: Point | null, done: () => void) => {
    if (!panel.current || !scrim.current || !motionAllowed()) {
      done();
      return;
    }
    const { at, r } = iris(origin);
    pending.current?.kill();
    gsap.killTweensOf([panel.current, scrim.current]);
    gsap.to(scrim.current, { opacity: 0, duration: CLOSE_S, ease: 'power2.in' });
    gsap.fromTo(
      panel.current,
      { clipPath: `circle(${r}px at ${at})` },
      { clipPath: `circle(0px at ${at})`, duration: CLOSE_S, ease: 'power2.in', onComplete: done },
    );
  });

  /** Put the light behind a row (`y` and height in list coordinates). The first placement snaps. */
  const moveLight = contextSafe((target: { y: number; height: number; base: number } | null) => {
    const el = light.current;
    if (!el || !glide.current) return;
    if (!target) {
      gsap.set(el, { autoAlpha: 0 });
      placed.current = false;
      return;
    }
    const scaleY = target.height / target.base;
    if (!placed.current || !motionAllowed()) {
      // Snap: set the transform now and park both quickTo tweens on the same value (start = end).
      gsap.set(el, { y: target.y, scaleY, autoAlpha: 1 });
      glide.current.y(target.y, target.y);
      glide.current.scaleY(scaleY, scaleY);
      placed.current = true;
      return;
    }
    glide.current.y(target.y);
    glide.current.scaleY(scaleY);
  });

  return { open, close, moveLight };
}
