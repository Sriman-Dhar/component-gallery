import { useEffect, useRef } from 'react';
import { gsap, motionAllowed } from '../../lib/motion';
import { setCarryPlayer } from './carry';

/** The orb's drawn size (px); every pose is a scale of it, so the flight is transforms and opacity only. */
const SIZE = 160;
/** How long the orb waits for the detail page's socket to mount before it lets go (s). */
const WAIT = 0.32;
const SKIP = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

const socket = () => document.querySelector('[data-world-anchor="close"]');

/**
 * The one orb that carries a clicked body's light into the next page's close orbit: it blooms where the click
 * landed (140ms), then flies to the header's socket and settles to the body's size as it fades into the
 * scene's own body (360ms, expo). Under 700ms in all; any input skips it, reduced motion never plays it.
 */
export default function RouteCarry() {
  const orb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = orb.current;
    if (!el) return;
    let tl: gsap.core.Timeline | null = null;
    const stop = () => {
      SKIP.forEach((type) => window.removeEventListener(type, skip));
      tl?.kill();
    };
    const skip = () => {
      stop();
      gsap.to(el, { autoAlpha: 0, duration: 0.12, ease: 'power1.out' });
    };
    const fly = (waited: number) => {
      const target = socket()?.getBoundingClientRect();
      if (!target?.width) {
        if (waited < WAIT) tl?.call(() => fly(waited + 0.04), [], '+=0.04');
        else tl?.to(el, { autoAlpha: 0, duration: 0.2 });
        return;
      }
      const size = Math.min(target.width, target.height) * 0.62;
      tl?.to(el, { x: target.left + target.width / 2 - SIZE / 2, y: target.top + target.height / 2 - SIZE / 2, scale: size / SIZE, duration: 0.36, ease: 'expo.inOut' })
        .to(el, { autoAlpha: 0, duration: 0.16, ease: 'power1.in' }, '-=0.12')
        .call(stop);
    };
    setCarryPlayer((x, y, r) => {
      if (!motionAllowed()) return;
      stop();
      const from = Math.max(10, r) * 2;
      gsap.set(el, { x: x - SIZE / 2, y: y - SIZE / 2, scale: from / SIZE, autoAlpha: 0 });
      tl = gsap.timeline();
      tl.to(el, { autoAlpha: 1, scale: (from * 1.9) / SIZE, duration: 0.14, ease: 'power2.out' }).call(() => fly(0));
      SKIP.forEach((type) => window.addEventListener(type, skip, { passive: true }));
    });
    return () => {
      setCarryPlayer(null);
      stop();
    };
  }, []);

  return (
    <div
      ref={orb}
      aria-hidden="true"
      className="route-carry pointer-events-none invisible fixed left-0 top-0 z-30 rounded-full opacity-0"
      style={{ width: SIZE, height: SIZE }}
    />
  );
}
