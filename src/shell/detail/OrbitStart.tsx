import { Link } from 'react-router-dom';
import { useFrameTheme } from '../../lib/theme';

/**
 * The first component's "previous": the start of the orbit, a tile the same size as its neighbour, so the
 * page ends on a balanced pair instead of one card and a void. Its stage holds the sun alone; it links to
 * the index's tiles.
 */
export default function OrbitStart() {
  const theme = useFrameTheme();
  return (
    <li className="tile group relative flex flex-col overflow-hidden rounded-tile border border-dashed border-line has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent">
      <div aria-hidden="true" data-stage-theme={theme} className="relative h-[220px] border-b border-dashed border-line">
        <div className="stage-surface stage-unlit absolute inset-0" />
        <span className="absolute left-1/2 top-1/2 -ml-8 -mt-8 h-16 w-16 rounded-full bg-[radial-gradient(closest-side,rgb(var(--color-glow)),rgb(var(--color-accent)/0.55)_40%,transparent)] transition-transform duration-base ease-out group-hover:scale-110 motion-reduce:transition-none" />
      </div>
      <div className="flex flex-1 flex-col justify-end p-5">
        <p className="mb-1 font-mono text-meta text-text-2">Previous · Start of the orbit</p>
        <Link
          to="/components"
          className="-my-2 block py-2 font-display text-[20px] font-semibold leading-7 tracking-[-0.02em] text-text outline-none after:absolute after:inset-0 after:content-['']"
        >
          Every component
        </Link>
      </div>
    </li>
  );
}
