import type { RefObject } from 'react';
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '../../lib/motion';
import { world } from './worldState';

/** Where the rail sits in the viewport when the dive ends: its box center at 62% of the height. */
const DIVE_END = 'center 62%';

/** Reads the rail anchor's place in the document (one layout read, on refresh only, never per frame). */
function measureRail(anchor: HTMLElement | null) {
  if (!anchor) {
    world.rail.ok = false;
    return;
  }
  const rect = anchor.getBoundingClientRect();
  world.rail.left = rect.left + window.scrollX;
  world.rail.top = rect.top + window.scrollY;
  world.rail.width = rect.width;
  world.rail.base = Number(anchor.dataset.base ?? 84);
  world.rail.ok = true;
  world.labels = [...anchor.querySelectorAll<SVGTextElement>('[data-week-label]')];
}

/**
 * The dive's single scroll source: one ScrollTrigger from the hero's top to the rail settling at 62% of the
 * viewport. It only writes the target progress; the scene damps toward it. The rail anchor is measured on
 * every refresh (resize, fonts, layout) so the particle rail lands exactly on the DOM rail. Reduced motion:
 * no trigger at all, the scene stays a still and the rail stays the poster.
 */
export function useDiveScroll(hero: RefObject<HTMLElement>, rail: RefObject<HTMLElement>) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const anchor = rail.current?.querySelector<HTMLElement>('[data-world-anchor="rail"]') ?? null;
      const trigger = ScrollTrigger.create({
        trigger: hero.current,
        start: 'top top',
        endTrigger: anchor ?? rail.current,
        end: DIVE_END,
        onUpdate: (self) => {
          world.diveTarget = self.progress;
        },
        onRefresh: (self) => {
          measureRail(anchor);
          world.diveTarget = self.progress;
        },
      });
      measureRail(anchor);
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => {
        trigger.kill();
        world.rail.ok = false;
        world.labels = [];
        world.diveTarget = 0;
        world.dive = 0;
      };
    });
    return () => mm.revert();
  });
}
