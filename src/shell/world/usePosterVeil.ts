import { useEffect, type RefObject } from 'react';

/** Slack around the type (px) a poster body must clear. */
const PAD = 8;

/**
 * The poster's half of the veil rule the live scene keeps: a body dot that lands on the page's type
 * (data-world-veil) is hidden, so no-WebGL visitors never see specks on the headline; the rings fade out above the footer. Re-checked on mount,
 * once fonts settle, on resize and when a scroll comes to rest (no frame loop of its own).
 */
export function usePosterVeil(root: RefObject<HTMLElement>): void {
  useEffect(() => {
    let timer = 0;
    const check = () => {
      const el = root.current;
      if (!el) return;
      const veils = Array.from(document.querySelectorAll('[data-world-veil]'), (v) => v.getBoundingClientRect()).filter((r) => r.width > 0);
      el.querySelectorAll<SVGGElement>('[data-slot]').forEach((slot) => {
        const b = slot.getBoundingClientRect();
        const hit = veils.some((v) => b.right > v.left - PAD && b.left < v.right + PAD && b.bottom > v.top - PAD && b.top < v.bottom + PAD);
        slot.style.opacity = hit ? '0' : '';
      });
      // The rings are whole paths, so they fade out above the footer instead (its rule and date stay clean).
      const foot = document.querySelector('footer[data-world-veil]')?.getBoundingClientRect();
      const top = foot ? foot.top - el.getBoundingClientRect().top : Infinity;
      const mask = top < el.offsetHeight ? `linear-gradient(to bottom, #000 ${Math.round(top - 56)}px, transparent ${Math.round(top - 12)}px)` : '';
      el.style.setProperty('mask-image', mask);
      el.style.setProperty('-webkit-mask-image', mask);
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(check, 60);
    };
    check();
    const late = window.setTimeout(check, 900);
    document.fonts?.ready.then(schedule);
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(late);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule);
    };
  }, [root]);
}
