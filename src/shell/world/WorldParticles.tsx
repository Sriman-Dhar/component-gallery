import { useEffect, useMemo } from 'react';
import { AdditiveBlending, NormalBlending, ShaderMaterial } from 'three';
import { useFrameTheme } from '../../lib/theme';
import { particleFragment, particleVertex } from './glsl/particles';
import type { WorldUniforms } from './useWorldUniforms';
import { buildWorldGeometry } from './worldGeometry';

interface Props {
  uniforms: WorldUniforms;
  count: number;
  /** Low tier draws only the first half of the buffer (a fair sample: kinds are interleaved). */
  low: boolean;
  shipped: number;
  litWeeks: number[];
}

/** The swarm: one points draw, all motion in the vertex shader, light on dark, ink on light. */
export default function WorldParticles({ uniforms, count, low, shipped, litWeeks }: Props) {
  const theme = useFrameTheme();
  const litKey = litWeeks.join(',');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const geometry = useMemo(() => buildWorldGeometry(count, shipped, litWeeks), [count, shipped, litKey]);
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
    geometry.setDrawRange(0, low ? Math.floor(count / 2) : count);
  }, [geometry, low, count]);

  useEffect(() => {
    material.blending = theme === 'dark' ? AdditiveBlending : NormalBlending;
    material.needsUpdate = true;
  }, [material, theme]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={2} />;
}
