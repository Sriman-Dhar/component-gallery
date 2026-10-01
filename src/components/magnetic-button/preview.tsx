import MagneticButton from './MagneticButton';

/** Gallery tile close crop: the button large, sitting in its own warm glow. Rendered inert. */
export default function MagneticButtonPreview() {
  return (
    <div className="relative flex items-center justify-center">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute h-[160px] w-[340px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--p-amber-500,255_138_42)/0.32),transparent)]"
      />
      <div className="relative scale-[1.25]">
        <MagneticButton>Join the waitlist</MagneticButton>
      </div>
    </div>
  );
}
