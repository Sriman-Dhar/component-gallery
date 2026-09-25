import type { ComponentTypeLabel } from '../lib/types';

export default function TypeLabel({ type }: { type: ComponentTypeLabel }) {
  return (
    <span className="rounded border border-gray-300 px-2 py-0.5 text-xs text-gray-700">
      Type: {type}
    </span>
  );
}
