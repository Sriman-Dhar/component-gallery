import OrreryPoster from '../orrery/OrreryPoster';

/**
 * The orrery without WebGL: the SVG still framed like the live hero (sun right of center on wide screens,
 * above the type on phones), with its warm atmosphere. On the index it stays fixed behind the page with the rest of the world box.
 */
export default function WorldPoster({ shipped }: { shipped: number }) {
  return (
    <div data-testid="world-poster" className="pointer-events-none absolute inset-x-0 top-0 h-[100svh] overflow-hidden">
      <div className="absolute left-[-4%] top-[4%] aspect-[1.3] w-[108%] lg:left-auto lg:right-[-10%] lg:top-[10%] lg:w-[84%]">
        <div className="orrery-atmos absolute -inset-x-[6%] -inset-y-[14%]" />
        <OrreryPoster shipped={shipped} />
      </div>
    </div>
  );
}
