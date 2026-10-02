import { forwardRef } from 'react';
import { shipped as entries, TARGET, upcomingWeek } from '../../lib/catalogue';
import { weekOpens } from '../../lib/ruler';
import { REPO_URL } from '../../lib/site';
import { FOCUS_RING } from '../focus';
import OrreryPoster from '../orrery/OrreryPoster';
import { useWorldStatus } from '../world/worldState';

/**
 * The index's closing frame: the system seen from far away, calm, above the footer, and the last word over
 * it: when the next week opens and where to follow along. While the scene is live the particles form the
 * far orrery on the anchor box (the `far` formation); otherwise the SVG orrery stands in, small and dim.
 */
const FarCoda = forwardRef<HTMLDivElement, { shipped: number }>(function FarCoda({ shipped }, ref) {
  const live = useWorldStatus() === 'live';
  const week = upcomingWeek(entries);
  return (
    <section ref={ref} aria-labelledby="coda-heading" className="relative flex min-h-[52svh] items-center justify-center py-16 sm:min-h-[60svh]">
      <div aria-hidden="true" data-world-anchor="far" className="absolute left-1/2 top-1/2 aspect-[1.6] w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2">
        {live ? null : (
          <div className="absolute inset-[8%] opacity-60">
            <OrreryPoster shipped={shipped} />
          </div>
        )}
      </div>
      <div data-world-veil className="copy-scrim relative max-w-[40ch] text-center">
        <h2 id="coda-heading" className="text-balance font-display text-[26px] font-bold leading-[32px] tracking-[-0.025em] text-text sm:text-[34px] sm:leading-[40px]">
          {week ? `Week ${week} opens ${weekOpens(week).replace(/ \d{4}$/, '').replace(' ', '\u00a0')}.` : 'All thirteen weeks are in.'}
        </h2>
        <p className="mt-3 text-text-2">
          {shipped} of {TARGET} shipped. Each new one takes its place in the orbit.
        </p>
        {REPO_URL ? (
          <a
            href={REPO_URL}
            className={`mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-accent/50 bg-surface/80 px-5 font-mono text-small text-text transition-colors duration-fast hover:border-accent hover:bg-surface-2 ${FOCUS_RING}`}
          >
            Follow along on GitHub
          </a>
        ) : null}
      </div>
    </section>
  );
});

export default FarCoda;
