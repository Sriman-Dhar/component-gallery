import { useEffect, useMemo } from 'react';
import { AdditiveBlending, NormalBlending, ShaderMaterial } from 'three';
import { useFrameTheme } from '../../lib/theme';
import { particleFragment, particleVertex } from './glsl/particles';
import type { WorldUniforms } from './useWorldUniforms';
import { GLYPH_FONT } from './glyphSampler';
import { castGlyphs, type GridPlan } from './gridGeometry';
import { buildWorldGeometry } from './worldGeometry';

/** The low tier keeps 70% of the swarm: below that the orbit trails thin to dotted outlines. */
const LOW_SHARE = 0.7;

interface Props {
  uniforms: WorldUniforms;
  count: number;
  /** Low tier draws only the first LOW_SHARE of the buffer (a fair sample: kinds are interleaved). */
  low: boolean;
  shipped: number;
  litWeeks: number[];
  grid: GridPlan;
}

/** The swarm: one points draw, all motion in the vertex shader, light on dark, ink on light. */
export default function WorldParticles({ uniforms, count, low, shipped, litWeeks, grid }: Props) {
  const theme = useFrameTheme();
  const key = `${litWeeks.join(',')}|${grid.labels.join(',')}|${grid.next}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const geometry = useMemo(() => buildWorldGeometry(count, shipped, litWeeks, grid), [count, shipped, key]);

  // The numerals are cast in the display face: recast once it has loaded, if it had not yet.
  useEffect(() => {
    let live = true;
    document.fonts?.load(GLYPH_FONT).then(() => live && castGlyphs(geometry, grid));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      }),
    [uniforms],
  );

  useEffect(() => {
    geometry.setDrawRange(0, low ? Math.floor(count * LOW_SHARE) : count);
  }, [geometry, low, count]);

  useEffect(() => {
    material.blending = theme === 'dark' ? AdditiveBlending : NormalBlending;
    material.needsUpdate = true;
  }, [material, theme]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={2} />;
}
