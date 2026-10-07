/** Light and shade over the plinth tones (page primitives with literal fallbacks). */
const LIT = (a: number) => `rgb(var(--p-mist-0, 255 255 255) / ${a})`;
const SHADE = (a: number) => `rgb(var(--p-ink-990, 18 18 22) / ${a})`;

/** Plinth box: 132 wide, 76 deep, 20 tall; its top face sits at y 88 below the object's centre. */
const W = 132;
const D = 76;
const H = 20;
const TOP = 88;
/** The rod starts under the core's sphere, so it never draws across it. */
const ROD_TOP = 10;

const TOP_FACE = `radial-gradient(46% 52% at 50% 44%, rgb(var(--f-core) / 0.3), transparent 70%), radial-gradient(12% 16% at 50% 50%, ${SHADE(0.45)}, transparent), linear-gradient(${LIT(0.1)}, ${SHADE(0.06)}), rgb(var(--tc-plinth-top))`;
const FRONT_FACE = `linear-gradient(${LIT(0.2)}, ${LIT(0.06)} 30%, ${SHADE(0.12)}), rgb(var(--tc-plinth-front))`;
const SIDE_FACE = `linear-gradient(90deg, ${SHADE(0.35)}, ${LIT(0.04)}), rgb(var(--tc-plinth-front))`;
const ROD = 'linear-gradient(90deg, rgb(var(--f-lo)), rgb(var(--f-hi)) 45%, rgb(var(--f-mid)) 60%, rgb(var(--f-lo)))';

/**
 * The stand: a rod from the core down to a plinth box with a lit top (the core's glow pools on it, a contact shadow
 * under the rod), a front face with a bright leading edge, and two side faces that show as the case turns.
 */
export default function Plinth() {
  return (
    <>
      {/* The rod: two crossed planes, so it stays a rod from any side. */}
      {[0, 90].map((turn) => (
        <span
          key={turn}
          style={{ top: ROD_TOP, height: TOP - ROD_TOP, background: ROD, transform: `rotateY(${turn}deg)` }}
          className="absolute left-0 -ml-[2.5px] w-[5px] rounded-[2px]"
        />
      ))}
      <div
        style={{ width: W, height: D, marginLeft: -W / 2, top: TOP - D / 2, background: TOP_FACE, transform: 'rotateX(90deg)' }}
        className="absolute left-0 rounded-[3px]"
      />
      <div
        style={{ width: W, height: H, marginLeft: -W / 2, top: TOP, background: FRONT_FACE, transform: `translateZ(${D / 2}px)` }}
        className="absolute left-0 rounded-b-[2px] shadow-[inset_0_1px_0_rgb(var(--tc-plinth-lip))]"
      />
      {[-1, 1].map((side) => (
        <div
          key={side}
          style={{ width: D, height: H, marginLeft: -D / 2, top: TOP, background: SIDE_FACE, transform: `translateX(${(side * W) / 2}px) rotateY(90deg)` }}
          className="absolute left-0"
        />
      ))}
    </>
  );
}
