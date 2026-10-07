import { CARD_THEME, VITRINE_BACK } from './cardTheme';
import TiltProductCard from './TiltProductCard';

/**
 * Gallery tile close crop: the case alone in its composed still (no listeners), composed for the tile. The case's
 * back wall is painted far past the crop on every side, so the tile shows one lit case and never the stage grid
 * around a smaller card. The tile renders it inert; the tile's own hover tilt is the only tilt on the index.
 */
export default function TiltProductCardPreview() {
  return (
    <div className={`${CARD_THEME} relative h-[240px] w-[360px]`}>
      <div aria-hidden="true" className="absolute -inset-[480px]" style={{ background: VITRINE_BACK }} />
      {/* The card is cropped to its case: the case's centre sits on the tile's centre. */}
      <div className="absolute left-1/2 top-1/2 w-[360px] -translate-x-1/2 -translate-y-[149px]">
        {/* The card's own surface steps back (no border, fill or shadow), so only the case's edge frames the object. */}
        <TiltProductCard still className="[&>div]:border-transparent [&>div]:bg-transparent [&>div]:!shadow-none" />
      </div>
    </div>
  );
}
