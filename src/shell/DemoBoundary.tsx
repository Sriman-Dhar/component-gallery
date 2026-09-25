import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** What to show when the demo throws. Receives the error message. */
  fallback: (message: string) => ReactNode;
}

/** Catches a crashing component demo so the stage (or a thumbnail) fails alone, not the page. */
export default class DemoBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    return this.state.error ? this.props.fallback(this.state.error.message) : this.props.children;
  }
}
