import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SPRING, useMagneticPull, type MotionMode } from './useMagneticPull';

gsap.registerPlugin(useGSAP);

/**
 * The component's own custom properties. The stage theme flips them; page primitives are only read
 * with literal fallbacks, so the button keeps its look when lifted out of this gallery.
 * Light stage: dark fill, light text. Dark stage: light fill, dark text.
 */
const THEME = [
  '[--mb-fill:var(--p-ink-990,18_18_22)]',
  '[--mb-ink:var(--p-mist-50,243_243_246)]',
  '[--mb-ring:var(--p-amber-700,173_74_5)]',
  '[--mb-glow:var(--p-amber-500,255_138_42)]',
  '[--mb-glow-alpha:0.42]',
  '[--mb-shadow:var(--p-amber-900,138_62_10)]',
  '[[data-stage-theme=dark]_&]:[--mb-fill:var(--p-mist-50,243_243_246)]',
  '[[data-stage-theme=dark]_&]:[--mb-ink:var(--p-ink-990,18_18_22)]',
  '[[data-stage-theme=dark]_&]:[--mb-ring:var(--p-amber-500,255_138_42)]',
  '[[data-stage-theme=dark]_&]:[--mb-glow-alpha:0.3]',
  // Depth: the drop shadow and the inset highlight, tweened down while pressed.
  '[--mb-shadow-y:14px] [--mb-shadow-blur:32px] [--mb-highlight:0.12]',
].join(' ');

/** Rest and pressed depth. Pressed sits the button closer to the surface and drops the top highlight. */
const DEPTH = {
  rest: { '--mb-shadow-y': '14px', '--mb-shadow-blur': '32px', '--mb-highlight': 0.12 },
  pressed: { '--mb-shadow-y': '4px', '--mb-shadow-blur': '10px', '--mb-highlight': 0 },
};
const SHADOW =
  '0 var(--mb-shadow-y) var(--mb-shadow-blur) -14px rgb(var(--mb-shadow) / 0.7), inset 0 1px 0 rgb(var(--mb-ink) / var(--mb-highlight))';
/** The label and spinner trade places with a 180ms fade and a 6px slide, inside one fixed-width cell. */
const SWAP = 'transition-[opacity,transform] duration-[180ms] ease-out motion-reduce:transition-none';

/** Scale targets. Touch gets a firmer press because there is no hover to prepare it. */
const SCALE = { rest: 1, hover: 1.04, press: 0.96, touch: 0.93 } as const;

export interface MagneticButtonProps {
  /** The label. Keep it short: one to three words. */
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Swaps the label for a spinner inside the same width and blocks activation. */
  loading?: boolean;
  /** Removes the pull, dims the button, blocks pointer and keyboard activation. */
  disabled?: boolean;
  /** Announced politely when loading starts. */
  busyText?: string;
  /** Announced politely when loading ends. */
  doneText?: string;
  type?: 'button' | 'submit';
  className?: string;
}

export default function MagneticButton({
  children = 'Join the waitlist',
  onClick,
  loading = false,
  disabled = false,
  busyText = 'Working, please wait',
  doneText = 'Done',
  type = 'button',
  className = '',
}: MagneticButtonProps) {
  const root = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const glow = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const mode = useRef<MotionMode>('none');
  const hovered = useRef(false);
  const blocked = disabled || loading;
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;

  const { contextSafe } = useGSAP({ scope: root });
  useMagneticPull({ root, fill, glow, label, mode, enabled: !blocked });

  /**
   * One place decides the scale and depth: pressed beats hovered beats rest. While disabled or loading
   * only rest is allowed, so a busy button never lifts or squeezes. Reduced motion keeps the instant press.
   */
  const scaleTo = contextSafe((target: number) => {
    const el = body.current;
    const face = fill.current;
    if (!el || !face || mode.current === 'none') return;
    if (blockedRef.current && target !== SCALE.rest) return;
    const pressing = target < 1;
    const depth = pressing ? DEPTH.pressed : DEPTH.rest;
    if (mode.current === 'reduced') {
      gsap.set(el, { scale: target > 1 ? SCALE.rest : target });
      gsap.set(face, depth);
      return;
    }
    const motion = pressing ? SPRING.press : SPRING.scale;
    gsap.to(el, { scale: target, ...motion, overwrite: 'auto' });
    gsap.to(face, { ...depth, ...(pressing ? SPRING.press : { duration: 0.3, ease: 'power2.out' }), overwrite: 'auto' });
  });

  const release = () => scaleTo(hovered.current ? SCALE.hover : SCALE.rest);

  const onPointerEnter = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'touch') return;
    hovered.current = true;
    scaleTo(SCALE.hover);
  };
  const onPointerLeave = () => {
    hovered.current = false;
    scaleTo(SCALE.rest);
  };
  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    scaleTo(e.pointerType === 'touch' ? SCALE.touch : SCALE.press);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!e.repeat && (e.key === 'Enter' || e.key === ' ')) scaleTo(SCALE.press);
  };
  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') release();
  };
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (blocked) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Busy or disabled: settle to rest. Free again with the pointer still over it: lift back to hover.
  useEffect(() => {
    scaleTo(blocked || !hovered.current ? SCALE.rest : SCALE.hover);
  }, [blocked, scaleTo]);

  const announcement = useAnnouncement(loading, busyText, doneText);

  return (
    <span className={`${THEME} inline-flex ${className}`}>
      <button
        ref={root}
        type={type}
        aria-disabled={blocked || undefined}
        aria-busy={loading || undefined}
        onClick={handleClick}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={release}
        onPointerCancel={release}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={() => scaleTo(SCALE.rest)}
        className={`group relative inline-flex min-h-[52px] min-w-[44px] select-none items-center justify-center rounded-control font-sans outline-none [-webkit-tap-highlight-color:transparent] [touch-action:manipulation] ${
          disabled ? 'cursor-not-allowed opacity-[0.45]' : loading ? 'cursor-progress' : 'cursor-pointer'
        }`}
      >
        <span ref={body} className="relative inline-flex min-h-[52px] items-center justify-center will-change-transform">
          <span
            ref={fill}
            aria-hidden="true"
            style={{ boxShadow: SHADOW }}
            className="absolute inset-0 overflow-hidden rounded-control bg-[rgb(var(--mb-fill))] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[rgb(var(--mb-ring))]"
          >
            <span
              ref={glow}
              className="pointer-events-none absolute left-1/2 top-1/2 -ml-[60px] -mt-[60px] h-[120px] w-[120px] rounded-full opacity-0 bg-[radial-gradient(closest-side,rgb(var(--mb-glow)/var(--mb-glow-alpha)),transparent)]"
            />
          </span>
          <span ref={label} className="relative inline-grid place-items-center px-7 text-[16px] font-semibold leading-none tracking-[-0.01em] text-[rgb(var(--mb-ink))]">
            {/* opacity, not visibility: the label stays the accessible name while the spinner shows */}
            <span className={`whitespace-nowrap [grid-area:1/1] ${SWAP} ${loading ? '-translate-y-1.5 opacity-0' : ''}`}>
              {children}
            </span>
            <span aria-hidden="true" className={`[grid-area:1/1] ${SWAP} ${loading ? '' : 'translate-y-1.5 opacity-0'}`}>
              <Spinner />
            </span>
          </span>
        </span>
      </button>
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </span>
  );
}

/** Polite announcements: the busy text when loading starts, the done text when it ends. */
function useAnnouncement(loading: boolean, busyText: string, doneText: string): string {
  const [message, setMessage] = useState('');
  const wasLoading = useRef(false);
  useEffect(() => {
    if (loading) setMessage(busyText);
    else if (wasLoading.current) setMessage(doneText);
    wasLoading.current = loading;
  }, [loading, busyText, doneText]);
  return message;
}

/** A small inline spinner. It shares the label's grid cell, so the button width never changes. */
function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 animate-spin motion-reduce:animate-[spin_1.6s_linear_infinite]">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
