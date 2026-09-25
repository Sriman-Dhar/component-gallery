import { gsap, motionAllowed } from './motion';
import { getTheme, setTheme, type ThemeName } from './theme';

const DURATION = 0.45;

type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

function radiusFrom(x: number, y: number): number {
  return Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
}

/** Fallback: an overlay in the new theme grows from the origin, the theme flips under it, the overlay fades. */
function overlayWipe(next: ThemeName, x: number, y: number): void {
  const overlay = document.createElement('div');
  overlay.setAttribute('data-theme', next);
  overlay.setAttribute('aria-hidden', 'true');
  overlay.className = 'theme-wipe pointer-events-none fixed inset-0 z-[70]';
  document.body.appendChild(overlay);
  gsap
    .timeline({ onComplete: () => overlay.remove() })
    .fromTo(
      overlay,
      { clipPath: `circle(0px at ${x}px ${y}px)` },
      { clipPath: `circle(${radiusFrom(x, y)}px at ${x}px ${y}px)`, duration: DURATION, ease: 'power2.inOut' },
    )
    .add(() => setTheme(next))
    .to(overlay, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' });
}

/**
 * Flip the frame theme with a circular wipe from (x, y). Reduced motion (and jsdom) flips instantly.
 * With view transitions the new frame, content included, is revealed by the circle.
 */
export function wipeTheme(x: number, y: number): ThemeName {
  const next: ThemeName = getTheme() === 'dark' ? 'light' : 'dark';
  if (!motionAllowed()) {
    setTheme(next);
    return next;
  }
  const doc = document as ViewTransitionDoc;
  if (typeof doc.startViewTransition !== 'function') {
    overlayWipe(next, x, y);
    return next;
  }
  const transition = doc.startViewTransition(() => setTheme(next));
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radiusFrom(x, y)}px at ${x}px ${y}px)`] },
        { duration: DURATION * 1000, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => undefined);
  return next;
}
