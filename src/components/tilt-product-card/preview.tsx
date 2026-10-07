import TiltProductCard from './TiltProductCard';

/**
 * Gallery tile close crop: the case in its composed still (no listeners), cropped to the vitrine so the object leads.
 * The tile renders it inert; the tile's own hover tilt is the only tilt on the index.
 */
export default function TiltProductCardPreview() {
  return (
    <div className="h-[300px] w-[340px] overflow-hidden">
      <TiltProductCard still />
    </div>
  );
}
