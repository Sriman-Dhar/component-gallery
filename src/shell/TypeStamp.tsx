import type { ComponentTypeLabel } from '../lib/types';

/** The challenge Type label, stamped: mono, hairline border. Text stays "Type: <label>". */
export default function TypeStamp({ type }: { type: ComponentTypeLabel }) {
  return (
    <span className="inline-block whitespace-nowrap rounded-control border border-line bg-surface-2 px-2 py-0.5 font-mono text-meta text-text">
      Type: {type}
    </span>
  );
}
