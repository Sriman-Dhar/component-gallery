import { useEffect, type RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { slotCaption } from '../../lib/catalogue';
import { gsap, motionAllowed } from '../../lib/motion';
import { canUseWebGL } from '../../lib/webgl';
import { armCarry } from '../carry/carry';
import { dragEnd, dragMove, dragStart } from '../orrery/orrerySpin';
import { bodyUnder } from './bodyHit';
import { world } from './worldState';

/** A press that travels less than this (px) and lifts within this (ms) is a click, not a drag. */
const CLICK_PX = 6;
const CLICK_MS = 320;
/** A drag counts as "used" (the hint retires) once it has travelled this far (px). */
const USED_PX = 60;

/** Presses on real controls stay theirs; the rest of the hero grabs the orrery. */
function onControl(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest('a, button, input, select, textarea, [role="button"]'));
}

/** Fills the hover label and shows it on body `i`, or hides it (-1). */
function showTag(i: number) {
  if (i === world.hover) return;
  world.hover = i;
  const tag = world.tag;
  if (!tag) return;
  if (i < 0) {
    tag.style.opacity = '0';
    return;
  }
  const { number, title, slug } = slotCaption(i);
  tag.querySelector('[data-tag="number"]')!.textContent = slug ? `${number} · Open` : number;
  tag.querySelector('[data-tag="title"]')!.textContent = title;
  tag.style.opacity = '1';
}

/**
 * Pointer into the world: anywhere on the page the pointer is a gravity well (NDC). Anywhere on the hero that
 * is not a control, a drag turns the system with inertia (horizontal) and tips it (vertical, mouse only), a
 * click sends a shockwave, and hovering a body names it; a shipped body clicks through to its page. Touch
 * keeps vertical scrolling (the hero is touch-action: pan-y), so only a sideways swipe turns it.
 * `data-cursor` on the hero drives the grab / grabbing / pointer cursor.
 */
export function useWorldInput(hero: RefObject<HTMLElement>, onTurned: () => void) {
  const navigate = useNavigate();
  useEffect(() => {
    const el = hero.current;
    // Only a live scene turns: no grab cursor over the still or the SVG poster.
    if (!el || !motionAllowed() || !canUseWebGL()) return;
    let press = { x: 0, y: 0, t: 0, on: false, travel: 0 };
    let used = false;
    el.dataset.cursor = 'grab';
    const toNdc = (event: PointerEvent) => {
      world.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      world.pointer.y = 1 - (event.clientY / window.innerHeight) * 2;
    };
    const move = (event: PointerEvent) => {
      toNdc(event);
      world.pointer.on = 1;
      if (press.on) {
        const y = event.pointerType === 'mouse' ? event.clientY : world.spin.lastY;
        dragMove(world.spin, event.clientX, event.timeStamp, y);
        press.travel = Math.hypot(event.clientX - press.x, event.clientY - press.y);
        if (!used && press.travel > USED_PX) {
          used = true;
          onTurned();
        }
        return;
      }
      const inHero = el.contains(event.target as Node) && !onControl(event.target);
      const i = inHero && event.pointerType === 'mouse' ? bodyUnder(event.clientX, event.clientY) : -1;
      showTag(i);
      el.dataset.cursor = i >= 0 && slotCaption(i).slug ? 'pointer' : 'grab';
    };
    const down = (event: PointerEvent) => {
      if (onControl(event.target) || event.button > 0) return;
      toNdc(event);
      press = { x: event.clientX, y: event.clientY, t: event.timeStamp, on: true, travel: 0 };
      dragStart(world.spin, event.clientX, event.timeStamp, event.clientY);
      showTag(-1);
      el.dataset.cursor = 'grabbing';
    };
    const up = (event: PointerEvent) => {
      if (!press.on) return;
      press.on = false;
      dragEnd(world.spin, event.timeStamp);
      el.dataset.cursor = 'grab';
      const still = press.travel < CLICK_PX && event.timeStamp - press.t < CLICK_MS;
      if (still) {
        const i = bodyUnder(event.clientX, event.clientY);
        const slug = i >= 0 ? slotCaption(i).slug : undefined;
        if (slug) {
          const xyr = world.bodies.xyr;
          armCarry(xyr[i * 3], xyr[i * 3 + 1], xyr[i * 3 + 2]);
          navigate(`/components/${slug}`);
          return;
        }
        toNdc(event);
        world.shock.x = world.pointer.x;
        world.shock.y = world.pointer.y;
        world.shock.at = gsap.ticker.time;
      }
      if (event.pointerType !== 'mouse') world.pointer.on = 0;
    };
    const leave = () => {
      world.pointer.on = 0;
      showTag(-1);
    };
    // On the document, not the window: it runs before the cursor ring's window listener, so the ring reads this
    // move's data-cursor (a shipped body under the pointer turns the ring hot on the same frame).
    document.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      delete el.dataset.cursor;
      showTag(-1);
      document.removeEventListener('pointermove', move);
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [hero, navigate, onTurned]);
}
