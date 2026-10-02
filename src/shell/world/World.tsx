import { lazy, Suspense, useEffect, useState } from 'react';
import { motionAllowed } from '../../lib/motion';
import { canUseWebGL } from '../../lib/webgl';
import WorldPoster from './WorldPoster';
import { setWorldStatus } from './worldState';

const WorldCanvas = lazy(() => import('./WorldCanvas'));

type Render = 'live' | 'still' | 'poster';

interface Props {
  shipped: number;
  litWeeks: number[];
}

/**
 * The Living Orrery's DOM gate. Live: one fixed full-viewport canvas behind the whole index (the scene
 * code is its own lazy chunk, so the DOM paints first), landing in darkness for the ignition. Reduced
 * motion: the same scene as one composed still at the top of the page, no flight, no ignition. No WebGL or
 * a lost context: the SVG poster. Decorative throughout: the hero type says the same in words.
 */
export default function World({ shipped, litWeeks }: Props) {
  const [render] = useState<Render>(() => (!canUseWebGL() ? 'poster' : motionAllowed() ? 'live' : 'still'));
  const [lost, setLost] = useState(false);
  const [ready, setReady] = useState(false);
  const canvas = render !== 'poster' && !lost;

  useEffect(() => {
    setWorldStatus(canvas && ready ? (render === 'live' ? 'live' : 'still') : 'off');
  }, [canvas, ready, render]);
  useEffect(() => () => setWorldStatus('off'), []);

  return (
    <div
      aria-hidden="true"
      data-testid="world"
      data-render={canvas ? render : 'poster'}
      className={`pointer-events-none inset-x-0 top-0 z-0 ${render === 'live' && !lost ? 'fixed bottom-0' : 'absolute h-[100svh]'}`}
    >
      {!canvas || (render === 'still' && !ready) ? <WorldPoster shipped={shipped} /> : null}
      {canvas ? (
        <Suspense fallback={null}>
          <WorldCanvas
            still={render === 'still'}
            shipped={shipped}
            litWeeks={litWeeks}
            onReady={() => setReady(true)}
            onLost={() => {
              setLost(true);
              setReady(false);
            }}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
