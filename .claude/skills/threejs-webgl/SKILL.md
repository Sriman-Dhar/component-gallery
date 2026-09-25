---
name: threejs-webgl
description: Build interactive 3D / WebGL experiences for award-winning websites — Three.js via React Three Fiber, custom GLSL shaders, scroll-driven 3D scenes, image distortion effects, particle systems, all under strict performance budgets. Use whenever a site needs 3D, WebGL, shaders, particles, an immersive or "Awwwards-style" hero, a product render that reacts to scroll or mouse, image distortion / hover effects, generative backgrounds, or any visual the DOM + CSS cannot deliver — even if the user never says "Three.js". Also use when reviewing or fixing performance of existing Three.js / R3F code.
---

# Three.js / WebGL for Award-Winning Sites

This skill exists because WebGL is the layer that separates award-winning sites from
very good ones — and also the layer most likely to ship as a janky, battery-draining
mess. Every pattern here is chosen to hit both bars at once: distinctive visuals AND
60fps on a mid-range phone.

## Step 0 — Does this actually need WebGL?

WebGL earns its cost only when the effect is impossible or ugly in DOM/CSS/GSAP.
A crisp DOM site that ships fast beats a stuttering 3D one every time.

| Use WebGL for | Stay in DOM + GSAP for |
|---|---|
| Real 3D objects, depth, parallax with perspective | Flat parallax, translate/scale/opacity motion |
| Shader image effects (distortion, ripple, RGB shift) | Simple hover zoom, grayscale→color, clip-path reveals |
| Particle fields (thousands of points) | A few floating dots (absolutely-positioned divs) |
| Generative / reactive backgrounds | Gradient meshes, CSS animations, SVG filters |
| Scroll-driven camera moves through a scene | Pinned sections, SplitText, Flip layout moves |

If the answer is "DOM can do it", stop here and use the GSAP skills instead.
When in doubt, prototype the DOM version first — it is usually the right call.

## Stack defaults

React project (the default for this user's stack):

```bash
npm i three @react-three/fiber @react-three/drei
npm i -D @types/three
```

- **@react-three/fiber (R3F)** — never raw `new THREE.WebGLRenderer()` inside React.
  R3F handles the render loop, resize, and disposal; raw Three in React leaks.
- **@react-three/drei** — use its helpers (`shaderMaterial`, `ScrollControls`,
  `useTexture`, `Environment`, `Instances`) before writing your own.
- **GSAP ScrollTrigger** drives scroll state; R3F consumes it (see scroll-3d.md).
  One scroll source of truth — never two competing scroll listeners.
- Vanilla Three.js only for non-React pages (static marketing HTML). Same rules apply.

## Workflow — budget first, beauty second

1. **Set the performance budget before writing a line.** Target: 60fps desktop,
   30fps+ mid-range mobile, < 300KB gzipped JS for the 3D layer, textures ≤ 1024px
   unless a hero demands more. Write the budget down in the plan.
2. **Block out the scene** with placeholder geometry and flat materials. Get the
   camera, composition, and scroll choreography right while iteration is cheap.
3. **Wire motion**: scroll via ScrollTrigger → lerped values in `useFrame`
   (read `references/scroll-3d.md`), pointer via normalized mouse with damping.
4. **Polish pass**: real materials, lighting, shaders, post-processing — checking
   fps after each addition, not at the end.
5. **QA gate** (ships only if all pass):
   - fps holds on a DPR-2 laptop AND a throttled-CPU run (Chrome DevTools 4× slowdown)
   - `prefers-reduced-motion` gets a static or minimal-motion fallback
   - WebGL-unavailable gets a styled poster/image fallback, not a blank box
   - no context-lost crash: `Canvas` has `onCreated` guard, page still readable
   - canvas is lazy-mounted (below-fold scenes load on approach, not on page load)
   - tab-away pauses the loop (R3F does this; verify custom loops do too)

## Non-negotiables (each one is a real shipped-site failure mode)

- **Cap DPR**: `<Canvas dpr={[1, 2]}>`. DPR 3 phones render 2.25× the pixels for
  zero visible gain and melt the battery.
- **`frameloop="demand"` for static scenes** — a hero that only moves on
  scroll/hover should not burn a render loop at idle. Call `invalidate()` on change.
- **Dispose what you create manually.** Geometries, materials, textures, render
  targets created outside JSX need explicit `.dispose()` on cleanup. JSX-declared
  objects are handled by R3F.
- **Never `setState` inside `useFrame`.** React re-renders at 60fps will tank the
  page. Mutate refs; read external state via `useRef`/getState-style access.
- **Load textures compressed** (`ktx2`/basis for big scenes) and models as
  Draco-compressed GLB. A 4MB GLB is a bug, not an asset.
- **SSR guard**: Three touches `window`. In Next.js, dynamic-import the scene with
  `ssr: false`; keep the canvas out of the server tree.
- **Reduced motion is a feature, not a fallback.** Check
  `matchMedia('(prefers-reduced-motion: reduce)')` and render the composed static
  frame — the scene's most beautiful still — not an empty div.

## Making it award-winning (not tech-demo)

- 3D must serve the content story — a product exploding into parts as you scroll
  explains something; a spinning cube explains nothing. Tie every camera move to a
  narrative beat in the copy.
- Restraint reads as expensive: one strong scene beats five gimmicks. Fog, subtle
  grain, and a tight palette (pull colors from the site's design tokens) make
  WebGL feel native to the page instead of pasted on.
- Blend layers: DOM text over canvas (position the canvas `fixed`/absolute behind,
  drive both from the same ScrollTrigger timeline) so typography stays crisp,
  selectable, and accessible. Never render body text inside WebGL.
- Easing everywhere: raw mouse/scroll values look robotic. Lerp or damp every
  input (`THREE.MathUtils.damp`, drei `easing.damp3`).

## Reference map — read before writing code in that area

| Task | Read |
|---|---|
| New scene / project setup, Canvas config, Next.js, lazy mount | `references/setup.md` |
| Scroll-driven 3D, GSAP ScrollTrigger ↔ R3F bridge, camera rigs | `references/scroll-3d.md` |
| Custom shaders, image distortion, hover effects, transitions | `references/shaders.md` |
| Particles, instancing, morphing point clouds | `references/particles.md` |
| Performance tuning, profiling, mobile tiering, disposal audits | `references/performance.md` |

Pipeline note: this skill is the 3D/WebGL layer of the lofistack-frontend-stack
pipeline — design system and taste decisions (ui-ux-pro-max, design-taste-frontend)
come first; this skill executes the immersive layer inside that direction; the
GSAP skills own DOM motion alongside it.
