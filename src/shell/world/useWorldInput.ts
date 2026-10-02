import { useEffect, type RefObject } from 'react';
import { gsap, motionAllowed } from '../../lib/motion';
import { dragEnd, dragMove, dragStart } from '../orrery/orrerySpin';
import { world } from './worldState';

/** A press that travels less than this (px) and lifts within this (ms) is a click: it sends a shockwave. */
const CLICK_PX = 6;
const CLICK_MS = 320;

/** Presses on real controls stay theirs; only the hero's open space grabs the orrery. */
function onControl(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest('a, button, input, select, textarea, [role="button"]'));
}

/**
 * Pointer into the world: anywhere on the page the pointer is a gravity well (NDC); inside the hero a
 * horizontal drag spins the system with inertia and a click sends a shockwave through the rings. Touch keeps
 * vertical scrolling (the hero is touch-action: pan-y), so a vertical swipe still scrolls the dive.
 */
export function useWorldInput(hero: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = hero.current;
    if (!el || !motionAllowed()) return;
    let press = { x: 0, y: 0, t: 0, on: false };
    const toNdc = (event: PointerEvent) => {
      world.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      world.pointer.y = 1 - (event.clientY / window.innerHeight) * 2;
    };
    const move = (event: PointerEvent) => {
      toNdc(event);
      world.pointer.on = 1;
      dragMove(world.spin, event.clientX, event.timeStamp);
    };
    const down = (event: PointerEvent) => {
      if (onControl(event.target) || event.button > 0) return;
      toNdc(event);
      press = { x: event.clientX, y: event.clientY, t: event.timeStamp, on: true };
      dragStart(world.spin, event.clientX, event.timeStamp);
    };
    const up = (event: PointerEvent) => {
      if (!press.on) return;
      press.on = false;
      dragEnd(world.spin, event.timeStamp);
      const still = Math.hypot(event.clientX - press.x, event.clientY - press.y) < CLICK_PX;
      if (still && event.timeStamp - press.t < CLICK_MS) {
        toNdc(event);
        world.shock.x = world.pointer.x;
        world.shock.y = world.pointer.y;
        world.shock.at = gsap.ticker.time;
      }
      if (event.pointerType !== 'mouse') world.pointer.on = 0;
    };
    const leave = () => (world.pointer.on = 0);
    window.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [hero]);
}
