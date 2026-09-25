# Setup — R3F project wiring

## Install

```bash
npm i three @react-three/fiber @react-three/drei
npm i -D @types/three
```

Optional, add only when needed: `@react-three/postprocessing` (effects),
`r3f-perf` (dev profiling), `leva` (dev tweak panel — strip from prod).

## Canvas defaults

This is the starting `<Canvas>` for nearly every site scene:

```tsx
import { Canvas } from '@react-three/fiber'

<Canvas
  dpr={[1, 2]}                       // cap device pixel ratio — non-negotiable
  camera={{ position: [0, 0, 5], fov: 45 }}
  gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
  frameloop="always"                 // switch to "demand" for static scenes
  style={{ position: 'absolute', inset: 0 }}  // typical: canvas behind DOM content
>
  <Scene />
</Canvas>
```

- `alpha: true` lets the page background show through — the usual mode for
  canvas-behind-DOM layouts. Set a solid `scene.background` only for full-bleed scenes.
- `fov 35–50` for product/hero scenes (less distortion); higher fov reads "wide-angle cheap".

## Layout pattern: canvas behind DOM

The standard award-site structure — WebGL as a full-viewport layer, DOM content
scrolling above it, both driven by the same scroll:

```tsx
export default function Page() {
  return (
    <>
      <div className="fixed inset-0 -z-10">   {/* canvas layer */}
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
          <Scene />
        </Canvas>
      </div>
      <main className="relative">            {/* normal DOM flow above */}
        <section className="h-screen">…</section>
        <section className="h-screen">…</section>
      </main>
    </>
  )
}
```

Pointer events: the fixed layer usually needs `pointer-events: none` unless the
scene is interactive; re-enable per-element if mixing.

## Next.js / SSR guard

Three.js touches `window` at import time in places. Keep the whole scene out of SSR:

```tsx
// app/page.tsx
import dynamic from 'next/dynamic'
const Hero3D = dynamic(() => import('@/components/three/Hero3D'), {
  ssr: false,
  loading: () => <HeroPoster />,   // styled static fallback, never a blank div
})
```

Vite/CRA SPAs don't need this, but keep the poster fallback anyway for the
WebGL-unavailable case.

## Lazy-mount below-fold scenes

Don't pay for a scene the user hasn't reached:

```tsx
function LazyScene() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { rootMargin: '400px' }        // start loading before it scrolls in
    )
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return <div ref={ref}>{visible ? <Canvas>…</Canvas> : <Poster />}</div>
}
```

## WebGL support + reduced motion

```tsx
function supportsWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { return false }
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
// reducedMotion → render the scene's static "beauty frame" (frameloop="never"
// after one render, or a pre-rendered poster image). No autoplaying motion.
```

## Drei essentials (use before hand-rolling)

| Need | Drei |
|---|---|
| Load textures | `useTexture` (suspends; wrap in `<Suspense>`) |
| Load GLB/GLTF | `useGLTF` (+ `useGLTF.preload(url)`) |
| Custom shader material as JSX | `shaderMaterial` (see shaders.md) |
| IBL lighting that looks expensive | `<Environment preset="city" />` |
| Soft ground shadow, cheap | `<ContactShadows />` |
| Many copies of a mesh | `<Instances>` / `<Merged>` |
| Damped value easing | `import { easing } from 'maath'` → `easing.damp3` |
| HTML pinned to 3D point | `<Html>` (sparingly — layout cost) |

## Loading UX

Never let the page pop in raw. Preload models, and gate the reveal:

```tsx
import { useProgress } from '@react-three/drei'
const { progress } = useProgress()   // drive a loader bar / counter, then
                                     // GSAP-animate the reveal at 100
```

A percentage counter that wipes away at 100% is the classic award-site opener —
cheap to build with `useProgress` + one GSAP timeline.

## TypeScript notes

- Refs: `useRef<THREE.Mesh>(null)`, `useRef<THREE.ShaderMaterial>(null)` — then
  guard `if (!ref.current) return` at the top of `useFrame`.
- Custom shaderMaterial JSX elements need a module declaration — see shaders.md.
- Keep all scene code in `components/three/` — one component per file, same
  file-size limits as the rest of the codebase (scenes love to become god-files).
