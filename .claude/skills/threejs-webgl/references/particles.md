# Particles & instancing — fields, morphs, many-object scenes

## Choosing the tool

| Count / need | Use |
|---|---|
| < 100 meshes, distinct materials | Plain meshes |
| 100 – 50k copies of one mesh | `<Instances>` (drei) / `InstancedMesh` |
| 10k – 500k dots/sprites | `<points>` + custom shader |
| Simulated motion (flocking, fluid) | GPGPU / FBO — heavy; justify it first |

Rule of thumb: every particle system on a marketing site is either a Points
cloud or instancing. GPGPU is rarely worth it for a site.

## Points cloud with shader (the standard particle field)

Geometry is just buffers — build once with `useMemo`:

```tsx
function Particles({ count = 5000 }) {
  const mat = useRef<any>(null)
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions.set([
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ], i * 3)
      seeds[i] = Math.random()
    }
    return { positions, seeds }
  }, [count])

  useFrame((_, delta) => { if (mat.current) mat.current.uTime += delta })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <particleMaterial ref={mat} transparent depthWrite={false}
                        blending={THREE.AdditiveBlending} />
    </points>
  )
}
```

Move particles **in the vertex shader**, never by writing positions from JS per
frame (that re-uploads the buffer every frame — the classic particle perf bug):

```glsl
// vertex
uniform float uTime;
attribute float aSeed;
varying float vAlpha;
void main() {
  vec3 pos = position;
  pos.y += sin(uTime * 0.4 + aSeed * 6.28) * 0.3;       // idle drift
  pos.x += cos(uTime * 0.3 + aSeed * 6.28) * 0.2;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (4.0 + aSeed * 4.0) * (1.0 / -mv.z);   // size attenuation
  vAlpha = 0.4 + aSeed * 0.6;
  gl_Position = projectionMatrix * mv;
}
```

```glsl
// fragment — soft round sprite, no texture needed
varying float vAlpha;
uniform vec3 uColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.1, d) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
}
```

`depthWrite={false}` + additive blending = glowing dust that never z-fights.

## Morphing point clouds (shape A → shape B on scroll)

The signature move: particles form a logo, scatter, reform as a product. Store
both positions as attributes; mix in the vertex shader; drive `uProgress` from
the scroll bridge (see scroll-3d.md):

```tsx
// sample two geometries to the SAME count, e.g. with
// MeshSurfaceSampler for meshes or text-canvas pixel sampling for logos
<bufferAttribute attach="attributes-position"  args={[shapeA, 3]} />
<bufferAttribute attach="attributes-aTarget"   args={[shapeB, 3]} />
```

```glsl
uniform float uProgress;      // eased on the JS side, or ease here
attribute vec3 aTarget;
attribute float aSeed;
void main() {
  // per-particle stagger makes it organic instead of a linear slide
  float t = smoothstep(aSeed * 0.3, 0.7 + aSeed * 0.3, uProgress);
  vec3 pos = mix(position, aTarget, t);
  pos += normalize(pos) * sin(t * 3.14159) * 0.6;   // arc outward mid-flight
  …
}
```

Sampling a logo/text into points: draw it to an offscreen 2D canvas, read
`getImageData`, emit a particle for each dark pixel (stride 2–4 px). Cheap,
robust, works for any SVG/text.

## InstancedMesh via drei

For real geometry (cubes, shards, product parts) at scale:

```tsx
import { Instances, Instance } from '@react-three/drei'

<Instances limit={1000} geometry={shardGeo} material={shardMat}>
  {shards.map((s, i) => (
    <Instance key={i} position={s.pos} rotation={s.rot} scale={s.scale} />
  ))}
</Instances>
```

Animating instances: give each `<Instance>` a ref and mutate in one shared
`useFrame`, or drop to raw `InstancedMesh` + `setMatrixAt` with
`instanceMatrix.needsUpdate = true` for full control. One draw call either way —
that's the entire point; if DevTools shows hundreds of draw calls, instancing
isn't wired right.

## Interaction: pointer repulsion

```tsx
// pass eased pointer world-pos as uMouse (vec3)
```
```glsl
vec3 toMouse = pos - uMouse;
float d = length(toMouse);
pos += normalize(toMouse) * smoothstep(1.5, 0.0, d) * 0.5;
```

Ease `uMouse` on the JS side (damp) — raw pointer makes the field twitch.

## Particle budgets

- Desktop: 20–50k Points comfortably; mobile tier: divide by 4 (see
  performance.md tiering) — pass a lower `count` prop, don't branch in shader.
- One Points object per system. 10 systems × 5k = 10 draw calls; 1 × 50k = 1.
- `AdditiveBlending` over big screen areas is fill-rate heavy — if mobile fps
  dips with large glowing clouds, shrink point size before cutting count.
