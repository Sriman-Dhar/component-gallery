import { forwardRef } from 'react';
import OrreryPoster from '../orrery/OrreryPoster';
import { useWorldStatus } from '../world/worldState';

/**
 * The index's closing frame: the system seen from far away, calm, above the footer. While the scene is live
 * the particles form it on the anchor box (the `far` formation); otherwise the SVG orrery stands in, small
 * and dim, so the band is never empty. Decorative.
 */
const FarCoda = forwardRef<HTMLDivElement, { shipped: number }>(function FarCoda({ shipped }, ref) {
  const live = useWorldStatus() === 'live';
  return (
    <div ref={ref} aria-hidden="true" className="flex min-h-[58svh] items-center justify-center py-16 sm:min-h-[66svh]">
      <div data-world-anchor="far" className="relative aspect-[1.6] w-full max-w-[640px]">
        {live ? null : (
          <div className="absolute inset-[8%] opacity-60">
            <OrreryPoster shipped={shipped} />
          </div>
        )}
      </div>
    </div>
  );
});

export default FarCoda;
