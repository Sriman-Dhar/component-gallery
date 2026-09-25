# Performance — budgets, profiling, tiering, disposal

Perf is the difference between "immersive" and "my laptop fan is screaming".
Budget first, measure always, degrade gracefully.

## The budget (write it into the plan before building)

| Metric | Target |
|---|---|
| Desktop fps | 60 sustained |
| Mid-mobile fps (Chrome 4× CPU throttle as proxy) | ≥ 30 |
| 3D layer JS, gzipped (three + r3f + drei + scene) | < 300 KB |
| Single texture | ≤ 1024×1024 (hero may earn 2048) |
| Total GLB payload | < 1.5 MB (Draco-compressed) |
| Draw calls | < 100 desktop, < 50 mobile |
| Time to first painted frame after mount | < 1 s |

## Measuring (do this during the build, not after)

- `r3f-perf` dev overlay: `import { Perf } from 'r3f-perf'` → `<Perf />` inside
  Canvas. Watch fps, draw calls, triangles, GPU ms live. Strip from prod.
- Chrome DevTools → Performance with **4× CPU throttle** = your mid-mobile proxy.
  Record a full scroll-through; long tasks during scroll are the killers.
- `renderer.info` (in R3F: `useThree(s => s.gl.info)`): `render.calls`,
  `memory.geometries`, `memory.textures`. If textures/geometries climb as you
  navigate, you have a leak — see disposal below.

## The high-leverage wins, in order

1. **DPR cap** `dpr={[1, 2]}` — biggest single lever; fill-rate scales with DPR².
2. **`frameloop="demand"`** for scenes that only move on input. Call
   `invalidate()` from your ScrollTrigger `onUpdate` / pointer handlers. An idle
   hero at 0% CPU is a feature.
3. **Instancing** — collapse repeated meshes to one draw call (particles.md).
4. **Texture compression** — KTX2/Basis via `useKTX2` or gltf-transform'd assets;
   a 2048 PNG is ~12 MB of GPU memory, KTX2 ~1/6 of that and uploads faster.
5. **Draco-compress GLBs**: `npx gltf-transform optimize in.glb out.glb` —
   typically 5–10× smaller. Set up `useGLTF` (Draco decoder is auto-wired).
6. **Cheap materials where nobody looks** — `MeshBasicMaterial`/`Lambert` for
   background objects; `Standard`/`Physical` only where light interaction sells.
7. **Lights are per-fragment cost** — 1 directional + `<Environment>` IBL usually
   beats 4 point lights and looks better. Avoid real-time shadows; use
   `<ContactShadows>` or baked AO.
8. **Post-processing on a budget** — grain/vignette cheap; bloom/DOF real cost.
   One `EffectComposer`, never two.

## Device tiering

Decide tier once at mount, pass down as props (don't branch per-frame):

```tsx
function getTier(): 'high' | 'mid' | 'low' {
  const gl = document.createElement('canvas').getContext('webgl2')
  if (!gl) return 'low'
  const coarse = matchMedia('(pointer: coarse)').matches   // touch device
  const mem = (navigator as any).deviceMemory ?? 8          // Chrome only, fine
  if (coarse && mem <= 4) return 'low'
  if (coarse || mem <= 4) return 'mid'
  return 'high'
}
// high: full particles, post-processing, 2048 hero texture
// mid:  half particles, grain-only post, 1024 textures
// low:  poster image or frameloop="never" static frame — not a broken scene
```

Optional runtime guard: drei `<PerformanceMonitor>` can drop DPR when measured
fps sags — good belt-and-suspenders on top of tiering, not a replacement.

## Disposal — the leak checklist

R3F disposes JSX-declared objects on unmount. Leaks come from the manual stuff:

- Anything `new`-ed in JS (`new THREE.CanvasTexture`, render targets, cloned
  materials): `.dispose()` in the effect cleanup.
- `useTexture`/`useGLTF` cache by URL — fine for a site's fixed asset set; call
  `useGLTF.clear(url)` only for truly dynamic galleries.
- Kill every GSAP ScrollTrigger/timeline touching the scene on unmount —
  a live trigger holding refs keeps the whole scene graph from GC.
- Verify: navigate to the page and away 5×; `gl.info.memory` must return to
  baseline. If it climbs, bisect the scene.

## Context loss (real on mobile Safari)

```tsx
<Canvas onCreated={({ gl }) => {
  gl.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault()            // allows restore instead of dying
  })
}}>
```

Page content must remain fully readable if the canvas dies — which it already is
if the DOM-behind-canvas layout from setup.md was followed.

## Bundle discipline

- Import three normally (it tree-shakes reasonably in Vite/Next); never import
  from `three/examples/*` paths you don't use.
- Drei is modular — importing `@react-three/drei` root is fine with modern
  bundlers, but check the analyzer if the 3D chunk exceeds budget.
- Code-split the scene: the dynamic import from setup.md doubles as bundle
  splitting — the 3D chunk loads only when needed.
- Run `npx vite-bundle-visualizer` / `@next/bundle-analyzer` once before ship;
  the 3D chunk should be self-contained and lazy.

## Pre-ship QA (from SKILL.md, expanded)

1. 60fps desktop scroll-through with DevTools performance recording — no long tasks.
2. 4× CPU throttle run ≥ 30fps.
3. `gl.info` draw calls within budget; memory stable across mount/unmount cycles.
4. Reduced-motion: static beauty frame renders, no animation runs.
5. WebGL blocked (Chrome flag or `--disable-webgl`): poster fallback shows.
6. Tab backgrounded 60s → return: no time-jump snap (use delta, not absolute
   time accumulated from mount, for anything that must stay in sync).
7. Mobile Safari real-device check if the scene is core to the page.
