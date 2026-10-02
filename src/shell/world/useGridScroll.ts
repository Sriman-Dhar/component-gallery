import type { RefObject } from 'react';
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '../../lib/motion';
import { MAX_TILES, measureBox, world } from './worldState';

/**
 * Tile boxes in document px, read from layout offsets inside the grid (so the tiles' own reveal transforms
 * never shift the halos), plus the fraction the dive's streams part around and the coda's far orrery.
 */
function measure(grid: HTMLElement | null, coda: HTMLElement | null) {
  measureBox(world.keep, document.querySelector('[data-world-keep]'));
  measureBox(world.far, coda?.querySelector('[data-world-anchor="far"]') ?? null);
  const tiles = grid ? [...grid.querySelectorAll<HTMLElement>(':scope > li')].slice(0, MAX_TILES) : [];
  const box = grid?.getBoundingClientRect();
  tiles.forEach((tile, i) => {
    world.tiles.rects.set(
      [(box?.left ?? 0) + window.scrollX + tile.offsetLeft, (box?.top ?? 0) + window.scrollY + tile.offsetTop, tile.offsetWidth, tile.offsetHeight],
      i * 4,
    );
  });
  world.tiles.count = tiles.length;
}

/**
 * The index's second and third acts on the same single scroll source: the grid trigger takes the swarm from
 * the rail into the tile halos (first half) and casts the numerals (second half, tiles centered); the coda
 * trigger, from the coda entering to the end of the page, calms it into the far orrery. Targets only; the
 * scene damps toward them. Reduced motion: no triggers, the scene is a still at the top.
 */
export function useGridScroll(grid: RefObject<HTMLElement>, coda: RefObject<HTMLElement>) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const remeasure = () => measure(grid.current, coda.current);
      const tiles = ScrollTrigger.create({
        trigger: grid.current,
        start: 'top 92%',
        end: 'center 52%',
        onUpdate: (self) => (world.gridTarget = self.progress),
        onRefresh: (self) => {
          remeasure();
          world.gridTarget = self.progress;
        },
      });
      const calm = ScrollTrigger.create({
        trigger: coda.current,
        start: 'top 72%',
        end: 'max',
        onUpdate: (self) => (world.codaTarget = self.progress),
        onRefresh: (self) => (world.codaTarget = self.progress),
      });
      remeasure();
      return () => {
        tiles.kill();
        calm.kill();
        world.tiles.count = 0;
        world.gridTarget = world.grid = world.codaTarget = world.coda = 0;
        measureBox(world.keep, null);
        measureBox(world.far, null);
      };
    });
    return () => mm.revert();
  });
}
