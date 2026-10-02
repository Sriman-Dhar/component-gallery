/**
 * Route carry: the light of the body (or tile) the visitor clicked flies into the detail page's close-orbit
 * socket while the route changes, so the page reads as moving into that planet. The click site arms it with
 * a viewport point and radius; RouteCarry (mounted once in the Layout) owns the one DOM orb that plays it.
 */
type Play = (x: number, y: number, r: number) => void;

let player: Play | null = null;

/** RouteCarry registers its player on mount; null on unmount. */
export function setCarryPlayer(play: Play | null): void {
  player = play;
}

/** Start the carry from a viewport point (px) at a radius (px). A no-op until RouteCarry is mounted. */
export function armCarry(x: number, y: number, r: number): void {
  player?.(x, y, r);
}

/** Arm from an element's box: its center, a radius from its shorter side. */
export function armCarryFrom(el: Element | null): void {
  const box = el?.getBoundingClientRect();
  if (box) armCarry(box.left + box.width / 2, box.top + box.height / 2, Math.min(box.width, box.height) * 0.18);
}
