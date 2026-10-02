import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react';
import { motionAllowed } from '../../lib/motion';
import { canUseWebGL } from '../../lib/webgl';
import type { GridPlan } from './gridGeometry';
import { useCloseFrame } from './useCloseFrame';
import WorldPoster from './WorldPoster';
import { setWorldStatus, world } from './worldState';
import type { WorldMode } from './worldModes';

const WorldCanvas = lazy(() => import('./WorldCanvas'));

type Render = 'live' | 'still' | 'poster';

interface Props {
  mode: WorldMode;
  shipped: number;
  litWeeks: number[];
  grid: GridPlan;
  /** Close mode: this component's slot (0-based ship order). */
  slot?: number;
}

/** The canvas edge that meets the page fades out over its last 140px (a static mask, painted once). */
const FADE: CSSProperties = {
  maskImage: 'linear-gradient(to bottom, #000 calc(100% - 140px), transparent)',
  WebkitMaskImage: 'linear-gradient(to bottom, #000 calc(100% - 140px), transparent)',
};

/**
 * The Living Orrery's DOM gate. Index live: one fixed full-viewport canvas behind the whole page (the scene
 * code is its own lazy chunk, so the DOM paints first), landing in darkness for the ignition. Detail: the
 * close orbit at the top of the page, ending above the stage. 404: the dark orrery at the top of the page.
 * Reduced motion: the same scene as one composed still, no flight, no ignition. No WebGL or a lost context:
 * the SVG poster (none on the detail page, whose header carries its own glow). Decorative throughout.
 */
export default function World({ mode, shipped, litWeeks, grid, slot = 0 }: Props) {
  const [render] = useState<Render>(() => (!canUseWebGL() ? 'poster' : motionAllowed() ? 'live' : 'still'));
  const [lost, setLost] = useState(false);
  const [ready, setReady] = useState(false);
  const closeHeight = useCloseFrame(mode === 'close');
  const canvas = render !== 'poster' && !lost && (mode !== 'close' || closeHeight > 0);
  const fixed = mode === 'index' && render === 'live' && !lost;

  useEffect(() => {
    setWorldStatus(canvas && ready ? (render === 'live' ? 'live' : 'still') : 'off');
  }, [canvas, ready, render]);
  useEffect(() => {
    // The pointer only reaches the scene through the index hero; a well left on from there must not linger.
    if (mode !== 'index') world.pointer.on = 0;
    return () => setWorldStatus('off');
  }, [mode]);

  const box = fixed ? 'fixed bottom-0' : mode === 'close' ? 'absolute' : 'absolute h-[100svh]';
  const poster = mode !== 'close' && (!canvas || (render === 'still' && !ready));
  return (
    <div
      aria-hidden="true"
      data-testid="world"
      data-mode={mode}
      data-render={canvas ? render : 'poster'}
      className={`pointer-events-none inset-x-0 top-0 z-0 ${box}`}
      style={mode === 'index' ? undefined : { ...FADE, height: mode === 'close' ? closeHeight : undefined }}
    >
      {poster ? <WorldPoster shipped={mode === 'dark' ? 0 : shipped} /> : null}
      {canvas ? (
        <Suspense fallback={null}>
          <WorldCanvas
            mode={mode}
            still={render === 'still'}
            shipped={shipped}
            litWeeks={litWeeks}
            grid={grid}
            slot={slot}
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
