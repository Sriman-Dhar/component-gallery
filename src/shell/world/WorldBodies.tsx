import { useEffect, useMemo } from 'react';
import {
  AdditiveBlending,
  IcosahedronGeometry,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  NormalBlending,
  PlaneGeometry,
  ShaderMaterial,
} from 'three';
import { useFrameTheme } from '../../lib/theme';
import { SLOT_COUNT, slotOf } from '../orrery/orreryModel';
import { bodyFragment, bodyVertex, sunFragment, sunVertex } from './glsl/bodies';
import type { WorldUniforms } from './useWorldUniforms';

/** The 30 slots as instanced spheres, shipped first; each arrives in ship order during the ignition. */
function buildBodies(shipped: number): InstancedBufferGeometry {
  const sphere = new IcosahedronGeometry(1, 3);
  const geometry = new InstancedBufferGeometry();
  geometry.index = sphere.index;
  geometry.setAttribute('position', sphere.getAttribute('position'));
  geometry.setAttribute('normal', sphere.getAttribute('normal'));
  const ring = new Float32Array(SLOT_COUNT);
  const u = new Float32Array(SLOT_COUNT);
  const lit = new Float32Array(SLOT_COUNT);
  const order = new Float32Array(SLOT_COUNT);
  for (let i = 0; i < SLOT_COUNT; i++) {
    const at = slotOf(i);
    ring[i] = at.ring;
    u[i] = at.u;
    lit[i] = i < shipped ? 1 : 0;
    order[i] = i / SLOT_COUNT;
  }
  geometry.setAttribute('aSlotRing', new InstancedBufferAttribute(ring, 1));
  geometry.setAttribute('aSlotU', new InstancedBufferAttribute(u, 1));
  geometry.setAttribute('aLit', new InstancedBufferAttribute(lit, 1));
  geometry.setAttribute('aOrder', new InstancedBufferAttribute(order, 1));
  geometry.instanceCount = SLOT_COUNT;
  sphere.dispose();
  return geometry;
}

/** The sun (HDR disc, bloom source) and the 30 bodies it lights. */
export default function WorldBodies({ uniforms, shipped }: { uniforms: WorldUniforms; shipped: number }) {
  const theme = useFrameTheme();
  const bodies = useMemo(() => buildBodies(shipped), [shipped]);
  const disc = useMemo(() => new PlaneGeometry(2, 2), []);
  const bodyMaterial = useMemo(
    () => new ShaderMaterial({ vertexShader: bodyVertex, fragmentShader: bodyFragment, uniforms }),
    [uniforms],
  );
  const sunMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: sunVertex,
        fragmentShader: sunFragment,
        uniforms,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  );

  useEffect(() => {
    sunMaterial.blending = theme === 'dark' ? AdditiveBlending : NormalBlending;
    sunMaterial.needsUpdate = true;
  }, [sunMaterial, theme]);

  useEffect(
    () => () => {
      bodies.dispose();
      disc.dispose();
      bodyMaterial.dispose();
      sunMaterial.dispose();
    },
    [bodies, disc, bodyMaterial, sunMaterial],
  );

  return (
    <>
      <mesh geometry={disc} material={sunMaterial} frustumCulled={false} renderOrder={1} />
      <mesh geometry={bodies} material={bodyMaterial} frustumCulled={false} renderOrder={3} />
    </>
  );
}
