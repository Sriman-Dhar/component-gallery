# Shaders — image effects, hover distortion, transitions

Custom shaders are the single biggest "how did they do that" factor on awarded
sites. The good news: 90% of site shader work is one pattern — a textured plane
with a fragment shader driven by 2–3 uniforms.

## drei shaderMaterial — the standard pattern

```tsx
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const WaveMaterial = shaderMaterial(
  // uniforms + defaults
  { uTime: 0, uHover: 0, uTexture: new THREE.Texture(), uRes: new THREE.Vector2(1, 1) },
  // vertex
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment
  /* glsl */ `
    uniform float uTime;
    uniform float uHover;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      uv.y += sin(uv.x * 10.0 + uTime) * 0.02 * uHover;   // ripple on hover
      // RGB shift, scaled by hover — the classic
      float shift = 0.008 * uHover;
      float r = texture2D(uTexture, uv + vec2(shift, 0.0)).r;
      vec2  gb = texture2D(uTexture, uv - vec2(shift, 0.0)).gb;
      gl_FragColor = vec4(r, gb, 1.0);
      #include <colorspace_fragment>   // keep colors correct in r152+ pipelines
    }
  `
)
extend({ WaveMaterial })

// TS: declare the JSX element once, in a global .d.ts or top of file
declare module '@react-three/fiber' {
  interface ThreeElements {
    waveMaterial: ThreeElement<typeof WaveMaterial>
  }
}
```

Usage with eased hover (never snap uniforms — ease them):

```tsx
function DistortImage({ url }: { url: string }) {
  const mat = useRef<any>(null)
  const hover = useRef(0)
  const texture = useTexture(url)
  useFrame((_, delta) => {
    if (!mat.current) return
    mat.current.uTime += delta
    mat.current.uHover = THREE.MathUtils.damp(
      mat.current.uHover, hover.current, 6, delta)
  })
  return (
    <mesh onPointerOver={() => (hover.current = 1)}
          onPointerOut={() => (hover.current = 0)}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <waveMaterial ref={mat} uTexture={texture} transparent />
    </mesh>
  )
}
```

## Matching WebGL planes to DOM layout

For image grids where each image gets a shader (portfolio hover effects), sync
plane size/position to the DOM element so the page stays a normal document:

1. Render normal `<img>` elements (SEO, layout, fallback), `visibility: hidden`
   once WebGL confirms.
2. For each, `getBoundingClientRect()` → plane scale = rect size in world units,
   plane position = rect center mapped into the camera's view.
3. With a camera at `z = 600`, `fov = 2 * atan((h/2) / 600)`, one world unit =
   one CSS pixel — the mapping becomes trivial.
4. Update positions on scroll (cheap: translate all planes by scroll delta) and
   on resize (re-measure).

This is more code than one plane — keep it in a dedicated `DomSyncedPlanes`
component. Don't hand-roll it inline in a page file.

## Texture cover-fit (the background-size: cover of GLSL)

Images almost never match plane aspect. Without this you get stretching:

```glsl
vec2 coverUv(vec2 uv, vec2 planeRes, vec2 imgRes) {
  float planeAspect = planeRes.x / planeRes.y;
  float imgAspect = imgRes.x / imgRes.y;
  vec2 s = planeAspect > imgAspect
    ? vec2(1.0, imgAspect / planeAspect)
    : vec2(planeAspect / imgAspect, 1.0);
  return (uv - 0.5) * s + 0.5;
}
```

## Noise — the texture of expensive motion

Almost every organic effect (smoke, heat, liquid reveal) is simplex noise
displacing UVs or mixing colors. Don't write noise from memory — vendor a known
implementation (Ashima / `glsl-noise` snoise) into the shader string. Typical use:

```glsl
float n = snoise(vec3(vUv * 3.0, uTime * 0.2));
vec2 uv = vUv + n * 0.03 * uIntensity;
```

Animate `uIntensity`, not the noise scale — rescaling noise mid-flight looks like
a glitch, easing intensity looks like material.

## Transition / reveal shaders

Progress-driven wipe between two textures (page transitions, before/after):

```glsl
uniform float uProgress;   // 0 → 1, tween with GSAP
float n = snoise(vec3(vUv * 4.0, 1.0)) * 0.5 + 0.5;
float edge = smoothstep(uProgress - 0.1, uProgress + 0.1, mix(vUv.y, n, 0.4));
gl_FragColor = mix(texture2D(uTexB, uv), texture2D(uTexA, uv), edge);
```

Tween `uProgress` from GSAP (`gsap.to(mat, { uProgress: 1, ease: 'power2.inOut' })`
works — shaderMaterial exposes uniforms as properties).

## Vertex displacement (flags, blobs, terrain)

Displace in the vertex shader, and remember lighting needs normals — for simple
site work, fake it with fresnel-style shading in the fragment instead of
recomputing normals:

```glsl
// vertex
vec3 pos = position;
pos.z += snoise(vec3(uv * 2.0, uTime * 0.3)) * uAmp;
```

Subdivide the plane (`planeGeometry args={[w, h, 64, 64]}`) — displacement on a
2-triangle plane does nothing visible.

## Post-processing

Use `@react-three/postprocessing` (it batches passes efficiently):

```tsx
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
<EffectComposer>
  <Bloom intensity={0.4} luminanceThreshold={0.8} mipmapBlur />
  <Noise opacity={0.04} />          {/* film grain — instant "graded" feel */}
  <Vignette darkness={0.6} />
</EffectComposer>
```

Grain + vignette are nearly free and hide banding in gradients. Bloom costs real
ms — budget it, and skip post entirely on low-tier mobile (see performance.md).

## Shader debugging

- Output the suspect value as color: `gl_FragColor = vec4(vec3(n), 1.0);`
- UV sanity: `gl_FragColor = vec4(vUv, 0.0, 1.0);` (black corner = 0,0).
- Black screen usually = NaN (division by zero, `pow` of negative) or a uniform
  never set. Check the JS side first.
