import type { MutableRefObject, RefObject } from 'react';
import { FINISH_VARS, finishStyle, type FinishSpec } from './finishes';
import { RINGS } from './tiltMath';

/** The object's centre: a little above the vitrine middle, 70px in front of the back wall, leaned back 14deg so the plinth top shows. */
const GROUP = 'translate3d(0px, -18px, 70px) rotateX(14deg)';
const PRESERVE = '[transform-style:preserve-3d]';
/** Metal: the ring body in the finish colour, a bright inner lip and a dark outer lip. Colours crossfade in 240ms. */
const RING_FACE =
  'absolute left-0 top-0 rounded-full border-[3.5px] [outline:1px_solid_transparent] border-[rgb(var(--f-mid))] shadow-[inset_0_0_0_1px_rgb(var(--f-hi)/0.75),0_0_0_1px_rgb(var(--f-lo)/0.9)] transition-[border-color,box-shadow] duration-[240ms] ease-out motion-reduce:transition-none';

interface Props {
  finish: FinishSpec;
  rings: MutableRefObject<(HTMLDivElement | null)[]>;
  core: RefObject<HTMLDivElement>;
}

/** A desk armillary built from CSS 3D planes: three nested rings, a billboarded glowing core, a stem and a plinth with a top and a front face. */
export default function ArmillaryObject({ finish, rings, core }: Props) {
  return (
    <div
      aria-hidden="true"
      style={{ ...finishStyle(finish), transform: GROUP }}
      className={`${FINISH_VARS} ${PRESERVE} pointer-events-none absolute left-1/2 top-1/2 h-0 w-0`}
    >
      {RINGS.map((ring, i) => (
        <div
          key={ring.size}
          ref={(el) => {
            rings.current[i] = el;
          }}
          style={{
            width: ring.size,
            height: ring.size,
            marginLeft: -ring.size / 2,
            marginTop: -ring.size / 2,
            transform: ring.css,
          }}
          className={`${RING_FACE} ${ring.spread === 0 ? '' : 'will-change-transform'}`}
        >
          {/* The stem hangs from the outer ring: rotateY keeps it vertical, and it rides the ring's own layer. */}
          {i === 0 ? (
            <span className="absolute left-1/2 top-full -ml-[2px] h-[22px] w-[4px] rounded-b-[1px] bg-[rgb(var(--f-lo))] transition-colors duration-[240ms] motion-reduce:transition-none" />
          ) : null}
        </div>
      ))}
      <div
        ref={core}
        className="absolute -ml-[28px] -mt-[28px] h-[56px] w-[56px] rounded-full will-change-transform [background:radial-gradient(closest-side,rgb(var(--f-core))_0%,rgb(var(--f-core)/0.85)_28%,rgb(var(--f-core)/0.28)_62%,transparent)] transition-[background] duration-[240ms] motion-reduce:transition-none"
      />
      {/* Plinth: the top face lies flat (rotateX 90) and catches a little of the core's light; the front face stands at its leading edge. */}
      <div
        style={{ transform: 'rotateX(90deg)' }}
        className="absolute -ml-[64px] top-[50px] h-[72px] w-[128px] rounded-[3px] [background:radial-gradient(60%_70%_at_50%_45%,rgb(var(--f-core)/0.22),transparent),linear-gradient(rgb(var(--tc-plinth-top)),rgb(var(--tc-plinth-top)))]"
      />
      <div
        style={{ transform: 'translateZ(36px)' }}
        className="absolute -ml-[64px] top-[86px] h-[18px] w-[128px] rounded-b-[3px] border-t border-[rgb(var(--tc-plinth-lip))] bg-[rgb(var(--tc-plinth-front))]"
      />
    </div>
  );
}
