import type { MutableRefObject, RefObject } from 'react';
import ArmillaryRing from './ArmillaryRing';
import { FINISH_VARS, finishStyle, type FinishSpec } from './finishes';
import Plinth from './Plinth';
import { RINGS } from './tiltMath';

/** The object's centre: a little above the vitrine middle, 92px in front of the back wall, tipped 16deg toward the viewer so the plinth top shows (CSS rotateX is positive top-away). */
const GROUP = 'translate3d(0px, -24px, 92px) rotateX(-16deg)';
/** Band widths, outer to inner: the outer ring is the heaviest, like the meridian of a real armillary. */
const WIDTHS = [5, 4.5, 4];
/** The glowing core: a lit sphere in the core tone with a hot highlight at its upper left, inside a soft halo. */
const SPHERE =
  '[background:radial-gradient(circle_at_36%_32%,rgb(var(--p-mist-0,255_255_255)/0.95),rgb(var(--f-core))_28%,rgb(var(--f-mid))_70%,rgb(var(--f-lo)))]';
const HALO =
  '[background:radial-gradient(closest-side,rgb(var(--f-core)/0.55)_0%,rgb(var(--f-core)/0.3)_40%,rgb(var(--f-core)/0.1)_70%,transparent)]';

interface Props {
  finish: FinishSpec;
  rings: MutableRefObject<(HTMLDivElement | null)[]>;
  specs: MutableRefObject<(HTMLDivElement | null)[]>;
  core: RefObject<HTMLDivElement>;
  /** Sold out: the core's glow drops to 40% and the rings to half, so the object reads as out of stock too. */
  dim: boolean;
}

/** A desk armillary built from CSS 3D planes: three thick lit rings, a billboarded glowing core and a stand. */
export default function ArmillaryObject({ finish, rings, specs, core, dim }: Props) {
  return (
    <div
      aria-hidden="true"
      style={{ ...finishStyle(finish), transform: GROUP }}
      className={`${FINISH_VARS} pointer-events-none absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]`}
    >
      <Plinth />
      {RINGS.map((ring, i) => (
        <ArmillaryRing
          key={ring.size}
          size={ring.size}
          width={WIDTHS[i]}
          css={`translateZ(${ring.z}px) ${ring.css}`}
          dim={dim}
          ringRef={(el) => {
            rings.current[i] = el;
          }}
          specRef={(el) => {
            specs.current[i] = el;
          }}
        />
      ))}
      <div
        ref={core}
        className={`absolute -ml-[34px] -mt-[34px] grid h-[68px] w-[68px] place-items-center rounded-full will-change-transform ${HALO} transition-opacity duration-[240ms] motion-reduce:transition-none ${dim ? 'opacity-40' : ''}`}
      >
        <span className={`h-[18px] w-[18px] rounded-full ${SPHERE} shadow-[0_0_12px_2px_rgb(var(--f-core)/0.6)]`} />
      </div>
    </div>
  );
}
