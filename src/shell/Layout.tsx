import GrainLayer from './GrainLayer';
import Header, { REPO_URL } from './Header';
import LightField from './LightField';
import RouteTransition from './RouteTransition';
import { FOCUS_RING } from './focus';

/** Frame: the studio lights, grain, glass header, the routed view, one-line footer. Max 1280. */
export default function Layout() {
  return (
    <div className="relative min-h-[100dvh] bg-bg text-text">
      <LightField />
      <GrainLayer />
      <Header />
      <div className="relative z-10 mx-auto max-w-frame px-4 sm:px-8 lg:px-12">
        <main className="pb-20 pt-8 sm:pt-12">
          <RouteTransition />
        </main>
        <footer className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-6 text-small text-text-2">
          <span>Two components a week, 1 October to 30 December 2026.</span>
          <a href={REPO_URL} className={`rounded-control font-mono text-meta text-text underline decoration-line underline-offset-4 hover:decoration-accent ${FOCUS_RING}`}>
            Source on GitHub
          </a>
        </footer>
      </div>
    </div>
  );
}
