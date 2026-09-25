import { Component, lazy, Suspense, useMemo, type ReactNode } from 'react';
import type { GalleryEntry } from '../lib/types';

class DemoBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <p className="text-sm text-gray-700">Demo failed to render: {this.state.error.message}</p>;
    }
    return this.props.children;
  }
}

export default function DemoPanel({ entry }: { entry: GalleryEntry }) {
  const Demo = useMemo(() => lazy(entry.loadDemo), [entry]);
  return (
    <div className="flex min-h-48 items-center justify-center rounded border border-gray-200 p-8">
      <DemoBoundary>
        <Suspense fallback={<p className="text-sm text-gray-500">Loading demo</p>}>
          <Demo />
        </Suspense>
      </DemoBoundary>
    </div>
  );
}
