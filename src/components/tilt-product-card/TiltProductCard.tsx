import { useId, useRef, useState } from 'react';
import ArmillaryObject from './ArmillaryObject';
import BagButton from './BagButton';
import CardLight from './CardLight';
import { CARD_SHADOW, CARD_THEME, VITRINE_BACK, VITRINE_INNER } from './cardTheme';
import FinishPicker from './FinishPicker';
import { DEFAULT_FINISHES, describeFinish, finishSpec, type Finish } from './finishes';
import SaveButton from './SaveButton';
import { clampTilt, PERSPECTIVE, VITRINE } from './tiltMath';
import { useTilt } from './useTilt';

export interface TiltProductCardProps {
  /** Default 'Armilla No. 3'. */
  name?: string;
  /** Default 'Vorrel Works'. */
  maker?: string;
  /** Preformatted, default '$148.00'. */
  price?: string;
  /** Default 'Ships in 3 days'. */
  stockNote?: string;
  /** The product name links here. Default '#armilla'. */
  href?: string;
  /** Default Brass, Graphite, Frost. */
  finishes?: Finish[];
  /** Controlled finish id. */
  finish?: string;
  /** Uncontrolled start, default 'brass'. */
  defaultFinish?: string;
  onFinishChange?: (id: string) => void;
  /** A returned promise drives the adding state. */
  onAddToBag?: (finishId: string) => Promise<void> | void;
  /** Disables Add to bag and shows 'Sold out'; the finish picker stays usable. */
  soldOut?: boolean;
  /** Controlled Save state. */
  saved?: boolean;
  onSavedChange?: (saved: boolean) => void;
  /** Items in the bag, when the host knows it: the success announcement then says how many. */
  bagCount?: number;
  /** Degrees, default 10, clamped 0..14. */
  maxTilt?: number;
  /** Force the composed still (the gallery tile uses it): no listeners attached. */
  still?: boolean;
  className?: string;
}

/** "Armilla No. 3" -> "No 3" for the maker line; any other name leaves the maker alone. */
function modelOf(name: string): string | null {
  const match = /No\.?\s*(\d+)/i.exec(name);
  return match ? `No ${match[1]}` : null;
}

/**
 * Armillary Vitrine: a product card that is a glass display case. The case tilts toward a fine pointer in real
 * perspective; inside it a desk armillary built from CSS 3D planes shows its depth, its rings breathe apart along Z,
 * an amber glare follows the pointer across the glass and a cool rim lights the far edge. On touch and under reduced
 * motion it holds a composed still. Name, finish, price, Save and Add to bag sit flat on the front plane.
 */
export default function TiltProductCard({
  name = 'Armilla No. 3',
  maker = 'Vorrel Works',
  price = '$148.00',
  stockNote = 'Ships in 3 days',
  href = '#armilla',
  finishes = DEFAULT_FINISHES,
  finish,
  defaultFinish = 'brass',
  onFinishChange,
  onAddToBag,
  soldOut = false,
  saved,
  onSavedChange,
  bagCount,
  maxTilt,
  still = false,
  className = '',
}: TiltProductCardProps) {
  const nameId = useId();
  const [ownFinish, setOwnFinish] = useState(defaultFinish);
  const [ownSaved, setOwnSaved] = useState(false);
  const finishId = finish ?? ownFinish;
  const isSaved = saved ?? ownSaved;
  const spec = finishSpec(finishId, finishes);
  const model = modelOf(name);

  const root = useRef<HTMLElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);
  const rim = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const rings = useRef<(HTMLDivElement | null)[]>([]);
  const { flare } = useTilt({ root, tilt, glare, rim, core, rings }, { maxTilt: clampTilt(maxTilt), still });

  const pickFinish = (id: string) => {
    if (finish === undefined) setOwnFinish(id);
    onFinishChange?.(id);
  };
  const toggleSaved = () => {
    if (saved === undefined) setOwnSaved(!isSaved);
    onSavedChange?.(!isSaved);
  };

  return (
    <article
      ref={root}
      aria-labelledby={nameId}
      style={{ perspective: PERSPECTIVE, perspectiveOrigin: `50% ${VITRINE.inset + VITRINE.height / 2}px` }}
      className={`${CARD_THEME} relative w-full min-w-[280px] max-w-[380px] font-sans text-[rgb(var(--tc-ink))] ${className}`}
    >
      <div
        ref={tilt}
        data-tilt=""
        style={{ boxShadow: CARD_SHADOW }}
        className="relative rounded-tile border border-[rgb(var(--tc-line))] bg-[rgb(var(--tc-surface))] p-2 will-change-transform [transform-style:preserve-3d]"
      >
        <div
          style={{ height: VITRINE.height, background: VITRINE_BACK, boxShadow: VITRINE_INNER }}
          className="relative rounded-control [transform-style:preserve-3d]"
        >
          <ArmillaryObject finish={spec} rings={rings} core={core} />
          <CardLight glare={glare} rim={rim} />
          <p data-vitrine-description="" className="sr-only">
            {describeFinish(spec.label)}
          </p>
        </div>
        <div className="flex flex-col gap-4 px-3 pb-3 pt-4 [backface-visibility:hidden]">
          <div className="flex flex-col gap-0.5">
            <p className="font-mono text-[12px] uppercase leading-4 tracking-[0.12em] text-[rgb(var(--tc-ink-2))]">
              {maker}
              {model ? ` · ${model}` : ''}
            </p>
            <h2 id={nameId} className="font-display text-[22px] font-semibold leading-[1.15] tracking-[-0.01em] sm:text-[26px]">
              <a
                href={href}
                className="-mx-1 inline-flex min-h-[44px] items-center rounded-[4px] px-1 underline-offset-[5px] outline-none decoration-[rgb(var(--tc-ink-2))] decoration-1 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--tc-focus))]"
              >
                {name}
              </a>
            </h2>
          </div>
          <FinishPicker finishes={finishes} value={finishId} onChange={pickFinish} />
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-display text-[20px] font-semibold leading-6 tabular-nums">{price}</p>
            <p className="text-[14px] leading-5 text-[rgb(var(--tc-ink-2))]">{soldOut ? 'Out of stock' : stockNote}</p>
          </div>
          <div className="flex items-stretch gap-2">
            <SaveButton name={name} saved={isSaved} onToggle={toggleSaved} />
            <BagButton soldOut={soldOut} onAdd={() => onAddToBag?.(finishId)} onAdded={flare} bagCount={bagCount} />
          </div>
        </div>
      </div>
    </article>
  );
}
